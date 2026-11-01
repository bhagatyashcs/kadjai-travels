import test from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateTripFare,
  estimateLocationDetails,
  calculateDaysBetween,
  PRICING_CONFIG,
  findHubCoordinates,
  searchLocationSuggestions,
  detectTripCategory,
  estimateGpsDrivingDistance,
  calculateHaversineDistance,
  geocodeLocation
} from '../utils/travelStorage.js';

test('1. One-way journey calculation does not charge for return', () => {
  const result = calculateTripFare({
    tripType: 'One Way',
    estKm: 155, // Mumbai to Pune
    tollCharges: 430,
    parkingCharges: 100,
    nightCharges: 0,
  });

  // 155 km @ ₹25/km = ₹3,875
  // Driver Charge = ₹400
  // Tolls = ₹430
  // Parking = ₹100
  // Total = 3875 + 400 + 430 + 100 = ₹4,805
  assert.equal(result.billableKm, 155);
  assert.equal(result.baseFare, 3875);
  assert.equal(result.driverBataTotal, 400);
  assert.equal(result.totalFare, 4805);
  assert.ok(!isNaN(result.totalFare));
});

test('2. Round-trip multi-day calculation enforces 300km/day minimum & daily driver charge', () => {
  const result = calculateTripFare({
    tripType: 'Round Trip',
    daysCount: 2,
    estKm: 500, // Shirdi round trip estimated 500 km, but 2 days * 300 = 600 km minimum
    tollCharges: 900,
    parkingCharges: 240,
    nightCharges: 0,
  });

  // Min quota: 2 * 300 = 600 KM
  // 600 * 25 = ₹15,000
  // Driver Charge = 2 * 400 = ₹800
  // Tolls = ₹900
  // Parking = ₹240
  // Total = 15000 + 800 + 900 + 240 = ₹16,940
  assert.equal(result.billableKm, 600);
  assert.equal(result.baseFare, 15000);
  assert.equal(result.driverBataTotal, 800);
  assert.equal(result.totalFare, 16940);
});

test('3. Local rental calculation with base 8h/80km package and extra km', () => {
  // Standard 8h/80km package
  const standard = calculateTripFare({
    tripType: 'Local Rental',
    localPackage: '8h_80km',
    estKm: 80,
    tollCharges: 0,
    parkingCharges: 150,
  });

  // Base = ₹2,200 + parking ₹150 = ₹2,350
  assert.equal(standard.baseFare, 2200);
  assert.equal(standard.driverBataTotal, 0); // Driver duty included in local city
  assert.equal(standard.totalFare, 2350);

  // With extra km (e.g. 100 km -> 20 extra km @ ₹15/km = +₹300)
  const withExtraKm = calculateTripFare({
    tripType: 'Local Rental',
    localPackage: '8h_80km',
    estKm: 100,
    tollCharges: 0,
    parkingCharges: 150,
  });
  assert.equal(withExtraKm.baseFare, 2500); // 2200 + 300
  assert.equal(withExtraKm.totalFare, 2650);
});

test('4. Airport transfer calculates flat airport package plus official parking and toll', () => {
  const result = calculateTripFare({
    tripType: 'Airport Transfer',
    estKm: 45,
    tollCharges: 100,
    parkingCharges: 180,
    nightCharges: 0,
  });

  // Base = ₹1,800
  // Tolls = ₹100
  // Airport Parking = ₹180
  // Total = ₹2,080
  assert.equal(result.baseFare, 1800);
  assert.equal(result.driverBataTotal, 0);
  assert.equal(result.totalFare, 2080);
});

test('5. Missing or empty inputs safely fall back to defaults without NaN', () => {
  const result = calculateTripFare({});
  assert.ok(!isNaN(result.totalFare));
  assert.ok(result.totalFare > 0);
  assert.equal(typeof result.totalFare, 'number');
  assert.equal(result.paymentStatus, 'Pending');
});

test('6. Invalid dates handle gracefully in calculateDaysBetween', () => {
  assert.equal(calculateDaysBetween(null, null), 1);
  assert.equal(calculateDaysBetween('invalid-date', '2026-10-15'), 1);
  assert.equal(calculateDaysBetween('2026-10-15', 'invalid-date'), 1);
});

test('7. Return date before pickup date defaults to 1 day duty', () => {
  const days = calculateDaysBetween('2026-10-20', '2026-10-18');
  assert.equal(days, 1);
});

test('8. Zero or negative distance does not produce negative fare or NaN', () => {
  const zeroKm = calculateTripFare({
    tripType: 'One Way',
    estKm: 0,
    tollCharges: 0,
  });
  // One way minimum quota is 150 km
  assert.equal(zeroKm.billableKm, 150);
  assert.ok(zeroKm.totalFare > 0);

  const negativeKm = calculateTripFare({
    tripType: 'One Way',
    estKm: -50,
  });
  assert.equal(negativeKm.billableKm, 150);
  assert.ok(negativeKm.totalFare > 0);
});

test('9. Night driving allowance applies accurately between 10 PM and 6 AM', () => {
  const night1 = estimateLocationDetails('Bandra', 'Pune', 'One Way', '23:30');
  assert.equal(night1.nightCharge, 300);

  const night2 = estimateLocationDetails('Bandra', 'Pune', 'One Way', '04:15');
  assert.equal(night2.nightCharge, 300);

  const dayTime = estimateLocationDetails('Bandra', 'Pune', 'One Way', '10:00');
  assert.equal(dayTime.nightCharge, 0);
});

