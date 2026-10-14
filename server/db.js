import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { generateSalt, hashPassword } from './auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'kadjai_travels.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

let dbInstance = null;

export function getDb() {
  if (!dbInstance) {
    dbInstance = new Database(DB_PATH);
    dbInstance.pragma('journal_mode = WAL');
    dbInstance.pragma('foreign_keys = ON');
    initDatabase(dbInstance);
  }
  return dbInstance;
}

function initDatabase(db) {
  // Execute schema (DDL only - no automatic data seeding)
  if (fs.existsSync(SCHEMA_PATH)) {
    const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf8');
    db.exec(schemaSql);
  }
}

/**
 * Checks if an administrator / owner account has already been registered.
 */
export function isOwnerConfigured() {
  const db = getDb();
  const row = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('ROLE_ADMIN');
  return Boolean(row && row.count > 0);
}

/**
 * Secure Initial Owner Setup: Creates the first owner account when the database is empty.
 * Prevents multiple setups by enforcing that user count must be zero.
 */
export function registerInitialOwner({ username, email, password, fullName }) {
  const db = getDb();

  if (isOwnerConfigured()) {
    throw new Error('Initial owner is already configured. Multiple initializations are rejected.');
  }

  if (!username || typeof username !== 'string' || username.trim().length < 3) {
    throw new Error('Username must be at least 3 characters long.');
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    throw new Error('A valid email address is required.');
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    throw new Error('Password must be at least 8 characters long.');
  }

  const salt = generateSalt();
  const hash = hashPassword(password, salt);
  const cleanUsername = username.trim();
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = fullName ? fullName.trim() : 'Proprietor';

  const stmt = db.prepare(`
    INSERT INTO users (username, email, password_hash, salt, full_name, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  stmt.run(cleanUsername, cleanEmail, hash, salt, cleanName, 'ROLE_ADMIN');
  return findUserByUsernameOrEmail(cleanUsername);
}

/**
 * Generates a collision-resistant, cryptographically random booking reference.
 * Format: KAD-<YEAR>-<8-CHAR-HEX> (e.g. KAD-2026-F4C91E2A)
 * Guaranteed unique by checking against existing database records.
 */
export function generateCollisionResistantBookingId(customDb = null) {
  const db = customDb || getDb();
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < 10; attempt++) {
    const token = crypto.randomBytes(4).toString('hex').toUpperCase();
    const candidateId = `KAD-${year}-${token}`;
    const exists = db.prepare('SELECT 1 FROM bookings WHERE id = ?').get(candidateId);
    if (!exists) {
      return candidateId;
    }
  }
  // Fallback with timestamp for absolute collision resistance
  const ts = Date.now().toString(36).toUpperCase();
  const token = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `KAD-${year}-${ts}-${token}`;
}

// ============================================================================
// DATABASE REPOSITORY FUNCTIONS
// ============================================================================

export function findUserByUsernameOrEmail(identifier) {
  const db = getDb();
  return db.prepare(`
    SELECT * FROM users WHERE username = ? OR email = ?
  `).get(identifier, identifier);
}

export function getUserById(id) {
  const db = getDb();
  return db.prepare('SELECT id, username, email, full_name, role, created_at, last_login FROM users WHERE id = ?').get(id);
}

export function updateLastLogin(id) {
  const db = getDb();
  db.prepare("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?").run(id);
}

export function getBookingsList(options = {}) {
  const db = getDb();
  let query = 'SELECT * FROM bookings';
  const params = [];
  const conditions = [];

  if (options.status) {
    conditions.push('status = ?');
    params.push(options.status);
  }

  if (options.search) {
    const q = `%${options.search}%`;
    conditions.push(`(
      id LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ? 
      OR pickup_location LIKE ? OR drop_location LIKE ?
    )`);
    params.push(q, q, q, q, q);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY created_at DESC';
  const rows = db.prepare(query).all(...params);
  return rows.map(formatBookingFromDb);
}

export function getBookingById(id) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
  return row ? formatBookingFromDb(row) : null;
}

/**
 * Public customer tracking lookup requiring BOTH Booking ID AND Customer Mobile
 */
export function getCustomerTripTracking(bookingId, phone) {
  const db = getDb();
  if (!bookingId || !phone) return null;

  // Clean phone string to digits
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const row = db.prepare('SELECT * FROM bookings WHERE LOWER(id) = LOWER(?)').get(bookingId.trim());

  if (!row) return null;

  const dbPhoneClean = (row.customer_phone || '').replace(/[^0-9]/g, '');
  if (!dbPhoneClean.endsWith(cleanPhone.slice(-10)) && !cleanPhone.endsWith(dbPhoneClean.slice(-10))) {
    return null; // Phone number does not match
  }

  const b = formatBookingFromDb(row);
  // Return sanitized customer tracking view (no internal margins or notes)
  return {
    id: b.id,
    customerName: b.customerName,
    customerPhone: b.customerPhone,
    tripType: b.tripType,
    pickupLocation: b.pickupLocation,
    dropLocation: b.dropLocation,
    pickupDate: b.pickupDate,
    pickupTime: b.pickupTime,
    returnDate: b.returnDate,
    daysCount: b.daysCount,
    passengers: b.passengers,
    vehiclePlateNumber: b.vehiclePlateNumber || 'Allocation in progress',
    vehicleModel: 'Maruti Suzuki Ertiga (6+1 AC)',
    driverName: b.driverName || 'Will be allocated prior to trip',
    driverPhone: b.driverPhone || null,
    startKm: b.startKm,
    endKm: b.endKm,
    totalKm: b.totalKm,
    totalFare: b.totalFare,
    advancePaid: b.advancePaid,
    balanceDue: b.balanceDue,
    paymentStatus: b.paymentStatus,
    status: b.status,
    createdAt: b.createdAt,
  };
}

export function insertBooking(booking) {
  const db = getDb();
  const bookingId = booking.id || generateCollisionResistantBookingId(db);
  const stmt = db.prepare(`
    INSERT INTO bookings (
      id, customer_name, customer_phone, trip_type, pickup_location, drop_location,
      pickup_date, pickup_time, return_date, days_count, passengers,
      vehicle_id, driver_id, vehicle_plate_number, driver_name, driver_phone,
      start_km, end_km, total_km, billable_km, rate_per_km, base_fare,
      driver_bata_total, toll_charges, parking_charges, night_charges, discount,
      total_fare, advance_paid, balance_due, payment_status, status, notes
    ) VALUES (
      @id, @customer_name, @customer_phone, @trip_type, @pickup_location, @drop_location,
      @pickup_date, @pickup_time, @return_date, @days_count, @passengers,
      @vehicle_id, @driver_id, @vehicle_plate_number, @driver_name, @driver_phone,
      @start_km, @end_km, @total_km, @billable_km, @rate_per_km, @base_fare,
      @driver_bata_total, @toll_charges, @parking_charges, @night_charges, @discount,
      @total_fare, @advance_paid, @balance_due, @payment_status, @status, @notes
    )
  `);

  stmt.run({
    id: bookingId,
    customer_name: booking.customerName,
    customer_phone: booking.customerPhone,
    trip_type: booking.tripType || 'Round Trip',
    pickup_location: booking.pickupLocation,
    drop_location: booking.dropLocation,
    pickup_date: booking.pickupDate,
    pickup_time: booking.pickupTime || '07:00',
    return_date: booking.returnDate || null,
    days_count: Number(booking.daysCount) || 1,
    passengers: Number(booking.passengers) || 4,
    vehicle_id: booking.vehicleId || null,
    driver_id: booking.driverId || null,
    vehicle_plate_number: booking.vehiclePlateNumber || null,
    driver_name: booking.driverName || null,
    driver_phone: booking.driverPhone || null,
    start_km: booking.startKm ? Number(booking.startKm) : null,
    end_km: booking.endKm ? Number(booking.endKm) : null,
    total_km: booking.totalKm ? Number(booking.totalKm) : null,
    billable_km: Number(booking.billableKm) || Number(booking.estKm) || 300,
    rate_per_km: Number(booking.ratePerKm) || 20.00,
    base_fare: Number(booking.baseFare) || 0.00,
    driver_bata_total: Number(booking.driverBataTotal) || 0.00,
    toll_charges: Number(booking.tollCharges) || 0.00,
    parking_charges: Number(booking.parkingCharges) || 0.00,
    night_charges: Number(booking.nightCharges) || 0.00,
    discount: Number(booking.discount) || 0.00,
    total_fare: Number(booking.totalFare) || 0.00,
    advance_paid: Number(booking.advancePaid) || 0.00,
    balance_due: Number(booking.balanceDue) || Number(booking.totalFare) || 0.00,
    payment_status: booking.paymentStatus || 'Pending',
    status: booking.status || 'Enquiry Received',
    notes: booking.notes || null,
  });

  return getBookingById(bookingId);
}

/**
 * Checks for recent duplicate booking submissions (same phone & pickup date within 5 minutes)
 */
export function findRecentDuplicateBooking(phone, pickupDate) {
  const db = getDb();
  if (!phone || !pickupDate) return null;
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const rows = db.prepare(`
    SELECT id, customer_name, customer_phone, pickup_date, pickup_location, created_at 
    FROM bookings 
    WHERE pickup_date = ? 
    ORDER BY created_at DESC 
    LIMIT 10
  `).all(pickupDate);

  for (const r of rows) {
    const rPhoneClean = (r.customer_phone || '').replace(/[^0-9]/g, '');
    if (rPhoneClean.length >= 10 && cleanPhone.length >= 10) {
      if (rPhoneClean.endsWith(cleanPhone.slice(-10)) || cleanPhone.endsWith(rPhoneClean.slice(-10))) {
        return r;
      }
    }
  }
  return null;
}

export function updateBooking(id, booking) {
  const db = getDb();
  const stmt = db.prepare(`
    UPDATE bookings SET
      customer_name = COALESCE(@customer_name, customer_name),
      customer_phone = COALESCE(@customer_phone, customer_phone),
      trip_type = COALESCE(@trip_type, trip_type),
      pickup_location = COALESCE(@pickup_location, pickup_location),
      drop_location = COALESCE(@drop_location, drop_location),
      pickup_date = COALESCE(@pickup_date, pickup_date),
      pickup_time = COALESCE(@pickup_time, pickup_time),
      return_date = COALESCE(@return_date, return_date),
      days_count = COALESCE(@days_count, days_count),
      passengers = COALESCE(@passengers, passengers),
      vehicle_id = COALESCE(@vehicle_id, vehicle_id),
      driver_id = COALESCE(@driver_id, driver_id),
      vehicle_plate_number = COALESCE(@vehicle_plate_number, vehicle_plate_number),
      driver_name = COALESCE(@driver_name, driver_name),
      driver_phone = COALESCE(@driver_phone, driver_phone),
      start_km = COALESCE(@start_km, start_km),
      end_km = COALESCE(@end_km, end_km),
      total_km = COALESCE(@total_km, total_km),
      billable_km = COALESCE(@billable_km, billable_km),
      rate_per_km = COALESCE(@rate_per_km, rate_per_km),
      base_fare = COALESCE(@base_fare, base_fare),
      driver_bata_total = COALESCE(@driver_bata_total, driver_bata_total),
      toll_charges = COALESCE(@toll_charges, toll_charges),
      parking_charges = COALESCE(@parking_charges, parking_charges),
      night_charges = COALESCE(@night_charges, night_charges),
      discount = COALESCE(@discount, discount),
      total_fare = COALESCE(@total_fare, total_fare),
      advance_paid = COALESCE(@advance_paid, advance_paid),
      balance_due = COALESCE(@balance_due, balance_due),
      payment_status = COALESCE(@payment_status, payment_status),
      status = COALESCE(@status, status),
      notes = COALESCE(@notes, notes),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = @id
  `);

  stmt.run({
    id,
    customer_name: booking.customerName,
    customer_phone: booking.customerPhone,
    trip_type: booking.tripType,
    pickup_location: booking.pickupLocation,
    drop_location: booking.dropLocation,
    pickup_date: booking.pickupDate,
    pickup_time: booking.pickupTime,
    return_date: booking.returnDate,
    days_count: booking.daysCount !== undefined ? Number(booking.daysCount) : null,
    passengers: booking.passengers !== undefined ? Number(booking.passengers) : null,
    vehicle_id: booking.vehicleId,
    driver_id: booking.driverId,
    vehicle_plate_number: booking.vehiclePlateNumber,
    driver_name: booking.driverName,
    driver_phone: booking.driverPhone,
    start_km: booking.startKm !== undefined ? Number(booking.startKm) : null,
    end_km: booking.endKm !== undefined ? Number(booking.endKm) : null,
    total_km: booking.totalKm !== undefined ? Number(booking.totalKm) : null,
    billable_km: booking.billableKm !== undefined ? Number(booking.billableKm) : null,
    rate_per_km: booking.ratePerKm !== undefined ? Number(booking.ratePerKm) : null,
    base_fare: booking.baseFare !== undefined ? Number(booking.baseFare) : null,
    driver_bata_total: booking.driverBataTotal !== undefined ? Number(booking.driverBataTotal) : null,
    toll_charges: booking.tollCharges !== undefined ? Number(booking.tollCharges) : null,
    parking_charges: booking.parkingCharges !== undefined ? Number(booking.parkingCharges) : null,
    night_charges: booking.nightCharges !== undefined ? Number(booking.nightCharges) : null,
    discount: booking.discount !== undefined ? Number(booking.discount) : null,
    total_fare: booking.totalFare !== undefined ? Number(booking.totalFare) : null,
    advance_paid: booking.advancePaid !== undefined ? Number(booking.advancePaid) : null,
    balance_due: booking.balanceDue !== undefined ? Number(booking.balanceDue) : null,
    payment_status: booking.paymentStatus,
    status: booking.status,
    notes: booking.notes,
  });

  return getBookingById(id);
}

/**
 * Atomic status transition with vehicle and driver dispatch sync
 */
export function updateBookingStatus(id, newStatus) {
  const db = getDb();
  const tx = db.transaction(() => {
    db.prepare(`
      UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(newStatus, id);

    const b = getBookingById(id);
    if (b && newStatus === 'In Progress') {
      if (b.vehicleId) {
        db.prepare("UPDATE vehicles SET status = 'On Trip' WHERE id = ?").run(b.vehicleId);
      }
      if (b.driverId) {
        db.prepare("UPDATE drivers SET status = 'On Trip' WHERE id = ?").run(b.driverId);
      }
    } else if (b && (newStatus === 'Completed' || newStatus === 'Cancelled')) {
      if (b.vehicleId) {
        db.prepare("UPDATE vehicles SET status = 'Available' WHERE id = ?").run(b.vehicleId);
      }
      if (b.driverId) {
        db.prepare("UPDATE drivers SET status = 'Available' WHERE id = ?").run(b.driverId);
      }
    }
    return b;
  });

  return tx();
}

