// Storage and computation utilities for Kadjai Travels Tourist Vehicle Management System

import {
  INITIAL_BOOKINGS,
  INITIAL_VEHICLES,
  INITIAL_DRIVERS,
  VEHICLE_DETAILS
} from '../data/travelData.js';

const STORAGE_KEYS = {
  BOOKINGS: 'kadjai_travel_bookings_v1',
  VEHICLES: 'kadjai_travel_vehicles_v1',
  DRIVERS: 'kadjai_travel_drivers_v1',
};

// Centralized Configurable Pricing Policy for Maruti Suzuki Ertiga (6+1 AC)
export const PRICING_CONFIG = {
  ertiga: {
    name: 'Maruti Suzuki Ertiga',
    seatingCapacity: '6+1 Seater AC',
    // Intercity / Outstation Policy
    outstationRatePerKm: 25,
    outstationMinKmPerDay: 300,
    outstationDriverBataPerDay: 400,
    // One-Way Outstation Policy
    oneWayRatePerKm: 25,
    oneWayMinKm: 150,
    oneWayDriverBata: 400,
    // Mumbai Local City Rental Policy
    localRatePerKm: 15,
    localPackages: {
      '8h_80km': { label: '8 Hours / 80 KM', hours: 8, km: 80, basePrice: 2200 },
      '12h_120km': { label: '12 Hours / 120 KM', hours: 12, km: 120, basePrice: 3200 },
    },
    localExtraKmRate: 15,
    localExtraHourRate: 150,
    // Airport Transfer Policy (CSMIA T1 & T2)
    airportBasePrice: 1800,
    airportOfficialParking: 180,
    airportSeaLinkToll: 100,
    // Night Driving Policy (between 22:00 / 10 PM and 06:00 / 6 AM)
    nightAllowance: 300,
  }
};

// Custom events for reactive UI sync across components
export const notifyDataChanged = () => {
  window.dispatchEvent(new Event('kadjai_data_updated'));
};

/* =========================================================
   BOOKINGS STORAGE
========================================================= */
export const getBookings = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (!raw) {
      saveBookings(INITIAL_BOOKINGS);
      return INITIAL_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse bookings from localStorage:', err);
    return INITIAL_BOOKINGS;
  }
};

export const saveBookings = (bookings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    notifyDataChanged();
  } catch (err) {
    console.error('Failed to save bookings to localStorage:', err);
  }
};

/* =========================================================
   VEHICLES STORAGE
========================================================= */
export const getVehicles = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VEHICLES);
    if (!raw) {
      saveVehicles(INITIAL_VEHICLES);
      return INITIAL_VEHICLES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse vehicles from localStorage:', err);
    return INITIAL_VEHICLES;
  }
};

export const saveVehicles = (vehicles) => {
  try {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
    notifyDataChanged();
  } catch (err) {
    console.error('Failed to save vehicles to localStorage:', err);
  }
};

/* =========================================================
   DRIVERS STORAGE
========================================================= */
export const getDrivers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DRIVERS);
    if (!raw) {
      saveDrivers(INITIAL_DRIVERS);
      return INITIAL_DRIVERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse drivers from localStorage:', err);
    return INITIAL_DRIVERS;
  }
};

export const saveDrivers = (drivers) => {
  try {
    localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(drivers));
    notifyDataChanged();
  } catch (err) {
    console.error('Failed to save drivers to localStorage:', err);
  }
};

/* =========================================================
   RESET ALL TO DEFAULT
========================================================= */
export const resetAllData = () => {
  saveBookings(INITIAL_BOOKINGS);
  saveVehicles(INITIAL_VEHICLES);
  saveDrivers(INITIAL_DRIVERS);
  notifyDataChanged();
};

/* =========================================================
   ID GENERATOR
========================================================= */
export const generateBookingId = (existingBookings = []) => {
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < 10; attempt++) {
    const token = Math.random().toString(16).substring(2, 10).toUpperCase();
    const candidate = `KAD-${year}-${token}`;
    if (!existingBookings.some(b => b.id === candidate)) {
      return candidate;
    }
  }
  return `KAD-${year}-${Date.now().toString(36).toUpperCase()}`;
};

/* =========================================================
   DATE DURATION CALCULATOR (DECIMAL-SAFE)
========================================================= */
export const calculateDaysBetween = (pickupDate, returnDate) => {
  if (!pickupDate || !returnDate) return 1;
  const start = new Date(pickupDate);
  const end = new Date(returnDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
    return 1;
  }
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays + 1);
};

