import React from 'react';
import { 
  Car, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  Users, 
  Compass, 
  Plane, 
  DollarSign, 
  Sparkles, 
  MessageSquare,
  Check,
  ChevronRight
} from 'lucide-react';
import BookingForm from '../components/BookingForm';
import { COMPANY_INFO, SERVICES_LIST, DESTINATIONS_LIST, VEHICLE_DETAILS } from '../data/travelData';

export default function HomePage({ 
  onNavigate, 
  onSelectDestinationForBooking, 
  onSubmitBooking, 
  onOpenTrackBooking,
  defaultDestination = ''
}) {
  const scrollToBooking = () => {
    const el = document.getElementById('booking-enquiry-panel');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleDestinationClick = (destName) => {
    if (onSelectDestinationForBooking) {
      onSelectDestinationForBooking(destName);
    }
    scrollToBooking();
  };

  return (
    <div className="space-y-16 sm:space-y-24 text-slate-100">

      {/* =========================================================
          1. HERO SECTION
          Exact Copy requested in Prompt:
          - Heading: “Every Journey Deserves a Better Ride.”
          - Supporting copy: “Discover comfortable, thoughtfully planned journeys with Kadjai Travels — from city transfers to outstation adventures.”
          - Primary CTA: “Plan Your Journey”
          - Secondary CTA: “Explore Our Services”
      ========================================================= */}
      <section className="relative min-h-[620px] lg:min-h-[720px] flex items-center justify-center overflow-hidden">
        {/* Scenic Highway & Tourist Car Photography */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=2000&q=85"
            alt="Kadjai Travels Tourist Highway Road through Western Ghats"
            className="w-full h-full object-cover object-center filter brightness-[0.65] contrast-[1.08] scale-105"
          />
          {/* Subtle Multi-Layer Dark Gradient for Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28 w-full">
          <div className="max-w-3xl space-y-6">
            
            {/* Brand Credibility Tag */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-xl">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Mumbai Tourist Car Services
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-xs text-amber-400 font-mono font-bold hidden sm:inline">
                Maruti Suzuki Ertiga (6+1 AC Luxury)
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
              Every Journey <br />
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                Deserves a Better Ride.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl">
              Discover comfortable, thoughtfully planned journeys with Kadjai Travels — from city transfers to outstation adventures.
            </p>

            {/* Verified Fare Transparency Pill */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/85 border border-slate-800 text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Intercity Outstation: <strong className="text-white font-mono">₹20 / KM</strong></span>
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/85 border border-slate-800 text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Mumbai Local: <strong className="text-white font-mono">₹15 / KM</strong></span>
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/85 border border-slate-800 text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Driver Bata: <strong className="text-white font-mono">₹400 / Day</strong></span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3">
              <button
                onClick={scrollToBooking}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-7 py-4 rounded-2xl shadow-xl shadow-amber-500/25 text-sm sm:text-base transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
              >
                <span>Plan Your Journey</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('verified-services');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else onNavigate('services');
                }}
                className="bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white font-bold px-7 py-4 rounded-2xl shadow-lg backdrop-blur-sm text-sm sm:text-base transition flex items-center justify-center gap-2.5"
              >
                <Compass className="w-4 h-4 text-amber-400" />
                <span>Explore Our Services</span>
              </button>
            </div>

            {/* Core Commitments Bar */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Punctual Doorstep Pickup</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Sanitized Dual AC Ertiga</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Mandatory Itemized Bills</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          2. EMBEDDED REBUILT FARE CALCULATOR & BOOKING FLOW
      ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <BookingForm 
          onSubmitBooking={onSubmitBooking} 
          defaultDestination={defaultDestination}
        />
      </section>

      {/* =========================================================
          3. VERIFIED SERVICES SECTION (EDITORIAL LAYOUT)
      ========================================================= */}
      <section id="verified-services" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-amber-400 font-extrabold uppercase tracking-wider text-xs flex items-center gap-1.5 mb-1.5">
              <Compass className="w-4 h-4" />
              <span>Tailored Tourist Services</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Chauffeur-Driven Tourist Vehicle Services
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
              Every trip is operated with verified commercial highway drivers in our clean Maruti Suzuki Ertiga (6+1 AC).
            </p>
          </div>

          <button
            onClick={() => onNavigate('services')}
            className="text-amber-400 hover:text-amber-300 font-bold text-xs flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Explore All Services & Rates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES_LIST.map((srv) => (
            <div
              key={srv.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition flex flex-col justify-between group shadow-xl"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                  <Car className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                    {srv.shortDesc}
                  </p>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80 space-y-1 text-[11px]">
                  <span className="text-slate-500 font-semibold uppercase tracking-wider block text-[10px]">
                    Pricing Basis:
                  </span>
                  <span className="text-amber-400 font-mono font-bold">
                    {srv.rateInfo}
                  </span>
                </div>

                <ul className="space-y-1.5 text-xs text-slate-300">
                  {srv.inclusions.slice(0, 2).map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-slate-800/80 mt-6 flex items-center justify-between">
                <button
                  onClick={() => {
                    onNavigate('services');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs text-slate-400 hover:text-white transition font-medium"
                >
                  View Details
                </button>

                <button
                  onClick={scrollToBooking}
                  className="bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs transition"
                >
                  Enquire Ride
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          4. TRAVEL INSPIRATION (AUTHENTIC MAHARASHTRA DESTINATIONS)
      ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-amber-400 font-extrabold uppercase tracking-wider text-xs flex items-center gap-1.5 mb-1.5">
              <MapPin className="w-4 h-4" />
              <span>Travel Inspiration & Verified Routes</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Popular Outstation Journeys from Mumbai
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
              Distances, expressway drive times, and highway Fastag toll estimates for top tourist destinations across Maharashtra and Goa.
            </p>
          </div>

          <button
            onClick={() => onNavigate('destinations')}
            className="text-amber-400 hover:text-amber-300 font-bold text-xs flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DESTINATIONS_LIST.slice(0, 6).map((dest) => (
            <div
              key={dest.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-700 transition flex flex-col justify-between group shadow-xl"
            >
              {/* Destination Image */}
              <div className="relative h-48 overflow-hidden bg-slate-950">
                <img
                  src={dest.imageUrl}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-2.5 py-1 rounded-xl text-[10px] font-bold text-amber-400 font-mono">
                  {dest.tollEst}
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-lg font-black text-white">
                    {dest.name}
                  </h3>
                  <p className="text-slate-300 text-[11px]">
                    {dest.region}
                  </p>
                </div>
              </div>

              {/* Destination Verified Details */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Highway Transit:</span>
                    <span className="font-semibold text-white">{dest.approxDriveTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Distance:</span>
                    <span className="font-semibold text-white">{dest.distanceFromMumbai}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Recommended Duration:</span>
                    <span className="font-semibold text-white">{dest.typicalDuration}</span>
                  </div>

                  <p className="text-slate-400 text-xs leading-relaxed pt-1 line-clamp-2">
                    {dest.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={() => onNavigate('destinations')}
                    className="text-xs text-slate-400 hover:text-white transition font-medium"
                  >
                    Route Guide
                  </button>

                  <button
                    onClick={() => handleDestinationClick(dest.name.split(' ')[0])}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-xs transition"
                  >
                    Plan This Trip
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          5. EXCLUSIVE VEHICLE SPOTLIGHT: MARUTI SUZUKI ERTIGA (6+1 AC)
      ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Car className="w-3.5 h-3.5" />
                <span>Primary Dedicated Tourist Vehicle</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Maruti Suzuki Ertiga <br />
                <span className="text-amber-400 text-2xl sm:text-3xl font-bold">
                  6+1 Passenger AC Luxury Tourer
                </span>
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                We operate clean, modern Maruti Suzuki Ertiga vehicles. Specifically chosen for Indian highway journeys due to its whisper-quiet ride, comfortable legroom across all three rows, powerful roof-mounted dual air conditioning, and top-mounted luggage rack.
              </p>

              {/* Verified Pricing Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">Outstation Tariff</span>
                  <span className="text-lg font-black text-amber-400 font-mono">₹20 / KM</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Min 300 KM / Day</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">Mumbai Local City</span>
                  <span className="text-lg font-black text-amber-400 font-mono">₹15 / KM</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Base 8h/80km: ₹2,200</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">Driver Allowance</span>
                  <span className="text-lg font-black text-white font-mono">₹400 / Day</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Driver Bata included</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={scrollToBooking}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-3 rounded-2xl text-xs sm:text-sm transition shadow-lg shadow-amber-500/20"
                >
                  Book This Ertiga
                </button>

                <button
                  onClick={() => onNavigate('vehicles')}
                  className="text-xs text-slate-300 hover:text-white underline font-semibold"
                >
                  View Full Specifications
                </button>
              </div>
            </div>

            {/* Vehicle Card / Image Spotlight */}
            <div className="lg:w-1/2 space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group">
                <img
                  src={VEHICLE_DETAILS.imageUrl}
                  alt="Maruti Suzuki Ertiga 6+1 AC Tourist Vehicle by Kadjai Travels"
                  className="w-full h-72 sm:h-80 object-cover object-center transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                <div className="absolute top-3 left-4 bg-slate-900/90 border border-slate-700/80 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-amber-400">
                  Maruti Suzuki Ertiga (6+1 AC)
                </div>
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
                  <span className="bg-slate-900/90 text-white font-bold px-3 py-1 rounded-xl backdrop-blur-md">
                    6 Passengers + 1 Driver
                  </span>
                  <span className="bg-emerald-600/90 text-white font-bold px-3 py-1 rounded-xl backdrop-blur-md">
                    Dual AC Verified
                  </span>
                </div>
              </div>

              {/* Verified Features Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {VEHICLE_DETAILS.features.slice(0, 4).map((f, i) => (
                  <div key={i} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-[11px]">{f}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          6. WHY CHOOSE KADJAI TRAVELS (AUTHENTIC SERVICE VALUES)
      ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-amber-400 font-extrabold uppercase tracking-wider text-xs flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Service Commitments</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Why Travelers Choose Kadjai Travels
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            We focus on genuine reliability and transparent operations rather than exaggerated promises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Clear Communication',
              desc: 'From initial enquiry to driver arrival, you receive explicit trip confirmations, driver details, and transparent WhatsApp updates.',
              icon: MessageSquare,
            },
            {
              title: 'Planned Pickup Arrangements',
              desc: 'Punctual arrivals scheduled with buffer times for airport terminals and early-morning outstation departures.',
              icon: Clock,
            },
            {
              title: 'Transparent Fare Discussions',
              desc: 'No hidden surge pricing. Outstation fares are strictly ₹20/km with ₹400 driver bata and mandatory Fastag tolls itemized clearly.',
              icon: DollarSign,
            },
            {
              title: 'Customer-Focused Travel Coordination',
              desc: 'Flexible rest stop timings, patient meal breaks, and customized schedules designed around senior citizens and children.',
              icon: Users,
            },
            {
              title: 'Vehicle Cleanliness & Comfort',
              desc: 'Every Ertiga is sanitized, vacuumed, and equipped with chilled dual air conditioning and phone charging before departure.',
              icon: Sparkles,
            },
            {
              title: 'Verified Commercial Drivers',
              desc: 'Experienced highway drivers with proven records on Mumbai-Pune Expressway, Samruddhi Mahamarg, and Western Ghats routes.',
              icon: ShieldCheck,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 hover:border-slate-700 transition shadow-lg"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          7. HOW BOOKING WORKS (4-STEP WORKFLOW)
      ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-amber-400 font-extrabold uppercase tracking-wider text-xs">
              Simple 4-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              How Booking Works
            </h2>
            <p className="text-slate-400 text-xs">
              Simple, verified, and reliable booking from start to finish.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {[
              {
                step: '01',
                title: 'Share Trip Details',
                desc: 'Enter your doorstep pickup location, destination, dates, and number of passengers using our booking form.',
              },
              {
                step: '02',
                title: 'Discuss Route & Fare',
                desc: 'Review the calculated fare (₹20/km outstation, ₹15/km local, plus mandatory Fastag tolls and driver bata).',
              },
              {
                step: '03',
                title: 'Confirm with Operator',
                desc: 'Our dispatch desk verifies vehicle and driver allocation and provides your booking reference via phone or WhatsApp.',
              },
              {
                step: '04',
                title: 'Travel as Agreed',
                desc: 'Your sanitized Ertiga arrives on time. Travel peacefully and pay the balance upon trip completion with printable duty slip.',
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800/90 rounded-2xl p-5 space-y-3 relative group hover:border-slate-700 transition"
              >
                <div className="text-3xl font-black text-amber-500/40 font-mono">
                  {step.step}
                </div>
                <h3 className="font-bold text-sm text-white">
                  {step.title}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-4 text-center">
            <button
              onClick={scrollToBooking}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-8 py-3.5 rounded-2xl shadow-xl text-xs sm:text-sm transition"
            >
              Start Your Booking Request Now
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================
          8. CONCISE ABOUT KADJAI TRAVELS
      ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="text-amber-400 font-extrabold uppercase tracking-wider text-xs">
              About Kadjai Travels
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Dedicated Tourist Vehicle & Cab Services in Mumbai
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Kadjai Travels provides personalized tourist vehicle and cab services based in Mumbai, Maharashtra. We operate clean, comfortable Maruti Suzuki Ertiga vehicles, catering to families, corporate professionals, and pilgrims traveling across Maharashtra and Western India.
            </p>
            <p className="text-slate-400 text-xs leading-relaxed">
              We believe in upfront transparency: no hidden surge rates, no unverified claims. Every passenger receives clear route planning, verified commercial drivers, and fair, itemized billing covering mandatory tolls, parking, and driver allowances.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold">
              <span className="text-slate-300">Base Location: <strong className="text-white">Mumbai, Maharashtra</strong></span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">Helpline: <strong className="text-amber-400 font-mono">{COMPANY_INFO.displayPhone}</strong></span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">Email: <strong className="text-white">{COMPANY_INFO.email}</strong></span>
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
              <Phone className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Have Questions or Need a Custom Route?</h3>
              <p className="text-slate-400 text-xs mt-1">
                Speak directly with our travel operations desk.
              </p>
            </div>
            <a
              href={`tel:${COMPANY_INFO.phone}`}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl text-xs block transition"
            >
              Call {COMPANY_INFO.displayPhone}
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