test('10. Boundary case: Advance paid equals total fare sets Paid status', () => {
  const result = calculateTripFare({
    tripType: 'One Way',
    estKm: 150,
    tollCharges: 0,
    parkingCharges: 0,
    nightCharges: 0,
    advancePaid: 4150, // 150 * 25 = 3750 + 400 driver charge = 4150
  });

  assert.equal(result.totalFare, 4150);
  assert.equal(result.advancePaid, 4150);
  assert.equal(result.balanceDue, 0);
  assert.equal(result.paymentStatus, 'Paid');
});

test('11. Trip type switching produces consistent and distinct calculations', () => {
  const oneWay = calculateTripFare({ tripType: 'One Way', estKm: 150, tollCharges: 300 });
  const roundTrip = calculateTripFare({ tripType: 'Round Trip', daysCount: 1, estKm: 300, tollCharges: 600 });
  const local = calculateTripFare({ tripType: 'Local Rental', estKm: 80, tollCharges: 0 });

  assert.notEqual(oneWay.totalFare, roundTrip.totalFare);
  assert.notEqual(roundTrip.totalFare, local.totalFare);
});

test('12. Currency calculations are integers without floating point inaccuracies', () => {
  const result = calculateTripFare({
    tripType: 'Round Trip',
    daysCount: 3,
    estKm: 950,
    tollCharges: 420.50,
    discount: 100.25,
  });

  assert.equal(Number.isInteger(result.baseFare), true);
  assert.equal(Number.isInteger(result.totalFare), true);
  assert.equal(Number.isInteger(result.balanceDue), true);
});

test('13. Location engine resolves offline hubs and suggests matching destinations', () => {
  const hubKolhapur = findHubCoordinates('Kolhapur');
  assert.ok(hubKolhapur);
  assert.equal(hubKolhapur.name, 'Kolhapur');
  assert.ok(hubKolhapur.lat > 16 && hubKolhapur.lat < 17);

  const hubRatnagiri = findHubCoordinates('Ratnagiri');
  assert.ok(hubRatnagiri);
  assert.equal(hubRatnagiri.name, 'Ratnagiri & Ganpatipule');

  const suggestions = searchLocationSuggestions('Sur', 3);
  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.some(s => s.name.toLowerCase().includes('surat')));
});

test('14. Category auto-detection dynamically identifies trip category by distance and keywords', () => {
  // Airport query
  const catAirport = detectTripCategory('Bandra', 'CSMIA Airport Terminal 2', 20);
  assert.equal(catAirport.category, 'Airport Transfer');

  // Short local intra-city query (< 50 km)
  const catLocal = detectTripCategory('Dadar, Mumbai', 'Colaba, Mumbai', 15);
  assert.equal(catLocal.category, 'Local Rental');

  // Outstation destination (> 50 km)
  const catOutstationDist = detectTripCategory('Bandra West, Mumbai', 'Ratnagiri', 320);
  assert.equal(catOutstationDist.category, 'Outstation');

  // Named outstation keyword even without precomputed distance
  const catOutstationNamed = detectTripCategory('Thane', 'Kolhapur', 0);
  assert.equal(catOutstationNamed.category, 'Outstation');
});

test('15. Dynamic road distance and toll estimation computes realistic metrics for arbitrary locations', () => {
  // Mumbai center (19.0760, 72.8777) to Pune (18.5204, 73.8567)
  const airKm = calculateHaversineDistance(19.0760, 72.8777, 18.5204, 73.8567);
  assert.ok(airKm > 100 && airKm < 140);

  const roadKm = estimateGpsDrivingDistance(19.0760, 72.8777, 18.5204, 73.8567, 'Pune');
  assert.ok(roadKm >= 140 && roadKm <= 170);

  // Dynamic estimate with custom coordinates
  const estimate = estimateLocationDetails('Bandra', 'Custom City', 'One Way', '08:00', {
    pickupLat: 19.0596,
    pickupLon: 72.8295,
    destLat: 17.2826,
    destLon: 73.4569, // Ratnagiri coords
  });
  assert.ok(estimate.estKm > 250);
  assert.ok(estimate.estToll > 0);
  assert.equal(estimate.isGpsCalculated, true);
});

test('16. Any arbitrary outstation location calculates billable amount at verified ₹25/km and ₹400/day driver charge', () => {
  // Arbitrary custom location 340 KM away for a 2-day round trip
  const fare = calculateTripFare({
    tripType: 'Round Trip',
    daysCount: 2,
    estKm: 680, // 340 km * 2
    tollCharges: 900,
    parkingCharges: 120,
    nightCharges: 0,
  });

  // Billable KM: 680 KM (since 680 > 2 days * 300 = 600 min quota)
  // Vehicle Base Fare: 680 * ₹25/km = ₹17,000
  // Driver Charge: 2 days * ₹400 = ₹800
  // Tolls: ₹900
  // Parking: ₹120
  // Total: 17000 + 800 + 900 + 120 = ₹18,820
  assert.equal(fare.billableKm, 680);
  assert.equal(fare.ratePerKm, 25);
  assert.equal(fare.baseFare, 17000);
  assert.equal(fare.driverBataTotal, 800);
  assert.equal(fare.totalFare, 18820);
});