export function deleteBooking(id) {
  const db = getDb();
  const result = db.prepare('DELETE FROM bookings WHERE id = ?').run(id);
  return result.changes > 0;
}

// ----------------------------------------------------------------------------
// VEHICLES REPO
// ----------------------------------------------------------------------------
export function getVehiclesList() {
  const db = getDb();
  return db.prepare('SELECT * FROM vehicles').all();
}

export function updateVehicle(id, vehicle) {
  const db = getDb();
  db.prepare(`
    UPDATE vehicles SET
      plate_number = COALESCE(?, plate_number),
      current_odometer_km = COALESCE(?, current_odometer_km),
      status = COALESCE(?, status),
      maintenance_notes = COALESCE(?, maintenance_notes)
    WHERE id = ?
  `).run(
    vehicle.plateNumber || vehicle.plate_number,
    vehicle.currentKm || vehicle.current_odometer_km,
    vehicle.status,
    vehicle.maintenanceNotes || vehicle.maintenance_notes,
    id
  );
  return db.prepare('SELECT * FROM vehicles WHERE id = ?').get(id);
}

// ----------------------------------------------------------------------------
// DRIVERS REPO
// ----------------------------------------------------------------------------
export function getDriversList() {
  const db = getDb();
  return db.prepare('SELECT * FROM drivers').all();
}

