import React, { useState } from 'react';
import { 
  Car, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  ShieldCheck, 
  ChevronRight,
  Shield,
  FileText,
  X
} from 'lucide-react';
import { COMPANY_INFO, SERVICES_LIST, DESTINATIONS_LIST } from '../data/travelData';

export default function Footer({ onNavigate }) {
  const [activeModal, setActiveModal] = useState(null); // 'privacy' | 'terms' | null

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 text-xs">
      
      {/* Upper Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
        
        {/* Col 1: Brand & Commitment (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black text-white tracking-wider">
                KADJAI<span className="text-amber-400">TRAVELS</span>
              </span>
            </div>
          </div>

          <p className="text-slate-400 leading-relaxed text-xs">
            Reliable tourist car and travel services based in Mumbai. We provide planned outstation journeys, punctual airport transfers, and family travel across Maharashtra in clean, verified Maruti Suzuki Ertiga (6+1 AC) cabs.
          </p>

          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl space-y-1.5 text-[11px]">
            <div className="flex items-center gap-2 text-white font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Service Values We Stand By:</span>
            </div>
            <p className="text-slate-400 leading-relaxed pl-6">
              Clear communication, planned pickups, transparent fare discussions, and strict attention to vehicle cleanliness.
            </p>
          </div>
        </div>

        {/* Col 2: Navigation Links (2 Cols) */}
        <div className="lg:col-span-2 space-y-3">
          <h4 className="font-extrabold text-white text-sm uppercase tracking-wider">
            Quick Links
          </h4>
          <ul className="space-y-2">
            {[
              { id: 'home', label: 'Home' },
              { id: 'services', label: 'Our Services' },
              { id: 'vehicles', label: 'Our Vehicle' },
              { id: 'destinations', label: 'Destinations' },
              { id: 'about', label: 'About Us' },
              { id: 'contact', label: 'Contact & Book' },
              { id: 'operations', label: 'Operator Desk' },
            ].map(link => (
              <li key={link.id}>
                <button
                  onClick={() => {
                    onNavigate(link.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-slate-400 hover:text-amber-400 transition text-xs flex items-center gap-1.5 group text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-amber-400 transition-colors" />
                  <span>{link.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Popular Routes / Destinations (3 Cols) */}
        <div className="lg:col-span-3 space-y-3">
          <h4 className="font-extrabold text-white text-sm uppercase tracking-wider">
            Popular Journeys
          </h4>
          <ul className="space-y-2 text-xs">
            {DESTINATIONS_LIST.slice(0, 5).map(dest => (
              <li key={dest.id}>
                <button
                  onClick={() => {
                    onNavigate('destinations');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-slate-400 hover:text-white transition flex items-center justify-between w-full text-left"
                >
                  <span className="hover:underline">{dest.name}</span>
                  <span className="text-[10px] text-amber-400/80 font-mono font-medium">Ertiga AC</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="pt-2">
            <span className="text-[11px] text-slate-500">
              Rates: Intercity ₹25/KM • Local ₹15/KM
            </span>
          </div>
        </div>

        {/* Col 4: Verified Contact & Business Info (3 Cols) */}
        <div className="lg:col-span-3 space-y-3">
          <h4 className="font-extrabold text-white text-sm uppercase tracking-wider">
            Contact & Office
          </h4>
          
          <div className="space-y-2.5 text-xs text-slate-400">
            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">24x7 Customer Helpline</span>
                <a href={`tel:${COMPANY_INFO.phone}`} className="text-white hover:text-amber-400 font-bold font-mono text-xs">
                  {COMPANY_INFO.displayPhone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Booking Enquiries</span>
                <a href={`mailto:${COMPANY_INFO.email}`} className="text-white hover:text-amber-400 text-xs">
                  {COMPANY_INFO.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Base Location</span>
                <span className="text-slate-300">{COMPANY_INFO.baseLocation}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Operational Support</span>
                <span className="text-slate-300">{COMPANY_INFO.operatingHours}</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <a
              href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=Hi%20Kadjai%20Travels,%20I%20would%20like%20to%20enquire%20about%20a%20tourist%20car%20booking.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition shadow-md"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Booking Desk</span>
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="bg-slate-950/80 border-t border-slate-900/90 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            <div>
              © {new Date().getFullYear()} Kadjai Travels. All rights reserved. Registered tourist car services in Mumbai, Maharashtra.
            </div>
            <div className="text-[10px] text-slate-600 mt-1">
              Proprietor: {COMPANY_INFO.proprietor}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveModal('privacy')}
              className="hover:text-slate-300 transition"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveModal('terms')}
              className="hover:text-slate-300 transition"
            >
              Terms of Booking
            </button>
            <span>•</span>
            <button
              onClick={() => {
                onNavigate('operations');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-amber-400 text-slate-400 font-medium transition"
            >
              TVMS Desk
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Policy & Terms Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm text-slate-100">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>{activeModal === 'privacy' ? 'Privacy Policy' : 'Terms of Booking & Travel'}</span>
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              {activeModal === 'privacy' ? (
                <>
                  <p>
                    <strong>Kadjai Travels</strong> respects your personal privacy. Customer phone numbers and trip details collected through our website are used exclusively to coordinate your travel, assign verified drivers, and generate trip duty slips.
                  </p>
                  <p>
                    We never sell, rent, or distribute your private contact details to third-party telemarketers or external advertising networks.
                  </p>
                  <p>
                    All booking records stored within our system are handled securely and solely for operational logistics and tax invoice generation.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>Booking Confirmation:</strong> Journey requests submitted online are verified by the Kadjai Travels operations desk. Bookings are confirmed upon mutual agreement of dates, route, vehicle availability, and advance payment.
                  </p>
                  <p>
                    <strong>Tariff & Billing:</strong> Intercity outstation journeys in Maruti Ertiga are calculated at ₹25 / KM with a standard minimum calendar day distance of 300 KM per day, plus ₹400 / day driver charge. Local Mumbai city runs are calculated at ₹15 / KM.
                  </p>
                  <p>
                    <strong>Tolls & Parking:</strong> Fastag highway toll receipts and destination municipal parking are charged based on actuals or confirmed upfront with the passenger.
                  </p>
                  <p>
                    <strong>Vehicle Decorum:</strong> All vehicles are 100% air-conditioned. We promote safe, smooth highway driving and request passengers to respect driver rest breaks on long journeys.
                  </p>
                </>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800 text-right">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition"
              >
                Understood & Close
              </button>
            </div>
          </div>
        </div>
      )}

    </footer>
  );
}
