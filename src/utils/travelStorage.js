// Storage and computation utilities for Kadjai Travels Tourist Vehicle Management System

import {
  INITIAL_BOOKINGS,
  INITIAL_VEHICLES,
  INITIAL_DRIVERS,
  VEHICLE_DETAILS
} from '../data/travelData.js';

const STORAGE_KEYS = {
  BOOKINGS: 'kadjai_travel_bookings_v1',
  VEHICLES: 'kadjai_travel_vehicles_v1',
  DRIVERS: 'kadjai_travel_drivers_v1',
};

// Centralized Configurable Pricing Policy for Maruti Suzuki Ertiga (6+1 AC)
export const PRICING_CONFIG = {
  ertiga: {
    name: 'Maruti Suzuki Ertiga',
    seatingCapacity: '6+1 Seater AC',
    // Intercity / Outstation Policy
    outstationRatePerKm: 20,
    outstationMinKmPerDay: 300,
    outstationDriverBataPerDay: 400,
    // One-Way Outstation Policy
    oneWayRatePerKm: 20,
    oneWayMinKm: 150,
    oneWayDriverBata: 400,
    // Mumbai Local City Rental Policy
    localRatePerKm: 15,
    localPackages: {
      '8h_80km': { label: '8 Hours / 80 KM', hours: 8, km: 80, basePrice: 2200 },
      '12h_120km': { label: '12 Hours / 120 KM', hours: 12, km: 120, basePrice: 3200 },
    },
    localExtraKmRate: 15,
    localExtraHourRate: 150,
    // Airport Transfer Policy (CSMIA T1 & T2)
    airportBasePrice: 1800,
    airportOfficialParking: 180,
    airportSeaLinkToll: 100,
    // Night Driving Policy (between 22:00 / 10 PM and 06:00 / 6 AM)
    nightAllowance: 300,
  }
};

// Custom events for reactive UI sync across components
export const notifyDataChanged = () => {
  window.dispatchEvent(new Event('kadjai_data_updated'));
};

/* =========================================================
   BOOKINGS STORAGE
========================================================= */
export const getBookings = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (!raw) {
      saveBookings(INITIAL_BOOKINGS);
      return INITIAL_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse bookings from localStorage:', err);
    return INITIAL_BOOKINGS;
  }
};

export const saveBookings = (bookings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    notifyDataChanged();
  } catch (err) {
    console.error('Failed to save bookings to localStorage:', err);
  }
};

/* =========================================================
   VEHICLES STORAGE
========================================================= */
export const getVehicles = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VEHICLES);
    if (!raw) {
      saveVehicles(INITIAL_VEHICLES);
      return INITIAL_VEHICLES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse vehicles from localStorage:', err);
    return INITIAL_VEHICLES;
  }
};

export const saveVehicles = (vehicles) => {
  try {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
    notifyDataChanged();
  } catch (err) {
    console.error('Failed to save vehicles to localStorage:', err);
  }
};

/* =========================================================
   DRIVERS STORAGE
========================================================= */
export const getDrivers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DRIVERS);
    if (!raw) {
      saveDrivers(INITIAL_DRIVERS);
      return INITIAL_DRIVERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse drivers from localStorage:', err);
    return INITIAL_DRIVERS;
  }
};

export const saveDrivers = (drivers) => {
  try {
    localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(drivers));
    notifyDataChanged();
  } catch (err) {
    console.error('Failed to save drivers to localStorage:', err);
  }
};

/* =========================================================
   RESET ALL TO DEFAULT
========================================================= */
export const resetAllData = () => {
  saveBookings(INITIAL_BOOKINGS);
  saveVehicles(INITIAL_VEHICLES);
  saveDrivers(INITIAL_DRIVERS);
  notifyDataChanged();
};

/* =========================================================
   ID GENERATOR
========================================================= */
export const generateBookingId = (existingBookings = []) => {
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < 10; attempt++) {
    const token = Math.random().toString(16).substring(2, 10).toUpperCase();
    const candidate = `KAD-${year}-${token}`;
    if (!existingBookings.some(b => b.id === candidate)) {
      return candidate;
    }
  }
  return `KAD-${year}-${Date.now().toString(36).toUpperCase()}`;
};