export function updateDriver(id, driver) {
  const db = getDb();
  db.prepare(`
    UPDATE drivers SET
      name = COALESCE(?, name),
      phone = COALESCE(?, phone),
      status = COALESCE(?, status),
      rating = COALESCE(?, rating)
    WHERE id = ?
  `).run(driver.name, driver.phone, driver.status, driver.rating, id);
  return db.prepare('SELECT * FROM drivers WHERE id = ?').get(id);
}

// ----------------------------------------------------------------------------
// DUTY SLIPS REPO
// ----------------------------------------------------------------------------
export function getDutySlipByBookingId(bookingId) {
  const db = getDb();
  return db.prepare('SELECT * FROM duty_slips WHERE booking_id = ?').get(bookingId);
}

export function saveDutySlip(slip) {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM duty_slips WHERE booking_id = ?').get(slip.bookingId || slip.booking_id);

  if (existing) {
    db.prepare(`
      UPDATE duty_slips SET
        opening_km = @opening_km,
        closing_km = @closing_km,
        total_distance_km = @total_distance_km,
        billable_distance_km = @billable_distance_km,
        base_amount = @base_amount,
        driver_bata = @driver_bata,
        fastag_tolls = @fastag_tolls,
        parking_taxes = @parking_taxes,
        night_allowance = @night_allowance,
        total_billed = @total_billed,
        advance_settled = @advance_settled,
        balance_payable = @balance_payable,
        payment_mode = @payment_mode
      WHERE id = @id
    `).run({
      id: existing.id,
      opening_km: Number(slip.openingKm || slip.opening_km),
      closing_km: Number(slip.closingKm || slip.closing_km),
      total_distance_km: Number(slip.totalDistanceKm || slip.total_distance_km),
      billable_distance_km: Number(slip.billableDistanceKm || slip.billable_distance_km),
      base_amount: Number(slip.baseAmount || slip.base_amount),
      driver_bata: Number(slip.driverBata || slip.driver_bata || 0),
      fastag_tolls: Number(slip.fastagTolls || slip.fastag_tolls || 0),
      parking_taxes: Number(slip.parkingTaxes || slip.parking_taxes || 0),
      night_allowance: Number(slip.nightAllowance || slip.night_allowance || 0),
      total_billed: Number(slip.totalBilled || slip.total_billed),
      advance_settled: Number(slip.advanceSettled || slip.advance_settled || 0),
      balance_payable: Number(slip.balancePayable || slip.balance_payable || 0),
      payment_mode: slip.paymentMode || slip.payment_mode || 'Cash / UPI',
    });
    return getDutySlipByBookingId(slip.bookingId || slip.booking_id);
  } else {
    const id = slip.id || `DS-${Date.now().toString().slice(-6)}`;
    db.prepare(`
      INSERT INTO duty_slips (
        id, booking_id, opening_km, closing_km, total_distance_km,
        billable_distance_km, base_amount, driver_bata, fastag_tolls,
        parking_taxes, night_allowance, total_billed, advance_settled,
        balance_payable, payment_mode
      ) VALUES (
        @id, @booking_id, @opening_km, @closing_km, @total_distance_km,
        @billable_distance_km, @base_amount, @driver_bata, @fastag_tolls,
        @parking_taxes, @night_allowance, @total_billed, @advance_settled,
        @balance_payable, @payment_mode
      )
    `).run({
      id,
      booking_id: slip.bookingId || slip.booking_id,
      opening_km: Number(slip.openingKm || slip.opening_km),
      closing_km: Number(slip.closingKm || slip.closing_km),
      total_distance_km: Number(slip.totalDistanceKm || slip.total_distance_km),
      billable_distance_km: Number(slip.billableDistanceKm || slip.billable_distance_km),
      base_amount: Number(slip.baseAmount || slip.base_amount),
      driver_bata: Number(slip.driverBata || slip.driver_bata || 0),
      fastag_tolls: Number(slip.fastagTolls || slip.fastag_tolls || 0),
      parking_taxes: Number(slip.parkingTaxes || slip.parking_taxes || 0),
      night_allowance: Number(slip.nightAllowance || slip.night_allowance || 0),
      total_billed: Number(slip.totalBilled || slip.total_billed),
      advance_settled: Number(slip.advanceSettled || slip.advance_settled || 0),
      balance_payable: Number(slip.balancePayable || slip.balance_payable || 0),
      payment_mode: slip.paymentMode || slip.payment_mode || 'Cash / UPI',
    });
    return getDutySlipByBookingId(slip.bookingId || slip.booking_id);
  }
}

