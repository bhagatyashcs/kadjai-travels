import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowRight,
  X
} from 'lucide-react';
import { loginOwner } from '../utils/apiClient';

export default function OwnerLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await loginOwner(identifier, password);
      if (result.success) {
        onLoginSuccess(result.user);
      } else {
        setError(result.error || 'Authentication failed. Please verify credentials.');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl text-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Operations Login</h2>
              <p className="text-xs text-slate-400">Kadjai Travels Dispatch Desk</p>
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
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-slate-400 font-semibold mb-1">
              Username or Registered Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="owner or owner@kadjaitravels.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">
              Secret Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-10 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-xs shadow-lg shadow-amber-500/20"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dispatch Desk'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[10px] text-slate-500 text-center">
            Protected internal interface for managing tourist trips, duty slips, and vehicle odometer records.
          </p>

        </form>

      </div>
    </div>
  );
}