/* =========================================================
   DATE DURATION CALCULATOR (DECIMAL-SAFE)
========================================================= */
export const calculateDaysBetween = (pickupDate, returnDate) => {
  if (!pickupDate || !returnDate) return 1;
  const start = new Date(pickupDate);
  const end = new Date(returnDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
    return 1;
  }
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays + 1);
};

/* =========================================================
   DYNAMIC ROUTE, TOLL, PARKING & DRIVER ESTIMATOR
========================================================= */
export const estimateLocationDetails = (
  pickupLocation = '', 
  dropLocation = '', 
  tripType = 'Round Trip', 
  pickupTime = '07:00'
) => {
  const p = (pickupLocation || '').toLowerCase();
  const d = (dropLocation || '').toLowerCase();
  const t = (tripType || '').toLowerCase();

  const isRoundTrip = t.includes('round') || t.includes('multi-day');
  const isOneWay = t.includes('one way') || t.includes('one-way') || t.includes('drop');
  const isLocal = t.includes('local');
  const isAirport = t.includes('airport');

  let estKmOneWay = 150;
  let estToll = 250;
  let estParking = 0;
  let suggestedDays = 1;

  if (d.includes('lonavala') || d.includes('khandala')) {
    estKmOneWay = 95;
    estToll = 320; // Mumbai-Pune Expressway toll to Lonavala
    estParking = 100;
    suggestedDays = 1;
  } else if (d.includes('pune') || d.includes('hinjewadi') || d.includes('pcmc')) {
    estKmOneWay = 155;
    estToll = 430; // Full Mumbai-Pune Expressway toll
    estParking = 100;
    suggestedDays = 1;
  } else if (d.includes('shirdi') || d.includes('shani') || d.includes('kopargaon')) {
    estKmOneWay = 250;
    estToll = 450; // Samruddhi / NH-160
    estParking = 120;
    suggestedDays = 2;
  } else if (d.includes('mahabaleshwar') || d.includes('panchgani') || d.includes('wai')) {
    estKmOneWay = 265;
    estToll = 400; // NH-48 / Pune-Satara
    estParking = 150; // Tourist municipality entry tax & parking
    suggestedDays = 2;
  } else if (d.includes('goa') || d.includes('panaji') || d.includes('calangute') || d.includes('candolim')) {
    estKmOneWay = 590;
    estToll = 850; // NH-66 / NH-48 tolls
    estParking = 200;
    suggestedDays = 4;
  } else if (d.includes('alibaug') || d.includes('nagaon') || d.includes('kashid') || d.includes('murud')) {
    estKmOneWay = 110;
    estToll = 180;
    estParking = 100;
    suggestedDays = 1;
  } else if (d.includes('nashik') || d.includes('trimbak') || d.includes('igatpuri')) {
    estKmOneWay = 175;
    estToll = 350;
    estParking = 100;
    suggestedDays = 2;
  } else if (isAirport || d.includes('airport') || p.includes('airport') || d.includes('csmia') || d.includes('terminal')) {
    estKmOneWay = 45;
    estToll = 100;
    estParking = 180; // Airport parking slip
    suggestedDays = 1;
  } else if (isLocal || d.includes('local') || d.includes('darshan') || d.includes('sightseeing')) {
    estKmOneWay = 40;
    estToll = 0;
    estParking = 150;
    suggestedDays = 1;
  } else {
    // Generic custom destination
    estKmOneWay = 150;
    estToll = 250;
    estParking = 100;
    suggestedDays = 1;
  }

  // Determine total estimated KM and toll charges based strictly on trip type
  let totalEstKm = estKmOneWay;
  let finalToll = estToll;
  let finalParking = estParking;

  if (isRoundTrip) {
    totalEstKm = estKmOneWay * 2;
    finalToll = estToll * 2;
  } else if (isOneWay) {
    totalEstKm = estKmOneWay;
    finalToll = estToll; // Only one-way toll charged
  } else if (isLocal) {
    totalEstKm = 80;
    finalToll = 0;
    finalParking = 150;
  } else if (isAirport) {
    totalEstKm = 45;
    finalToll = 100;
    finalParking = 180;
  }

  // Check night driving charges (pickup time between 22:00 / 10 PM and 06:00 / 6 AM)
  let nightCharge = 0;
  if (pickupTime && typeof pickupTime === 'string') {
    const hour = parseInt(pickupTime.split(':')[0], 10);
    if (!isNaN(hour) && (hour < 6 || hour >= 22)) {
      nightCharge = PRICING_CONFIG.ertiga.nightAllowance;
    }
  }

  return {
    estKm: Math.round(totalEstKm),
    estToll: Math.round(finalToll),
    estParking: Math.round(finalParking),
    nightCharge: Math.round(nightCharge),
    suggestedDays,
  };
};

