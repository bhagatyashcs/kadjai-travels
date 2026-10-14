import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getDb,
  findUserByUsernameOrEmail,
  getBookingsList,
  getBookingById,
  getCustomerTripTracking,
  insertBooking,
  updateBookingStatus,
  saveDutySlip,
  getDutySlipByBookingId,
  addTripExpense,
  getTripExpenses,
  getAnalyticsSummary,
  getVehiclesList,
  getDriversList,
  findRecentDuplicateBooking,
  deleteBooking,
  isOwnerConfigured,
  registerInitialOwner,
  generateCollisionResistantBookingId,
} from '../../server/db.js';

import {
  verifyPassword,
  createSessionToken,
  verifySessionToken,
  hashPassword,
  generateSalt,
} from '../../server/auth.js';

import { seedDemoData } from '../../server/seed.js';

// Setup: Ensure database and demo baseline are present for test execution
const db = getDb();
seedDemoData(db);

test('TVMS Backend 1: SQLite Database boots with seeded Ertiga vehicle and driver', () => {
  assert.ok(db);

  const vehicles = getVehiclesList();
  assert.ok(vehicles.length >= 1);
  const ertiga = vehicles.find(v => v.plate_number === 'MH 02 EE 4589');
  assert.ok(ertiga, 'Ertiga MH 02 EE 4589 must be registered in the fleet');
  assert.equal(ertiga.model, 'Maruti Suzuki Ertiga ZXi');
  assert.equal(ertiga.seating_capacity, 7);

  const drivers = getDriversList();
  assert.ok(drivers.length >= 1);
  const driver = drivers.find(d => d.name === 'Ramesh Shinde');
  assert.ok(driver, 'Ramesh Shinde must be registered as primary commercial driver');
  assert.equal(driver.license_number, 'MH-02-2015-004312');
});

test('TVMS Backend 2: Owner authentication securely validates proprietor credentials', () => {
  const user = findUserByUsernameOrEmail('owner');
  assert.ok(user, 'Default owner account must exist');
  assert.equal(user.full_name, 'Ramasre Bhagat');
  assert.equal(user.role, 'ROLE_ADMIN');

  // Validate correct password
  const valid = verifyPassword('kadjai@2026', user.password_hash, user.salt);
  assert.equal(valid, true);

  // Reject wrong password
  const wrong = verifyPassword('wrong-password', user.password_hash, user.salt);
  assert.equal(wrong, false);

  // Reject empty inputs
  assert.equal(verifyPassword('', user.password_hash, user.salt), false);
  assert.equal(verifyPassword('kadjai@2026', '', user.salt), false);
  assert.equal(verifyPassword('kadjai@2026', user.password_hash, ''), false);

  // Generate & verify signed session token
  const token = createSessionToken(user);
  assert.ok(token);
  const payload = verifySessionToken(token);
  assert.ok(payload);
  assert.equal(payload.username, 'owner');
  assert.equal(payload.fullName, 'Ramasre Bhagat');
});

test('TVMS Backend 3: Token security prevents tampered signatures and length mismatch crashes', () => {
  const user = findUserByUsernameOrEmail('owner');
  const token = createSessionToken(user);

  // 1. Completely invalid token strings
  assert.equal(verifySessionToken(null), null);
  assert.equal(verifySessionToken(''), null);
  assert.equal(verifySessionToken('not-a-valid-token'), null);
  assert.equal(verifySessionToken('invalid.too.many.dots.here'), null);

  // 2. Tampered signature (different byte length should NOT crash crypto.timingSafeEqual)
  const [b64] = token.split('.');
  assert.equal(verifySessionToken(`${b64}.short`), null);
  assert.equal(verifySessionToken(`${b64}.thisIsAnEntirelyInvalidSignatureThatHasDifferentLength`), null);

  // 3. Tampered payload
  const tamperedPayload = Buffer.from(JSON.stringify({ id: 999, username: 'hacker', exp: Date.now() + 10000 })).toString('base64url');
  assert.equal(verifySessionToken(`${tamperedPayload}.${token.split('.')[1]}`), null);
});