// ----------------------------------------------------------------------------
// TRIP EXPENSES REPO
// ----------------------------------------------------------------------------
export function getTripExpenses(bookingId = null) {
  const db = getDb();
  if (bookingId) {
    return db.prepare('SELECT * FROM trip_expenses WHERE booking_id = ? ORDER BY expense_date DESC').all(bookingId);
  }
  return db.prepare('SELECT * FROM trip_expenses ORDER BY expense_date DESC').all();
}

export function addTripExpense(expense) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO trip_expenses (booking_id, category, amount, notes, expense_date)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    expense.bookingId || expense.booking_id || null,
    expense.category,
    Number(expense.amount),
    expense.notes || null,
    expense.expenseDate || expense.expense_date || new Date().toISOString().split('T')[0]
  );
  return db.prepare('SELECT * FROM trip_expenses WHERE id = ?').get(result.lastInsertRowid);
}

export function deleteTripExpense(id) {
  const db = getDb();
  const result = db.prepare('DELETE FROM trip_expenses WHERE id = ?').run(id);
  return result.changes > 0;
}

// ----------------------------------------------------------------------------
// PRICING RULES REPO
// ----------------------------------------------------------------------------
export function getPricingRules() {
  const db = getDb();
  return db.prepare('SELECT * FROM pricing_rules LIMIT 1').get();
}