/* =========================================================
   COMPREHENSIVE FARE COMPUTATION ENGINE
   - Decimal-safe money arithmetic
   - Prevents NaN, Infinity, negative fares
   - Fully supports One Way, Round Trip, Local Rental, Airport Transfer
========================================================= */
export const calculateTripFare = ({
  vehicleModelId = 'ertiga',
  tripType = 'Round Trip',
  daysCount = 1,
  startKm = null,
  endKm = null,
  estKm = 300,
  tollCharges = 0,
  parkingCharges = 0,
  nightCharges = 0,
  discount = 0,
  advancePaid = 0,
  customRatePerKm = null,
  localPackage = '8h_80km',
  applyGst = false,
} = {}) => {
  const config = PRICING_CONFIG.ertiga;
  const t = String(tripType || '').toLowerCase();

  const isRoundTrip = t.includes('round') || t.includes('multi-day');
  const isOneWay = t.includes('one way') || t.includes('one-way') || t.includes('drop');
  const isLocal = t.includes('local');
  const isAirport = t.includes('airport');

  // Days: minimum 1 day, positive integer
  const days = Math.max(1, Math.round(Number(daysCount) || 1));

  // Actual KM if odometer readings are available
  let totalActualKm = null;
  if (startKm !== null && endKm !== null && !isNaN(Number(startKm)) && !isNaN(Number(endKm))) {
    const s = Number(startKm);
    const e = Number(endKm);
    if (e >= s) {
      totalActualKm = Math.round(e - s);
    }
  }

  // Sanitized distance to evaluate (must be >= 0)
  const rawEstKm = Math.max(0, Math.round(Number(estKm) || 0));
  const kmToConsider = totalActualKm !== null ? totalActualKm : rawEstKm;

  let ratePerKm = config.outstationRatePerKm;
  let billableKm = kmToConsider;
  let baseFare = 0;
  let driverBataTotal = 0;
  let driverBataPerDay = 0;
  let minKmApplied = 0;

  if (isLocal) {
    // -----------------------------------------------------------
    // LOCAL CITY RENTAL (8h/80km: ₹2,200 or 12h/120km: ₹3,200)
    // -----------------------------------------------------------
    const selectedPkg = config.localPackages[localPackage] || config.localPackages['8h_80km'];
    ratePerKm = customRatePerKm !== null && !isNaN(Number(customRatePerKm)) && Number(customRatePerKm) > 0
      ? Number(customRatePerKm)
      : config.localExtraKmRate;

    const basePkgPrice = selectedPkg.basePrice;
    const includedKm = selectedPkg.km;
    minKmApplied = includedKm;

    const extraKm = Math.max(0, kmToConsider - includedKm);
    billableKm = Math.max(includedKm, kmToConsider);
    baseFare = Math.round(basePkgPrice + (extraKm * ratePerKm));
    driverBataPerDay = 0; // Driver duty included in in-city rental package
    driverBataTotal = 0;

  } else if (isAirport) {
    // -----------------------------------------------------------
    // AIRPORT TRANSFER (CSMIA T1 & T2)
    // -----------------------------------------------------------
    ratePerKm = config.localRatePerKm;
    minKmApplied = 45;
    billableKm = Math.max(45, kmToConsider);
    baseFare = Math.round(config.airportBasePrice);
    driverBataPerDay = 0;
    driverBataTotal = 0;

  } else if (isOneWay) {
    // -----------------------------------------------------------
    // ONE WAY OUTSTATION (Calculates ONLY one-way distance)
    // -----------------------------------------------------------
    ratePerKm = customRatePerKm !== null && !isNaN(Number(customRatePerKm)) && Number(customRatePerKm) > 0
      ? Number(customRatePerKm)
      : config.oneWayRatePerKm;

    minKmApplied = config.oneWayMinKm;
    billableKm = Math.max(config.oneWayMinKm, kmToConsider);
    baseFare = Math.round(billableKm * ratePerKm);
    driverBataPerDay = config.oneWayDriverBata;
    driverBataTotal = config.oneWayDriverBata; // One-way day trip duty

  } else {
    // -----------------------------------------------------------
    // ROUND TRIP OUTSTATION (300 KM / calendar day minimum)
    // -----------------------------------------------------------
    ratePerKm = customRatePerKm !== null && !isNaN(Number(customRatePerKm)) && Number(customRatePerKm) > 0
      ? Number(customRatePerKm)
      : config.outstationRatePerKm;

    const minQuota = days * config.outstationMinKmPerDay;
    minKmApplied = minQuota;
    billableKm = Math.max(minQuota, kmToConsider);
    baseFare = Math.round(billableKm * ratePerKm);
    driverBataPerDay = config.outstationDriverBataPerDay;
    driverBataTotal = Math.round(days * config.outstationDriverBataPerDay);
  }

  // Ancillary components (strictly non-negative)
  const tolls = Math.max(0, Math.round(Number(tollCharges) || 0));
  const parking = Math.max(0, Math.round(Number(parkingCharges) || 0));
  const night = Math.max(0, Math.round(Number(nightCharges) || 0));
  const disc = Math.max(0, Math.round(Number(discount) || 0));

  // Subtotal and Total Fare
  const subtotal = Math.max(0, Math.round(baseFare + driverBataTotal + tolls + parking + night - disc));
  const gstTax = applyGst ? Math.round(subtotal * 0.05) : 0;
  const totalFare = Math.max(0, subtotal + gstTax);

  // Advance paid and balance due
  const advance = Math.max(0, Math.round(Number(advancePaid) || 0));
  const balanceDue = Math.max(0, totalFare - advance);

  let paymentStatus = 'Pending';
  if (totalFare > 0 && advance >= totalFare) {
    paymentStatus = 'Paid';
  } else if (advance > 0) {
    paymentStatus = 'Partial';
  }

  return {
    tripType,
    vehicleModelId,
    ratePerKm,
    minKmPerDay: minKmApplied,
    daysCount: days,
    totalKm: totalActualKm,
    billableKm,
    baseFare,
    extraKmCharge: 0,
    driverBataPerDay,
    driverBataTotal,
    tollCharges: tolls,
    parkingCharges: parking,
    nightCharges: night,
    discount: disc,
    subtotal,
    gstTax,
    totalFare,
    advancePaid: advance,
    balanceDue,
    paymentStatus,
    isEstimate: true,
  };
};