test('TVMS Backend 4: Booking lifecycle supports all 7 formal statuses and synchronizes fleet availability', () => {
  const validStatuses = [
    'Enquiry Received',
    'Under Review',
    'Quote Sent',
    'Confirmed',
    'In Progress',
    'Completed',
    'Cancelled',
  ];

  const testId = `KAD-TEST-${Date.now()}`;
  const created = insertBooking({
    id: testId,
    customerName: 'Test Lifecycle Customer',
    customerPhone: '+91 99999 11111',
    tripType: 'Round Trip',
    pickupLocation: 'Mumbai',
    dropLocation: 'Lonavala',
    pickupDate: '2026-10-25',
    pickupTime: '08:00',
    status: 'Enquiry Received',
    vehicleId: 'VEH-01',
    driverId: 'DRV-01',
    totalFare: 5000,
    advancePaid: 0,
    balanceDue: 5000,
  });

  assert.equal(created.status, 'Enquiry Received');

  // Stage 1 -> Progress to 'In Progress' -> Vehicle and Driver must become 'On Trip'
  const inProgressBooking = updateBookingStatus(testId, 'In Progress');
  assert.equal(inProgressBooking.status, 'In Progress');
  const vehicleOnTrip = getVehiclesList().find(v => v.id === 'VEH-01');
  const driverOnTrip = getDriversList().find(d => d.id === 'DRV-01');
  assert.equal(vehicleOnTrip.status, 'On Trip');
  assert.equal(driverOnTrip.status, 'On Trip');

  // Stage 2 -> Progress to 'Completed' -> Vehicle and Driver must return to 'Available'
  const completedBooking = updateBookingStatus(testId, 'Completed');
  assert.equal(completedBooking.status, 'Completed');
  const vehicleAvailable = getVehiclesList().find(v => v.id === 'VEH-01');
  const driverAvailable = getDriversList().find(d => d.id === 'DRV-01');
  assert.equal(vehicleAvailable.status, 'Available');
  assert.equal(driverAvailable.status, 'Available');

  // Verify all 7 formal statuses are valid
  for (const st of validStatuses) {
    const updated = updateBookingStatus(testId, st);
    assert.equal(updated.status, st);
  }
});

test('TVMS Backend 5: Customer tracking strictly requires BOTH Booking ID and matching phone', () => {
  // Valid match for seeded booking KAD-2026-101 (+91 98205 11223)
  const trackingValid = getCustomerTripTracking('KAD-2026-101', '+91 98205 11223');
  assert.ok(trackingValid, 'Valid ID and Phone must return trip details');
  assert.equal(trackingValid.id, 'KAD-2026-101');
  assert.equal(trackingValid.customerName, 'Amitabh Sengupta');
  // Internal notes and operational driver allowances should not be leaked in public tracking
  assert.equal(trackingValid.notes, undefined);
  assert.equal(trackingValid.driverBataTotal, undefined);

  // Wrong phone with valid booking ID
  const trackingWrongPhone = getCustomerTripTracking('KAD-2026-101', '+91 91111 22222');
  assert.equal(trackingWrongPhone, null, 'Wrong phone number must be rejected');

  // Non-existent booking ID
  const trackingNonExistent = getCustomerTripTracking('KAD-9999-999', '+91 98205 11223');
  assert.equal(trackingNonExistent, null, 'Non-existent ID must return null');
});

