import React, { useState, useEffect } from 'react';
import { X, User, Phone, Shield, Star, Check } from 'lucide-react';

export default function DriverModal({
  isOpen,
  onClose,
  onSave,
  driverToEdit,
}) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    licenseNumber: '',
    badgeNumber: '',
    experienceYears: 5,
    status: 'Available',
    homeLocation: 'Mumbai',
    languages: 'Hindi, Marathi, English',
    rating: 4.9,
  });

  useEffect(() => {
    if (driverToEdit) {
      setFormData({
        ...driverToEdit,
        languages: Array.isArray(driverToEdit.languages) 
          ? driverToEdit.languages.join(', ') 
          : (driverToEdit.languages || 'Hindi, Marathi'),
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        licenseNumber: '',
        badgeNumber: '',
        experienceYears: 5,
        status: 'Available',
        homeLocation: 'Mumbai',
        languages: 'Hindi, Marathi, English',
        rating: 4.9,
      });
    }
  }, [driverToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Please enter Driver Name and Contact Phone.');
      return;
    }

    const payload = {
      ...formData,
      languages: formData.languages.split(',').map(s => s.trim()).filter(Boolean),
      experienceYears: Number(formData.experienceYears) || 1,
      rating: Number(formData.rating) || 5.0,
      id: driverToEdit ? driverToEdit.id : `DRV-${Date.now().toString().slice(-4)}`,
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl text-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {driverToEdit ? `Edit Driver (${driverToEdit.name})` : 'Add New Driver to Roster'}
              </h2>
              <p className="text-xs text-slate-400">
                Driver verification, licensing & contact details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Driver Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Shinde"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Phone / WhatsApp *</label>
              <input
                type="tel"
                required
                placeholder="+91 98XXXXXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Driving License No.</label>
              <input
                type="text"
                placeholder="MH-02-2015-XXXXXXX"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Tourist Badge No.</label>
              <input
                type="text"
                placeholder="TR-MUM-XXXX"
                value={formData.badgeNumber}
                onChange={(e) => setFormData({ ...formData, badgeNumber: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Experience (Yrs)</label>
              <input
                type="number"
                min="1"
                value={formData.experienceYears}
                onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-center focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Current Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-amber-400"
              >
                <option value="Available">Available</option>
                <option value="On Trip">On Trip</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Customer Rating</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-center font-bold text-amber-400 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Home Location / Area</label>
            <input
              type="text"
              placeholder="e.g. Andheri West, Mumbai"
              value={formData.homeLocation}
              onChange={(e) => setFormData({ ...formData, homeLocation: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Languages Spoken (comma separated)</label>
            <input
              type="text"
              placeholder="Hindi, Marathi, English"
              value={formData.languages}
              onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>{driverToEdit ? 'Save Driver' : 'Add Driver'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
