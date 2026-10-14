import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, booking, onConfirm, onCancel }) {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 overflow-hidden text-slate-100">
        <div className="flex items-start gap-4 mb-5">
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-white mb-1">Delete Booking Record?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to cancel and remove booking <span className="font-mono text-amber-400 font-bold">{booking.id}</span>? This action cannot be undone.
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Booking Summary Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 mb-6 text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span>Booking ID:</span>
            <span className="font-mono font-bold text-amber-400">{booking.id}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Customer:</span>
            <span className="font-semibold text-white">{booking.customerName} ({booking.customerPhone})</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Route:</span>
            <span className="font-semibold text-slate-200">{booking.route}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Date & Status:</span>
            <span className="font-medium text-slate-300">{booking.pickupDate} • {booking.status}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition"
          >
            Keep Booking
          </button>
          <button
            type="button"
            onClick={() => onConfirm(booking.id)}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-900/30 flex items-center gap-2 transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Booking</span>
          </button>
        </div>
      </div>
    </div>
  );
}