test('TVMS Backend 6: Duplicate booking detection prevents double submissions for same date and phone', () => {
  const phone = '+91 98205 ' + Math.floor(10000 + Math.random() * 90000);
  const pickupDate = '2026-11-05';

  // Initially no duplicate
  const noDup = findRecentDuplicateBooking(phone, pickupDate);
  assert.equal(noDup, null);

  // Insert a booking
  const newBookingId = `KAD-DUP-${Date.now()}`;
  insertBooking({
    id: newBookingId,
    customerName: 'Duplicate Test Customer',
    customerPhone: phone,
    tripType: 'Round Trip',
    pickupLocation: 'Bandra West',
    dropLocation: 'Mahabaleshwar',
    pickupDate: pickupDate,
    pickupTime: '06:00',
    totalFare: 12000,
  });

  // Now duplicate must be detected
  const duplicate = findRecentDuplicateBooking(phone, pickupDate);
  assert.ok(duplicate, 'Recent booking submission must be detected as duplicate');
  assert.equal(duplicate.id, newBookingId);

  // Clean up
  deleteBooking(newBookingId);
});

test('TVMS Backend 7: Real trip expenses and net operating profit calculations', () => {
  const initialAnalytics = getAnalyticsSummary();
  assert.ok(initialAnalytics.totalRevenueCollected >= 0);
  assert.ok(initialAnalytics.totalExpenses >= 0);
  assert.equal(
    initialAnalytics.netOperatingProfit,
    initialAnalytics.totalRevenueCollected - initialAnalytics.totalExpenses
  );

  // Log a new expense
  const exp = addTripExpense({
    bookingId: 'KAD-2026-103',
    category: 'Fuel (CNG/Petrol)',
    amount: 500,
    notes: 'Top-up CNG fuel at Expressway exit',
    expenseDate: '2026-10-14',
  });
  assert.ok(exp);
  assert.equal(exp.amount, 500);

  const updatedAnalytics = getAnalyticsSummary();
  assert.equal(
    updatedAnalytics.totalExpenses,
    initialAnalytics.totalExpenses + 500
  );
  assert.equal(
    updatedAnalytics.netOperatingProfit,
    updatedAnalytics.totalRevenueCollected - updatedAnalytics.totalExpenses
  );
});

test('TVMS Backend 8: Duty slip creation and retrieval links to completed booking', () => {
  const slip = getDutySlipByBookingId('KAD-2026-103');
  assert.ok(slip);
  assert.equal(slip.opening_km, 42000);
  assert.equal(slip.closing_km, 42185);
  assert.equal(slip.total_distance_km, 185);
  assert.equal(slip.total_billed, 4610);
});

test('TVMS Backend 9: Collision-resistant booking IDs generate unique, high-entropy references', () => {
  const generatedIds = new Set();
  const year = new Date().getFullYear();

  for (let i = 0; i < 50; i++) {
    const id = generateCollisionResistantBookingId(db);
    assert.match(id, new RegExp(`^KAD-${year}-[A-F0-9]{8,}`));
    assert.equal(generatedIds.has(id), false, `ID ${id} must not collide with previous IDs`);
    generatedIds.add(id);
  }

  // Insert without explicit ID should automatically assign a collision-resistant ID
  const autoIdBooking = insertBooking({
    customerName: 'Auto ID Customer',
    customerPhone: '+91 98205 99999',
    tripType: 'One Way',
    pickupLocation: 'Mumbai Airport T2',
    dropLocation: 'Pune Station',
    pickupDate: '2026-11-20',
    totalFare: 3500,
  });

  assert.ok(autoIdBooking);
  assert.match(autoIdBooking.id, new RegExp(`^KAD-${year}-[A-F0-9]{8,}`));
  deleteBooking(autoIdBooking.id);
});

test('TVMS Backend 10: Owner setup enforces single initialization and rejects duplicate setups', () => {
  assert.equal(isOwnerConfigured(), true, 'Owner should already be configured from seed baseline');

  // Attempting to register another initial owner must throw an error
  assert.throws(
    () => {
      registerInitialOwner({
        username: 'intruder',
        email: 'intruder@example.com',
        password: 'password123',
        fullName: 'Intruder User',
      });
    },
    /already configured/i
  );
});
