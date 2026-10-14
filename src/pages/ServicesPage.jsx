import React from 'react';
import { 
  Car, 
  Check, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Users, 
  Phone, 
  MessageSquare,
  DollarSign
} from 'lucide-react';
import { SERVICES_LIST, COMPANY_INFO, VEHICLE_DETAILS } from '../data/travelData';

export default function ServicesPage({ onNavigate, onBookService }) {
  const handleEnquireService = (serviceTitle) => {
    if (onBookService) {
      onBookService(serviceTitle);
    } else {
      onNavigate('home');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16 text-slate-100">
      
      {/* Page Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Car className="w-3.5 h-3.5" />
          <span>Our Travel Services</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Verified Tourist Vehicle Services
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Kadjai Travels provides dedicated chauffeur-driven tourist car services across Mumbai, Maharashtra, and Goa. Every service features our clean Maruti Suzuki Ertiga (6+1 AC) with transparent pricing.
        </p>

        {/* Pricing Notice Pill */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <DollarSign className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Standard Pricing: <strong className="text-white">Intercity Outstation @ ₹20/KM</strong> • <strong className="text-white">Mumbai Local @ ₹15/KM</strong></span>
          </div>
          <span className="text-amber-400 font-mono font-bold">Driver Bata: ₹400/day</span>
        </div>
      </div>

      {/* Services List - Deep Dive Cards */}
      <div className="space-y-12">
        {SERVICES_LIST.map((srv, index) => (
          <div
            key={srv.id}
            id={srv.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8 hover:border-slate-700 transition"
          >
            {/* Service Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-mono font-bold text-xs">
                    0{index + 1}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    {srv.title}
                  </h2>
                </div>
                <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
                  {srv.fullDesc}
                </p>
              </div>

              <div className="bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800/80 shrink-0">
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">Standard Tariff</span>
                <span className="text-amber-400 font-mono font-bold text-xs sm:text-sm">
                  {srv.rateInfo}
                </span>
              </div>
            </div>

            {/* Service Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
              
              {/* Col 1: Suitable Use Cases */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-3">
                <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>Suitable Use Cases</span>
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {srv.useCases}
                </p>
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-slate-500 text-[11px] block font-semibold">Assigned Vehicle:</span>
                  <span className="text-white font-medium">{VEHICLE_DETAILS.name} ({VEHICLE_DETAILS.seatingCapacity})</span>
                </div>
              </div>

              {/* Col 2: What is Included */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-3">
                <h3 className="font-bold text-emerald-300 text-sm flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>What is Included</span>
                </h3>
                <ul className="space-y-2 text-slate-300">
                  {srv.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 3: Exclusions & Additional Actuals */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-3">
                <h3 className="font-bold text-rose-300 text-sm flex items-center gap-2">
                  <X className="w-4 h-4 text-rose-400" />
                  <span>Exclusions (Charged at Actuals)</span>
                </h3>
                <ul className="space-y-2 text-slate-400">
                  {srv.exclusions.map((exc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold shrink-0 mt-0.5">•</span>
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-slate-400 text-xs">
                Doorstep pickup available across Mumbai, Thane, and Navi Mumbai.
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=Hi%20Kadjai%20Travels,%20I%20am%20interested%20in%20booking%20${encodeURIComponent(srv.title)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ask on WhatsApp</span>
                </a>

                <button
                  onClick={() => handleEnquireService(srv.title)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-1.5"
                >
                  <span>Book This Service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Bottom Assistance Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-white">Need a Multi-Day Custom Tour or Package?</h3>
          <p className="text-slate-400 text-xs mt-1">
            We plan customized itineraries for Ashtavinayak, Jyotirlinga, and Konkan family trips.
          </p>
        </div>

        <a
          href={`tel:${COMPANY_INFO.phone}`}
          className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold px-6 py-3 rounded-2xl text-xs transition flex items-center gap-2 shrink-0"
        >
          <Phone className="w-4 h-4 text-amber-400" />
          <span>Call Dispatch Desk: {COMPANY_INFO.displayPhone}</span>
        </a>
      </div>

    </div>
  );
}
