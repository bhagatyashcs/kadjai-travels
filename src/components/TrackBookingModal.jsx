import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Phone, 
  AlertCircle, 
  Printer, 
  MessageSquare,
  ShieldCheck,
  Car,
  MapPin,
  Calendar,
  Clock
} from 'lucide-react';
import { COMPANY_INFO } from '../data/travelData';
import { openWhatsApp } from '../utils/whatsapp';
import { trackTripApi } from '../utils/apiClient';

export default function TrackBookingModal({
  isOpen,
  onClose,
  bookings = [],
  onViewDutySlip,
}) {
  const [bookingId, setBookingId] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [foundBooking, setFoundBooking] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!bookingId.trim() || !customerPhone.trim()) {
      setErrorMessage('Please enter both Booking Reference ID and registered Mobile Number.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const result = await trackTripApi(bookingId, customerPhone);
      if (result && !result.error) {
        setFoundBooking(result);
        setErrorMessage('');
      } else {
        setFoundBooking(null);
        setErrorMessage(result?.error || 'No matching booking found. Please check both details.');
      }
      setSearched(true);
    } catch {
      setErrorMessage('Tracking service temporarily unavailable. Please try again or WhatsApp us.');
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoFill = (sampleBooking) => {
    setBookingId(sampleBooking.id);
    setCustomerPhone(sampleBooking.customerPhone || '');
    setFoundBooking(sampleBooking);
    setSearched(true);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl text-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Track Your Booking</h2>
              <p className="text-xs text-slate-400">
                Secure inquiry by Reference ID & Registered Mobile Number
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

        <div className="p-6 space-y-5 text-xs">
          
          {/* Security Notice */}
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 flex items-start gap-2.5 text-slate-400 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              For customer privacy, trip records are protected. Enter both your <strong>Booking ID</strong> and registered <strong>Mobile Number</strong> to retrieve live vehicle dispatch status.
            </span>
          </div>

          {/* Dual-Field Verification Search Form */}
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Booking Reference ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KAD-2026-101"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 font-mono transition"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Customer Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 font-mono transition"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold py-2.5 rounded-xl transition text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Verifying...' : 'Check Trip Status'}</span>
            </button>
          </form>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <div className="space-y-1">
                <span className="font-semibold block">{errorMessage}</span>
                <span className="text-[11px] text-slate-400 block">
                  Please confirm that the Booking ID and phone number match the details provided during booking enquiry.
                </span>
              </div>
            </div>
          )}

          {/* Search Result */}
          {searched && foundBooking && (
            <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-5 space-y-4">
              
              {/* Status Banner */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-400 text-sm">
                      {foundBooking.id}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      • {foundBooking.tripType}
                    </span>
                  </div>
                  <div className="text-slate-300 font-medium text-xs mt-1">
                    {foundBooking.customerName}
                  </div>
                </div>

                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    foundBooking.status === 'In Progress'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse'
                      : foundBooking.status === 'Confirmed'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                      : foundBooking.status === 'Completed'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {foundBooking.status === 'In Progress' ? '🚕 Live on Road' : foundBooking.status}
                  </span>
                </div>
              </div>

              {/* Driver & Vehicle Box */}
              <div className="grid grid-cols-2 gap-3 bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                    Assigned Driver
                  </span>
                  <span className="font-bold text-white text-xs block mt-0.5">
                    {foundBooking.driverName || 'Will be allocated prior to trip'}
                  </span>
                  {foundBooking.driverPhone && (
                    <div className="flex items-center gap-2 mt-1">
                      <a
                        href={`tel:${foundBooking.driverPhone}`}
                        className="text-amber-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{foundBooking.driverPhone}</span>
                      </a>
                      <button
                        onClick={() => openWhatsApp(foundBooking.driverPhone, `Hi, I am ${foundBooking.customerName} regarding booking ${foundBooking.id}`)}
                        className="text-emerald-400 hover:text-emerald-300"
                        title="WhatsApp Driver"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                    Assigned Vehicle
                  </span>
                  <span className="font-mono font-bold text-amber-400 text-xs block mt-0.5">
                    {foundBooking.vehiclePlateNumber || 'Allocation in progress'}
                  </span>
                  <span className="text-slate-400 text-[10px] block mt-0.5">
                    Maruti Suzuki Ertiga (6+1 AC)
                  </span>
                </div>
              </div>

              {/* Schedule & Odometer */}
              <div className="space-y-1.5 text-slate-300 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Departure:</span>
                  <span className="font-semibold text-white">{foundBooking.pickupDate} at {foundBooking.pickupTime}</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-500 shrink-0">Pickup:</span>
                  <span className="text-slate-200 text-right line-clamp-1">{foundBooking.pickupLocation}</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-500 shrink-0">Destination:</span>
                  <span className="text-slate-200 text-right line-clamp-1">{foundBooking.dropLocation}</span>
                </div>
                {foundBooking.startKm && (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-500">Opening Odometer:</span>
                    <span className="font-mono font-bold text-amber-400">{foundBooking.startKm} KM</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                  <span className="text-slate-500 font-bold">Total Fare:</span>
                  <span className="font-bold text-amber-400 text-sm">₹{(foundBooking.totalFare || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Balance Payable:</span>
                  <span className={`font-bold ${foundBooking.balanceDue > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    ₹{(foundBooking.balanceDue || 0).toLocaleString('en-IN')} ({foundBooking.paymentStatus || 'Pending'})
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    onClose();
                    onViewDutySlip(foundBooking);
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 text-xs shadow-md"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>View Printable Duty Slip & Invoice</span>
                </button>
              </div>

            </div>
          )}

          {/* Quick Demo Helpers */}
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1.5">
              Quick Test Samples (Click to auto-populate):
            </span>
            <div className="flex flex-wrap gap-2">
              {bookings.slice(0, 3).map(b => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => handleQuickDemoFill(b)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-amber-500/10 hover:border-amber-500/30 text-amber-400 border border-slate-800 font-mono text-[11px] transition"
                >
                  {b.id} ({b.customerName.split(' ')[0]})
                </button>
              ))}
            </div>
          </div>

          <div className="text-center pt-1">
            <a
              href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=Hi%20Kadjai%20Travels,%20please%20help%20me%20track%20my%20booking.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 transition text-[11px]"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>Need help? Contact Kadjai Desk on WhatsApp</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
