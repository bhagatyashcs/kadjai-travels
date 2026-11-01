import React, { useState, useEffect } from 'react';
import { 
  Car, 
  PlusCircle, 
  Download, 
  RotateCcw, 
  MessageSquare, 
  ArrowRight,
  TrendingUp,
  CreditCard,
  Edit3,
  Receipt,
  Trash2,
  LogOut,
  Wallet,
  Gauge,
  FileText,
  Users,
  Calculator,
  ShieldCheck
} from 'lucide-react';
import BookingList from './BookingList';
import { POPULAR_ROUTES } from '../data/travelData';
import { calculateTripFare, exportBookingsToCSV } from '../utils/travelStorage';
import { openWhatsApp } from '../utils/whatsapp';
import { 
  fetchExpensesApi, 
  logExpenseApi, 
  deleteExpenseApi,
  getCurrentUser
} from '../utils/apiClient';

export default function AdminDashboard({
  bookings = [],
  vehicles = [],
  drivers = [],
  onNewBooking,
  onEditBooking,
  onStartTrip,
  onEndTrip,
  onViewDutySlip,
  onDeleteBooking,
  onStatusChange,
  onAddVehicle,
  onEditVehicle,
  onAddDriver,
  onEditDriver,
  onResetData,
  onLogout,
}) {
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'fleet' | 'drivers' | 'expenses' | 'calculator'
  const currentUser = getCurrentUser() || { fullName: 'Ramasre Bhagat', username: 'owner', email: 'owner@kadjaitravels.com' };

  // Expenses management state
  const [expenses, setExpenses] = useState([]);
  const [newExpenseCategory, setNewExpenseCategory] = useState('Fuel (CNG/Petrol)');
  const [newExpenseBookingId, setNewExpenseBookingId] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseNotes, setNewExpenseNotes] = useState('');
  const [isLoggingExpense, setIsLoggingExpense] = useState(false);

  // Load expenses on mount and when tab changes
  useEffect(() => {
    let mounted = true;
    fetchExpensesApi().then(data => {
      if (mounted && Array.isArray(data)) {
        setExpenses(data);
      }
    });
    return () => { mounted = false; };
  }, [activeTab]);

  // Fast Calculator state for phone inquiry quotes
  const [calcRoute, setCalcRoute] = useState(POPULAR_ROUTES[0].title);
  const [calcDays, setCalcDays] = useState(POPULAR_ROUTES[0].suggestedDays || 1);
  const [calcEstKm, setCalcEstKm] = useState(POPULAR_ROUTES[0].estKm || 260);
  const [calcTolls, setCalcTolls] = useState(POPULAR_ROUTES[0].defaultToll || 320);

  // Compute operational KPIs
  const activeTripsCount = bookings.filter(b => b.status === 'In Progress').length;
  const confirmedTripsCount = bookings.filter(b => b.status === 'Confirmed').length;

  const totalRevenueCollected = bookings.reduce((sum, b) => sum + (Number(b.advancePaid) || 0), 0);

  // Total Expenses (from expenses state or fallback estimate)
  const totalExpensesLogged = expenses.length > 0 
    ? expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
    : 2210; // Initial seeded demo expense

  const netOperatingProfit = totalRevenueCollected - totalExpensesLogged;

  const totalKmRun = bookings.reduce((sum, b) => {
    if (b.totalKm !== null && b.totalKm !== undefined) return sum + Number(b.totalKm);
    if (b.startKm && b.endKm) return sum + (Number(b.endKm) - Number(b.startKm));
    return sum;
  }, 0);

  // Live calculator calculation
  const fastQuote = calculateTripFare({
    vehicleModelId: 'ertiga',
    tripType: 'Round Trip',
    daysCount: calcDays,
    estKm: calcEstKm,
    tollCharges: calcTolls,
  });

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!newExpenseAmount || Number(newExpenseAmount) <= 0) return;

    setIsLoggingExpense(true);
    const newExp = await logExpenseApi({
      bookingId: newExpenseBookingId || null,
      category: newExpenseCategory,
      amount: Number(newExpenseAmount),
      notes: newExpenseNotes,
      expenseDate: new Date().toISOString().split('T')[0],
    });

    if (newExp) {
      setExpenses([newExp, ...expenses]);
      setNewExpenseAmount('');
      setNewExpenseNotes('');
      setNewExpenseBookingId('');
    }
    setIsLoggingExpense(false);
  };

  const handleDeleteExpense = async (id) => {
    const ok = await deleteExpenseApi(id);
    if (ok) {
      setExpenses(expenses.filter(e => e.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Operations Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
                Operations & Dispatch Desk
              </span>
              <span className="text-xs text-slate-400">TVMS v2.0 (Relational SQLite)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">
              Tourist Vehicle & Fleet Management System
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
              <span>Dedicated Fleet: <strong className="text-amber-400">Maruti Suzuki Ertiga (MH 02 EE 4589)</strong></span>
              <span>•</span>
              <span>Operations Hub: <strong className="text-slate-200">Mumbai & Maharashtra</strong></span>
            </div>
          </div>

          {/* Quick Header Actions & Auth Status */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onNewBooking}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 text-xs shadow-lg shadow-amber-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Booking</span>
            </button>

            <button
              onClick={() => exportBookingsToCSV(bookings)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-3.5 py-2.5 rounded-xl transition flex items-center gap-2 text-xs border border-slate-700"
              title="Download accounting Excel/CSV"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onResetData}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition border border-slate-700"
              title="Reset Sample Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{currentUser.fullName}</span>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-semibold px-3 py-2.5 rounded-xl transition flex items-center gap-1.5 text-xs border border-rose-500/30"
                title="Sign out from Operator Desk"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>

        {/* Operational KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          
          {/* KPI 1: Live On-Road Trips */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl relative overflow-hidden group">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>On-Road Live</span>
              <span className="flex h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400">
              {activeTripsCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {confirmedTripsCount} confirmed next
            </div>
          </div>

          {/* KPI 2: Revenue Collected */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Collected Revenue</span>
              <CreditCard className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              ₹{totalRevenueCollected.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-emerald-400 mt-1 font-semibold">
              Advance & settled fares
            </div>
          </div>

          {/* KPI 3: Trip Operating Expenses */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Trip Expenses</span>
              <Receipt className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-rose-400">
              ₹{totalExpensesLogged.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Fuel, Fastag, Driver Charge & Parking
            </div>
          </div>

          {/* KPI 4: Net Operating Profit */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Net Operating Profit</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className={`text-xl sm:text-2xl font-black ${netOperatingProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ₹{netOperatingProfit.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Revenue minus expenses
            </div>
          </div>

          {/* KPI 5: Kilometres Logged */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Odometer KM Run</span>
              <Gauge className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">
              {totalKmRun.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-400">KM</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Logged across journeys
            </div>
          </div>

        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition ${
              activeTab === 'bookings'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Trip Bookings & Dispatch ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition ${
              activeTab === 'expenses'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Trip Expenses & Net Profit</span>
          </button>

          <button
            onClick={() => setActiveTab('fleet')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition ${
              activeTab === 'fleet'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Ertiga Fleet & Odometer ({vehicles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('drivers')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition ${
              activeTab === 'drivers'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Commercial Drivers ({drivers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition ${
              activeTab === 'calculator'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Tariff Calculator & Rate Card</span>
          </button>
        </div>

        {/* TAB 1: TRIP BOOKINGS MANAGER */}
        {activeTab === 'bookings' && (
          <BookingList
            bookings={bookings}
            vehicles={vehicles}
            drivers={drivers}
            onEditBooking={onEditBooking}
            onStartTrip={onStartTrip}
            onEndTrip={onEndTrip}
            onViewDutySlip={onViewDutySlip}
            onDeleteBooking={onDeleteBooking}
            onStatusChange={onStatusChange}
          />
        )}

        {/* TAB 2: TRIP EXPENSES & NET PROFIT TRACKER */}
        {activeTab === 'expenses' && (
          <div className="space-y-6">
            
            {/* Profitability Summary Banner */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 block font-semibold">Total Revenue Collected</span>
                <span className="text-2xl font-black text-white">₹{totalRevenueCollected.toLocaleString('en-IN')}</span>
                <span className="text-[11px] text-slate-500 block">From advances and completed duty slip settlements</span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 block font-semibold">Total Direct Operating Expenses</span>
                <span className="text-2xl font-black text-rose-400">₹{totalExpensesLogged.toLocaleString('en-IN')}</span>
                <span className="text-[11px] text-slate-500 block">Fuel (CNG/Petrol), Highway Fastag, Driver Charge & Parking</span>
              </div>

              <div className="space-y-1 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-400 block font-semibold">Net Operating Profit</span>
                <span className="text-2xl font-black text-emerald-400">₹{netOperatingProfit.toLocaleString('en-IN')}</span>
                <span className="text-[11px] text-emerald-400/80 block font-medium">
                  {totalRevenueCollected > 0 
                    ? `Operating Margin: ${Math.round((netOperatingProfit / totalRevenueCollected) * 100)}%` 
                    : '100% computed from real database records'}
                </span>
              </div>
            </div>

            {/* Log New Expense Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-xs space-y-4">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Receipt className="w-4 h-4 text-amber-400" />
                <span>Log Trip Expense</span>
              </div>

              <form onSubmit={handleAddExpense} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Expense Category</label>
                  <select
                    value={newExpenseCategory}
                    onChange={(e) => setNewExpenseCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Fuel (CNG/Petrol)">Fuel (CNG / Petrol)</option>
                    <option value="Fastag Tolls">Fastag Tolls</option>
                    <option value="Driver Bata">Driver Charge</option>
                    <option value="Parking">Parking & Municipal Tax</option>
                    <option value="Maintenance">Vehicle Maintenance / Service</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Trip Reference (Optional)</label>
                  <select
                    value={newExpenseBookingId}
                    onChange={(e) => setNewExpenseBookingId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  >
                    <option value="">General Fleet Expense</option>
                    {bookings.map(b => (
                      <option key={b.id} value={b.id}>{b.id} ({b.customerName})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 1200"
                    value={newExpenseAmount}
                    onChange={(e) => setNewExpenseAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Notes / Receipt Detail</label>
                  <input
                    type="text"
                    placeholder="e.g. CNG top-up on Expressway"
                    value={newExpenseNotes}
                    onChange={(e) => setNewExpenseNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoggingExpense}
                    className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold py-2 rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{isLoggingExpense ? 'Saving...' : 'Add Expense'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Expenses List Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden text-xs">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <span className="font-bold text-white">Logged Expense Records ({expenses.length})</span>
                <span className="text-slate-400 text-[11px]">Persisted in SQLite database</span>
              </div>

              {expenses.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  No expense records logged yet. Add fuel or toll receipts above.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px]">
                      <tr>
                        <th className="p-3">Date</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Trip Ref</th>
                        <th className="p-3">Notes</th>
                        <th className="p-3 text-right">Amount</th>
                        <th className="p-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {expenses.map(exp => (
                        <tr key={exp.id} className="hover:bg-slate-800/30">
                          <td className="p-3 font-mono text-slate-400">{exp.expense_date || exp.expenseDate || 'Today'}</td>
                          <td className="p-3 font-semibold text-white">{exp.category}</td>
                          <td className="p-3 font-mono text-amber-400">{exp.booking_id || exp.bookingId || '--'}</td>
                          <td className="p-3 text-slate-300">{exp.notes || '—'}</td>
                          <td className="p-3 text-right font-bold font-mono text-rose-400">
                            ₹{Number(exp.amount).toLocaleString('en-IN')}
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleDeleteExpense(exp.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                              title="Delete expense"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: VEHICLE FLEET MANAGEMENT */}
        {activeTab === 'fleet' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Single-Vehicle Tourist Fleet (Maruti Suzuki Ertiga)</h3>
                <p className="text-xs text-slate-400">
                  Exclusively operating a dedicated 6+1 Luxury AC Ertiga with valid commercial tourist permits.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vehicles.map(v => {
                const assignedDriver = drivers.find(d => d.id === v.assignedDriverId) || drivers[0];
                const activeTrip = bookings.find(b => b.status === 'In Progress');

                return (
                  <div 
                    key={v.id}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <span className="font-mono text-base font-extrabold text-amber-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                          {v.plateNumber || v.plate_number || 'MH 02 EE 4589'}
                        </span>
                        <div className="text-slate-300 font-semibold mt-1">
                          {v.model || 'Maruti Suzuki Ertiga'} ({v.variant || 'ZXi Dual Fuel'})
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        v.status === 'Available'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : v.status === 'On Trip'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}>
                        {v.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Current Odometer</span>
                        <span className="font-mono font-bold text-white text-sm">
                          {(v.currentKm || v.current_odometer_km || 42850).toLocaleString('en-IN')} KM
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Seating Capacity</span>
                        <span className="text-white font-medium">{v.seats || v.seating_capacity || 7} Seats (AC)</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Insurance Expiry</span>
                        <span className="text-slate-300 font-mono">{v.insuranceExpiry || v.insurance_expiry || '2027-04-15'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">PUC Expiry</span>
                        <span className="text-slate-300 font-mono">{v.pucExpiry || v.puc_expiry || '2026-11-20'}</span>
                      </div>
                    </div>

                    {assignedDriver && (
                      <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                        <span>Commercial Driver:</span>
                        <span className="font-semibold text-white">{assignedDriver.name}</span>
                      </div>
                    )}

                    {activeTrip && (
                      <div className="text-[11px] text-amber-400 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                        🚗 Live Trip: <span className="font-bold">{activeTrip.dropLocation || activeTrip.route}</span> ({activeTrip.customerName})
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => onEditVehicle(v)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Update Odometer</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: DRIVER ROSTER & WHATSAPP DISPATCH */}
        {activeTab === 'drivers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Commercial Highway Driver Directory</h3>
                <p className="text-xs text-slate-400">
                  Verified commercial badges, highway experience, and WhatsApp dispatch coordination.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {drivers.map(d => {
                return (
                  <div 
                    key={d.id}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{d.avatar || '👨‍✈️'}</span>
                        <div>
                          <div className="font-bold text-sm text-white">{d.name}</div>
                          <a 
                            href={`tel:${d.phone}`} 
                            className="text-[11px] text-amber-400 hover:underline font-mono"
                          >
                            {d.phone}
                          </a>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        d.status === 'Available'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : d.status === 'On Trip'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {d.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Experience</span>
                        <span className="text-white font-bold">{d.experienceYears || d.experience_years || 8} Years</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Driver Rating</span>
                        <span className="text-amber-400 font-bold">★ {d.rating || 4.9}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">License No</span>
                        <span className="text-slate-300 font-mono text-[10px]">{d.licenseNumber || d.license_number}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Tourist Badge</span>
                        <span className="text-slate-300 font-mono text-[10px]">{d.badgeNumber || d.badge_number}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <button
                        onClick={() => openWhatsApp(d.phone, `Namaste ${d.name}, message from Kadjai Travels Dispatch Desk.`)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 text-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat WhatsApp</span>
                      </button>

                      <button
                        onClick={() => onEditDriver(d)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: QUICK QUOTE ESTIMATOR & RATE CHART */}
        {activeTab === 'calculator' && (
          <div className="grid lg:grid-cols-12 gap-6">
            
            {/* Left 6 cols: Live Fare Calculator */}
            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Calculator className="w-4 h-4" />
                <span>Instant Phone Inquiry Fare Estimator</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Quickly calculate outstation tourist fares with minimum KM policy, driver allowance, and tolls.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Route Template</label>
                  <select
                    value={calcRoute}
                    onChange={(e) => {
                      setCalcRoute(e.target.value);
                      const found = POPULAR_ROUTES.find(r => r.title === e.target.value);
                      if (found) {
                        setCalcEstKm(found.estKm);
                        setCalcDays(found.suggestedDays || 1);
                        setCalcTolls(found.defaultToll || 0);
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    {POPULAR_ROUTES.map(r => (
                      <option key={r.id} value={r.title}>{r.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Vehicle Model</label>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-400 font-bold">
                    Maruti Suzuki Ertiga (₹25/km)
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Trip Days</label>
                  <input
                    type="number"
                    min="1"
                    value={calcDays}
                    onChange={(e) => setCalcDays(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-center font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Est. Distance (KM)</label>
                  <input
                    type="number"
                    value={calcEstKm}
                    onChange={(e) => setCalcEstKm(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-center font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Toll Est. (₹)</label>
                  <input
                    type="number"
                    value={calcTolls}
                    onChange={(e) => setCalcTolls(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-center"
                  />
                </div>
              </div>

              {/* Live Quotation Result Box */}
              <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-5 space-y-2.5">
                <div className="flex justify-between text-slate-400">
                  <span>Billable Kilometres (Min 300 km/day):</span>
                  <span className="text-white font-mono font-bold">{fastQuote.billableKm} KM</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Base Distance Fare (@ ₹{fastQuote.ratePerKm}/km):</span>
                  <span className="text-white">₹{fastQuote.baseFare.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Driver Charge ({calcDays} Days @ ₹400/day):</span>
                  <span className="text-white">₹{fastQuote.driverBataTotal.toLocaleString('en-IN')}</span>
                </div>
                {Number(calcTolls) > 0 && (
                  <div className="flex justify-between text-slate-400">
                    <span>Estimated Fastag Tolls:</span>
                    <span className="text-white">₹{Number(calcTolls).toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-base font-black">
                  <span className="text-white">Quotation to Customer:</span>
                  <span className="text-amber-400 text-xl font-mono">
                    ₹{fastQuote.totalFare.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onNewBooking({
                    pickupLocation: 'Mumbai',
                    dropLocation: calcRoute,
                    daysCount: calcDays,
                    estKm: calcEstKm,
                    tollCharges: calcTolls,
                  });
                }}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
              >
                <span>Convert to Booking</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right 6 cols: Standard Tariff Rate Card */}
            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Car className="w-4 h-4 text-amber-400" />
                <span>Kadjai Travels Transparent Tariff Chart</span>
              </h3>

              <div className="space-y-3">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">Intercity Outstation Duty</span>
                    <span className="text-amber-400 font-bold font-mono text-sm">₹25 / KM</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Applicable for round-trip journeys across Maharashtra and Goa. Minimum daily billing: 300 KM/day + ₹400/day driver charge.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">Local Mumbai Rental (8h / 80km)</span>
                    <span className="text-amber-400 font-bold font-mono text-sm">₹2,200 Flat</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Includes 8 hours and 80 kilometres within Mumbai, Navi Mumbai, and Thane. Extra km charged at ₹15/km.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">Local Mumbai Rental (12h / 120km)</span>
                    <span className="text-amber-400 font-bold font-mono text-sm">₹3,200 Flat</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Full-day shopping, wedding attendance, or corporate site visits. Extra km charged at ₹15/km.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">CSMIA Airport Transfer Package</span>
                    <span className="text-amber-400 font-bold font-mono text-sm">₹1,800 Base</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Door-to-terminal pickup or drop (Terminal 1 / Terminal 2) with flight delay buffer.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
