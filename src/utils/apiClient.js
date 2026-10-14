/**
 * KADJAI TRAVELS - TVMS API CLIENT & ADAPTER
 * Seamless dual-mode: Communicates with Express + SQLite REST API (/api),
 * with resilient automatic fallback to local persistence if offline.
 */

import {
  getBookings,
  saveBookings,
  getVehicles,
  saveVehicles,
  getDrivers,
  saveDrivers,
  generateBookingId,
} from './travelStorage';

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) 
  ? import.meta.env.VITE_API_URL 
  : '/api';
const AUTH_TOKEN_KEY = 'kadjai_tvms_auth_token';
const AUTH_USER_KEY = 'kadjai_tvms_auth_user';

// ============================================================================
// AUTHENTICATION UTILITIES
// ============================================================================

export function getAuthToken() {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAuthSession(token, user) {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } catch (err) {
    console.error('Failed to save auth session', err);
  }
}

export function clearAuthSession() {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  } catch (err) {
    console.error('Failed to clear auth session', err);
  }
}

export function isAuthenticated() {
  const token = getAuthToken();
  const user = getCurrentUser();
  return Boolean(token && user);
}

/**
 * Perform login against backend or local credentials
 */
export async function loginOwner(identifier, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });

    if (res.ok) {
      const data = await res.json();
      setAuthSession(data.token, data.user);
      return { success: true, user: data.user };
    }

    const errData = await res.json().catch(() => ({}));
    return { success: false, error: errData.error || 'Invalid credentials' };
  } catch (networkErr) {
    return { 
      success: false, 
      error: 'Backend authentication service unreachable. Please check network connection and ensure TVMS server is running.' 
    };
  }
}

export function logoutOwner() {
  clearAuthSession();
}

// ============================================================================
// OPERATIONS & BOOKINGS API
// ============================================================================

function getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function fetchBookings() {
  try {
    const res = await fetch(`${API_BASE}/bookings`, {
      headers: getHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      // Keep local storage in sync as a cache
      saveBookings(data);
      return data;
    }
  } catch (err) {
    console.warn('Fetch bookings from server failed, falling back to local storage', err);
  }
  return getBookings();
}

export async function submitBookingEnquiry(enquiryData) {
  try {
    // Omit any client-side ID so the server generates a collision-resistant reference
    const { id: _ignoredId, ...payload } = enquiryData;
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const result = await res.json();
      return result.booking;
    }
  } catch (err) {
    console.warn('Submit booking to server failed, falling back to local storage', err);
  }

  // Fallback local save
  const existing = getBookings();
  const year = new Date().getFullYear();
  const hexSuffix = Math.random().toString(16).substring(2, 10).toUpperCase();
  const newId = `KAD-${year}-${hexSuffix}`;
  const localBooking = {
    ...enquiryData,
    id: newId,
    status: 'Enquiry Received',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveBookings([localBooking, ...existing]);
  return localBooking;
}

export async function updateBookingApi(id, bookingData) {
  try {
    const res = await fetch(`${API_BASE}/bookings/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(bookingData),
    });
    if (res.ok) {
      const result = await res.json();
      return result.booking;
    }
  } catch (err) {
    console.warn('Update booking on server failed, falling back to local storage', err);
  }

  const existing = getBookings();
  const updated = existing.map(b => b.id === id ? { ...b, ...bookingData, updatedAt: new Date().toISOString() } : b);
  saveBookings(updated);
  return updated.find(b => b.id === id);
}

export async function updateBookingStatusApi(id, status) {
  try {
    const res = await fetch(`${API_BASE}/bookings/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const result = await res.json();
      return result.booking;
    }
  } catch (err) {
    console.warn('Update status on server failed, falling back to local storage', err);
  }

  const existing = getBookings();
  const updated = existing.map(b => b.id === id ? { ...b, status, updatedAt: new Date().toISOString() } : b);
  saveBookings(updated);
  return updated.find(b => b.id === id);
}

export async function deleteBookingApi(id) {
  try {
    const res = await fetch(`${API_BASE}/bookings/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (res.ok) {
      return true;
    }
  } catch (err) {
    console.warn('Delete booking on server failed, falling back to local storage', err);
  }

  const existing = getBookings();
  saveBookings(existing.filter(b => b.id !== id));
  return true;
}

/**
 * Public Customer Tracking Lookup (Requires both ID and Phone)
 */
export async function trackTripApi(bookingId, phone) {
  try {
    const query = new URLSearchParams({ id: bookingId.trim(), phone: phone.trim() }).toString();
    const res = await fetch(`${API_BASE}/track?${query}`);
    if (res.ok) {
      return await res.json();
    }
    if (res.status === 404 || res.status === 400) {
      const err = await res.json();
      return { error: err.error };
    }
  } catch (err) {
    console.warn('Track trip on server failed, using local lookup', err);
  }

  // Fallback local lookup
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const existing = getBookings();
  const found = existing.find(b => b.id?.toLowerCase() === bookingId.trim().toLowerCase());
  if (!found) {
    return { error: 'No booking found matching this Reference ID.' };
  }

  const dbPhoneClean = (found.customerPhone || '').replace(/[^0-9]/g, '');
  if (!dbPhoneClean.endsWith(cleanPhone.slice(-10)) && !cleanPhone.endsWith(dbPhoneClean.slice(-10))) {
    return { error: 'The phone number provided does not match the registered customer contact.' };
  }

  return found;
}

// ============================================================================
// EXPENSES & ANALYTICS API
// ============================================================================

export async function fetchAnalyticsApi() {
  try {
    const res = await fetch(`${API_BASE}/analytics`, {
      headers: getHeaders(),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Fetch analytics from server failed', err);
  }
  return null;
}

export async function fetchExpensesApi(bookingId = null) {
  try {
    const url = bookingId ? `${API_BASE}/expenses?bookingId=${bookingId}` : `${API_BASE}/expenses`;
    const res = await fetch(url, { headers: getHeaders() });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Fetch expenses failed', err);
  }
  return [];
}

export async function logExpenseApi(expenseData) {
  try {
    const res = await fetch(`${API_BASE}/expenses`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(expenseData),
    });
    if (res.ok) {
      const result = await res.json();
      return result.expense;
    }
  } catch (err) {
    console.warn('Log expense failed', err);
  }
  return null;
}

export async function deleteExpenseApi(id) {
  try {
    const res = await fetch(`${API_BASE}/expenses/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.ok;
  } catch (err) {
    console.warn('Delete expense failed', err);
    return false;
  }
}

export async function saveDutySlipApi(dutySlipData) {
  try {
    const res = await fetch(`${API_BASE}/duty-slips`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(dutySlipData),
    });
    if (res.ok) {
      const result = await res.json();
      return result.dutySlip;
    }
  } catch (err) {
    console.warn('Save duty slip on server failed', err);
  }
  return null;
}
