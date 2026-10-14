import React, { useState } from 'react';
import { 
  Car, 
  Phone, 
  Menu, 
  X, 
  Calendar, 
  MessageSquare, 
  Compass, 
  ShieldCheck,
  ChevronRight,
  LayoutDashboard
} from 'lucide-react';
import { COMPANY_INFO } from '../data/travelData';

export default function Header({ 
  currentPage = 'home', 
  onNavigate, 
  onOpenBooking,
  onOpenTrackBooking,
  activeTripsCount = 0 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Exact navigation specified in prompt 4.A:
  // Home, Services, Our Vehicle, Destinations, About, Contact, and a prominent "Plan Your Journey" CTA
  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'vehicles', label: 'Our Vehicle' },
    { id: 'destinations', label: 'Destinations' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleLinkClick = (pageId) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlanJourneyClick = () => {
    if (currentPage !== 'home') {
      onNavigate('home');
    }
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById('booking-enquiry-panel');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      
      {/* Utility Top Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-slate-800/80 px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-200">
              Tourist Car Services from Mumbai • Ertiga 6+1 AC Luxury
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-medium">
            <a 
              href={`tel:${COMPANY_INFO.phone}`}
              className="text-amber-400 hover:text-amber-300 transition flex items-center gap-1 font-mono font-bold"
            >
              <Phone className="w-3 h-3" />
              <span>{COMPANY_INFO.displayPhone}</span>
            </a>

            <span className="hidden sm:inline text-slate-600">•</span>

            <button
              onClick={onOpenTrackBooking}
              className="hidden sm:inline-block text-slate-400 hover:text-white transition text-[11px]"
            >
              Track Trip
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        
        {/* Brand Wordmark & Emblem */}
        <div 
          onClick={() => handleLinkClick('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Car className="w-5 h-5 text-amber-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-wider text-white">
                KADJAI<span className="text-amber-400">TRAVELS</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-tight -mt-0.5 hidden sm:block">
              Premium Tourist Car & Outstation Travel
            </p>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-2xl border border-slate-800/80">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                currentPage === link.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Operations / Dispatch Desk Switcher (For Operator) */}
          <button
            onClick={() => handleLinkClick('operations')}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
              currentPage === 'operations'
                ? 'bg-slate-800 text-amber-400 border-amber-400/40 shadow-inner font-bold'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
            title="Open Tourist Vehicle Management System (TVMS) Desk"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
            <span>Operations</span>
            {activeTripsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                {activeTripsCount}
              </span>
            )}
          </button>

          {/* Call Us Button */}
          <a
            href={`tel:${COMPANY_INFO.phone}`}
            className="hidden sm:flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-semibold px-3 py-2 rounded-xl text-xs transition"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span>Call Us</span>
          </a>

          {/* Prominent "Plan Your Journey" Primary CTA */}
          <button
            onClick={handlePlanJourneyClick}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-lg shadow-amber-500/20 text-xs sm:text-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Plan Your Journey</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800 transition"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/98 border-b border-slate-800 px-4 py-5 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-between ${
                  currentPage === link.id
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            ))}

            <button
              onClick={() => handleLinkClick('operations')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-between ${
                currentPage === 'operations'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 text-amber-400" />
                <span>Operator Dispatch & Fleet Desk</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
            <button
              onClick={handlePlanJourneyClick}
              className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 px-3 rounded-xl text-center text-xs transition"
            >
              Plan Your Journey
            </button>

            <a
              href={`tel:${COMPANY_INFO.phone}`}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Call</span>
            </a>
          </div>
        </div>
      )}

    </header>
  );
}