/* =========================================================
   UBER-STYLE GPS ROUTE & DISTANCE ENGINE
========================================================= */
export const KNOWN_HUBS = [
  // Airports
  { name: 'CSMIA Terminal 2 (International)', aliases: ['terminal 2', 't2', 'csmia t2', 'international airport', 'sahar', 'mumbai international airport'], lat: 19.0975, lon: 72.8746, toll: 100, parking: 180, days: 1 },
  { name: 'CSMIA Terminal 1 (Domestic)', aliases: ['terminal 1', 't1', 'csmia t1', 'santacruz airport', 'domestic airport', 'mumbai domestic airport'], lat: 19.0886, lon: 72.8535, toll: 100, parking: 180, days: 1 },
  { name: 'Navi Mumbai International Airport (NMIA)', aliases: ['nmia', 'navi mumbai airport', 'panvel airport'], lat: 18.9894, lon: 73.0722, toll: 100, parking: 150, days: 1 },
  { name: 'Pune Airport (PNQ Lohegaon)', aliases: ['pune airport', 'lohegaon airport', 'pnq'], lat: 18.5822, lon: 73.9197, toll: 430, parking: 150, days: 1 },

  // Mumbai & MMR Suburbs
  { name: 'Bandra West, Mumbai', aliases: ['bandra', 'bandra west', 'bandra east', 'bkc', 'bandra kurla complex', 'carter road', 'linking road'], lat: 19.0596, lon: 72.8295 },
  { name: 'Dadar, Mumbai', aliases: ['dadar', 'prabhadevi', 'matunga', 'central mumbai', 'shivaji park'], lat: 19.0178, lon: 72.8478 },
  { name: 'Andheri, Mumbai', aliases: ['andheri', 'andheri east', 'andheri west', 'marol', 'saki naka', 'versova', 'lokhandwala', 'jb nagar'], lat: 19.1136, lon: 72.8697 },
  { name: 'Thane West', aliases: ['thane', 'thane west', 'thane east', 'ghodbunder', 'ghodbunder road', 'mulund', 'manpada', 'majiwada', 'naupada', 'wagle estate'], lat: 19.2183, lon: 72.9781 },
  { name: 'Vashi, Navi Mumbai', aliases: ['navi mumbai', 'vashi', 'nerul', 'belapur', 'cbd belapur', 'sanpada', 'seawoods', 'airoli', 'ghansoli', 'kopar khairane'], lat: 19.0771, lon: 72.9986 },
  { name: 'Panvel & Kharghar', aliases: ['panvel', 'kharghar', 'kamothe', 'kalamboli', 'ulwe', 'dronagiri', 'taloja'], lat: 18.9894, lon: 73.1175 },
  { name: 'Borivali, Mumbai', aliases: ['borivali', 'borivali west', 'borivali east', 'kandivali', 'malad', 'goregaon', 'jogeshwari'], lat: 19.2307, lon: 72.8567 },
  { name: 'South Mumbai (Colaba & Fort)', aliases: ['colaba', 'nariman point', 'fort', 'cst', 'chhatrapati shivaji terminus', 'marine drive', 'churchgate', 'cuffe parade', 'ballard estate'], lat: 18.9220, lon: 72.8347 },
  { name: 'Worli & Lower Parel', aliases: ['worli', 'lower parel', 'mahalaxmi', 'elphinstone', 'prabhadevi', 'sea face', 'worli sea face'], lat: 19.0144, lon: 72.8180 },
  { name: 'Ghatkopar & Chembur', aliases: ['ghatkopar', 'chembur', 'kurla', 'tilak nagar', 'chunabhatti', 'govandi', 'mankhurd'], lat: 19.0860, lon: 72.9090 },
  { name: 'Powai & Kanjurmarg', aliases: ['powai', 'hiranandani', 'kanjurmarg', 'bhandup', 'vikhroli', 'chandivali', 'iit bombay'], lat: 19.1176, lon: 72.9060 },
  { name: 'Juhu & Santacruz', aliases: ['juhu', 'santacruz', 'vile parle', 'santacruz west', 'santacruz east', 'juhu beach'], lat: 19.1000, lon: 72.8300 },
  { name: 'Mira-Bhayandar & Dahisar', aliases: ['mira road', 'bhayandar', 'dahisar', 'mira bhayandar', 'kashimira'], lat: 19.2813, lon: 72.8561 },
  { name: 'Vasai & Virar', aliases: ['vasai', 'virar', 'nalasopara', 'naigaon', 'vasai west', 'virar west'], lat: 19.3919, lon: 72.8397 },
  { name: 'Kalyan & Dombivli', aliases: ['kalyan', 'dombivli', 'kalyan west', 'dombivli east', 'ulhasnagar', 'badlapur', 'ambernath'], lat: 19.2403, lon: 73.1305 },

  // Maharashtra Highway & Outstation Destinations
  { name: 'Lonavala & Khandala', aliases: ['lonavala', 'khandala', 'ins shivaji', 'tiger point', 'bushy dam'], lat: 18.7557, lon: 73.4091, toll: 320, parking: 100, days: 1 },
  { name: 'Pune', aliases: ['pune', 'hinjewadi', 'pcmc', 'wakad', 'viman nagar', 'kothrud', 'hadapsar', 'baner', 'aundh', 'magarpatta', 'shivajinagar', 'pimpri', 'chinchwad'], lat: 18.5204, lon: 73.8567, toll: 430, parking: 100, days: 1 },
  { name: 'Shirdi Sai Baba', aliases: ['shirdi', 'shani shingnapur', 'kopargaon', 'rahata', 'sai baba temple'], lat: 19.7667, lon: 74.4767, toll: 450, parking: 120, days: 2 },
  { name: 'Mahabaleshwar & Panchgani', aliases: ['mahabaleshwar', 'panchgani', 'wai', 'mapro garden', 'pratapgad', 'venna lake'], lat: 17.9237, lon: 73.6586, toll: 400, parking: 150, days: 2 },
  { name: 'Goa', aliases: ['goa', 'panaji', 'calangute', 'candolim', 'baga', 'madgaon', 'vasco', 'anjuna', 'morjim', 'arambol', 'panjim', 'mapusa', 'south goa', 'north goa'], lat: 15.4909, lon: 73.8278, toll: 850, parking: 200, days: 4 },
  { name: 'Alibaug Coast', aliases: ['alibaug', 'nagaon', 'kashid', 'murud', 'varsoli', 'kihim', 'mandwa', 'revdanda', 'alibag'], lat: 18.6414, lon: 72.8722, toll: 180, parking: 100, days: 1 },
  { name: 'Nashik & Trimbakeshwar', aliases: ['nashik', 'trimbak', 'trimbakeshwar', 'igatpuri', 'sula', 'sula vineyards', 'panchavati', 'muktidham'], lat: 19.9975, lon: 73.7898, toll: 350, parking: 100, days: 2 },
  { name: 'Ratnagiri & Ganpatipule', aliases: ['ratnagiri', 'ganpatipule', 'guhagar', 'jaigad', 'pawas', 'marleshwar'], lat: 16.9902, lon: 73.3120, toll: 500, parking: 120, days: 3 },
  { name: 'Kolhapur', aliases: ['kolhapur', 'mahalaxmi temple kolhapur', 'panhala', 'rankala', 'ichalkaranji'], lat: 16.7050, lon: 74.2433, toll: 600, parking: 120, days: 3 },
  { name: 'Solapur & Pandharpur', aliases: ['solapur', 'pandharpur', 'akkalkot', 'tuljapur', 'vitthal temple'], lat: 17.6599, lon: 75.9064, toll: 580, parking: 120, days: 3 },
  { name: 'Satara & Kaas Plateau', aliases: ['satara', 'kaas pathar', 'kaas plateau', 'thoseghar', 'sajjangad'], lat: 17.6805, lon: 73.9997, toll: 380, parking: 100, days: 2 },
  { name: 'Sangli & Miraj', aliases: ['sangli', 'miraj', 'kupwad', 'tasgaon'], lat: 16.8524, lon: 74.5815, toll: 550, parking: 120, days: 3 },
  { name: 'Chhatrapati Sambhajinagar (Aurangabad)', aliases: ['aurangabad', 'chhatrapati sambhajinagar', 'sambhajinagar', 'ellora', 'ajanta', 'daulatabad', 'grishneshwar'], lat: 19.8762, lon: 75.3433, toll: 520, parking: 120, days: 2 },
  { name: 'Nagpur', aliases: ['nagpur', 'wardha', 'sevagram', 'pench', 'ramtek', 'umred'], lat: 21.1458, lon: 79.0882, toll: 1100, parking: 200, days: 4 },
  { name: 'Jalgaon & Bhusawal', aliases: ['jalgaon', 'bhusawal', 'jamner', 'chalisgaon'], lat: 21.0077, lon: 75.5626, toll: 540, parking: 120, days: 3 },
  { name: 'Dhule & Malegaon', aliases: ['dhule', 'malegaon', 'shirpur', 'sakri'], lat: 20.9042, lon: 74.7749, toll: 450, parking: 100, days: 2 },
  { name: 'Ahmednagar', aliases: ['ahmednagar', 'nagar', 'shrigonda', 'parner'], lat: 19.0948, lon: 74.7480, toll: 380, parking: 100, days: 2 },
  { name: 'Karad', aliases: ['karad', 'shirwal', 'umraj', 'patan'], lat: 17.2892, lon: 74.1812, toll: 450, parking: 100, days: 2 },
  { name: 'Chiplun & Khed', aliases: ['chiplun', 'khed', 'deravan', 'parshuram'], lat: 17.5323, lon: 73.5186, toll: 350, parking: 100, days: 2 },
  { name: 'Malvan & Tarkarli', aliases: ['malvan', 'tarkarli', 'devbagh', 'vengurla', 'scuba tarkarli', 'sindhudurg fort'], lat: 16.0592, lon: 73.4687, toll: 750, parking: 150, days: 4 },
  { name: 'Sawantwadi & Sindhudurg', aliases: ['sawantwadi', 'sindhudurg', 'kudal', 'kankavli', 'amboli', 'amboli ghat'], lat: 15.9056, lon: 73.8188, toll: 750, parking: 150, days: 4 },
  { name: 'Lavasa Hill City', aliases: ['lavasa', 'dasve', 'warasgaon'], lat: 18.4069, lon: 73.5070, toll: 430, parking: 150, days: 1 },
  { name: 'Matheran & Neral', aliases: ['matheran', 'neral', 'aman lodge', 'dasturi'], lat: 18.9865, lon: 73.2673, toll: 180, parking: 150, days: 1 },
  { name: 'Karjat & Chowk', aliases: ['karjat', 'chowk', 'kondana', 'nd studios'], lat: 18.9102, lon: 73.3283, toll: 150, parking: 80, days: 1 },
  { name: 'Igatpuri & Kasara', aliases: ['igatpuri', 'kasara', 'vipassana igatpuri', 'bhavali dam'], lat: 19.6967, lon: 73.5614, toll: 220, parking: 80, days: 1 },

  // Interstate & Western India Destinations
  { name: 'Daman Beach Resort', aliases: ['daman', 'moti daman', 'nani daman', 'devka beach', 'jampore'], lat: 20.3974, lon: 72.8328, toll: 320, parking: 100, days: 2 },
  { name: 'Silvassa (Dadra & Nagar Haveli)', aliases: ['silvassa', 'dadra', 'khanvel'], lat: 20.2763, lon: 73.0083, toll: 300, parking: 100, days: 2 },
  { name: 'Vapi & Valsad', aliases: ['vapi', 'valsad', 'tithal', 'pardi', 'umargam'], lat: 20.3893, lon: 72.9106, toll: 300, parking: 100, days: 2 },
  { name: 'Surat', aliases: ['surat', 'navsari', 'dumas', 'kamrej', 'bardoli'], lat: 21.1702, lon: 72.8311, toll: 450, parking: 150, days: 2 },
  { name: 'Vadodara (Baroda)', aliases: ['vadodara', 'baroda', 'anand', 'nadiad', 'statue of unity', 'kevadiya', 'ekta nagar'], lat: 22.3072, lon: 73.1812, toll: 650, parking: 180, days: 3 },
  { name: 'Ahmedabad', aliases: ['ahmedabad', 'gandhinagar', 'sanand', 'sabarmati', 'sg highway'], lat: 23.0225, lon: 72.5714, toll: 850, parking: 200, days: 3 },
  { name: 'Indore & Ujjain', aliases: ['indore', 'ujjain', 'mahakaleshwar', 'omkareshwar', 'dewas', 'pithampur'], lat: 22.7196, lon: 75.8577, toll: 850, parking: 200, days: 4 },
  { name: 'Belgaum (Belagavi)', aliases: ['belgaum', 'belagavi', 'khanapur', 'nipani', 'sankeshwar'], lat: 15.8497, lon: 74.4977, toll: 720, parking: 180, days: 3 },
  { name: 'Hubli & Dharwad', aliases: ['hubli', 'dharwad', 'hubballi'], lat: 15.3647, lon: 75.1240, toll: 800, parking: 180, days: 4 },
  { name: 'Hyderabad', aliases: ['hyderabad', 'secunderabad', 'hitec city', 'gachibowli', 'cyberabad'], lat: 17.3850, lon: 78.4867, toll: 1100, parking: 200, days: 4 },
  { name: 'Bengaluru (Bangalore)', aliases: ['bengaluru', 'bangalore', 'whitefield', 'electronic city', 'koramangala', 'indiranagar'], lat: 12.9716, lon: 77.5946, toll: 1400, parking: 250, days: 5 },
  { name: 'Udaipur', aliases: ['udaipur', 'lake pichola', 'nathdwara', 'mount abu'], lat: 24.5854, lon: 73.7125, toll: 1200, parking: 250, days: 5 },
  { name: 'Jaipur', aliases: ['jaipur', 'amer', 'ajmer', 'pushkar'], lat: 26.9124, lon: 75.7873, toll: 1600, parking: 250, days: 6 },
  { name: 'Delhi NCR', aliases: ['delhi', 'new delhi', 'noida', 'gurugram', 'gurgaon', 'faridabad', 'ghaziabad'], lat: 28.6139, lon: 77.2090, toll: 2200, parking: 300, days: 6 },
];

