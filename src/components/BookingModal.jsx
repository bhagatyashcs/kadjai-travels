import React, { useState, useEffect } from 'react';
import { 
  X, 
  Car, 
  MapPin, 
  User, 
  DollarSign, 
  Check,
  Locate,
  Navigation
} from 'lucide-react';
import { 
  POPULAR_ROUTES, 
  VEHICLE_MODELS 
} from '../data/travelData';
import { 
  calculateTripFare, 
  estimateLocationDetails, 
  calculateDaysBetween 
} from '../utils/travelStorage';

export default function BookingModal({
  isOpen,
  onClose,
  onSave,
  bookingToEdit,
  vehicles = [],
  drivers = [],
}) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    passengers: 4,
    route: POPULAR_ROUTES[0].title,
    tripType: 'Outstation Round Trip',
    pickupLocation: '',
    dropLocation: '',
    pickupDate: new Date().toISOString().split('T')[0],
    pickupTime: '08:00',
    returnDate: '',
    daysCount: 1,
    vehicleModelId: 'ertiga',
    vehicleId: '',
    vehiclePlateNumber: '',
    driverId: '',
    driverName: 'Unassigned',
    driverPhone: '',
    status: 'Confirmed',
    estKm: 300,
    ratePerKm: 25,
    driverBataPerDay: 400,
    tollCharges: 0,
    parkingCharges: 0,
    nightCharges: 0,
    discount: 0,
    advancePaid: 0,
    paymentMode: 'Cash',
    notes: '',
  });

  const [autoCalculate, setAutoCalculate] = useState(true);

  // Sync state when editing
  useEffect(() => {
    if (bookingToEdit) {
      setFormData({
        ...bookingToEdit,
        vehicleId: bookingToEdit.vehicleId || '',
        driverId: bookingToEdit.driverId || '',
      });
      setAutoCalculate(false);
    } else {
      // Default new booking
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      
      setFormData({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        passengers: 4,
        route: POPULAR_ROUTES[0].title,
        tripType: 'Outstation Round Trip',
        pickupLocation: 'Mumbai',
        dropLocation: 'Lonavala',
        pickupDate: tomorrowStr,
        pickupTime: '07:30',
        returnDate: tomorrowStr,
        daysCount: 1,
        vehicleModelId: 'ertiga',
        vehicleId: '',
        vehiclePlateNumber: '',
        driverId: '',
        driverName: 'Unassigned',
        driverPhone: '',
        status: 'Confirmed',
        estKm: 300,
        ratePerKm: 25,
        driverBataPerDay: 400,
        tollCharges: 0,
        parkingCharges: 0,
        nightCharges: 0,
        discount: 0,
        advancePaid: 0,
        paymentMode: 'Cash',
        notes: '',
      });
      setAutoCalculate(true);
    }
  }, [bookingToEdit, isOpen]);

  // Handle vehicle assignment selection
  const handleVehicleSelect = (vId) => {
    if (!vId) {
      setFormData(prev => ({
        ...prev,
        vehicleId: '',
        vehiclePlateNumber: '',
      }));
      return;
    }
    const found = vehicles.find(v => v.id === vId);
    if (found) {
      setFormData(prev => ({
        ...prev,
        vehicleId: found.id,
        vehiclePlateNumber: found.plateNumber,
        vehicleModelId: found.modelId,
      }));
    }
  };

  // Handle driver assignment selection
  const handleDriverSelect = (dId) => {
    if (!dId) {
      setFormData(prev => ({
        ...prev,
        driverId: '',
        driverName: 'Unassigned',
        driverPhone: '',
      }));
      return;
    }
    const found = drivers.find(d => d.id === dId);
    if (found) {
      setFormData(prev => ({
        ...prev,
        driverId: found.id,
        driverName: found.name,
        driverPhone: found.phone,
      }));
    }
  };

  // Dynamic location and toll/parking update
  const [isLocatingGps, setIsLocatingGps] = useState(false);

  const handleGpsPickup = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) return;
    setIsLocatingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        let name = '';
        try {
          const ctrl = new AbortController();
          const timer = setTimeout(() => ctrl.abort(), 3500);
          const resp = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { signal: ctrl.signal, headers: { 'Accept-Language': 'en' } }
          );
          clearTimeout(timer);
          if (resp.ok) {
            const data = await resp.json();
            const addr = data.address || {};
            const suburb = addr.suburb || addr.neighbourhood || addr.residential || addr.road;
            const city = addr.city || addr.town || 'Mumbai';
            if (suburb) name = `${suburb}, ${city}`;
          }
        } catch {}
        if (!name) name = `Current GPS Location (${latitude.toFixed(3)}°N, ${longitude.toFixed(3)}°E)`;
        handleLocationChange('pickupLocation', name);
        setIsLocatingGps(false);
      },
      () => setIsLocatingGps(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleLocationChange = (field, val) => {
    setFormData(prev => {
      const next = { ...prev, [field]: val };
      const pickup = field === 'pickupLocation' ? val : next.pickupLocation;
      const drop = field === 'dropLocation' ? val : next.dropLocation;
      
      const estimate = estimateLocationDetails(pickup, drop, next.tripType, next.pickupTime);
      return {
        ...next,
        estKm: estimate.estKm,
        tollCharges: estimate.estToll,
        parkingCharges: estimate.estParking,
        route: `${(pickup || 'Mumbai').split(',')[0]} ➔ ${(drop || 'Destination').split(',')[0]}`,
      };
    });
  };

  // Dynamic date and days count update
  const handleDateChange = (field, val) => {
    setFormData(prev => {
      const next = { ...prev, [field]: val };
      if (next.pickupDate && next.returnDate && next.tripType === 'Outstation Round Trip') {
        const days = calculateDaysBetween(next.pickupDate, next.returnDate);
        next.daysCount = days;
      }
      return next;
    });
  };

  // Calculate live financials
  const financials = calculateTripFare({
    vehicleModelId: formData.vehicleModelId,
    tripType: formData.tripType,
    daysCount: formData.daysCount,
    estKm: formData.estKm,
    tollCharges: formData.tollCharges,
    parkingCharges: formData.parkingCharges,
    nightCharges: formData.nightCharges,
    discount: formData.discount,
    advancePaid: formData.advancePaid,
    customRatePerKm: formData.ratePerKm,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerPhone || !formData.pickupLocation) {
      alert('Please fill in required fields: Customer Name, Phone, and Pickup Location.');
      return;
    }

    const payload = {
      ...formData,
      ...financials,
      // preserve start/end km if present
      startKm: bookingToEdit ? bookingToEdit.startKm : null,
      endKm: bookingToEdit ? bookingToEdit.endKm : null,
      totalKm: bookingToEdit ? bookingToEdit.totalKm : null,
      updatedAt: new Date().toISOString(),
    };

    onSave(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl text-slate-100 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {bookingToEdit ? `Edit Booking (${bookingToEdit.id})` : 'Create New Tourist Booking'}
              </h2>
              <p className="text-xs text-slate-400">
                Manage schedule, pickup/drop, fleet assignment & fare computation
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-xs max-h-[80vh] overflow-y-auto">
          
          {/* SECTION 1: CUSTOMER DETAILS */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Customer Information</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">WhatsApp / Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98XXXXXXXX"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="customer@email.com"
                  value={formData.customerEmail || ''}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: TRIP & LOCATION DETAILS */}
          <div className="border-t border-slate-800 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Trip Route & Locations</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-slate-400 font-medium mb-1 flex items-center justify-between">
                  <span>Pickup Location & Address *</span>
                  <button
                    type="button"
                    onClick={handleGpsPickup}
                    disabled={isLocatingGps}
                    className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
                  >
                    <Navigation className={`w-2.5 h-2.5 ${isLocatingGps ? 'animate-spin' : ''}`} />
                    <span>{isLocatingGps ? 'Locating...' : 'Use Current GPS'}</span>
                  </button>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bandra West, Mumbai / Airport T2"
                  value={formData.pickupLocation}
                  onChange={(e) => handleLocationChange('pickupLocation', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
                <div className="flex flex-wrap gap-1 mt-1">
                  {['Bandra', 'Dadar', 'Airport T2', 'Thane', 'Navi Mumbai'].map(c => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => handleLocationChange('pickupLocation', `${c}, Mumbai`)}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1 flex items-center justify-between">
                  <span>Drop Destination / City *</span>
                  <span className="text-[10px] text-amber-400">Calculates Distance & Tolls</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lonavala, Pune, Shirdi, Goa, Alibaug..."
                  value={formData.dropLocation}
                  onChange={(e) => handleLocationChange('dropLocation', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
                <div className="flex flex-wrap gap-1 mt-1">
                  {['Lonavala', 'Pune', 'Shirdi', 'Mahabaleshwar', 'Goa', 'Alibaug', 'Nashik'].map(c => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => handleLocationChange('dropLocation', c)}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 hover:bg-amber-500/20 hover:text-amber-400 text-slate-300"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Generated Route Label</label>
                <input
                  type="text"
                  value={formData.route}
                  onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Trip Category</label>
                <select
                  value={formData.tripType}
                  onChange={(e) => {
                    const tType = e.target.value;
                    setFormData(prev => {
                      const next = { ...prev, tripType: tType };
                      const est = estimateLocationDetails(next.pickupLocation, next.dropLocation, tType, next.pickupTime);
                      next.estKm = est.estKm;
                      next.tollCharges = est.estToll;
                      next.parkingCharges = est.estParking;
                      return next;
                    });
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Outstation Round Trip">Outstation Round Trip</option>
                  <option value="One Way">Outstation One Way Drop</option>
                  <option value="Airport Pickup / Drop">Airport Pickup / Drop</option>
                  <option value="Local Rental">Local Rental (8h / 80km)</option>
                  <option value="Multi-Day Holiday">Multi-Day Holiday Tour</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Pickup Date</label>
                <input
                  type="date"
                  required
                  value={formData.pickupDate}
                  onChange={(e) => handleDateChange('pickupDate', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Pickup Time</label>
                <input
                  type="time"
                  required
                  value={formData.pickupTime}
                  onChange={(e) => {
                    const val = e.target.value;
                    const h = parseInt(val.split(':')[0], 10);
                    const isNight = !isNaN(h) && (h < 6 || h >= 22);
                    setFormData({
                      ...formData,
                      pickupTime: val,
                      nightCharges: isNight ? 300 : 0
                    });
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 text-center"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Return Date</label>
                <input
                  type="date"
                  value={formData.returnDate || ''}
                  onChange={(e) => handleDateChange('returnDate', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Trip Days Count</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={formData.daysCount}
                  onChange={(e) => setFormData({ ...formData, daysCount: Math.max(1, parseInt(e.target.value) || 1) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-center font-bold focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: FLEET & DRIVER ASSIGNMENT */}
          <div className="border-t border-slate-800 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5" />
              <span>Vehicle Fleet & Driver Assignment</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Vehicle Category</label>
                <select
                  value={formData.vehicleModelId}
                  onChange={(e) => {
                    const mId = e.target.value;
                    const model = VEHICLE_MODELS.find(m => m.id === mId);
                    setFormData(prev => ({
                      ...prev,
                      vehicleModelId: mId,
                      ratePerKm: model?.ratePerKm || 25,
                      driverBataPerDay: model?.driverBataPerDay || 400,
                    }));
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                >
                  {VEHICLE_MODELS.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.seats})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Assign Specific Car</label>
                <select
                  value={formData.vehicleId}
                  onChange={(e) => handleVehicleSelect(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-mono"
                >
                  <option value="">-- Unassigned (Assign Later) --</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.plateNumber} ({v.model} - {v.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Assign Driver</label>
                <select
                  value={formData.driverId}
                  onChange={(e) => handleDriverSelect(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="">-- Unassigned (Assign Later) --</option>
                  {drivers.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.status} • {d.rating}★)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Passengers Count</label>
                <input
                  type="number"
                  min="1"
                  max="17"
                  value={formData.passengers}
                  onChange={(e) => setFormData({ ...formData, passengers: parseInt(e.target.value) || 1 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-center focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Booking Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-amber-400"
                >
                  <option value="Pending">Pending / Lead</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="In Progress">In Progress (On Road)</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Est. Distance (KM)</label>
                <input
                  type="number"
                  value={formData.estKm}
                  onChange={(e) => setFormData({ ...formData, estKm: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-center font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Rate / KM (₹)</label>
                <input
                  type="number"
                  value={formData.ratePerKm}
                  onChange={(e) => setFormData({ ...formData, ratePerKm: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-center font-bold focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: FARES & ADVANCE PAYMENT */}
          <div className="border-t border-slate-800 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Financials, Advance & Payment</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Toll Charges (₹)</label>
                <input
                  type="number"
                  value={formData.tollCharges}
                  onChange={(e) => setFormData({ ...formData, tollCharges: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-center focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Parking / State Tax (₹)</label>
                <input
                  type="number"
                  value={formData.parkingCharges}
                  onChange={(e) => setFormData({ ...formData, parkingCharges: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-center focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Advance Received (₹)</label>
                <input
                  type="number"
                  value={formData.advancePaid}
                  onChange={(e) => setFormData({ ...formData, advancePaid: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-bold text-center focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Payment Mode</label>
                <select
                  value={formData.paymentMode}
                  onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI (GPay / PhonePe)">UPI (GPay / PhonePe)</option>
                  <option value="Bank Transfer (NEFT)">Bank Transfer (NEFT)</option>
                  <option value="Card">Card</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            {/* Live Financial Breakdown Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-[11px] text-slate-400 block">Billable KM</span>
                <span className="text-sm font-bold text-white">{financials.billableKm} KM</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Base + Driver Charge</span>
                <span className="text-sm font-bold text-white">
                  ₹{(financials.baseFare + financials.driverBataTotal).toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Calculated Total</span>
                <span className="text-base font-extrabold text-amber-400">
                  ₹{financials.totalFare.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Balance Outstanding</span>
                <span className={`text-base font-extrabold ${financials.balanceDue > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  ₹{financials.balanceDue.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 5: NOTES */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">Trip Instructions / Special Requests</label>
            <textarea
              rows="2"
              placeholder="e.g. Carrier rack needed, flight AI-191 delay buffer, passenger needs child seat..."
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
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
              <Check className="w-4 h-4" />
              <span>{bookingToEdit ? 'Save Changes' : 'Create Booking'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
