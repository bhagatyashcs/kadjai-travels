import { getDb } from './db.js';
import { generateSalt, hashPassword } from './auth.js';

/**
 * Deliberate Development / College Demonstration Seeder
 * Populates sample data marked clearly as [DEMO DATA].
 * Run via: npm run seed
 */
export function seedDemoData(customDb = null) {
  const db = customDb || getDb();

  console.log('[SEED] Starting deliberate demonstration data seeding...');

  // Ensure owner exists
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    const salt = generateSalt();
    const hash = hashPassword(process.env.OWNER_INITIAL_PASSWORD || 'kadjai@2026', salt);
    db.prepare(`
      INSERT INTO users (username, email, password_hash, salt, full_name, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('owner', 'owner@kadjaitravels.com', hash, salt, 'Ramasre Bhagat', 'ROLE_ADMIN');
    console.log('[SEED] Seeded development owner account: owner');
  }

  // Ensure vehicle exists
  const vehicleCount = db.prepare('SELECT COUNT(*) as count FROM vehicles').get().count;
  if (vehicleCount === 0) {
    db.prepare(`
      INSERT INTO vehicles (id, plate_number, model, category, seating_capacity, luggage_capacity, fuel_type, current_odometer_km, status, insurance_expiry, puc_expiry, maintenance_notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'VEH-01',
      'MH 02 EE 4589',
      'Maruti Suzuki Ertiga ZXi',
      '6+1 Tourist Luxury MUV (AC)',
      7,
      '3-4 Medium/Large Bags + Roof Luggage Carrier',
      'Petrol + CNG (Dual Fuel Eco)',
      42850,
      'Available',
      '2027-04-15',
      '2026-11-20',
      'Dual AC chilled & inspected. All-weather tyres in excellent condition.'
    );
    console.log('[SEED] Seeded vehicle: Maruti Suzuki Ertiga (MH 02 EE 4589)');
  }

  // Ensure driver exists
  const driverCount = db.prepare('SELECT COUNT(*) as count FROM drivers').get().count;
  if (driverCount === 0) {
    db.prepare(`
      INSERT INTO drivers (id, name, phone, license_number, badge_number, experience_years, status, rating)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'DRV-01',
      'Ramesh Shinde',
      '+91 98201 44521',
      'MH-02-2015-004312',
      'TR-MUM-8821',
      8,
      'Available',
      4.9
    );
    console.log('[SEED] Seeded primary driver: Ramesh Shinde');
  }

  // Ensure pricing rule exists
  const ruleCount = db.prepare('SELECT COUNT(*) as count FROM pricing_rules').get().count;
  if (ruleCount === 0) {
    db.prepare(`
      INSERT INTO pricing_rules (
        id, vehicle_model, outstation_rate_per_km, outstation_min_km_per_day,
        driver_bata_per_day, local_rate_per_km, local_8h_80km_package,
        local_12h_120km_package, airport_base_transfer, night_allowance
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'rule-ertiga',
      'Maruti Suzuki Ertiga',
      20.00,
      300,
      400.00,
      15.00,
      2200.00,
      3200.00,
      1800.00,
      300.00
    );
    console.log('[SEED] Seeded transparent pricing rules for Ertiga');
  }

  // Seed sample demonstration bookings
  const insertBooking = db.prepare(`
    INSERT OR REPLACE INTO bookings (
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

  // 1. Confirmed Trip (Lonavala)
  insertBooking.run({
    id: 'KAD-2026-101',
    customer_name: 'Amitabh Sengupta',
    customer_phone: '+91 98205 11223',
    trip_type: 'Round Trip',
    pickup_location: 'Bandra West, Mumbai (Near Linking Road)',
    drop_location: 'Della Resorts, Lonavala & Return',
    pickup_date: '2026-10-15',
    pickup_time: '07:30',
    return_date: '2026-10-16',
    days_count: 2,
    passengers: 4,
    vehicle_id: 'VEH-01',
    driver_id: 'DRV-01',
    vehicle_plate_number: 'MH 02 EE 4589',
    driver_name: 'Ramesh Shinde',
    driver_phone: '+91 98201 44521',
    start_km: null,
    end_km: null,
    total_km: null,
    billable_km: 600,
    rate_per_km: 20.00,
    base_fare: 12000.00,
    driver_bata_total: 800.00,
    toll_charges: 640.00,
    parking_charges: 200.00,
    night_charges: 0.00,
    discount: 0.00,
    total_fare: 13640.00,
    advance_paid: 4000.00,
    balance_due: 9640.00,
    payment_status: 'Partial',
    status: 'Confirmed',
    notes: '[DEMO RECORD] Family holiday to Lonavala. Roof luggage rack requested.',
  });

  // 2. In Progress Trip (Live on Road - Shirdi)
  insertBooking.run({
    id: 'KAD-2026-102',
    customer_name: 'Pooja Kulkarni',
    customer_phone: '+91 97690 44556',
    trip_type: 'Round Trip',
    pickup_location: 'Thane West, Ghodbunder Road',
    drop_location: 'Shirdi Sai Baba Temple & Return',
    pickup_date: '2026-10-14',
    pickup_time: '06:00',
    return_date: '2026-10-15',
    days_count: 2,
    passengers: 5,
    vehicle_id: 'VEH-01',
    driver_id: 'DRV-01',
    vehicle_plate_number: 'MH 02 EE 4589',
    driver_name: 'Ramesh Shinde',
    driver_phone: '+91 98201 44521',
    start_km: 42850,
    end_km: null,
    total_km: null,
    billable_km: 600,
    rate_per_km: 20.00,
    base_fare: 12000.00,
    driver_bata_total: 800.00,
    toll_charges: 450.00,
    parking_charges: 120.00,
    night_charges: 0.00,
    discount: 0.00,
    total_fare: 13370.00,
    advance_paid: 5000.00,
    balance_due: 8370.00,
    payment_status: 'Partial',
    status: 'In Progress',
    notes: '[DEMO RECORD] Active darshan trip. Route via Samruddhi Expressway.',
  });

  // 3. Completed Trip (Airport Transfer to Pune)
  insertBooking.run({
    id: 'KAD-2026-103',
    customer_name: 'Rajesh Mehta',
    customer_phone: '+91 98211 99887',
    trip_type: 'One Way',
    pickup_location: 'CSMIA Terminal 2 International, Mumbai',
    drop_location: 'Phase 1, Hinjewadi IT Park, Pune',
    pickup_date: '2026-10-12',
    pickup_time: '21:30',
    return_date: '2026-10-12',
    days_count: 1,
    passengers: 3,
    vehicle_id: 'VEH-01',
    driver_id: 'DRV-01',
    vehicle_plate_number: 'MH 02 EE 4589',
    driver_name: 'Ramesh Shinde',
    driver_phone: '+91 98201 44521',
    start_km: 42000,
    end_km: 42185,
    total_km: 185,
    billable_km: 185,
    rate_per_km: 20.00,
    base_fare: 3700.00,
    driver_bata_total: 0.00,
    toll_charges: 430.00,
    parking_charges: 180.00,
    night_charges: 300.00,
    discount: 0.00,
    total_fare: 4610.00,
    advance_paid: 4610.00,
    balance_due: 0.00,
    payment_status: 'Paid',
    status: 'Completed',
    notes: '[DEMO RECORD] Flight AI-191 on-time pickup. Bill fully settled.',
  });

  // 4. Enquiry Received (Website lead)
  insertBooking.run({
    id: 'KAD-2026-104',
    customer_name: 'Sunita Deshmukh',
    customer_phone: '+91 98204 88776',
    trip_type: 'Round Trip',
    pickup_location: 'Dadar West, Mumbai',
    drop_location: 'Mahabaleshwar Market & Sightseeing',
    pickup_date: '2026-10-20',
    pickup_time: '06:30',
    return_date: '2026-10-22',
    days_count: 3,
    passengers: 4,
    vehicle_id: null,
    driver_id: null,
    vehicle_plate_number: null,
    driver_name: null,
    driver_phone: null,
    start_km: null,
    end_km: null,
    total_km: null,
    billable_km: 900,
    rate_per_km: 20.00,
    base_fare: 18000.00,
    driver_bata_total: 1200.00,
    toll_charges: 800.00,
    parking_charges: 300.00,
    night_charges: 0.00,
    discount: 0.00,
    total_fare: 20300.00,
    advance_paid: 0.00,
    balance_due: 20300.00,
    payment_status: 'Pending',
    status: 'Enquiry Received',
    notes: '[DEMO RECORD] Customer requesting quote for 3-day family tour.',
  });

  // 5. Under Review
  insertBooking.run({
    id: 'KAD-2026-105',
    customer_name: 'Vikram Joshi',
    customer_phone: '+91 99200 33441',
    trip_type: 'Local Rental',
    pickup_location: 'Andheri East, Mumbai',
    drop_location: 'South Mumbai & BKC Full Day Meetings',
    pickup_date: '2026-10-18',
    pickup_time: '09:00',
    return_date: '2026-10-18',
    days_count: 1,
    passengers: 2,
    vehicle_id: null,
    driver_id: null,
    vehicle_plate_number: null,
    driver_name: null,
    driver_phone: null,
    start_km: null,
    end_km: null,
    total_km: null,
    billable_km: 80,
    rate_per_km: 15.00,
    base_fare: 2200.00,
    driver_bata_total: 0.00,
    toll_charges: 200.00,
    parking_charges: 150.00,
    night_charges: 0.00,
    discount: 0.00,
    total_fare: 2550.00,
    advance_paid: 0.00,
    balance_due: 2550.00,
    payment_status: 'Pending',
    status: 'Under Review',
    notes: '[DEMO RECORD] Checking schedule availability for full-day corporate rental.',
  });

  // Duty slip for completed booking
  db.prepare(`
    INSERT OR REPLACE INTO duty_slips (
      id, booking_id, opening_km, closing_km, total_distance_km,
      billable_distance_km, base_amount, driver_bata, fastag_tolls,
      parking_taxes, night_allowance, total_billed, advance_settled,
      balance_payable, payment_mode
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'DS-2026-103',
    'KAD-2026-103',
    42000,
    42185,
    185,
    185,
    3700.00,
    0.00,
    430.00,
    180.00,
    300.00,
    4610.00,
    4610.00,
    0.00,
    'Bank Transfer / UPI'
  );

  // Trip expenses
  const insertExpense = db.prepare(`
    INSERT INTO trip_expenses (booking_id, category, amount, notes, expense_date)
    VALUES (?, ?, ?, ?, ?)
  `);
  insertExpense.run('KAD-2026-103', 'Fuel (CNG/Petrol)', 1200.00, '[DEMO] CNG fill at Expressway pump', '2026-10-12');
  insertExpense.run('KAD-2026-103', 'Fastag Tolls', 430.00, '[DEMO] Expressway electronic toll debit', '2026-10-12');
  insertExpense.run('KAD-2026-103', 'Parking', 180.00, '[DEMO] CSMIA T2 airport parking receipt', '2026-10-12');
  insertExpense.run('KAD-2026-103', 'Driver Bata', 400.00, '[DEMO] Night duty allowance paid to driver', '2026-10-12');

  console.log('[SEED] Successfully seeded demonstration records. All marked with [DEMO RECORD].');
}

// Standalone execution if run via node server/seed.js
const isMain = process.argv[1] && process.argv[1].endsWith('seed.js');
if (isMain) {
  seedDemoData();
  process.exit(0);
}
