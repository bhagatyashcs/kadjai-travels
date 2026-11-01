import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  ShieldCheck, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  Car
} from 'lucide-react';
import BookingForm from '../components/BookingForm';
import { COMPANY_INFO, VEHICLE_DETAILS } from '../data/travelData';

export default function ContactPage({ onSubmitBooking }) {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: 'How are highway tolls and parking charges calculated?',
      a: 'Tolls and destination parking are strictly mandatory and calculated based on your specific highway route (e.g. Mumbai-Pune Expressway Fastag, Samruddhi Mahamarg, Atal Setu). We calculate and include them transparently in your estimated bill so there are no surprises during the trip.',
    },
    {
      q: 'What is the pricing rate for the Maruti Suzuki Ertiga?',
      a: 'For Intercity Outstation journeys, the tariff is ₹25 / KM with a standard calendar day minimum of 300 KM per day, plus a driver charge of ₹400 / day. For Mumbai Local city usage, the tariff is ₹15 / KM (or our 8-hour / 80-KM city package at ₹2,200).',
    },
    {
      q: 'Is there a luggage carrier on the roof for large bags?',
      a: 'Yes, our Maruti Suzuki Ertiga is equipped with a heavy-duty overhead luggage carrier and a waterproof tarpaulin cover. This allows comfortable seating for up to 6 passengers inside the cabin without bags crowding legroom.',
    },
    {
      q: 'How do I confirm my booking enquiry?',
      a: 'Once you submit your booking form online or via WhatsApp, our operations desk verifies vehicle and driver allocation. We will call you to confirm your schedule, provide your booking reference number, and coordinate driver pickup.',
    },
    {
      q: 'Is night driving permitted, and does it carry extra charges?',
      a: 'Yes, our drivers operate 24x7 for flight arrivals and early outstation departures. A standard night allowance of ₹300 applies for journeys operating between 10:00 PM and 06:00 AM.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16 text-slate-100">
      
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Phone className="w-3.5 h-3.5" />
          <span>Contact & Booking Desk</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Get in Touch with Kadjai Travels
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Need to reserve an Ertiga, enquire about outstation rates, or discuss a customized travel route? Connect with our 24x7 operations desk by phone, WhatsApp, or through the booking enquiry form below.
        </p>
      </div>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Phone */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <Phone className="w-5 h-5" />
          </div>
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">24/7 Helpline</span>
          <h3 className="text-base font-bold text-white">Call Operator Desk</h3>
          <a
            href={`tel:${COMPANY_INFO.phone}`}
            className="text-amber-400 font-mono font-bold hover:underline block text-sm"
          >
            {COMPANY_INFO.displayPhone}
          </a>
          <p className="text-slate-400 text-[11px]">Instant phone support for urgent rides.</p>
        </div>

        {/* WhatsApp */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">WhatsApp Desk</span>
          <h3 className="text-base font-bold text-white">Chat on WhatsApp</h3>
          <a
            href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=Hi%20Kadjai%20Travels,%20I%20would%20like%20to%20enquire%20about%20a%20tourist%20car%20booking.`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 font-bold hover:underline block text-sm"
          >
            Send WhatsApp Message
          </a>
          <p className="text-slate-400 text-[11px]">Get itemized quotations & live support.</p>
        </div>

        {/* Email */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Email Desk</span>
          <h3 className="text-base font-bold text-white">Corporate & Enquiries</h3>
          <a
            href={`mailto:${COMPANY_INFO.email}`}
            className="text-white hover:text-amber-400 block text-xs truncate"
          >
            {COMPANY_INFO.email}
          </a>
          <p className="text-slate-400 text-[11px]">Travel receipts, invoices & corporate bookings.</p>
        </div>

        {/* Base Hub */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Operational Base</span>
          <h3 className="text-base font-bold text-white">Mumbai, Maharashtra</h3>
          <p className="text-slate-300 text-xs">
            Doorstep pickups across Mumbai, Thane, & Navi Mumbai.
          </p>
          <p className="text-slate-400 text-[11px]">{COMPANY_INFO.operatingHours}</p>
        </div>

      </div>

      {/* Embedded Booking Form */}
      <section className="space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-2xl font-black text-white">
            Online Booking & Route Enquiry
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Submit your itinerary details below. Fares, tolls, and driver charges are calculated automatically.
          </p>
        </div>

        <BookingForm onSubmitBooking={onSubmitBooking} />
      </section>

      {/* Frequently Asked Questions */}
      <section className="space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <div className="text-amber-400 font-extrabold uppercase tracking-wider text-xs flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4" />
            <span>Common Questions</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                className="w-full text-left p-5 flex items-center justify-between text-xs sm:text-sm font-bold text-white hover:text-amber-400 transition"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-amber-400 shrink-0 ml-2" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
                )}
              </button>

              {openFaq === idx && (
                <div className="p-5 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 animate-in fade-in duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
