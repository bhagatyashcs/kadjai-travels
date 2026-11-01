import React from 'react';
import { 
  Car, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Users, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  FileText
} from 'lucide-react';
import { COMPANY_INFO, VEHICLE_DETAILS } from '../data/travelData';

export default function AboutPage({ onNavigate, onOpenTrackBooking }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16 text-slate-100">
      
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Car className="w-3.5 h-3.5" />
          <span>About Kadjai Travels</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Reliable Tourist Car Services from Mumbai
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Kadjai Travels was established to solve a simple yet fundamental problem in tourist car travel: delivering genuine punctuality, clean vehicles, transparent billing, and experienced highway drivers without deceptive surge pricing.
        </p>
      </div>

      {/* Main Philosophy Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        <div className="lg:col-span-7 space-y-5">
          <span className="text-amber-400 font-extrabold uppercase tracking-wider text-xs">
            Our Operating Approach
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Built on Real Commitments, Not Exaggerated Claims
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            We operate out of Mumbai, Maharashtra, specializing in tourist travel across Western Maharashtra, the Konkan coast, and Goa. Rather than attempting to maintain an unmanageable fleet of mixed cars, we focus our operations on the <strong>Maruti Suzuki Ertiga (6+1 AC Luxury)</strong>.
          </p>
          <p className="text-slate-400 text-xs leading-relaxed">
            This deliberate fleet focus ensures that every client receives the exact vehicle promised: thoroughly sanitized, mechanically inspected, with functional dual air conditioning, roof luggage carriers, and an experienced commercial driver who knows the highway routes intimately.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-amber-400 font-mono font-black text-xl block">₹25 / KM</span>
              <span className="text-slate-400 text-xs font-medium">Intercity Outstation Tariff</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-amber-400 font-mono font-black text-xl block">₹15 / KM</span>
              <span className="text-slate-400 text-xs font-medium">Local Mumbai City Tariff</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Service Standards We Enforce:</span>
          </h3>

          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Pre-Trip Sanitization:</strong> Vacuumed seats, clean mats, and odor-free cabin before passenger boarding.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Verified Commercial Drivers:</strong> Drivers hold valid badges, highway experience, and polite etiquette.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Transparent Fastag Tolls:</strong> Highway toll receipts and parking are calculated and itemized clearly.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Official Duty Slips:</strong> Digital and printable duty slips recording opening and closing odometer readings.</span>
            </li>
          </ul>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('contact')}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl text-xs transition"
            >
              Get in Touch with Us
            </button>
          </div>
        </div>

      </div>

      {/* Driver & Safety Standards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Commercial Licencing & Verification</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            All drivers assigned to tourist trips carry valid commercial badges, driving licenses, and verified local addresses in Mumbai or Thane.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Route Knowledge & Rest Breaks</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Our drivers are familiar with key expressway halts, hygienic family restaurants, and safe rest stops on routes to Shirdi, Pune, and Goa.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-400">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Digital Record Keeping</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Our Tourist Vehicle Management System (TVMS) tracks every booking, start meter, end meter, and billing component for total accountability.
          </p>
        </div>
      </div>

      {/* Verified Business Details */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4">
        <h3 className="text-lg font-bold text-white">
          Verified Operating Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Registered Brand</span>
            <span className="text-white font-bold">{COMPANY_INFO.name}</span>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Fleet Model</span>
            <span className="text-white font-bold">Maruti Suzuki Ertiga (6+1 AC)</span>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Operating Regions</span>
            <span className="text-white font-bold">Mumbai, Maharashtra & Goa</span>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Base Location</span>
            <span className="text-white font-bold">{COMPANY_INFO.baseLocation}</span>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Customer Helpline</span>
            <a href={`tel:${COMPANY_INFO.phone}`} className="text-amber-400 font-mono font-bold hover:underline">
              {COMPANY_INFO.displayPhone}
            </a>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Enquiries Email</span>
            <a href={`mailto:${COMPANY_INFO.email}`} className="text-slate-300 hover:text-white hover:underline">
              {COMPANY_INFO.email}
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