export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in KM
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function findHubCoordinates(text) {
  if (!text || typeof text !== 'string') return null;
  const lower = text.toLowerCase().trim();
  for (const hub of KNOWN_HUBS) {
    if (lower === hub.name.toLowerCase() || lower.includes(hub.name.toLowerCase())) return hub;
    for (const alias of hub.aliases) {
      if (lower === alias || lower.includes(alias)) return hub;
    }
  }
  return null;
}

export function searchLocationSuggestions(query = '', limit = 6) {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return KNOWN_HUBS.slice(0, limit).map(h => ({ name: h.name, lat: h.lat, lon: h.lon }));
  }
  const q = query.toLowerCase().trim();
  const matched = [];
  for (const hub of KNOWN_HUBS) {
    const nameMatch = hub.name.toLowerCase().includes(q);
    const aliasMatch = hub.aliases.some(a => a.toLowerCase().includes(q));
    if (nameMatch || aliasMatch) {
      matched.push({ name: hub.name, lat: hub.lat, lon: hub.lon });
      if (matched.length >= limit) break;
    }
  }
  return matched;
}

export function estimateGpsDrivingDistance(lat1, lon1, lat2, lon2, destName = '') {
  const airKm = calculateHaversineDistance(lat1, lon1, lat2, lon2);
  const lowerDest = (destName || '').toLowerCase();
  
  let roadFactor = 1.28;
  if (lowerDest.includes('alibaug')) {
    roadFactor = 2.2; // Coastal creek detours via Pen/Wadkhal
  } else if (lowerDest.includes('mahabaleshwar') || lowerDest.includes('goa') || lowerDest.includes('ratnagiri') || lowerDest.includes('malvan') || lowerDest.includes('sindhudurg')) {
    roadFactor = 1.35; // Western Ghats winding roads / NH-66
  } else if (lowerDest.includes('pune') || lowerDest.includes('lonavala')) {
    roadFactor = 1.26; // Direct Mumbai-Pune Expressway
  } else if (lowerDest.includes('shirdi') || lowerDest.includes('nagpur')) {
    roadFactor = 1.22; // Direct Samruddhi Mahamarg Expressway
  } else if (airKm < 30) {
    roadFactor = 1.30; // City traffic grid
  }

  return Math.max(10, Math.round(airKm * roadFactor));
}

