import React, { useState, useEffect, useMemo } from 'react';
import { 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Users, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  DollarSign, 
  ArrowRight, 
  ChevronRight, 
  Info 
} from 'lucide-react';
import { COMPANY_INFO } from '../data/travelData';
import { 
  calculateTripFare, 
  estimateLocationDetails, 
  calculateDaysBetween,
  PRICING_CONFIG,
  generateBookingId,
  getBookings
} from '../utils/travelStorage';
import { getCustomerInquiryMessage, openWhatsApp } from '../utils/whatsapp';

export default function BookingForm({ onSubmitBooking, defaultDestination = '' }) {
  // Current Active Wizard Step: 1 = Journey Details, 2 = Contact, 3 = Review & Submit
  const [activeStep, setActiveStep] = useState(1);

  // Trip Type Selection
  const [tripType, setTripType] = useState('Round Trip'); // 'Round Trip' | 'One Way' | 'Local Rental' | 'Airport Transfer'

  // Locations
  const [pickupLocation, setPickupLocation] = useState('Bandra West, Mumbai');
  const [destination, setDestination] = useState(defaultDestination || 'Lonavala');
  
  // Airport specific fields
  const [airportDirection, setAirportDirection] = useState('Drop to Airport'); // 'Drop to Airport' | 'Pickup from Airport'
  const [airportTerminal, setAirportTerminal] = useState('Terminal 2 (CSMIA International/Domestic)');
  const [flightNumber, setFlightNumber] = useState('');

  // Local Rental specific fields
  const [localPackage, setLocalPackage] = useState('8h_80km'); // '8h_80km' | '12h_120km'

  // Dates & Times
  const [pickupDate, setPickupDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [pickupTime, setPickupTime] = useState('07:00');
  const [returnDate, setReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [daysCount, setDaysCount] = useState(2);

  // Passengers & Luggage
  const [passengers, setPassengers] = useState(4);
  const [luggageRequirement, setLuggageRequirement] = useState('Standard Luggage (Roof Carrier Needed)');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Customer Contact
  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  // Validation & Submission States
  const [errors, setErrors] = useState({});
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [assignedBookingRef, setAssignedBookingRef] = useState('');

  // Update destination if default prop changes
  useEffect(() => {
    if (defaultDestination) {
      setDestination(defaultDestination);
      if (tripType === 'Local Rental' || tripType === 'Airport Transfer') {
        setTripType('Round Trip');
      }
    }
  }, [defaultDestination]);

  // Recalculate days count for Round Trip
  useEffect(() => {
    if (tripType === 'Round Trip') {
      const days = calculateDaysBetween(pickupDate, returnDate);
      setDaysCount(days);
    } else {
      setDaysCount(1);
    }
  }, [pickupDate, returnDate, tripType]);

  // Dynamic estimate of distance, tolls & parking
  const effectiveDestination = useMemo(() => {
    if (tripType === 'Local Rental') return 'Mumbai Local Sightseeing';
    if (tripType === 'Airport Transfer') return airportTerminal;
    return destination;
  }, [tripType, destination, airportTerminal]);

  const locationEstimate = useMemo(() => {
    return estimateLocationDetails(pickupLocation, effectiveDestination, tripType, pickupTime);
  }, [pickupLocation, effectiveDestination, tripType, pickupTime]);

  const [estimatedKm, setEstimatedKm] = useState(locationEstimate.estKm);
  const [tollAmount, setTollAmount] = useState(locationEstimate.estToll);
  const [parkingAmount, setParkingAmount] = useState(locationEstimate.estParking);

  useEffect(() => {
    setEstimatedKm(locationEstimate.estKm);
    setTollAmount(locationEstimate.estToll);
    setParkingAmount(locationEstimate.estParking);
  }, [locationEstimate]);

  // Check night hours (10:00 PM to 06:00 AM)
  const isNightHours = useMemo(() => {
    if (!pickupTime) return false;
    const h = parseInt(pickupTime.split(':')[0], 10);
    return !isNaN(h) && (h < 6 || h >= 22);
  }, [pickupTime]);

  const nightChargeApplied = isNightHours ? PRICING_CONFIG.ertiga.nightAllowance : 0;

  // Live Fare Computation using our verified decimal-safe engine
  const fareBreakdown = useMemo(() => {
    return calculateTripFare({
      vehicleModelId: 'ertiga',
      tripType,
      daysCount,
      estKm: estimatedKm,
      tollCharges: tollAmount,
      parkingCharges: parkingAmount,
      nightCharges: nightChargeApplied,
      localPackage,
      advancePaid: 0,
    });
  }, [tripType, daysCount, estimatedKm, tollAmount, parkingAmount, nightChargeApplied, localPackage]);

  // Validation
  const validateStep1 = () => {
    const errs = {};
    if (!pickupLocation.trim()) {
      errs.pickupLocation = 'Doorstep pickup location is required.';
    }
    if (tripType !== 'Local Rental' && !destination.trim() && tripType !== 'Airport Transfer') {
      errs.destination = 'Destination is required.';
    }
    if (!pickupDate) {
      errs.pickupDate = 'Pickup date is required.';
    }
    if (tripType === 'Round Trip') {
      if (!returnDate) {
        errs.returnDate = 'Return date is required for round trips.';
      } else if (returnDate < pickupDate) {
        errs.returnDate = 'Return date cannot be earlier than pickup date.';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!customerName.trim()) {
      errs.customerName = 'Please enter your full name.';
    }
    const cleanedMobile = mobileNumber.replace(/[^0-9]/g, '');
    const mobilePattern = /^[6-9]\d{9}$/;
    if (!cleanedMobile) {
      errs.mobileNumber = 'Mobile number is required.';
    } else if (cleanedMobile.length !== 10) {
      errs.mobileNumber = 'Please enter a 10-digit mobile number.';
    } else if (!mobilePattern.test(cleanedMobile)) {
      errs.mobileNumber = 'Please enter a valid Indian mobile number starting with 6, 7, 8, or 9.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextToStep2 = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setActiveStep(2);
    }
  };

  const handleNextToStep3 = (e) => {
    e.preventDefault();
    if (validateStep2()) {
      setActiveStep(3);
    }
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (!validateStep1() || !validateStep2()) {
      setActiveStep(1);
      return;
    }

    const currentBookings = getBookings();
    const newRefId = generateBookingId(currentBookings);

    const payload = {
      id: newRefId,
      customerName: customerName.trim(),
      customerPhone: mobileNumber.startsWith('+91') ? mobileNumber : `+91 ${mobileNumber.trim()}`,
      passengers: Number(passengers),
      route: tripType === 'Local Rental' 
        ? `Mumbai Local (${localPackage === '12h_120km' ? '12h/120km' : '8h/80km'})` 
        : (tripType === 'Airport Transfer' ? `${pickupLocation.split(',')[0]} ➔ ${airportTerminal.split(' ')[0]}` : `${pickupLocation.split(',')[0]} ➔ ${destination.split(',')[0]}`),
      tripType,
      pickupLocation: pickupLocation.trim(),
      dropLocation: tripType === 'Local Rental' ? 'Local Mumbai City' : (tripType === 'Airport Transfer' ? `${airportDirection} - ${airportTerminal} ${flightNumber ? `(Flight: ${flightNumber})` : ''}` : destination.trim()),
      pickupDate,
      pickupTime,
      returnDate: tripType === 'Round Trip' ? returnDate : null,
      daysCount: Number(daysCount),
      vehicleModelId: 'ertiga',
      ratePerKm: fareBreakdown.ratePerKm,
      estKm: fareBreakdown.billableKm,
      tollCharges: fareBreakdown.tollCharges,
      parkingCharges: fareBreakdown.parkingCharges,
      nightCharges: fareBreakdown.nightCharges,
      baseFare: fareBreakdown.baseFare,
      driverBataTotal: fareBreakdown.driverBataTotal,
      totalFare: fareBreakdown.totalFare,
      balanceDue: fareBreakdown.totalFare,
      notes: `${luggageRequirement ? `Luggage: ${luggageRequirement}. ` : ''}${additionalNotes || ''}`.trim(),
    };

    if (onSubmitBooking) {
      onSubmitBooking(payload);
    }

    setAssignedBookingRef(newRefId);
    setSubmittedSuccess(true);
  };

  const handleWhatsAppInstantSubmit = () => {
    if (!customerName.trim() || !mobileNumber.trim()) {
      setActiveStep(2);
      return;
    }

    const inquiryText = getCustomerInquiryMessage({
      pickupLocation,
      dropLocation: effectiveDestination,
      tripType,
      pickupDate,
      pickupTime,
      returnDate: tripType === 'Round Trip' ? returnDate : null,
      daysCount,
      vehicleName: 'Maruti Suzuki Ertiga (6+1 AC Luxury)',
      passengers,
      name: customerName || 'Passenger',
      phone: mobileNumber,
      breakdown: fareBreakdown,
    });

    openWhatsApp(COMPANY_INFO.whatsappNumber, inquiryText);
  };

  return (
    <div id="booking-enquiry-panel" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-slate-100 text-xs">
      
      {/* Panel Header */}
      <div className="border-b border-slate-800 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Plan Your Journey with Kadjai Travels
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">
                Exclusive Maruti Suzuki Ertiga (6+1 AC). Itemized fare estimate with transparent calculation basis.
              </p>
            </div>
          </div>
        </div>

        {/* Wizard Step Indicator */}
        <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-2xl border border-slate-800 text-[11px]">
          <span className={`px-2 py-0.5 rounded-lg font-bold ${activeStep === 1 ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}>
            1. Journey
          </span>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className={`px-2 py-0.5 rounded-lg font-bold ${activeStep === 2 ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}>
            2. Contact
          </span>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className={`px-2 py-0.5 rounded-lg font-bold ${activeStep === 3 ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}>
            3. Review & Submit
          </span>
        </div>
      </div>

      {/* Honest Success Banner */}
      {submittedSuccess && (
        <div className="bg-emerald-950/90 border border-emerald-500/50 p-6 rounded-3xl mb-6 space-y-3 animate-in fade-in duration-300">
          <div className="flex items-center gap-2.5 text-emerald-300 font-black text-base">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <span>Enquiry Received Successfully! (Ref: {assignedBookingRef})</span>
          </div>
          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
            Thank you, <strong>{customerName}</strong>! Your travel enquiry for <strong>{effectiveDestination}</strong> has been logged. 
            <span className="block mt-1 text-emerald-200">
              ⚠️ <em>Please note: This is an enquiry request, not an instant booking confirmation. Our dispatch desk will verify car and driver availability and contact you at <strong>{mobileNumber}</strong> within 15–30 minutes to confirm your ride.</em>
            </span>
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleWhatsAppInstantSubmit}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Confirm Instantly via WhatsApp Desk</span>
            </button>
            <button
              onClick={() => {
                setSubmittedSuccess(false);
                setActiveStep(1);
              }}
              className="text-emerald-400 hover:underline text-xs"
            >
              Plan Another Journey
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          STEP 1: JOURNEY DETAILS & ROUTE PARAMETERS
      ========================================================= */}
      {activeStep === 1 && (
        <div className="space-y-6">
          
          {/* Trip Type Selector */}
          <div>
            <label className="block text-slate-300 font-bold mb-2 text-xs">
              Select Trip Category:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'Round Trip', label: 'Round Trip Outstation', desc: '₹20/km • Min 300km/day' },
                { id: 'One Way', label: 'One-Way Outstation', desc: '₹20/km • Point-to-point drop' },
                { id: 'Local Rental', label: 'Local City Rental', desc: '₹2,200 for 8h/80km • ₹15/km extra' },
                { id: 'Airport Transfer', label: 'Airport Transfer', desc: 'CSMIA T1 & T2 • Flight buffer' },
              ].map(type => (
                <button
                  type="button"
                  key={type.id}
                  onClick={() => setTripType(type.id)}
                  className={`p-3.5 rounded-2xl text-left border transition flex flex-col justify-between ${
                    tripType === type.id
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-xs">{type.label}</div>
                  <div className={`text-[10px] mt-1 ${tripType === type.id ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
                    {type.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Location Inputs Contextual to Trip Type */}
          <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
            
            {/* Standard Pickup Location */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Doorstep Pickup Location in Mumbai / Thane / Navi Mumbai *</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Bandra West, Dadar, Andheri East, Thane, Vashi, Borivali..."
                value={pickupLocation}
                onChange={(e) => {
                  setPickupLocation(e.target.value);
                  if (errors.pickupLocation) setErrors({ ...errors, pickupLocation: null });
                }}
                className={`w-full bg-slate-900 border rounded-xl px-3 py-2.5 text-white focus:outline-none transition ${
                  errors.pickupLocation ? 'border-rose-500' : 'border-slate-700 focus:border-amber-400'
                }`}
              />
              {errors.pickupLocation && (
                <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.pickupLocation}</span>
                </p>
              )}
              {/* Pickup shortcut chips */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {['Bandra West', 'Dadar', 'Andheri', 'Thane West', 'Navi Mumbai', 'Borivali'].map(c => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setPickupLocation(`${c}, Mumbai`)}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition border border-slate-800"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Contextual Destination or Package */}
            {tripType === 'Local Rental' ? (
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  Select Local City Package *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: '8h_80km', label: '8 Hours / 80 KM', price: '₹2,200', desc: 'Standard City Tour' },
                    { id: '12h_120km', label: '12 Hours / 120 KM', price: '₹3,200', desc: 'Full Day Shopping & Events' },
                  ].map(pkg => (
                    <button
                      type="button"
                      key={pkg.id}
                      onClick={() => setLocalPackage(pkg.id)}
                      className={`p-3 rounded-xl border text-left transition ${
                        localPackage === pkg.id 
                          ? 'bg-amber-500/15 border-amber-400 text-white font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="font-bold text-xs text-white">{pkg.label}</div>
                      <div className="text-amber-400 font-mono font-bold text-sm mt-0.5">{pkg.price}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{pkg.desc}</div>
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 mt-2">
                  * Extra distance charged at ₹15 / KM. Extra hours charged at ₹150 / hour.
                </p>
              </div>
            ) : tripType === 'Airport Transfer' ? (
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">Transfer Direction</label>
                  <select
                    value={airportDirection}
                    onChange={(e) => setAirportDirection(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Drop to Airport">Drop to Airport from Doorstep</option>
                    <option value="Pickup from Airport">Pickup from Airport Arrival Terminal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">Airport Terminal</label>
                  <select
                    value={airportTerminal}
                    onChange={(e) => setAirportTerminal(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Terminal 2 (CSMIA International/Domestic)">Terminal 2 (T2 Sahar - International & Domestic)</option>
                    <option value="Terminal 1 (CSMIA Santacruz Domestic)">Terminal 1 (T1 Santacruz - Domestic)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-bold mb-1.5">Flight Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. AI-191, 6E-5324 (helps driver track flight landing delays)"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>Outstation Destination *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lonavala, Pune, Shirdi, Mahabaleshwar, Goa, Alibaug, Nashik..."
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    if (errors.destination) setErrors({ ...errors, destination: null });
                  }}
                  className={`w-full bg-slate-900 border rounded-xl px-3 py-2.5 text-white focus:outline-none transition ${
                    errors.destination ? 'border-rose-500' : 'border-slate-700 focus:border-amber-400'
                  }`}
                />
                {errors.destination && (
                  <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.destination}</span>
                  </p>
                )}
                {/* Destination Quick Chips */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {['Lonavala', 'Pune', 'Shirdi', 'Mahabaleshwar', 'Goa', 'Alibaug', 'Nashik'].map(d => (
                    <button
                      type="button"
                      key={d}
                      onClick={() => setDestination(d)}
                      className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-amber-500/20 hover:text-amber-400 text-slate-400 transition border border-slate-800"
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Dates & Times */}
          <div className="grid sm:grid-cols-2 gap-4 bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Pickup Date & Departure Time *</span>
              </label>
              <div className="grid grid-cols-5 gap-2">
                <input
                  type="date"
                  required
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="col-span-3 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
                <input
                  type="time"
                  required
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="col-span-2 bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-white focus:outline-none focus:border-amber-400 text-center font-mono font-bold"
                />
              </div>
              {isNightHours && (
                <p className="text-[10px] text-amber-400 mt-1.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Night travel (10 PM to 6 AM): ₹300 night allowance applies</span>
                </p>
              )}
            </div>

            {tripType === 'Round Trip' ? (
              <div>
                <label className="block text-slate-300 font-bold mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Return Date *</span>
                  </span>
                  <span className="text-amber-400 font-bold font-mono">{daysCount} Days Duty</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <input
                    type="date"
                    required
                    value={returnDate}
                    onChange={(e) => {
                      setReturnDate(e.target.value);
                      if (errors.returnDate) setErrors({ ...errors, returnDate: null });
                    }}
                    className={`col-span-3 bg-slate-900 border rounded-xl px-3 py-2 text-white focus:outline-none ${
                      errors.returnDate ? 'border-rose-500' : 'border-slate-700 focus:border-amber-400'
                    }`}
                  />
                  <div className="col-span-1 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center font-bold text-white text-xs">
                    {daysCount}d
                  </div>
                </div>
                {errors.returnDate && (
                  <p className="text-[10px] text-rose-400 mt-1">{errors.returnDate}</p>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Journey Scope</label>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-300 font-medium text-xs">
                  {tripType === 'One Way' && 'Direct One-Way Point-to-Point Transit'}
                  {tripType === 'Airport Transfer' && 'Doorstep CSMIA Airport Transfer with Luggage Assistance'}
                  {tripType === 'Local Rental' && `Mumbai In-City Coverage (${localPackage === '12h_120km' ? '12h/120km' : '8h/80km'})`}
                </div>
              </div>
            )}
          </div>

          {/* Passengers & Luggage */}
          <div className="grid sm:grid-cols-2 gap-4 bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Passenger Count (Max 6 in Ertiga)</span>
              </label>
              <select
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
              >
                <option value="1">1 Passenger</option>
                <option value="2">2 Passengers</option>
                <option value="3">3 Passengers</option>
                <option value="4">4 Passengers</option>
                <option value="5">5 Passengers</option>
                <option value="6">6 Passengers (Full Ertiga Capacity)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                <span>Luggage Requirement</span>
              </label>
              <select
                value={luggageRequirement}
                onChange={(e) => setLuggageRequirement(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Standard Luggage (Roof Carrier Needed)">Heavy Bags (Roof Luggage Carrier Needed)</option>
                <option value="Standard Boot Bags">Standard Boot Luggage Only (2-3 bags)</option>
                <option value="Light Hand Baggage Only">Light Hand Baggage</option>
              </select>
            </div>
          </div>

          {/* Live Quick Estimate Bar */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">
                Preliminary Estimate Basis:
              </span>
              <span className="text-white font-semibold">
                {tripType === 'Local Rental' 
                  ? `Mumbai Local Package (${localPackage === '12h_120km' ? '12h/120km' : '8h/80km'})` 
                  : `${fareBreakdown.billableKm} KM billable in Maruti Ertiga (6+1 AC)`}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Estimated Total</span>
                <span className="text-2xl font-black text-amber-400 font-mono">
                  ₹{fareBreakdown.totalFare.toLocaleString('en-IN')}
                </span>
              </div>

              <button
                type="button"
                onClick={handleNextToStep2}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* =========================================================
          STEP 2: CUSTOMER CONTACT DETAILS
      ========================================================= */}
      {activeStep === 2 && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-amber-400" />
              <span>Contact Information for Pickup Coordination</span>
            </h4>
            <p className="text-slate-400 text-xs">
              We collect your name and mobile number strictly to assign verified drivers and communicate trip progress.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patil"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (errors.customerName) setErrors({ ...errors, customerName: null });
                  }}
                  className={`w-full bg-slate-900 border rounded-xl px-3 py-2.5 text-white focus:outline-none transition ${
                    errors.customerName ? 'border-rose-500' : 'border-slate-700 focus:border-amber-400'
                  }`}
                />
                {errors.customerName && (
                  <p className="text-[10px] text-rose-400 mt-1">{errors.customerName}</p>
                )}
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Indian Mobile / WhatsApp Number *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500 font-bold text-xs">+91</span>
                  <input
                    type="tel"
                    required
                    maxLength="10"
                    placeholder="98XXXXXXXX"
                    value={mobileNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setMobileNumber(val);
                      if (errors.mobileNumber) setErrors({ ...errors, mobileNumber: null });
                    }}
                    className={`w-full bg-slate-900 border rounded-xl pl-12 pr-3 py-2.5 text-white focus:outline-none font-mono font-bold transition ${
                      errors.mobileNumber ? 'border-rose-500' : 'border-slate-700 focus:border-amber-400'
                    }`}
                  />
                </div>
                {errors.mobileNumber && (
                  <p className="text-[10px] text-rose-400 mt-1">{errors.mobileNumber}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5">Special Travel Requests (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Senior citizen onboard, infant seat, preferred expressway stop..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className="text-slate-400 hover:text-white text-xs font-bold px-3 py-2 rounded-xl"
            >
              ← Back to Journey
            </button>

            <button
              type="button"
              onClick={handleNextToStep3}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <span>Review Estimate & Submit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          STEP 3: REVIEW & HONEST FARE BREAKDOWN
      ========================================================= */}
      {activeStep === 3 && (
        <div className="space-y-6">
          
          {/* Itemized Calculation Card */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-amber-500/50 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-extrabold text-amber-400 uppercase tracking-wider text-xs flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4" />
                  <span>Itemized Fare Calculation</span>
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Route: <strong className="text-white">{pickupLocation.split(',')[0]} ➔ {effectiveDestination.split(',')[0]}</strong>
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                {tripType}
              </span>
            </div>

            {/* Bill Lines */}
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">
                  🚗 Vehicle Base Fare ({fareBreakdown.billableKm} KM @ ₹{fareBreakdown.ratePerKm}/km):
                </span>
                <span className="font-mono font-bold text-white">
                  ₹{fareBreakdown.baseFare.toLocaleString('en-IN')}
                </span>
              </div>

              {fareBreakdown.driverBataTotal > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">
                    👨‍✈️ Driver Daily Allowance ({daysCount} day{daysCount > 1 ? 's' : ''} @ ₹{PRICING_CONFIG.ertiga.outstationDriverBataPerDay}/day):
                  </span>
                  <span className="font-mono font-bold text-white">
                    ₹{fareBreakdown.driverBataTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              {fareBreakdown.tollCharges > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">
                    🛣️ Highway Fastag Toll Charges (Mandatory for Route):
                  </span>
                  <span className="font-mono font-bold text-white">
                    ₹{fareBreakdown.tollCharges.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              {fareBreakdown.parkingCharges > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">
                    🅿️ Parking / State Entry Taxes (Estimated for Destination):
                  </span>
                  <span className="font-mono font-bold text-white">
                    ₹{fareBreakdown.parkingCharges.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              {fareBreakdown.nightCharges > 0 && (
                <div className="flex items-center justify-between text-amber-300">
                  <span>
                    🌙 Night Driving Allowance (10:00 PM – 06:00 AM):
                  </span>
                  <span className="font-mono font-bold">
                    ₹{fareBreakdown.nightCharges.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>

            {/* Total Fare Line */}
            <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-extrabold text-slate-200 block">
                  Total Estimated Fare:
                </span>
                <span className="text-[10px] text-slate-400">
                  Zero surge pricing • Transparent quotation basis
                </span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-amber-400 font-mono">
                  ₹{fareBreakdown.totalFare.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Transparent Disclaimer */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Quotation Notice:</strong> This is a calculated estimate based on standard tariff parameters. The final quotation and vehicle booking are subject to operational confirmation by Kadjai Travels.
              </span>
            </div>
          </div>

          {/* Action Submission Buttons */}
          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3.5 px-6 rounded-2xl shadow-xl shadow-amber-500/20 text-xs sm:text-sm transition flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Booking Enquiry (₹{fareBreakdown.totalFare.toLocaleString('en-IN')})</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsAppInstantSubmit}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg text-xs sm:text-sm transition flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Enquire Instantly on WhatsApp</span>
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className="text-slate-400 hover:text-white text-xs underline"
            >
              ← Edit Contact or Trip Details
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
