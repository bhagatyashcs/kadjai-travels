import React, { useState } from 'react';
import { 
  Car, 
  Users, 
  Briefcase, 
  Wind, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Phone, 
  MessageSquare,
  Sparkles,
  DollarSign,
  Camera,
  Layers,
  ChevronRight
} from 'lucide-react';
import { VEHICLE_DETAILS, COMPANY_INFO } from '../data/travelData';

export default function VehiclesPage({ onNavigate }) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const galleryPhotos = VEHICLE_DETAILS.gallery || [
    {
      id: 'front',
      title: 'Exterior Profile',
      caption: 'Pristine Arctic White Maruti Suzuki Ertiga (6+1 Luxury Tourist MUV)',
      url: '/images/ertiga-front.jpg',
    },
    {
      id: 'interior',
      title: 'Comfortable Cabin & Dual AC',
      caption: 'Ergonomic dual-tone seating, clean dashboard & dedicated rear AC vents',
      url: '/images/ertiga-interior.jpg',
    },
    {
      id: 'rear',
      title: 'Rear Luggage & Boot Space',
      caption: 'Spacious luggage compartment with foldable 3rd-row seating and roof carrier capability',
      url: '/images/ertiga-rear.jpg',
    },
  ];

  const handleBookErtiga = () => {
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
          <Car className="w-3.5 h-3.5" />
          <span>Our Operational Tourist Fleet</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Maruti Suzuki Ertiga (6+1 AC)
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          At Kadjai Travels, we focus exclusively on the Maruti Suzuki Ertiga. It is the premier choice for family vacations and outstation journeys across India, offering the ideal blend of 3-row comfort, highway stability, chilled dual air-conditioning, and luggage capacity.
        </p>
      </div>

      {/* Main Vehicle Showcase Hero Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Side: Vehicle Photography & Interactive Gallery Switcher */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-950 p-4 sm:p-6 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 min-h-[300px] sm:min-h-[380px] flex items-center justify-center border border-slate-800 shadow-inner group">
            <img
              src={galleryPhotos[selectedPhotoIndex].url}
              alt={galleryPhotos[selectedPhotoIndex].caption}
              className="w-full h-full max-h-[420px] object-cover object-center transition-all duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
            
            <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-700/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold text-amber-400 flex items-center gap-1.5 shadow-lg">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{galleryPhotos[selectedPhotoIndex].title}</span>
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
              <span className="bg-slate-950/90 border border-slate-800 text-slate-200 font-medium px-3 py-1.5 rounded-xl backdrop-blur-sm shadow-md line-clamp-1">
                {galleryPhotos[selectedPhotoIndex].caption}
              </span>
              <span className="bg-emerald-600/90 text-white font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm shrink-0 ml-2">
                Photo {selectedPhotoIndex + 1}/{galleryPhotos.length}
              </span>
            </div>
          </div>

          {/* Thumbnail Selector */}
          <div className="grid grid-cols-3 gap-3">
            {galleryPhotos.map((photo, idx) => (
              <button
                key={photo.id || idx}
                onClick={() => setSelectedPhotoIndex(idx)}
                className={`relative rounded-xl overflow-hidden border-2 transition-all text-left p-1 ${
                  selectedPhotoIndex === idx 
                    ? 'border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-400/10' 
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 opacity-80 hover:opacity-100'
                }`}
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-16 sm:h-20 object-cover rounded-lg"
                />
                <div className="p-1 mt-0.5">
                  <p className="text-[11px] font-bold text-white truncate">{photo.title}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Verified Specifications & Tariff */}
        <div className="lg:col-span-5 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-xs uppercase tracking-wider font-extrabold text-amber-400">
                Vehicle Specifications
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                {VEHICLE_DETAILS.name}
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                {VEHICLE_DETAILS.category}
              </p>
            </div>

            {/* Spec Matrix */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>Seating Capacity:</span>
                </span>
                <span className="font-bold text-white">{VEHICLE_DETAILS.seatingCapacity}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 flex items-center gap-2">
                  <Wind className="w-4 h-4 text-emerald-400" />
                  <span>Air Conditioning:</span>
                </span>
                <span className="font-bold text-white">Dual AC (All Rows)</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-amber-400" />
                  <span>Luggage Capacity:</span>
                </span>
                <span className="font-bold text-white">Boot + Secure Roof Rack</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  <span>Intercity Tariff:</span>
                </span>
                <span className="font-bold text-amber-400 font-mono">₹25 / KM (300 km min/day)</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  <span>Mumbai Local Tariff:</span>
                </span>
                <span className="font-bold text-amber-400 font-mono">₹15 / KM (8h / 80km package)</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>Driver Charge:</span>
                </span>
                <span className="font-bold text-white font-mono">₹400 / Day</span>
              </div>
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <button
              onClick={handleBookErtiga}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3.5 px-6 rounded-2xl shadow-xl shadow-amber-500/20 text-xs sm:text-sm transition flex items-center justify-center gap-2"
            >
              <span>Enquire & Book Ertiga</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=Hi%20Kadjai%20Travels,%20I%20would%20like%20to%20enquire%20about%20booking%20your%20Maruti%20Suzuki%20Ertiga.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 transition"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>Direct WhatsApp Enquiry</span>
            </a>
          </div>

        </div>

      </div>

      {/* Vehicle Detailed Gallery Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-amber-400 font-extrabold uppercase tracking-wider text-xs flex items-center gap-1.5">
              <Camera className="w-4 h-4" />
              <span>Real Fleet Visual Inspection</span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">
              Authentic Maruti Suzuki Ertiga Details
            </h2>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            100% Genuine Commercial Tourist Vehicle
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {galleryPhotos.map((photo, idx) => (
            <div 
              key={photo.id || idx}
              onClick={() => setSelectedPhotoIndex(idx)}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl cursor-pointer hover:border-amber-500/50 transition group"
            >
              <div className="relative h-56 overflow-hidden bg-slate-950">
                <img 
                  src={photo.url} 
                  alt={photo.caption}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 bg-slate-900/90 text-white font-bold text-xs px-2.5 py-1 rounded-lg backdrop-blur-md">
                  {photo.title}
                </span>
              </div>
              <div className="p-5 space-y-2">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {photo.caption}
                </p>
                <div className="flex items-center text-amber-400 text-xs font-semibold pt-1">
                  <span>View High-Res Photo</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Ertiga is Ideal Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Features Checklist */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="text-amber-400 font-extrabold uppercase tracking-wider text-xs flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Cabin & Highway Features</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            Designed for Passenger Comfort
          </h3>
          <p className="text-slate-400 text-xs">
            Every feature on our vehicle is maintained to commercial tourist standards.
          </p>

          <ul className="space-y-3 pt-2">
            {VEHICLE_DETAILS.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Suitable Travel Types */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="text-amber-400 font-extrabold uppercase tracking-wider text-xs flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Suitable Journey Types</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            Where the Ertiga Excels
          </h3>
          <p className="text-slate-400 text-xs">
            Perfect balance between spaciousness, highway efficiency, and tight ghat maneuverability.
          </p>

          <ul className="space-y-3 pt-2">
            {VEHICLE_DETAILS.suitableFor.map((journey, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                <span>{journey}</span>
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-slate-800">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 text-xs text-slate-400 leading-relaxed">
              <strong className="text-white block mb-1">Cleanliness & Safety Commitment:</strong>
              Our vehicles undergo interior sanitization, AC filter cleaning, and mechanical tyre/brake checks before undertaking outstation journeys on the expressway.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