const geocodeCache = new Map();

/**
 * Forward Geocoding Engine: Resolves ANY location in Maharashtra & India to coordinates
 * Covers every city, town, taluka, village, or custom address
 */
export async function geocodeLocation(query) {
  if (!query || typeof query !== 'string') return null;
  const trimmed = query.trim();
  if (trimmed.length < 2) return null;

  // 1. Instant offline hub lookup (0ms)
  const matchedHub = findHubCoordinates(trimmed);
  if (matchedHub) {
    return {
      lat: matchedHub.lat,
      lon: matchedHub.lon,
      name: matchedHub.name,
      isKnownHub: true,
      toll: matchedHub.toll,
      parking: matchedHub.parking,
      days: matchedHub.days,
    };
  }

  // 2. In-memory cache
  const cacheKey = trimmed.toLowerCase();
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey);
  }

  // Check localStorage cache if available
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = window.localStorage.getItem(`kadjai_geo_${cacheKey}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        geocodeCache.set(cacheKey, parsed);
        return parsed;
      }
    } catch {}
  }

  // 3. Live Geocoding via OpenStreetMap Nominatim for any village, town, or address in India
  try {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 4000);
    const searchTarget = trimmed.toLowerCase().includes('india') ? trimmed : `${trimmed}, India`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTarget)}&countrycodes=in&limit=1`;
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { 
        'Accept-Language': 'en',
      },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const results = await res.json();
      if (results && results.length > 0) {
        const item = results[0];
        const geocoded = {
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
          name: item.display_name.split(',').slice(0, 3).join(',').trim(),
          isKnownHub: false,
        };
        geocodeCache.set(cacheKey, geocoded);
        if (typeof window !== 'undefined' && window.localStorage) {
          try {
            window.localStorage.setItem(`kadjai_geo_${cacheKey}`, JSON.stringify(geocoded));
          } catch {}
        }
        return geocoded;
      }
    }
  } catch {
    // Network / timeout safe fallback
  }

  return null;
}