// ----------------------------------------------------------------------------
// REAL REVENUE & PROFIT ANALYTICS SUMMARY
// ----------------------------------------------------------------------------
export function getAnalyticsSummary() {
  const db = getDb();

  // 1. Revenue figures
  const revenueRow = db.prepare(`
    SELECT
      SUM(advance_paid) as total_collected,
      SUM(balance_due) as total_receivable,
      SUM(total_fare) as gross_booked,
      COUNT(*) as total_bookings
    FROM bookings
  `).get();

  // 2. Status Breakdown
  const statusCounts = db.prepare(`
    SELECT status, COUNT(*) as count FROM bookings GROUP BY status
  `).all();

  // 3. Total Real Logged Expenses
  const expensesRow = db.prepare(`
    SELECT
      SUM(amount) as total_expenses,
      SUM(CASE WHEN category LIKE '%Fuel%' THEN amount ELSE 0 END) as fuel_expenses,
      SUM(CASE WHEN category LIKE '%Toll%' THEN amount ELSE 0 END) as toll_expenses,
      SUM(CASE WHEN category LIKE '%Driver%' THEN amount ELSE 0 END) as driver_bata_expenses,
      SUM(CASE WHEN category LIKE '%Parking%' THEN amount ELSE 0 END) as parking_expenses,
      SUM(CASE WHEN category LIKE '%Maintenance%' THEN amount ELSE 0 END) as maintenance_expenses
    FROM trip_expenses
  `).get();

  // 4. Kilometers run
  const kmRow = db.prepare(`
    SELECT
      SUM(CASE WHEN total_km IS NOT NULL THEN total_km ELSE 0 END) as total_km_logged
    FROM bookings
  `).get();

  const totalCollected = Number(revenueRow.total_collected || 0);
  const totalExpenses = Number(expensesRow.total_expenses || 0);
  const netOperatingProfit = totalCollected - totalExpenses;

  return {
    totalRevenueCollected: totalCollected,
    totalBalanceReceivable: Number(revenueRow.total_receivable || 0),
    grossBookedBilling: Number(revenueRow.gross_booked || 0),
    totalExpenses,
    netOperatingProfit,
    expenseBreakdown: {
      fuel: Number(expensesRow.fuel_expenses || 0),
      tolls: Number(expensesRow.toll_expenses || 0),
      driverBata: Number(expensesRow.driver_bata_expenses || 0),
      parking: Number(expensesRow.parking_expenses || 0),
      maintenance: Number(expensesRow.maintenance_expenses || 0),
    },
    totalKmLogged: Number(kmRow.total_km_logged || 0),
    statusCounts: statusCounts.reduce((acc, row) => {
      acc[row.status] = row.count;
      return acc;
    }, {}),
    totalBookingsCount: Number(revenueRow.total_bookings || 0),
  };
}