/* =========================================================
   EXPORT BOOKINGS TO CSV (SAFE QUOTING)
========================================================= */
export const exportBookingsToCSV = (bookings = []) => {
  if (!bookings || bookings.length === 0) return;

  const headers = [
    'Booking ID',
    'Customer Name',
    'Phone',
    'Trip Type',
    'Route',
    'Pickup Date',
    'Pickup Time',
    'Return Date',
    'Days',
    'Vehicle',
    'Vehicle Number',
    'Driver',
    'Driver Phone',
    'Start KM',
    'End KM',
    'Total KM',
    'Billable KM',
    'Base Fare (INR)',
    'Driver Bata (INR)',
    'Tolls & Parking (INR)',
    'Total Fare (INR)',
    'Advance Paid (INR)',
    'Balance Due (INR)',
    'Payment Status',
    'Trip Status',
  ];

  const escapeCsv = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = bookings.map(b => [
    escapeCsv(b.id),
    escapeCsv(b.customerName),
    escapeCsv(b.customerPhone),
    escapeCsv(b.tripType),
    escapeCsv(b.route),
    escapeCsv(b.pickupDate),
    escapeCsv(b.pickupTime),
    escapeCsv(b.returnDate),
    b.daysCount || 1,
    escapeCsv(b.vehicleModelId),
    escapeCsv(b.vehiclePlateNumber),
    escapeCsv(b.driverName),
    escapeCsv(b.driverPhone),
    b.startKm ?? '',
    b.endKm ?? '',
    b.totalKm ?? '',
    b.billableKm ?? '',
    b.baseFare ?? '',
    b.driverBataTotal ?? '',
    (Number(b.tollCharges || 0) + Number(b.parkingCharges || 0)),
    b.totalFare ?? '',
    b.advancePaid ?? '',
    b.balanceDue ?? '',
    escapeCsv(b.paymentStatus),
    escapeCsv(b.status),
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Kadjai_Travels_Trips_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