export function detectTripCategory(pickup = '', drop = '', distanceKm = 0) {
  const p = (pickup || '').toLowerCase();
  const d = (drop || '').toLowerCase();

  // 1. Check for Airport Transfers
  const airportKeywords = ['airport', 'csmia', 'terminal 1', 'terminal 2', 't1', 't2', 'sahar', 'santacruz airport'];
  if (airportKeywords.some(k => d.includes(k) || p.includes(k))) {
    return {
      category: 'Airport Transfer',
      label: 'Mumbai Airport Transfer (CSMIA)',
      badge: 'Airport Package',
      explanation: 'Door-to-terminal airport pickup/drop with dedicated flight buffer & luggage assistance.',
      rateSummary: '₹1,800 Flat Base + ₹180 Airport Parking + ₹100 Sea Link/Fastag'
    };
  }

  // 2. Check for Intercity Outstation
  const outstationDestinations = [
    'pune', 'lonavala', 'khandala', 'shirdi', 'nashik', 'trimbak', 'trimbakeshwar',
    'mahabaleshwar', 'panchgani', 'goa', 'alibaug', 'kopargaon', 'igatpuri',
    'surat', 'satara', 'kolhapur', 'aurangabad', 'sambhajinagar', 'maval', 'lavasa',
    'daman', 'silvassa', 'vapi', 'karjat', 'alibaug coast', 'ratnagiri', 'solapur',
    'nagpur', 'chiplun', 'malvan', 'tarkarli', 'sindhudurg', 'sawantwadi', 'ahmednagar',
    'jalgaon', 'dhule', 'sangli', 'miraj', 'matheran', 'neral', 'indore', 'belgaum',
    'valsad', 'baroda', 'vadodara', 'ahmedabad', 'udaipur', 'jaipur', 'delhi', 'bengaluru', 'hyderabad'
  ];

  const isExplicitOutstation = outstationDestinations.some(k => d.includes(k) || p.includes(k));
  if (isExplicitOutstation || distanceKm > 55) {
    return {
      category: 'Outstation',
      label: 'Intercity Outstation Journey',
      badge: 'Intercity Highway',
      explanation: `Highway journey to destination (${distanceKm > 0 ? `~${distanceKm} KM` : 'Outstation route'}). Select Round-Trip or One-Way.`,
      rateSummary: '₹25 / KM + ₹400 / Day Driver Charge + Mandatory Fastag Tolls'
    };
  }

  // 3. Otherwise: Local City Rental
  return {
    category: 'Local Rental',
    label: 'Mumbai Local City Rental',
    badge: 'In-City Coverage',
    explanation: 'Intra-city transit within Mumbai, Thane & Navi Mumbai metropolitan region.',
    rateSummary: '8h / 80km (₹2,200) or 12h / 120km (₹3,200) • Extra KM @ ₹15/KM'
  };
}

