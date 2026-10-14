import React, { useState } from 'react';
import { 
  MapPin, 
  Clock, 
  Car, 
  ArrowRight, 
  Calendar, 
  Sparkles, 
  Search,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { DESTINATIONS_LIST, COMPANY_INFO } from '../data/travelData';

export default function DestinationsPage({ onNavigate, onSelectDestinationForBooking }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');

  const filteredDestinations = DESTINATIONS_LIST.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleBookRoute = (destName) => {
    if (onSelectDestinationForBooking) {
      onSelectDestinationForBooking(destName.split(' ')[0]);
    }
    onNavigate('home');
    setTimeout(() => {
      const el = document.getElementById('booking-enquiry-panel');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16 text-slate-100">
      
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <MapPin className="w-3.5 h-3.5" />
          <span>Verified Outstation Destinations</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Destinations & Route Guides
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Planning an outstation journey from Mumbai? Explore verified driving distances, expressway travel times, highway Fastag toll estimates, and travel highlights across Maharashtra and Goa.
        </p>

        {/* Search Bar */}
        <div className="pt-2">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search destinations (e.g. Lonavala, Shirdi, Pune)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredDestinations.map((dest) => (
          <div
            key={dest.id}
            id={dest.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between group hover:border-slate-700 transition"
          >
            {/* Image Header with Tags */}
            <div className="relative h-60 bg-slate-950 overflow-hidden">
              <img
                src={dest.imageUrl}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <div className="absolute top-4 left-4 bg-slate-900/90 border border-slate-700 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-white">
                {dest.region}
              </div>

              <div className="absolute top-4 right-4 bg-amber-500/90 text-slate-950 font-black px-2.5 py-1 rounded-xl text-[11px] font-mono">
                {dest.tollEst}
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-2xl font-black text-white">
                  {dest.name}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{dest.approxDriveTime}</span>
                  </span>
                  <span>•</span>
                  <span>{dest.typicalDuration}</span>
                </div>
              </div>
            </div>

            {/* Body Content */}
            <div className="p-6 space-y-6 flex-1 flex flex-col justify-between">
              
              <div className="space-y-4 text-xs">
                {/* Distance and Route Metrics */}
                <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Distance from Mumbai</span>
                    <span className="text-white font-semibold">{dest.distanceFromMumbai}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Parking / Entry Est.</span>
                    <span className="text-amber-400 font-mono font-bold">{dest.parkingEst}</span>
                  </div>
                </div>

                <p className="text-slate-300 leading-relaxed">
                  {dest.description}
                </p>

                {/* Key Highlights */}
                <div>
                  <span className="text-slate-400 uppercase tracking-wider font-bold text-[10px] block mb-2">
                    Key Sightseeing & Route Highlights:
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-300 text-[11px]">
                    {dest.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-400 shrink-0">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Best Time to Visit */}
                <div className="pt-2 text-slate-400 text-[11px]">
                  <strong className="text-slate-300">Best Season: </strong>
                  {dest.bestTimeToVisit}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <a
                  href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=Hi%20Kadjai%20Travels,%20I%20would%20like%20to%20enquire%20about%20a%20trip%20to%20${encodeURIComponent(dest.name)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Enquire Route</span>
                </a>

                <button
                  onClick={() => handleBookRoute(dest.name)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs transition flex items-center gap-1.5"
                >
                  <span>Book Ertiga for {dest.name.split(' ')[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>
        ))}
      </div>

      {/* Transparent Disclaimer */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-xs text-slate-400 space-y-2">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Factual Travel Route Disclaimer</span>
        </div>
        <p className="leading-relaxed">
          Highway driving durations, toll amounts, and distances provided above are calculated from central Mumbai based on standard NH and State Expressway routes. Actual highway transit times may vary depending on local traffic conditions, ghat weather, and road maintenance. All outstation bookings are subject to vehicle availability and verified driver confirmation.
        </p>
      </div>

    </div>
  );
}
