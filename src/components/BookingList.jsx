import React, { useState } from 'react';
import { 
  Car, 
  MapPin, 
  Calendar, 
  User, 
  Phone, 
  AlertCircle, 
  MessageSquare, 
  Edit3, 
  Trash2, 
  Play, 
  Square, 
  Printer, 
  Search, 
  Send,
  Users,
  CheckCircle2
} from 'lucide-react';
import { 
  getCustomerConfirmationMessage, 
  getDriverDispatchMessage, 
  openWhatsApp 
} from '../utils/whatsapp';

const ALL_STATUSES = [
  'Enquiry Received',
  'Under Review',
  'Quote Sent',
  'Confirmed',
  'In Progress',
  'Completed',
  'Cancelled'
];

export default function BookingList({
  bookings = [],
  vehicles = [],
  drivers = [],
  onEditBooking,
  onStartTrip,
  onEndTrip,
  onViewDutySlip,
  onDeleteBooking,
  onStatusChange,
}) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Status counts
  const counts = {
    all: bookings.length,
    enquiries: bookings.filter(b => b.status === 'Enquiry Received' || b.status === 'Pending').length,
    under_review: bookings.filter(b => b.status === 'Under Review').length,
    quote_sent: bookings.filter(b => b.status === 'Quote Sent').length,
    confirmed: bookings.filter(b => b.status === 'Confirmed').length,
    in_progress: bookings.filter(b => b.status === 'In Progress').length,
    completed: bookings.filter(b => b.status === 'Completed').length,
    cancelled: bookings.filter(b => b.status === 'Cancelled').length,
  };

  // Filtered bookings
  const filteredBookings = bookings.filter(b => {
    // Tab filter
    if (activeFilter === 'enquiries' && b.status !== 'Enquiry Received' && b.status !== 'Pending') return false;
    if (activeFilter === 'under_review' && b.status !== 'Under Review') return false;
    if (activeFilter === 'quote_sent' && b.status !== 'Quote Sent') return false;
    if (activeFilter === 'confirmed' && b.status !== 'Confirmed') return false;
    if (activeFilter === 'in_progress' && b.status !== 'In Progress') return false;
    if (activeFilter === 'completed' && b.status !== 'Completed') return false;
    if (activeFilter === 'cancelled' && b.status !== 'Cancelled') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = b.customerName?.toLowerCase().includes(q);
      const matchPhone = b.customerPhone?.includes(q);
      const matchId = b.id?.toLowerCase().includes(q);
      const matchPickup = b.pickupLocation?.toLowerCase().includes(q);
      const matchDrop = b.dropLocation?.toLowerCase().includes(q);
      const matchDriver = b.driverName?.toLowerCase().includes(q);
      const matchPlate = b.vehiclePlateNumber?.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchId && !matchPickup && !matchDrop && !matchDriver && !matchPlate) {
        return false;
      }
    }
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>On Road (Live)</span>
          </span>
        );
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Confirmed</span>
          </span>
        );
      case 'Enquiry Received':
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Enquiry Received</span>
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <span>Under Review</span>
          </span>
        );
      case 'Quote Sent':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <span>Quote Sent</span>
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-400">
            <span>{status}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Filters & Search Header */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-slate-900 p-3.5 rounded-2xl border border-slate-800">
        
        {/* Status Pill Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeFilter === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>All ({counts.all})</span>
          </button>

          <button
            onClick={() => setActiveFilter('in_progress')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeFilter === 'in_progress'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>On Road ({counts.in_progress})</span>
          </button>

          <button
            onClick={() => setActiveFilter('confirmed')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeFilter === 'confirmed'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>Confirmed ({counts.confirmed})</span>
          </button>

          <button
            onClick={() => setActiveFilter('enquiries')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeFilter === 'enquiries'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>Enquiries ({counts.enquiries})</span>
          </button>

          <button
            onClick={() => setActiveFilter('under_review')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeFilter === 'under_review'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>Review ({counts.under_review})</span>
          </button>

          <button
            onClick={() => setActiveFilter('quote_sent')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeFilter === 'quote_sent'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>Quoted ({counts.quote_sent})</span>
          </button>

          <button
            onClick={() => setActiveFilter('completed')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeFilter === 'completed'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>Completed ({counts.completed})</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search ref ID, customer, route, car..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
          />
        </div>
      </div>

      {/* Bookings List / Cards */}
      {filteredBookings.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          <Car className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No Bookings Found</h3>
          <p className="text-xs text-slate-500">
            {searchQuery ? 'Try adjusting your search criteria.' : 'No trips match this filter stage.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings.map(b => {
            return (
              <div 
                key={b.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/30 rounded-2xl p-4 sm:p-5 transition shadow-lg text-xs"
              >
                {/* Card Top Row: ID, Status, Route & Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono font-bold text-amber-400 text-sm bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                      {b.id}
                    </span>
                    {getStatusBadge(b.status)}
                    <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                      {b.tripType}
                    </span>

                    {/* Quick Status Stage Dropdown */}
                    {onStatusChange && (
                      <div className="relative inline-block">
                        <select
                          value={b.status}
                          onChange={(e) => onStatusChange(b.id, e.target.value)}
                          className="bg-slate-950 text-slate-300 border border-slate-800 rounded-lg px-2 py-1 text-[11px] font-medium focus:border-amber-400 outline-none"
                        >
                          {ALL_STATUSES.map(st => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-white font-medium">{b.pickupDate}</span>
                      <span>({b.pickupTime})</span>
                    </div>
                    {b.returnDate && (
                      <div className="flex items-center gap-1">
                        <span>→ Return:</span>
                        <span className="text-white font-medium">{b.returnDate}</span>
                        <span className="text-slate-500">({b.daysCount}d)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Main Body Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  
                  {/* Left 4 Cols: Customer & Pickup Details */}
                  <div className="md:col-span-4 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{b.customerName}</span>
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{b.passengers || 4} pax</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a 
                        href={`tel:${b.customerPhone}`}
                        className="text-amber-400 hover:underline flex items-center gap-1 font-mono"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{b.customerPhone}</span>
                      </a>

                      <button
                        onClick={() => openWhatsApp(b.customerPhone, getCustomerConfirmationMessage(b))}
                        className="p-1 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition"
                        title="Send confirmation on WhatsApp"
                      >
                        <MessageSquare className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-400 pt-1 space-y-1">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1 text-slate-300 font-medium">Pickup: {b.pickupLocation}</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3 h-3 text-rose-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1 text-slate-300">Drop: {b.dropLocation}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle 4 Cols: Fleet, Driver & Odometer */}
                  <div className="md:col-span-4 bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Vehicle:</span>
                      <span className="font-mono font-bold text-amber-400">
                        {b.vehiclePlateNumber || 'MH 02 EE 4589 (Ertiga)'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Driver:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-white">
                          {b.driverName || 'Ramesh Shinde'}
                        </span>
                        {b.driverPhone && (
                          <button
                            onClick={() => openWhatsApp(b.driverPhone, getDriverDispatchMessage(b))}
                            className="p-1 rounded bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                            title="Dispatch trip details to driver WhatsApp"
                          >
                            <Send className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Odometer Tracker Bar */}
                    <div className="border-t border-slate-800/80 pt-1.5 flex items-center justify-between text-[11px]">
                      <div>
                        <span className="text-slate-500 block">Start KM</span>
                        <span className="font-mono font-bold text-slate-300">
                          {b.startKm !== null && b.startKm !== undefined ? `${b.startKm} KM` : '--'}
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="text-slate-500 block">End KM</span>
                        <span className="font-mono font-bold text-slate-300">
                          {b.endKm !== null && b.endKm !== undefined ? `${b.endKm} KM` : '--'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 block">Total KM</span>
                        <span className="font-mono font-bold text-emerald-400">
                          {b.totalKm !== null && b.totalKm !== undefined ? `${b.totalKm} KM` : `~${b.billableKm || b.estKm || 300} KM`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right 4 Cols: Financials & Action Buttons */}
                  <div className="md:col-span-4 flex flex-col justify-between h-full space-y-3">
                    
                    {/* Financial Summary */}
                    <div className="flex items-center justify-between bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block font-semibold">Total Fare</span>
                        <span className="text-base font-extrabold text-amber-400">
                          ₹{(b.totalFare || 0).toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 uppercase block font-semibold">Balance Due</span>
                        <span className={`text-sm font-bold ${b.balanceDue > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          ₹{(b.balanceDue || 0).toLocaleString('en-IN')}
                        </span>
                        <span className={`text-[10px] block font-semibold ${b.paymentStatus === 'Paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          ({b.paymentStatus || 'Pending'})
                        </span>
                      </div>
                    </div>

                    {/* Operations Action Buttons */}
                    <div className="flex flex-wrap items-center gap-1.5 justify-end">
                      
                      {/* Workflow Button: Start Trip */}
                      {b.status === 'Confirmed' && (
                        <button
                          onClick={() => onStartTrip(b)}
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1 shadow-md shadow-amber-500/20 text-xs"
                          title="Record opening odometer and begin journey"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Start Trip</span>
                        </button>
                      )}

                      {/* Workflow Button: End Trip */}
                      {b.status === 'In Progress' && (
                        <button
                          onClick={() => onEndTrip(b)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1 shadow-md text-xs"
                          title="Record closing odometer and complete trip"
                        >
                          <Square className="w-3.5 h-3.5 fill-current" />
                          <span>End Trip & Bill</span>
                        </button>
                      )}

                      {/* Workflow Button: Duty Slip / Invoice */}
                      <button
                        onClick={() => onViewDutySlip(b)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-2.5 py-1.5 rounded-xl transition flex items-center gap-1 text-xs"
                        title="View printable Duty Slip & Invoice"
                      >
                        <Printer className="w-3.5 h-3.5 text-amber-400" />
                        <span>Slip</span>
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => onEditBooking(b)}
                        className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                        title="Edit booking details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => onDeleteBooking(b)}
                        className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
                        title="Delete booking"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                    </div>

                  </div>

                </div>

                {/* Notes footer if any */}
                {b.notes && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span className="text-amber-400 font-semibold">Note:</span>
                    <span>{b.notes}</span>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