/* =========================================================
   DYNAMIC ROUTE, TOLL, PARKING & DRIVER ESTIMATOR
========================================================= */
export const estimateLocationDetails = (
  pickupLocation = '', 
  dropLocation = '', 
  tripType = 'Round Trip', 
  pickupTime = '07:00',
  gpsCoords = null
) => {
  const p = (pickupLocation || '').toLowerCase();
  const d = (dropLocation || '').toLowerCase();
  const t = (tripType || '').toLowerCase();

  const isRoundTrip = t.includes('round') || t.includes('multi-day');
  const isOneWay = t.includes('one way') || t.includes('one-way') || t.includes('drop');
  const isLocal = t.includes('local');
  const isAirport = t.includes('airport');

  let estKmOneWay = 150;
  let estToll = 250;
  let estParking = 0;
  let suggestedDays = 1;
  let isGpsCalculated = false;

  // 1. Dynamic Coordinate Resolution & Driving Distance for ANY Location in India
  let pickupLat = gpsCoords?.pickupLat;
  let pickupLon = gpsCoords?.pickupLon;
  let destLat = gpsCoords?.destLat;
  let destLon = gpsCoords?.destLon;

  if (!pickupLat || !pickupLon) {
    const matchedPickup = findHubCoordinates(pickupLocation);
    if (matchedPickup) {
      pickupLat = matchedPickup.lat;
      pickupLon = matchedPickup.lon;
    } else if (p) {
      // Default baseline to Mumbai coordinates
      pickupLat = 19.0760;
      pickupLon = 72.8777;
    }
  }

  if (!destLat || !destLon) {
    const matchedDest = findHubCoordinates(dropLocation);
    if (matchedDest) {
      destLat = matchedDest.lat;
      destLon = matchedDest.lon;
    }
  }

  if (pickupLat && pickupLon && destLat && destLon) {
    const roadKm = estimateGpsDrivingDistance(
      pickupLat, 
      pickupLon, 
      destLat, 
      destLon, 
      dropLocation
    );
    if (roadKm > 0) {
      estKmOneWay = roadKm;
      isGpsCalculated = true;
    }
  }

  // 2. Verified Landmark Rules & Dynamic Multi-Day / Toll Engine for ANY Destination
  const matchedDestHub = findHubCoordinates(dropLocation);

  if (isAirport || d.includes('airport') || p.includes('airport') || d.includes('csmia') || d.includes('terminal')) {
    if (!isGpsCalculated) estKmOneWay = 45;
    estToll = 100;
    estParking = 180; // Airport parking slip
    suggestedDays = 1;
  } else if (isLocal || d.includes('local') || d.includes('darshan') || d.includes('sightseeing')) {
    if (!isGpsCalculated) estKmOneWay = 40;
    estToll = 0;
    estParking = 150;
    suggestedDays = 1;
  } else if (matchedDestHub && matchedDestHub.toll !== undefined) {
    if (!isGpsCalculated && matchedDestHub.lat && matchedDestHub.lon) {
      estKmOneWay = estimateGpsDrivingDistance(pickupLat, pickupLon, matchedDestHub.lat, matchedDestHub.lon, dropLocation);
    }
    estToll = matchedDestHub.toll || Math.round(estKmOneWay * 1.8);
    estParking = matchedDestHub.parking || 100;
    suggestedDays = matchedDestHub.days || (estKmOneWay > 260 ? 2 : 1);
  } else if (d.includes('lonavala') || d.includes('khandala')) {
    if (!isGpsCalculated) estKmOneWay = 95;
    estToll = 320; // Mumbai-Pune Expressway toll to Lonavala
    estParking = 100;
    suggestedDays = 1;
  } else if (d.includes('pune') || d.includes('hinjewadi') || d.includes('pcmc')) {
    if (!isGpsCalculated) estKmOneWay = 155;
    estToll = 430; // Full Mumbai-Pune Expressway toll
    estParking = 100;
    suggestedDays = 1;
  } else if (d.includes('shirdi') || d.includes('shani') || d.includes('kopargaon')) {
    if (!isGpsCalculated) estKmOneWay = 250;
    estToll = 450; // Samruddhi / NH-160
    estParking = 120;
    suggestedDays = 2;
  } else if (d.includes('mahabaleshwar') || d.includes('panchgani') || d.includes('wai')) {
    if (!isGpsCalculated) estKmOneWay = 265;
    estToll = 400; // NH-48 / Pune-Satara
    estParking = 150; // Tourist municipality entry tax & parking
    suggestedDays = 2;
  } else if (d.includes('goa') || d.includes('panaji') || d.includes('calangute') || d.includes('candolim')) {
    if (!isGpsCalculated) estKmOneWay = 590;
    estToll = 850; // NH-66 / NH-48 tolls
    estParking = 200;
    suggestedDays = 4;
  } else if (d.includes('alibaug') || d.includes('nagaon') || d.includes('kashid') || d.includes('murud')) {
    if (!isGpsCalculated) estKmOneWay = 110;
    estToll = 180;
    estParking = 100;
    suggestedDays = 1;
  } else if (d.includes('nashik') || d.includes('trimbak') || d.includes('igatpuri')) {
    if (!isGpsCalculated) estKmOneWay = 175;
    estToll = 350;
    estParking = 100;
    suggestedDays = 2;
  } else {
    // Dynamic calculation for ANY custom destination in Maharashtra / India
    if (isGpsCalculated) {
      estToll = Math.round(estKmOneWay * 1.8);
      estParking = 100;
      if (estKmOneWay > 500) suggestedDays = Math.max(3, Math.ceil(estKmOneWay / 200));
      else if (estKmOneWay > 260) suggestedDays = 2;
      else suggestedDays = 1;
    } else {
      estKmOneWay = 150;
      estToll = 250;
      estParking = 100;
      suggestedDays = 1;
    }
  }

  // Determine total estimated KM and toll charges based strictly on trip type
  let totalEstKm = estKmOneWay;
  let finalToll = estToll;
  let finalParking = estParking;

  if (isRoundTrip) {
    totalEstKm = estKmOneWay * 2;
    finalToll = estToll * 2;
  } else if (isOneWay) {
    totalEstKm = estKmOneWay;
    finalToll = estToll; // Only one-way toll charged
  } else if (isLocal) {
    totalEstKm = 80;
    finalToll = 0;
    finalParking = 150;
  } else if (isAirport) {
    totalEstKm = 45;
    finalToll = 100;
    finalParking = 180;
  }

  // Check night driving charges (pickup time between 22:00 / 10 PM and 06:00 / 6 AM)
  let nightCharge = 0;
  if (pickupTime && typeof pickupTime === 'string') {
    const hour = parseInt(pickupTime.split(':')[0], 10);
    if (!isNaN(hour) && (hour < 6 || hour >= 22)) {
      nightCharge = PRICING_CONFIG.ertiga.nightAllowance;
    }
  }

  return {
    estKm: Math.round(totalEstKm),
    estToll: Math.round(finalToll),
    estParking: Math.round(finalParking),
    nightCharge: Math.round(nightCharge),
    suggestedDays,
    isGpsCalculated: !!isGpsCalculated,
  };
};

