import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getDb,
  findUserByUsernameOrEmail,
  updateLastLogin,
  getUserById,
  getBookingsList,
  getBookingById,
  getCustomerTripTracking,
  insertBooking,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
  getVehiclesList,
  updateVehicle,
  getDriversList,
  updateDriver,
  getDutySlipByBookingId,
  saveDutySlip,
  getTripExpenses,
  addTripExpense,
  deleteTripExpense,
  getPricingRules,
  getAnalyticsSummary,
  findRecentDuplicateBooking,
  isOwnerConfigured,
  registerInitialOwner,
  generateCollisionResistantBookingId,
} from './db.js';
import { seedDemoData } from './seed.js';
import {
  verifyPassword,
  createSessionToken,
  verifySessionToken,
  requireAuth,
} from './auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load server/.env if available
try {
  if (typeof process.loadEnvFile === 'function') {
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      process.loadEnvFile(envPath);
    }
  }
} catch {
  // Safe fallback
}

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Database and baseline data on startup
try {
  const db = getDb();
  const vehicleCount = db.prepare('SELECT COUNT(*) as count FROM vehicles').get().count;
  if (vehicleCount === 0) {
    seedDemoData(db);
    console.log('[SERVER] Database populated with operational vehicles, driver, and rates.');
  }
} catch (err) {
  console.warn('[SERVER] Initial database startup check notice:', err.message);
}

// ============================================================================
// SECURITY MIDDLEWARES & RATE LIMITING
// ============================================================================

// Explicit CORS Configuration: Strictly restricted to configured origins
const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

