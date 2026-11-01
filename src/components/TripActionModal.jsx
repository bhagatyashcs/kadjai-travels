import React, { useState, useEffect } from 'react';
import { 
  X, 
  Gauge, 
  Car, 
  AlertTriangle,
  Receipt,
  Calculator
} from 'lucide-react';
import { calculateTripFare } from '../utils/travelStorage';

export default function TripActionModal({
  isOpen,
  onClose,
  mode = 'start', // 'start' | 'end'
  booking,
  vehicle,
  onConfirmStart,
  onConfirmEnd,
}) {
  // Start trip fields
  const [startKm, setStartKm] = useState('');
  const [departureTime, setDepartureTime] = useState('');

  // End trip fields
  const [endKm, setEndKm] = useState('');
  const [tollCharges, setTollCharges] = useState(0);
  const [parkingCharges, setParkingCharges] = useState(0);
  const [nightCharges, setNightCharges] = useState(0);
  const [additionalPayment, setAdditionalPayment] = useState(0);
  const [paymentMode, setPaymentMode] = useState('Cash');

  useEffect(() => {
    if (!booking) return;

    if (mode === 'start') {
      // Prefill start km with vehicle's current km or booking start km
      const initialKm = booking.startKm || vehicle?.currentKm || 40000;
      setStartKm(initialKm);
      const now = new Date();
      setDepartureTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
    } else {
      // End mode
      const recordedStart = booking.startKm || vehicle?.currentKm || 40000;
      setStartKm(recordedStart);
      const estTotal = booking.estKm || 300;
      setEndKm(booking.endKm || (Number(recordedStart) + Number(estTotal)));
      setTollCharges(booking.tollCharges || 0);
      setParkingCharges(booking.parkingCharges || 0);
      setNightCharges(booking.nightCharges || 0);
      setAdditionalPayment(booking.balanceDue || 0);
      setPaymentMode(booking.paymentMode || 'Cash');
    }
  }, [booking, vehicle, mode, isOpen]);

  if (!isOpen || !booking) return null;

  // Real-time calculations for End Trip
  const numStart = Number(startKm) || 0;
  const numEnd = Number(endKm) || 0;
  const totalKmDriven = Math.max(0, numEnd - numStart);

  const finalCalculation = calculateTripFare({
    vehicleModelId: booking.vehicleModelId,
    tripType: booking.tripType,
    daysCount: booking.daysCount,
    startKm: numStart,
    endKm: numEnd,
    estKm: booking.estKm,
    tollCharges: Number(tollCharges) || 0,
    parkingCharges: Number(parkingCharges) || 0,
    nightCharges: Number(nightCharges) || 0,
    discount: booking.discount || 0,
    advancePaid: (Number(booking.advancePaid) || 0) + (Number(additionalPayment) || 0),
    customRatePerKm: booking.ratePerKm,
  });

  const handleStartSubmit = (e) => {
    e.preventDefault();
    if (!startKm || Number(startKm) <= 0) {
      alert('Please enter a valid Starting Odometer reading.');
      return;
    }
    onConfirmStart({
      bookingId: booking.id,
      startKm: Number(startKm),
      departureTime,
    });
  };

  const handleEndSubmit = (e) => {
    e.preventDefault();
    if (numEnd < numStart) {
      alert(`Closing Odometer (${numEnd}) cannot be less than Starting Odometer (${numStart})!`);
      return;
    }

    onConfirmEnd({
      bookingId: booking.id,
      startKm: numStart,
      endKm: numEnd,
      totalKm: totalKmDriven,
      billableKm: finalCalculation.billableKm,
      baseFare: finalCalculation.baseFare,
      extraKmCharge: finalCalculation.extraKmCharge,
      driverBataTotal: finalCalculation.driverBataTotal,
      tollCharges: Number(tollCharges) || 0,
      parkingCharges: Number(parkingCharges) || 0,
      nightCharges: Number(nightCharges) || 0,
      totalFare: finalCalculation.totalFare,
      advancePaid: (Number(booking.advancePaid) || 0) + (Number(additionalPayment) || 0),
      balanceDue: finalCalculation.balanceDue,
      paymentStatus: finalCalculation.paymentStatus,
      paymentMode,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl text-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl border ${
              mode === 'start' 
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}>
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {mode === 'start' ? 'Start Trip & Log Opening KM' : 'Complete Trip & Log Closing KM'}
              </h2>
              <p className="text-xs text-slate-400">
                Booking: <span className="text-amber-400 font-mono font-semibold">{booking.id}</span> • {booking.customerName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Trip Quick Context */}
        <div className="bg-slate-950/60 px-6 py-3 border-b border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400">Route: </span>
            <span className="text-white font-medium">{booking.route}</span>
          </div>
          <div>
            <span className="text-slate-400">Vehicle: </span>
            <span className="text-amber-400 font-mono font-bold">{booking.vehiclePlateNumber || 'Allocated'}</span>
          </div>
        </div>

        {/* MODE: START TRIP FORM */}
        {mode === 'start' ? (
          <form onSubmit={handleStartSubmit} className="p-6 space-y-5 text-xs">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
              <Car className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white text-sm mb-1">Departure Checklist</h4>
                <p className="text-slate-300 leading-relaxed">
                  Verify vehicle cleanliness, AC cooling, tire pressure, and ensure customer notes the starting meter reading.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Starting Odometer (Start KM) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    value={startKm}
                    onChange={(e) => setStartKm(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-lg font-mono font-bold text-amber-400 focus:outline-none focus:border-amber-400"
                    placeholder="e.g. 42300"
                  />
                  <span className="absolute right-3 top-3 text-slate-500 font-bold">KM</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Last recorded meter: {vehicle?.currentKm || 0} KM
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Departure Time
                </label>
                <input
                  type="time"
                  required
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-amber-400 text-center"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Scheduled for: {booking.pickupTime}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center gap-2"
              >
                <Gauge className="w-4 h-4" />
                <span>Confirm & Start Trip</span>
              </button>
            </div>
          </form>
        ) : (
          /* MODE: END TRIP & FARE SETTLEMENT FORM */
          <form onSubmit={handleEndSubmit} className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
            
            {/* Odometer readings */}
            <div className="grid grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Start KM (Opening)</label>
                <input
                  type="number"
                  value={startKm}
                  onChange={(e) => setStartKm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 font-mono text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">End KM (Closing) *</label>
                <input
                  type="number"
                  required
                  value={endKm}
                  onChange={(e) => setEndKm(e.target.value)}
                  className="w-full bg-slate-900 border border-amber-500/50 rounded-lg px-2.5 py-1.5 font-mono text-amber-400 font-extrabold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Total KM Run</label>
                <div className="bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800 font-mono font-bold text-emerald-400 text-sm">
                  {totalKmDriven} KM
                </div>
              </div>
            </div>

            {/* Validation warning if end < start */}
            {numEnd < numStart && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Closing odometer reading cannot be lower than opening reading!</span>
              </div>
            )}

            {/* Additional expenses during trip */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Toll Receipts (₹)</label>
                <input
                  type="number"
                  value={tollCharges}
                  onChange={(e) => setTollCharges(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Parking / Taxes (₹)</label>
                <input
                  type="number"
                  value={parkingCharges}
                  onChange={(e) => setParkingCharges(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Night Driving (₹)</label>
                <input
                  type="number"
                  value={nightCharges}
                  onChange={(e) => setNightCharges(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Final Billing Computation Card */}
            <div className="bg-slate-950 border border-amber-500/20 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-300 border-b border-slate-800 pb-2">
                <span className="flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-amber-400" />
                  <span>Final Bill Breakdown</span>
                </span>
                <span className="text-xs text-slate-400">
                  {finalCalculation.billableKm} Billable KM @ ₹{finalCalculation.ratePerKm}/km
                </span>
              </div>

              <div className="flex justify-between text-slate-400">
                <span>Base Fare ({finalCalculation.billableKm} KM):</span>
                <span className="text-white">₹{finalCalculation.baseFare.toLocaleString('en-IN')}</span>
              </div>

              {finalCalculation.driverBataTotal > 0 && (
                <div className="flex justify-between text-slate-400">
                  <span>Driver Charge ({booking.daysCount} days):</span>
                  <span className="text-white">₹{finalCalculation.driverBataTotal.toLocaleString('en-IN')}</span>
                </div>
              )}

              {(Number(tollCharges) > 0 || Number(parkingCharges) > 0) && (
                <div className="flex justify-between text-slate-400">
                  <span>Tolls & Parking:</span>
                  <span className="text-white">₹{(Number(tollCharges) + Number(parkingCharges)).toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="border-t border-slate-800 pt-2 flex justify-between font-extrabold text-sm">
                <span className="text-white">Net Total Fare:</span>
                <span className="text-amber-400 text-base">₹{finalCalculation.totalFare.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-slate-400">
                <span>Advance Paid Previously:</span>
                <span className="text-emerald-400">-₹{(booking.advancePaid || 0).toLocaleString('en-IN')}</span>
              </div>

              <div className="border-t border-slate-800 pt-2 flex justify-between font-extrabold text-sm">
                <span className="text-slate-300">Net Balance Remaining:</span>
                <span className={`text-base ${finalCalculation.balanceDue > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  ₹{finalCalculation.balanceDue.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Payment collection on trip completion */}
            <div className="grid grid-cols-2 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Collection Received Now (₹)
                </label>
                <input
                  type="number"
                  value={additionalPayment}
                  onChange={(e) => setAdditionalPayment(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold text-emerald-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Payment Mode
                </label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="Cash">Cash to Driver</option>
                  <option value="UPI (GPay / PhonePe)">UPI (GPay / PhonePe)</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Pending">Balance Pending</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-800 pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2"
              >
                <Receipt className="w-4 h-4" />
                <span>Complete Trip & Generate Duty Slip</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