/* =========================================================
   COMPREHENSIVE FARE COMPUTATION ENGINE
   - Decimal-safe money arithmetic
   - Prevents NaN, Infinity, negative fares
   - Fully supports One Way, Round Trip, Local Rental, Airport Transfer
========================================================= */
export const calculateTripFare = ({
  vehicleModelId = 'ertiga',
  tripType = 'Round Trip',
  daysCount = 1,
  startKm = null,
  endKm = null,
  estKm = 300,
  tollCharges = 0,
  parkingCharges = 0,
  nightCharges = 0,
  discount = 0,
  advancePaid = 0,
  customRatePerKm = null,
  localPackage = '8h_80km',
  applyGst = false,
} = {}) => {
  const config = PRICING_CONFIG.ertiga;
  const t = String(tripType || '').toLowerCase();

  const isRoundTrip = t.includes('round') || t.includes('multi-day');
  const isOneWay = t.includes('one way') || t.includes('one-way') || t.includes('drop');
  const isLocal = t.includes('local');
  const isAirport = t.includes('airport');

  // Days: minimum 1 day, positive integer
  const days = Math.max(1, Math.round(Number(daysCount) || 1));

  // Actual KM if odometer readings are available
  let totalActualKm = null;
  if (startKm !== null && endKm !== null && !isNaN(Number(startKm)) && !isNaN(Number(endKm))) {
    const s = Number(startKm);
    const e = Number(endKm);
    if (e >= s) {
      totalActualKm = Math.round(e - s);
    }
  }

  // Sanitized distance to evaluate (must be >= 0)
  const rawEstKm = Math.max(0, Math.round(Number(estKm) || 0));
  const kmToConsider = totalActualKm !== null ? totalActualKm : rawEstKm;

  let ratePerKm = config.outstationRatePerKm;
  let billableKm = kmToConsider;
  let baseFare = 0;
  let driverBataTotal = 0;
  let driverBataPerDay = 0;
  let minKmApplied = 0;

  if (isLocal) {
    // -----------------------------------------------------------
    // LOCAL CITY RENTAL (8h/80km: ₹2,200 or 12h/120km: ₹3,200)
    // -----------------------------------------------------------
    const selectedPkg = config.localPackages[localPackage] || config.localPackages['8h_80km'];
    ratePerKm = customRatePerKm !== null && !isNaN(Number(customRatePerKm)) && Number(customRatePerKm) > 0
      ? Number(customRatePerKm)
      : config.localExtraKmRate;

    const basePkgPrice = selectedPkg.basePrice;
    const includedKm = selectedPkg.km;
    minKmApplied = includedKm;

    const extraKm = Math.max(0, kmToConsider - includedKm);
    billableKm = Math.max(includedKm, kmToConsider);
    baseFare = Math.round(basePkgPrice + (extraKm * ratePerKm));
    driverBataPerDay = 0; // Driver duty included in in-city rental package
    driverBataTotal = 0;

  } else if (isAirport) {
    // -----------------------------------------------------------
    // AIRPORT TRANSFER (CSMIA T1 & T2)
    // -----------------------------------------------------------
    ratePerKm = config.localRatePerKm;
    minKmApplied = 45;
    billableKm = Math.max(45, kmToConsider);
    baseFare = Math.round(config.airportBasePrice);
    driverBataPerDay = 0;
    driverBataTotal = 0;

  } else if (isOneWay) {
    // -----------------------------------------------------------
    // ONE WAY OUTSTATION (Calculates ONLY one-way distance)
    // -----------------------------------------------------------
    ratePerKm = customRatePerKm !== null && !isNaN(Number(customRatePerKm)) && Number(customRatePerKm) > 0
      ? Number(customRatePerKm)
      : config.oneWayRatePerKm;

    minKmApplied = config.oneWayMinKm;
    billableKm = Math.max(config.oneWayMinKm, kmToConsider);
    baseFare = Math.round(billableKm * ratePerKm);
    driverBataPerDay = config.oneWayDriverBata;
    driverBataTotal = config.oneWayDriverBata; // One-way day trip duty

  } else {
    // -----------------------------------------------------------
    // ROUND TRIP OUTSTATION (300 KM / calendar day minimum)
    // -----------------------------------------------------------
    ratePerKm = customRatePerKm !== null && !isNaN(Number(customRatePerKm)) && Number(customRatePerKm) > 0
      ? Number(customRatePerKm)
      : config.outstationRatePerKm;

    const minQuota = days * config.outstationMinKmPerDay;
    minKmApplied = minQuota;
    billableKm = Math.max(minQuota, kmToConsider);
    baseFare = Math.round(billableKm * ratePerKm);
    driverBataPerDay = config.outstationDriverBataPerDay;
    driverBataTotal = Math.round(days * config.outstationDriverBataPerDay);
  }

  // Ancillary components (strictly non-negative)
  const tolls = Math.max(0, Math.round(Number(tollCharges) || 0));
  const parking = Math.max(0, Math.round(Number(parkingCharges) || 0));
  const night = Math.max(0, Math.round(Number(nightCharges) || 0));
  const disc = Math.max(0, Math.round(Number(discount) || 0));

  // Subtotal and Total Fare
  const subtotal = Math.max(0, Math.round(baseFare + driverBataTotal + tolls + parking + night - disc));
  const gstTax = applyGst ? Math.round(subtotal * 0.05) : 0;
  const totalFare = Math.max(0, subtotal + gstTax);

  // Advance paid and balance due
  const advance = Math.max(0, Math.round(Number(advancePaid) || 0));
  const balanceDue = Math.max(0, totalFare - advance);

  let paymentStatus = 'Pending';
  if (totalFare > 0 && advance >= totalFare) {
    paymentStatus = 'Paid';
  } else if (advance > 0) {
    paymentStatus = 'Partial';
  }

  return {
    tripType,
    vehicleModelId,
    ratePerKm,
    minKmPerDay: minKmApplied,
    daysCount: days,
    totalKm: totalActualKm,
    billableKm,
    baseFare,
    extraKmCharge: 0,
    driverBataPerDay,
    driverBataTotal,
    tollCharges: tolls,
    parkingCharges: parking,
    nightCharges: night,
    discount: disc,
    subtotal,
    gstTax,
    totalFare,
    advancePaid: advance,
    balanceDue,
    paymentStatus,
    isEstimate: true,
  };
};

