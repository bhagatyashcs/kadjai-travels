import React, { useState, useEffect } from 'react';
import { X, Car, Gauge, Fuel, Calendar, Check } from 'lucide-react';
import { VEHICLE_MODELS } from '../data/travelData';

export default function VehicleModal({
  isOpen,
  onClose,
  onSave,
  vehicleToEdit,
}) {
  const [formData, setFormData] = useState({
    plateNumber: '',
    model: 'Maruti Suzuki Ertiga',
    modelId: 'ertiga',
    variant: 'ZXi (CNG + Petrol)',
    year: 2024,
    color: 'Pearl Arctic White',
    seats: 7,
    status: 'Available',
    currentKm: 35000,
    insuranceExpiry: '2027-04-15',
    pucExpiry: '2026-12-31',
    fitnessExpiry: '2028-06-30',
    notes: '',
  });

  useEffect(() => {
    if (vehicleToEdit) {
      setFormData(vehicleToEdit);
    } else {
      setFormData({
        plateNumber: '',
        model: 'Maruti Suzuki Ertiga',
        modelId: 'ertiga',
        variant: 'ZXi (CNG + Petrol)',
        year: 2024,
        color: 'Pearl Arctic White',
        seats: 7,
        status: 'Available',
        currentKm: 35000,
        insuranceExpiry: '2027-04-15',
        pucExpiry: '2026-12-31',
        fitnessExpiry: '2028-06-30',
        notes: '',
      });
    }
  }, [vehicleToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.plateNumber) {
      alert('Please enter Vehicle License Plate Registration Number (e.g. MH 02 EE 4589).');
      return;
    }

    const payload = {
      ...formData,
      currentKm: Number(formData.currentKm) || 0,
      seats: Number(formData.seats) || 7,
      year: Number(formData.year) || 2024,
      id: vehicleToEdit ? vehicleToEdit.id : `VEH-${Date.now().toString().slice(-4)}`,
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
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {vehicleToEdit ? `Edit Vehicle (${vehicleToEdit.plateNumber})` : 'Add New Tourist Vehicle to Fleet'}
              </h2>
              <p className="text-xs text-slate-400">
                Registration, odometer tracking & compliance dates
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
              <label className="block text-slate-400 font-medium mb-1">Plate Number *</label>
              <input
                type="text"
                required
                placeholder="MH 02 EE 4589"
                value={formData.plateNumber}
                onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value.toUpperCase() })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono font-bold text-amber-400 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Vehicle Model Category</label>
              <select
                value={formData.modelId}
                onChange={(e) => {
                  const mId = e.target.value;
                  const found = VEHICLE_MODELS.find(v => v.id === mId);
                  setFormData(prev => ({
                    ...prev,
                    modelId: mId,
                    model: found?.name || 'Tourist Cab',
                  }));
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
              >
                {VEHICLE_MODELS.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Variant / Fuel</label>
              <input
                type="text"
                placeholder="ZXi (CNG)"
                value={formData.variant}
                onChange={(e) => setFormData({ ...formData, variant: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Year</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 2024 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-center focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Seating Capacity</label>
              <input
                type="number"
                value={formData.seats}
                onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) || 7 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-center focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Current Odometer (KM)</label>
              <div className="relative">
                <input
                  type="number"
                  required
                  value={formData.currentKm}
                  onChange={(e) => setFormData({ ...formData, currentKm: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono font-bold text-emerald-400 focus:outline-none focus:border-amber-400"
                />
                <span className="absolute right-3 top-2 text-slate-500 font-bold">KM</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Fleet Operational Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-amber-400"
              >
                <option value="Available">Available (Ready for Duty)</option>
                <option value="On Trip">On Trip</option>
                <option value="Maintenance">Maintenance / Service</option>
                <option value="Cleaning">Cleaning & Wash</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Insurance Expiry</label>
              <input
                type="date"
                value={formData.insuranceExpiry || ''}
                onChange={(e) => setFormData({ ...formData, insuranceExpiry: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">PUC Expiry</label>
              <input
                type="date"
                value={formData.pucExpiry || ''}
                onChange={(e) => setFormData({ ...formData, pucExpiry: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Fitness Cert (FC)</label>
              <input
                type="date"
                value={formData.fitnessExpiry || ''}
                onChange={(e) => setFormData({ ...formData, fitnessExpiry: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Service & Equipment Notes</label>
            <textarea
              rows="2"
              placeholder="e.g. Carrier rack installed, new tires, AC cooling excellent..."
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
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
              <span>{vehicleToEdit ? 'Save Vehicle' : 'Add Vehicle'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
