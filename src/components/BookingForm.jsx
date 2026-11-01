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
  Info,
  Locate,
  Navigation,
  Loader2,
  Sparkles
} from 'lucide-react';
import { COMPANY_INFO } from '../data/travelData';
import { 
  calculateTripFare, 
  estimateLocationDetails, 
  calculateDaysBetween,
  PRICING_CONFIG,
  generateBookingId,
  getBookings,
  findHubCoordinates,
  KNOWN_HUBS,
  calculateHaversineDistance,
  detectTripCategory,
  geocodeLocation,
  searchLocationSuggestions
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
  
  // Uber-Style Live GPS States
  const [pickupCoords, setPickupCoords] = useState(null); // { lat, lon }
  const [destinationCoords, setDestinationCoords] = useState(null); // { lat, lon }
  const [isLocatingPickup, setIsLocatingPickup] = useState(false);
  const [isLocatingDest, setIsLocatingDest] = useState(false);
  const [gpsSuccessMessage, setGpsSuccessMessage] = useState(null);
  const [gpsError, setGpsError] = useState(null);

  // Live Dynamic Geocoding & Suggestions for ANY Location
  const [isGeocodingPickup, setIsGeocodingPickup] = useState(false);
  const [isGeocodingDest, setIsGeocodingDest] = useState(false);
  const [pickupVerifiedName, setPickupVerifiedName] = useState('Bandra West, Mumbai');
  const [destVerifiedName, setDestVerifiedName] = useState(defaultDestination || 'Lonavala & Khandala');
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  // Uber-Style Geolocation Trigger
  const handleDetectGps = (type = 'pickup') => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser. Please type your location.');
      return;
    }

    if (type === 'pickup') setIsLocatingPickup(true);
    else setIsLocatingDest(true);

    setGpsError(null);
    setGpsSuccessMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        let placeTitle = '';

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
            const suburb = addr.suburb || addr.neighbourhood || addr.residential || addr.road || addr.village || addr.subdistrict;
            const city = addr.city || addr.town || addr.county || addr.state_district || 'Mumbai';
            if (suburb) {
              placeTitle = `${suburb}, ${city}`;
            } else if (data.display_name) {
              placeTitle = data.display_name.split(',').slice(0, 2).join(',').trim();
            }
          }
        } catch {
          // Fallback handled below
        }

        if (!placeTitle) {
          let closest = null;
          let minD = Infinity;
          for (const hub of KNOWN_HUBS) {
            const d = calculateHaversineDistance(latitude, longitude, hub.lat, hub.lon);
            if (d < minD) {
              minD = d;
              closest = hub;
            }
          }
          if (closest && minD < 15) {
            placeTitle = `${closest.name} (GPS Verified)`;
          } else {
            placeTitle = `GPS Location (${latitude.toFixed(3)}°N, ${longitude.toFixed(3)}°E)`;
          }
        }

        if (type === 'pickup') {
          setPickupLocation(placeTitle);
          setPickupCoords({ lat: latitude, lon: longitude });
          setIsLocatingPickup(false);
          setGpsSuccessMessage(`📍 Live GPS Pickup Locked: ${placeTitle}`);
          setErrors(prev => ({ ...prev, pickupLocation: null }));
        } else {
          setDestination(placeTitle);
          setDestinationCoords({ lat: latitude, lon: longitude });
          setIsLocatingDest(false);
          setGpsSuccessMessage(`🏁 Live GPS Destination Locked: ${placeTitle}`);
          setErrors(prev => ({ ...prev, destination: null }));
        }
      },
      (err) => {
        if (type === 'pickup') setIsLocatingPickup(false);
        else setIsLocatingDest(false);

        if (err.code === 1) {
          setGpsError('Location access was denied. Please allow location permissions in your browser or type your location.');
        } else {
          setGpsError('Could not acquire GPS satellite position. Please enter your location manually.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };
  
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
      const hub = findHubCoordinates(defaultDestination);
      if (hub) {
        setDestinationCoords({ lat: hub.lat, lon: hub.lon });
        setDestVerifiedName(hub.name);
      }
      if (tripType === 'Local Rental' || tripType === 'Airport Transfer') {
        setTripType('Round Trip');
      }
    }
  }, [defaultDestination]);

  // Dynamic Forward Geocoding for ANY Pickup Location in India
  useEffect(() => {
    if (!pickupLocation || pickupLocation.trim().length < 2) {
      setPickupCoords(null);
      setPickupVerifiedName('');
      setPickupSuggestions([]);
      return;
    }

    const matches = searchLocationSuggestions(pickupLocation, 5);
    setPickupSuggestions(matches);

    const directHub = findHubCoordinates(pickupLocation);
    if (directHub) {
      setPickupCoords({ lat: directHub.lat, lon: directHub.lon });
      setPickupVerifiedName(directHub.name);
      return;
    }

    const timer = setTimeout(async () => {
      setIsGeocodingPickup(true);
      const res = await geocodeLocation(pickupLocation);
      if (res) {
        setPickupCoords({ lat: res.lat, lon: res.lon });
        setPickupVerifiedName(res.name);
      }
      setIsGeocodingPickup(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [pickupLocation]);

  // Dynamic Forward Geocoding for ANY Destination in Maharashtra / India
  useEffect(() => {
    if (!destination || destination.trim().length < 2) {
      setDestinationCoords(null);
      setDestVerifiedName('');
      setDestSuggestions([]);
      return;
    }

    const matches = searchLocationSuggestions(destination, 5);
    setDestSuggestions(matches);

    const directHub = findHubCoordinates(destination);
    if (directHub) {
      setDestinationCoords({ lat: directHub.lat, lon: directHub.lon });
      setDestVerifiedName(directHub.name);
      return;
    }

    const timer = setTimeout(async () => {
      setIsGeocodingDest(true);
      const res = await geocodeLocation(destination);
      if (res) {
        setDestinationCoords({ lat: res.lat, lon: res.lon });
        setDestVerifiedName(res.name);
      }
      setIsGeocodingDest(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [destination]);

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

  const effectivePickupCoords = useMemo(() => {
    if (pickupCoords) return pickupCoords;
    const hub = findHubCoordinates(pickupLocation);
    if (hub) return { lat: hub.lat, lon: hub.lon };
    return { lat: 19.0760, lon: 72.8777 }; // Baseline: Mumbai center
  }, [pickupCoords, pickupLocation]);

  const effectiveDestCoords = useMemo(() => {
    if (tripType === 'Local Rental') return { lat: 19.0760, lon: 72.8777 };
    if (tripType === 'Airport Transfer') {
      const airportHub = findHubCoordinates(airportTerminal) || findHubCoordinates('csmia');
      return airportHub ? { lat: airportHub.lat, lon: airportHub.lon } : null;
    }
    if (destinationCoords) return destinationCoords;
    const hub = findHubCoordinates(effectiveDestination);
    return hub ? { lat: hub.lat, lon: hub.lon } : null;
  }, [tripType, airportTerminal, destinationCoords, effectiveDestination]);

  const locationEstimate = useMemo(() => {
    const coords = (effectivePickupCoords && effectiveDestCoords) ? {
      pickupLat: effectivePickupCoords.lat,
      pickupLon: effectivePickupCoords.lon,
      destLat: effectiveDestCoords.lat,
      destLon: effectiveDestCoords.lon,
    } : null;

    return estimateLocationDetails(pickupLocation, effectiveDestination, tripType, pickupTime, coords);
  }, [pickupLocation, effectiveDestination, tripType, pickupTime, effectivePickupCoords, effectiveDestCoords]);

  const [estimatedKm, setEstimatedKm] = useState(locationEstimate.estKm);
  const [tollAmount, setTollAmount] = useState(locationEstimate.estToll);
  const [parkingAmount, setParkingAmount] = useState(locationEstimate.estParking);

  useEffect(() => {
    setEstimatedKm(locationEstimate.estKm);
    setTollAmount(locationEstimate.estToll);
    setParkingAmount(locationEstimate.estParking);
  }, [locationEstimate]);

  // Smart Category Detection based on Locations & Distance
  const detectedCategory = useMemo(() => {
    return detectTripCategory(pickupLocation, destination, locationEstimate.estKm);
  }, [pickupLocation, destination, locationEstimate.estKm]);

  // Align tripType whenever the detected category shifts between Outstation / Local / Airport
  useEffect(() => {
    if (detectedCategory.category === 'Airport Transfer') {
      if (tripType !== 'Airport Transfer') setTripType('Airport Transfer');
    } else if (detectedCategory.category === 'Local Rental') {
      if (tripType !== 'Local Rental') setTripType('Local Rental');
    } else if (detectedCategory.category === 'Outstation') {
      if (tripType === 'Local Rental' || tripType === 'Airport Transfer') {
        setTripType('Round Trip');
      }
    }
  }, [detectedCategory.category]);

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
    if (!destination.trim()) {
      errs.destination = 'Destination or drop area is required.';
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
          
          {/* 1. LOCATION & DESTINATION INPUTS FIRST */}
          <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
            
            {/* Standard Pickup Location */}
            <div className="relative">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-300 font-bold flex items-center gap-1.5 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Doorstep Pickup Location in Mumbai / MMR *</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleDetectGps('pickup')}
                  disabled={isLocatingPickup}
                  className="text-[10px] px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition flex items-center gap-1.5 font-medium cursor-pointer"
                  title="Detect live GPS location like Uber"
                >
                  {isLocatingPickup ? (
                    <Loader2 className="w-3 h-3 animate-spin text-emerald-400" />
                  ) : (
                    <Navigation className="w-3 h-3 text-emerald-400" />
                  )}
                  <span>{isLocatingPickup ? 'Locating GPS...' : 'Use Current GPS'}</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Bandra West, Dadar, Andheri East, Thane, Vashi, Borivali..."
                  value={pickupLocation}
                  onFocus={() => setShowPickupDropdown(true)}
                  onBlur={() => setTimeout(() => setShowPickupDropdown(false), 250)}
                  onChange={(e) => {
                    setPickupLocation(e.target.value);
                    setPickupCoords(null);
                    setShowPickupDropdown(true);
                    if (errors.pickupLocation) setErrors({ ...errors, pickupLocation: null });
                  }}
                  className={`w-full bg-slate-900 border rounded-xl pl-3 pr-10 py-2.5 text-white focus:outline-none transition ${
                    errors.pickupLocation ? 'border-rose-500' : 'border-slate-700 focus:border-amber-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => handleDetectGps('pickup')}
                  disabled={isLocatingPickup}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 transition"
                  title="Detect GPS location"
                >
                  <Locate className={`w-4 h-4 ${pickupCoords ? 'text-emerald-400' : ''}`} />
                </button>
              </div>

              {/* Pickup Suggestions Dropdown */}
              {showPickupDropdown && pickupSuggestions.length > 0 && (
                <div className="absolute z-30 left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden max-h-52 overflow-y-auto">
                  {pickupSuggestions.map(s => (
                    <button
                      key={s.name}
                      type="button"
                      onMouseDown={() => {
                        setPickupLocation(s.name);
                        setPickupCoords({ lat: s.lat, lon: s.lon });
                        setPickupVerifiedName(s.name);
                        setShowPickupDropdown(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-800 text-slate-200 flex items-center justify-between border-b border-slate-800/60 last:border-0 transition"
                    >
                      <span className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{s.name}</span>
                      </span>
                      <span className="text-[10px] text-emerald-400/80 font-mono">Verified Hub</span>
                    </button>
                  ))}
                </div>
              )}

              {isGeocodingPickup && (
                <div className="mt-1 text-[11px] text-amber-400 flex items-center gap-1.5">
                  <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
                  <span>Verifying pickup address coordinates...</span>
                </div>
              )}

              {pickupCoords && (
                <div className="mt-1.5 text-[11px] text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span>📍 Pickup Verified: {pickupVerifiedName || pickupLocation} ({pickupCoords.lat.toFixed(3)}°N, {pickupCoords.lon.toFixed(3)}°E)</span>
                </div>
              )}

              {gpsError && (
                <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{gpsError}</span>
                </p>
              )}

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
                    onClick={() => {
                      const place = `${c}, Mumbai`;
                      setPickupLocation(place);
                      const hub = findHubCoordinates(place);
                      if (hub) {
                        setPickupCoords({ lat: hub.lat, lon: hub.lon });
                        setPickupVerifiedName(hub.name);
                      } else {
                        setPickupCoords(null);
                      }
                    }}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition border border-slate-800"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Destination / Drop Location */}
            <div className="relative">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-300 font-bold flex items-center gap-1.5 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>Destination / Drop Location (Any Town, City, or Landmark) *</span>
                </label>
                {effectiveDestCoords && (
                  <span className="text-[10px] text-amber-400 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>GPS Target Auto-Linked</span>
                  </span>
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Pune, Lonavala, Shirdi, CSMIA Airport, Mahabaleshwar, Ratnagiri, Kolhapur, Surat, Goa..."
                  value={destination}
                  onFocus={() => setShowDestDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDestDropdown(false), 250)}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    setDestinationCoords(null);
                    setShowDestDropdown(true);
                    if (errors.destination) setErrors({ ...errors, destination: null });
                  }}
                  className={`w-full bg-slate-900 border rounded-xl pl-3 pr-10 py-2.5 text-white focus:outline-none transition ${
                    errors.destination ? 'border-rose-500' : 'border-slate-700 focus:border-amber-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => handleDetectGps('destination')}
                  disabled={isLocatingDest}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-amber-400 transition"
                  title="Detect destination with GPS"
                >
                  <Locate className={`w-4 h-4 ${destinationCoords ? 'text-amber-400' : ''}`} />
                </button>
              </div>

              {/* Destination Suggestions Dropdown */}
              {showDestDropdown && destSuggestions.length > 0 && (
                <div className="absolute z-30 left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden max-h-52 overflow-y-auto">
                  {destSuggestions.map(s => (
                    <button
                      key={s.name}
                      type="button"
                      onMouseDown={() => {
                        setDestination(s.name);
                        setDestinationCoords({ lat: s.lat, lon: s.lon });
                        setDestVerifiedName(s.name);
                        setShowDestDropdown(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-800 text-slate-200 flex items-center justify-between border-b border-slate-800/60 last:border-0 transition"
                    >
                      <span className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>{s.name}</span>
                      </span>
                      <span className="text-[10px] text-amber-400/80 font-mono">Select Route</span>
                    </button>
                  ))}
                </div>
              )}

              {isGeocodingDest && (
                <div className="mt-1 text-[11px] text-amber-400 flex items-center gap-1.5">
                  <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
                  <span>Calculating driving route & distance for "{destination}"...</span>
                </div>
              )}

              {destinationCoords && (
                <div className="mt-1.5 text-[11px] text-amber-400 flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
                  <span>🏁 Destination Locked: {destVerifiedName || destination} • ~{locationEstimate.estKm} KM driving route</span>
                </div>
              )}

              {errors.destination && (
                <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.destination}</span>
                </p>
              )}

              {/* Destination Quick Chips */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {['Lonavala', 'Pune', 'Shirdi', 'CSMIA Airport T2', 'Mahabaleshwar', 'Ratnagiri', 'Kolhapur', 'Surat', 'Goa', 'Alibaug', 'Nashik'].map(d => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => {
                      setDestination(d);
                      const hub = findHubCoordinates(d);
                      if (hub) {
                        setDestinationCoords({ lat: hub.lat, lon: hub.lon });
                        setDestVerifiedName(hub.name);
                      } else {
                        setDestinationCoords(null);
                      }
                    }}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-amber-500/20 hover:text-amber-400 text-slate-400 transition border border-slate-800"
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* 2. SMART AUTO-DETECTED CATEGORY & AMOUNT VERIFICATION CARD */}
          <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-amber-500/40 space-y-4 shadow-xl">
            
            {/* Header: Verified Category & Distance */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-amber-400 uppercase font-black tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto-Detected Category & Verification</span>
                </span>
                <div className="text-sm sm:text-base font-extrabold text-white mt-0.5 flex flex-wrap items-center gap-2">
                  <span>{detectedCategory.label}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    {detectedCategory.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {detectedCategory.explanation}
                </p>
              </div>

              <div className="text-left sm:text-right sm:border-l sm:border-slate-800 sm:pl-4 shrink-0">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Estimated Route Distance</span>
                <span className="text-lg font-black text-white font-mono flex items-center sm:justify-end gap-1">
                  <Navigation className="w-4 h-4 text-emerald-400" />
                  <span>~{locationEstimate.estKm} KM</span>
                </span>
                {locationEstimate.isGpsCalculated && (
                  <span className="text-[9px] text-emerald-400 font-medium block">
                    Live GPS Verified
                  </span>
                )}
              </div>
            </div>

            {/* Contextual Options Based on Category */}
            {detectedCategory.category === 'Outstation' ? (
              <div className="space-y-2">
                <label className="block text-slate-300 font-bold text-xs">
                  Select Outstation Journey Type:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setTripType('Round Trip');
                    }}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      tripType === 'Round Trip'
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-xs">Round Trip Outstation</div>
                    <div className={`text-[10px] mt-0.5 ${tripType === 'Round Trip' ? 'text-slate-900' : 'text-slate-500'}`}>
                      ₹25/km • Min 300km/day quota
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTripType('One Way');
                    }}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      tripType === 'One Way'
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-xs">One-Way Drop</div>
                    <div className={`text-[10px] mt-0.5 ${tripType === 'One Way' ? 'text-slate-900' : 'text-slate-500'}`}>
                      ₹25/km • Point-to-point drop
                    </div>
                  </button>
                </div>
              </div>
            ) : detectedCategory.category === 'Local Rental' ? (
              <div className="space-y-2">
                <label className="block text-slate-300 font-bold text-xs">
                  Select In-City Local Package:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
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
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1 text-xs">Transfer Direction</label>
                  <select
                    value={airportDirection}
                    onChange={(e) => setAirportDirection(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="Drop to Airport">Drop to Airport from Doorstep</option>
                    <option value="Pickup from Airport">Pickup from Airport Arrival Terminal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1 text-xs">Airport Terminal</label>
                  <select
                    value={airportTerminal}
                    onChange={(e) => setAirportTerminal(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="Terminal 2 (CSMIA International/Domestic)">Terminal 2 (T2 Sahar - International & Domestic)</option>
                    <option value="Terminal 1 (CSMIA Santacruz Domestic)">Terminal 1 (T1 Santacruz - Domestic)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Verified Amount Box with Itemized Verification Summary */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                    Verified Total Amount ({detectedCategory.category})
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-amber-400 font-mono">
                      ₹{fareBreakdown.totalFare.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      ({tripType === 'Local Rental' 
                        ? 'Local Package Base' 
                        : `${fareBreakdown.billableKm} KM billable @ ₹${fareBreakdown.ratePerKm}/km`})
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Pricing Policy: {detectedCategory.rateSummary}
                  </p>
                </div>

                {/* Manual Category Override */}
                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <span className="text-[10px] text-slate-500">Change:</span>
                  <select
                    value={tripType}
                    onChange={(e) => {
                      setTripType(e.target.value);
                    }}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-amber-400 font-bold focus:outline-none"
                  >
                    <option value="Round Trip">Round Trip Outstation</option>
                    <option value="One Way">One-Way Outstation</option>
                    <option value="Local Rental">Local City Rental</option>
                    <option value="Airport Transfer">Airport Transfer</option>
                  </select>
                </div>
              </div>

              {/* Itemized 4-Box Verification Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Vehicle Base Fare</span>
                  <span className="text-white font-mono font-bold text-xs">₹{fareBreakdown.baseFare.toLocaleString('en-IN')}</span>
                </div>
                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Driver Charge</span>
                  <span className="text-white font-mono font-bold text-xs">₹{fareBreakdown.driverBataTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Highway Tolls</span>
                  <span className="text-white font-mono font-bold text-xs">₹{fareBreakdown.tollCharges.toLocaleString('en-IN')}</span>
                </div>
                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Parking / Entry</span>
                  <span className="text-white font-mono font-bold text-xs">₹{fareBreakdown.parkingCharges.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

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
                  : `${fareBreakdown.billableKm} KM billable in Maruti Ertiga (6+1 AC)${locationEstimate.isGpsCalculated ? ' • Live GPS' : ''}`}
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

            {locationEstimate.isGpsCalculated && (
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl px-3 py-2 text-[11px] text-emerald-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium">
                  <Navigation className="w-3.5 h-3.5 shrink-0" />
                  <span>Uber-Style GPS Verified Route Distance:</span>
                </span>
                <span className="font-mono font-bold text-white">~{estimatedKm} KM</span>
              </div>
            )}

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
                    👨‍✈️ Driver Charge ({daysCount} day{daysCount > 1 ? 's' : ''} @ ₹{PRICING_CONFIG.ertiga.outstationDriverBataPerDay}/day):
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