/* =========================================================
   EXPORT BOOKINGS TO CSV (SAFE QUOTING)
========================================================= */
export const exportBookingsToCSV = (bookings = []) => {
  if (!bookings || bookings.length === 0) return;

  const headers = [
    'Booking ID',
    'Customer Name',
    'Phone',
    'Trip Type',
    'Route',
    'Pickup Date',
    'Pickup Time',
    'Return Date',
    'Days',
    'Vehicle',
    'Vehicle Number',
    'Driver',
    'Driver Phone',
    'Start KM',
    'End KM',
    'Total KM',
    'Billable KM',
    'Base Fare (INR)',
    'Driver Charge (INR)',
    'Tolls & Parking (INR)',
    'Total Fare (INR)',
    'Advance Paid (INR)',
    'Balance Due (INR)',
    'Payment Status',
    'Trip Status',
  ];

  const escapeCsv = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = bookings.map(b => [
    escapeCsv(b.id),
    escapeCsv(b.customerName),
    escapeCsv(b.customerPhone),
    escapeCsv(b.tripType),
    escapeCsv(b.route),
    escapeCsv(b.pickupDate),
    escapeCsv(b.pickupTime),
    escapeCsv(b.returnDate),
    b.daysCount || 1,
    escapeCsv(b.vehicleModelId),
    escapeCsv(b.vehiclePlateNumber),
    escapeCsv(b.driverName),
    escapeCsv(b.driverPhone),
    b.startKm ?? '',
    b.endKm ?? '',
    b.totalKm ?? '',
    b.billableKm ?? '',
    b.baseFare ?? '',
    b.driverBataTotal ?? '',
    (Number(b.tollCharges || 0) + Number(b.parkingCharges || 0)),
    b.totalFare ?? '',
    b.advancePaid ?? '',
    b.balanceDue ?? '',
    escapeCsv(b.paymentStatus),
    escapeCsv(b.status),
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Kadjai_Travels_Trips_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
