-- ============================================================================
-- KADJAI TRAVELS - TOURIST VEHICLE MANAGEMENT SYSTEM (TVMS)
-- RELATIONAL DATABASE SCHEMA (3NF)
-- Compatible with SQLite 3 and PostgreSQL 16
-- ============================================================================

-- 1. USERS & OWNER AUTHENTICATION
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(64) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_ADMIN', -- 'ROLE_ADMIN', 'ROLE_STAFF'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- 2. VEHICLE FLEET (EXCLUSIVELY MARUTI SUZUKI ERTIGA)
CREATE TABLE IF NOT EXISTS vehicles (
    id VARCHAR(30) PRIMARY KEY,
    plate_number VARCHAR(20) UNIQUE NOT NULL,
    model VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    seating_capacity INTEGER NOT NULL DEFAULT 7,
    luggage_capacity VARCHAR(100) NOT NULL,
    fuel_type VARCHAR(30) NOT NULL,
    current_odometer_km INTEGER NOT NULL DEFAULT 42000,
    status VARCHAR(20) NOT NULL DEFAULT 'Available', -- 'Available', 'On Trip', 'Maintenance'
    insurance_expiry DATE,
    puc_expiry DATE,
    maintenance_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. COMMERCIAL DRIVERS ROSTER
CREATE TABLE IF NOT EXISTS drivers (
    id VARCHAR(30) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    badge_number VARCHAR(50) NOT NULL,
    experience_years INTEGER NOT NULL DEFAULT 5,
    status VARCHAR(20) NOT NULL DEFAULT 'Available', -- 'Available', 'On Trip', 'Off Duty'
    active_trip_id VARCHAR(30),
    rating NUMERIC(3,1) DEFAULT 4.9,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. BOOKINGS & TRIP LIFECYCLE
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(30) PRIMARY KEY, -- 'KAD-YYYY-XXX'
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    trip_type VARCHAR(30) NOT NULL, -- 'Round Trip', 'One Way', 'Local Rental', 'Airport Transfer'
    pickup_location TEXT NOT NULL,
    drop_location TEXT NOT NULL,
    pickup_date DATE NOT NULL,
    pickup_time VARCHAR(10) NOT NULL,
    return_date DATE,
    days_count INTEGER NOT NULL DEFAULT 1,
    passengers INTEGER NOT NULL DEFAULT 4,
    vehicle_id VARCHAR(30) REFERENCES vehicles(id),
    driver_id VARCHAR(30) REFERENCES drivers(id),
    vehicle_plate_number VARCHAR(20),
    driver_name VARCHAR(100),
    driver_phone VARCHAR(20),
    start_km INTEGER,
    end_km INTEGER,
    total_km INTEGER,
    billable_km INTEGER,
    rate_per_km NUMERIC(10,2) NOT NULL DEFAULT 25.00,
    base_fare NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    driver_bata_total NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    toll_charges NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    parking_charges NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    night_charges NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    discount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    total_fare NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    advance_paid NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    balance_due NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    payment_status VARCHAR(20) NOT NULL DEFAULT 'Pending', -- 'Paid', 'Partial', 'Pending'
    status VARCHAR(30) NOT NULL DEFAULT 'Enquiry Received', -- 'Enquiry Received', 'Under Review', 'Quote Sent', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. OFFICIAL DUTY SLIPS & BILLING RECORDS
CREATE TABLE IF NOT EXISTS duty_slips (
    id VARCHAR(30) PRIMARY KEY, -- 'DS-YYYY-XXX'
    booking_id VARCHAR(30) UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    opening_km INTEGER NOT NULL,
    closing_km INTEGER NOT NULL,
    total_distance_km INTEGER NOT NULL,
    billable_distance_km INTEGER NOT NULL,
    base_amount NUMERIC(10,2) NOT NULL,
    driver_bata NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    fastag_tolls NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    parking_taxes NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    night_allowance NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    total_billed NUMERIC(10,2) NOT NULL,
    advance_settled NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    balance_payable NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    payment_mode VARCHAR(30) DEFAULT 'Cash / UPI',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. TRIP EXPENSES & NET PROFIT TRACKER
CREATE TABLE IF NOT EXISTS trip_expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id VARCHAR(30) REFERENCES bookings(id) ON DELETE SET NULL,
    category VARCHAR(50) NOT NULL, -- 'Fuel (CNG/Petrol)', 'Fastag Tolls', 'Driver Bata', 'Parking', 'Maintenance'
    amount NUMERIC(10,2) NOT NULL,
    notes TEXT,
    expense_date DATE DEFAULT (DATE('now')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. CONFIGURABLE PRICING RULES
CREATE TABLE IF NOT EXISTS pricing_rules (
    id VARCHAR(30) PRIMARY KEY,
    vehicle_model VARCHAR(50) NOT NULL,
    outstation_rate_per_km NUMERIC(10,2) NOT NULL DEFAULT 25.00,
    outstation_min_km_per_day INTEGER NOT NULL DEFAULT 300,
    driver_bata_per_day NUMERIC(10,2) NOT NULL DEFAULT 400.00,
    local_rate_per_km NUMERIC(10,2) NOT NULL DEFAULT 15.00,
    local_8h_80km_package NUMERIC(10,2) NOT NULL DEFAULT 2200.00,
    local_12h_120km_package NUMERIC(10,2) NOT NULL DEFAULT 3200.00,
    airport_base_transfer NUMERIC(10,2) NOT NULL DEFAULT 1800.00,
    night_allowance NUMERIC(10,2) NOT NULL DEFAULT 300.00,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR HIGH-PERFORMANCE DISPATCH SEARCH
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_pickup_date ON bookings(pickup_date);
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON bookings(customer_phone);
CREATE INDEX IF NOT EXISTS idx_expenses_booking ON trip_expenses(booking_id);