const configuredOrigins = (process.env.ALLOWED_ORIGINS || defaultAllowedOrigins.join(','))
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser tools (curl, server-side tests, mobile clients)
    if (!origin) return callback(null, true);
    if (configuredOrigins.includes(origin) || (origin && origin.endsWith('.onrender.com'))) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked: Origin ${origin} not permitted by security policy.`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Request payload limit (prevent buffer overflow / DoS attacks)
app.use(express.json({ limit: '100kb' }));

// In-Memory Rate Limiter
const rateLimitStore = new Map();

function createRateLimiter({ windowMs, maxRequests, message }) {
  return (req, res, next) => {
    if (process.env.NODE_ENV === 'test') {
      return next(); // Bypass rate limiting in automated tests
    }

    const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const record = rateLimitStore.get(ip) || { requests: [], blockedUntil: 0 };

    if (now < record.blockedUntil) {
      const waitSec = Math.ceil((record.blockedUntil - now) / 1000);
      return res.status(429).json({
        error: message || `Too many requests. Please try again after ${waitSec} seconds.`,
      });
    }

    record.requests = record.requests.filter(t => now - t < windowMs);

    if (record.requests.length >= maxRequests) {
      record.blockedUntil = now + windowMs;
      rateLimitStore.set(ip, record);
      return res.status(429).json({
        error: message || 'Too many requests. Please slow down and try again later.',
      });
    }

    record.requests.push(now);
    rateLimitStore.set(ip, record);
    next();
  };
}

const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 10,
  message: 'Too many login attempts. Please wait 15 minutes before trying again.',
});

const bookingLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 25,
  message: 'Too many booking requests from this network. Please wait a few minutes.',
});

const trackingLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  maxRequests: 50,
  message: 'Too many tracking queries. Please wait a moment.',
});

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[API] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});



// ============================================================================
// PUBLIC ROUTES
// ============================================================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Kadjai Travels TVMS Backend',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Transparent Pricing Rules
app.get('/api/pricing', (req, res) => {
  try {
    const rules = getPricingRules();
    res.json(rules);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pricing rules' });
  }
});

// Single-Vehicle Fleet Info (Public details for website)
app.get('/api/fleet', (req, res) => {
  try {
    const vehicles = getVehiclesList();
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// Public Customer Booking Enquiry Submission (Protected against mass-assignment and duplicates)
app.post('/api/bookings', bookingLimiter, (req, res) => {
  try {
    const data = req.body;
    if (!data.customerName || !data.customerPhone || !data.pickupLocation || !data.dropLocation || !data.pickupDate) {
      return res.status(400).json({
        error: 'Missing required fields: customerName, customerPhone, pickupLocation, dropLocation, and pickupDate are mandatory.',
      });
    }

    // Check for recent duplicate booking submission
    const duplicate = findRecentDuplicateBooking(data.customerPhone, data.pickupDate);
    if (duplicate) {
      return res.status(409).json({
        error: 'A booking enquiry for this customer and pickup date has already been registered recently.',
        bookingId: duplicate.id,
      });
    }

    // Enforce collision-resistant server-generated reference ID (ignore any client-provided ID)
    const bookingId = generateCollisionResistantBookingId();

    // Whitelist customer input fields (Prevent mass assignment of internal fields)
    const sanitizedBooking = {
      id: bookingId,
      customerName: String(data.customerName).trim().slice(0, 100),
      customerPhone: String(data.customerPhone).trim().slice(0, 25),
      tripType: data.tripType || 'Round Trip',
      pickupLocation: String(data.pickupLocation).trim().slice(0, 255),
      dropLocation: String(data.dropLocation).trim().slice(0, 255),
      pickupDate: String(data.pickupDate).trim().slice(0, 20),
      pickupTime: data.pickupTime ? String(data.pickupTime).trim().slice(0, 10) : '07:00',
      returnDate: data.returnDate ? String(data.returnDate).trim().slice(0, 20) : null,
      daysCount: Math.max(1, Number(data.daysCount) || 1),
      passengers: Math.max(1, Math.min(7, Number(data.passengers) || 4)),
      notes: data.notes ? String(data.notes).trim().slice(0, 500) : null,
      estKm: Math.max(0, Number(data.estKm) || 300),
      billableKm: Math.max(0, Number(data.billableKm) || Number(data.estKm) || 300),
      ratePerKm: Number(data.ratePerKm) || 25.00,
      baseFare: Math.max(0, Number(data.baseFare) || 0),
      driverBataTotal: Math.max(0, Number(data.driverBataTotal) || 0),
      tollCharges: Math.max(0, Number(data.tollCharges) || 0),
      parkingCharges: Math.max(0, Number(data.parkingCharges) || 0),
      nightCharges: Math.max(0, Number(data.nightCharges) || 0),
      discount: 0, // Public users cannot self-apply discounts
      totalFare: Math.max(0, Number(data.totalFare) || 0),
      advancePaid: 0, // Payment handled via verified channels post-review
      balanceDue: Math.max(0, Number(data.totalFare) || 0),
      paymentStatus: 'Pending',
      status: 'Enquiry Received', // Always starts as Enquiry Received
      vehicleId: null,
      driverId: null,
      vehiclePlateNumber: null,
      driverName: null,
      driverPhone: null,
    };

    const newBooking = insertBooking(sanitizedBooking);

    res.status(201).json({
      success: true,
      message: 'Booking enquiry registered successfully. Kadjai Travels will review and confirm availability.',
      booking: newBooking,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit booking enquiry' });
  }
});

// Public Customer Trip Tracking (Secured by Reference ID + Mobile Number)
app.get('/api/track', trackingLimiter, (req, res) => {
  try {
    const { id, phone } = req.query;
    if (!id || !phone) {
      return res.status(400).json({
        error: 'Both Booking Reference ID (e.g. KAD-2026-101) and Customer Mobile Number are required for tracking.',
      });
    }

    const trackingData = getCustomerTripTracking(id, phone);
    if (!trackingData) {
      return res.status(404).json({
        error: 'No matching trip found. Please verify your Booking ID and registered phone number.',
      });
    }

    res.json(trackingData);
  } catch (err) {
    res.status(500).json({ error: 'Failed to track trip' });
  }
});

// Duty Slip View (Protected: requires verified owner JWT session OR verified matching customer phone)
app.get('/api/duty-slips/:bookingId', (req, res) => {
  try {
    const { bookingId } = req.params;
    const { phone } = req.query;
    const authHeader = req.headers.authorization;

    let isAuthorized = false;

    // 1. Check if caller has a valid owner/operator JWT session
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7).trim();
      const verifiedUser = verifySessionToken(token);
      if (verifiedUser && (verifiedUser.role === 'ROLE_ADMIN' || verifiedUser.role === 'ROLE_OPERATOR')) {
        isAuthorized = true;
      }
    }

    // 2. If not authenticated staff, allow verified customer ONLY if registered phone matches booking
    if (!isAuthorized && phone) {
      const tracking = getCustomerTripTracking(bookingId, phone);
      if (tracking) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return res.status(401).json({
        error: 'Unauthorized: Duty slip access requires valid proprietor authentication or verified customer mobile number matching the booking.',
      });
    }

    const slip = getDutySlipByBookingId(bookingId);
    if (!slip) {
      return res.status(404).json({ error: 'Duty slip not found for this booking' });
    }
    res.json(slip);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch duty slip' });
  }
});

// ============================================================================
// OWNER AUTHENTICATION & SETUP
// ============================================================================

// Check if initial setup is needed
app.get('/api/auth/setup-status', (req, res) => {
  try {
    const configured = isOwnerConfigured();
    res.json({
      needsSetup: !configured,
      message: configured
        ? 'Owner account is configured.'
        : 'Initial owner setup is required. Please register the proprietor account.',
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to determine setup status' });
  }
});

// Initial Owner Account Setup (Only allowed if no admin exists)
app.post('/api/auth/setup', loginLimiter, (req, res) => {
  try {
    if (isOwnerConfigured()) {
      return res.status(403).json({
        error: 'Initial owner setup has already been completed. Further registrations are disabled.',
      });
    }

    const { username, email, password, fullName } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'Missing required setup fields: username, email, and password are required.',
      });
    }

    const newOwner = registerInitialOwner({ username, email, password, fullName });
    res.status(201).json({
      success: true,
      message: 'Proprietor account successfully initialized. You can now log in.',
      user: {
        id: newOwner.id,
        username: newOwner.username,
        email: newOwner.email,
        fullName: newOwner.full_name,
        role: newOwner.role,
      },
    });
  } catch (err) {
    res.status(400).json({ error: err.message || 'Setup registration failed' });
  }
});

app.post('/api/auth/login', loginLimiter, (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Identifier (username/email) and password are required' });
    }

    const user = findUserByUsernameOrEmail(identifier.trim());
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = verifyPassword(password, user.password_hash, user.salt);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    updateLastLogin(user.id);
    const token = createSessionToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Login error' });
  }
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  try {
    const user = getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      lastLogin: user.last_login,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// ============================================================================
// PROTECTED OPERATIONS & DISPATCH ROUTES (OWNER ONLY)
// ============================================================================

// List all bookings with optional status / search filter
app.get('/api/bookings', requireAuth, (req, res) => {
  try {
    const { status, search } = req.query;
    const bookings = getBookingsList({ status, search });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

app.get('/api/bookings/:id', requireAuth, (req, res) => {
  try {
    const booking = getBookingById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Update booking status (7-stage lifecycle)
app.patch('/api/bookings/:id/status', requireAuth, (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = [
      'Enquiry Received',
      'Under Review',
      'Quote Sent',
      'Confirmed',
      'In Progress',
      'Completed',
      'Cancelled',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Allowed values: ${validStatuses.join(', ')}`,
      });
    }

    const updated = updateBookingStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ error: 'Booking not found' });

    res.json({ success: true, booking: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

// Full booking update (assign driver/vehicle, update KM, advance, quotation, etc.)
app.put('/api/bookings/:id', requireAuth, (req, res) => {
  try {
    const updated = updateBooking(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Booking not found' });
    res.json({ success: true, booking: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// Delete booking
app.delete('/api/bookings/:id', requireAuth, (req, res) => {
  try {
    const success = deleteBooking(req.params.id);
    if (!success) return res.status(404).json({ error: 'Booking not found' });
    res.json({ success: true, message: `Booking ${req.params.id} deleted.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

// Drivers Management
app.get('/api/drivers', requireAuth, (req, res) => {
  try {
    const drivers = getDriversList();
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
});

app.put('/api/drivers/:id', requireAuth, (req, res) => {
  try {
    const updated = updateDriver(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Driver not found' });
    res.json({ success: true, driver: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update driver' });
  }
});

// Vehicles Management
app.put('/api/fleet/:id', requireAuth, (req, res) => {
  try {
    const updated = updateVehicle(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Vehicle not found' });
    res.json({ success: true, vehicle: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update vehicle' });
  }
});

// Official Duty Slips
app.post('/api/duty-slips', requireAuth, (req, res) => {
  try {
    const slip = saveDutySlip(req.body);
    res.status(201).json({ success: true, dutySlip: slip });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save duty slip' });
  }
});

// Real Trip Expenses Management
app.get('/api/expenses', requireAuth, (req, res) => {
  try {
    const { bookingId } = req.query;
    const expenses = getTripExpenses(bookingId);
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

app.post('/api/expenses', requireAuth, (req, res) => {
  try {
    const { category, amount } = req.body;
    if (!category || !amount) {
      return res.status(400).json({ error: 'Category and amount are required' });
    }
    const created = addTripExpense(req.body);
    res.status(201).json({ success: true, expense: created });
  } catch (err) {
    res.status(500).json({ error: 'Failed to log expense' });
  }
});

app.delete('/api/expenses/:id', requireAuth, (req, res) => {
  try {
    const ok = deleteTripExpense(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Expense not found' });
    res.json({ success: true, message: 'Expense record deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// Real Analytics & Profitability Summary
app.get('/api/analytics', requireAuth, (req, res) => {
  try {
    const analytics = getAnalyticsSummary();
    res.json(analytics);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate analytics' });
  }
});

// Global CORS and API Error Handler
app.use((err, req, res, next) => {
  if (err && err.message && err.message.startsWith('CORS blocked')) {
    return res.status(403).json({ error: err.message });
  }
  next(err);
});

// Serve compiled frontend files in production (Render deployment)
const distPath = path.resolve(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
}

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[SERVER] Kadjai Travels TVMS Backend listening on http://localhost:${PORT}`);
  });
}

export default app;