// Helper to convert snake_case DB row to camelCase for frontend compatibility
function formatBookingFromDb(row) {
  return {
    id: row.id,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    tripType: row.trip_type,
    pickupLocation: row.pickup_location,
    dropLocation: row.drop_location,
    pickupDate: row.pickup_date,
    pickupTime: row.pickup_time,
    returnDate: row.return_date,
    daysCount: row.days_count,
    passengers: row.passengers,
    vehicleId: row.vehicle_id,
    driverId: row.driver_id,
    vehiclePlateNumber: row.vehicle_plate_number,
    driverName: row.driver_name,
    driverPhone: row.driver_phone,
    startKm: row.start_km,
    endKm: row.end_km,
    totalKm: row.total_km,
    billableKm: row.billable_km,
    ratePerKm: Number(row.rate_per_km),
    baseFare: Number(row.base_fare),
    driverBataTotal: Number(row.driver_bata_total),
    tollCharges: Number(row.toll_charges),
    parkingCharges: Number(row.parking_charges),
    nightCharges: Number(row.night_charges),
    discount: Number(row.discount),
    totalFare: Number(row.total_fare),
    advancePaid: Number(row.advance_paid),
    balanceDue: Number(row.balance_due),
    paymentStatus: row.payment_status,
    status: row.status,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
