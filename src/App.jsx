import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { ShieldCheck, KeyRound } from 'lucide-react';

// Core Website Header & Footer
import Header from './components/Header';
import Footer from './components/Footer';

// Website Pages
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import VehiclesPage from './pages/VehiclesPage';
import DestinationsPage from './pages/DestinationsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

// TVMS Operations Components
import AdminDashboard from './components/AdminDashboard';
import BookingModal from './components/BookingModal';
import TripActionModal from './components/TripActionModal';
import DutySlipModal from './components/DutySlipModal';
import DriverModal from './components/DriverModal';
import VehicleModal from './components/VehicleModal';
import TrackBookingModal from './components/TrackBookingModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import OwnerLoginModal from './components/OwnerLoginModal';
import ErrorBoundary from './components/ErrorBoundary';
import Toast from './components/Toast';

// Storage & Data utilities
import {
  getBookings,
  saveBookings,
  getVehicles,
  saveVehicles,
  getDrivers,
  saveDrivers,
  generateBookingId,
  resetAllData
} from './utils/travelStorage';

// API Client for Live Backend with local fallback
import {
  fetchBookings,
  submitBookingEnquiry,
  updateBookingApi,
  updateBookingStatusApi,
  deleteBookingApi,
  saveDutySlipApi,
  isAuthenticated,
  logoutOwner
} from './utils/apiClient';

export default function App() {
  // Primary persistent state
  const [bookings, setBookings] = useState(() => getBookings());
  const [vehicles, setVehicles] = useState(() => getVehicles());
  const [drivers, setDrivers] = useState(() => getDrivers());

  // Page Routing State: 'home' | 'services' | 'vehicles' | 'destinations' | 'about' | 'contact' | 'operations'
  const [currentPage, setCurrentPage] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    const validPages = ['home', 'services', 'vehicles', 'destinations', 'about', 'contact', 'operations'];
    return validPages.includes(hash) ? hash : 'home';
  });

  // Owner Authentication State
  const [isOwnerLoggedIn, setIsOwnerLoggedIn] = useState(() => isAuthenticated());
  const [isOwnerLoginModalOpen, setIsOwnerLoginModalOpen] = useState(false);

  // Selected destination state for pre-filling booking form across pages
  const [selectedDestination, setSelectedDestination] = useState('');

  // Modals state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingToEdit, setBookingToEdit] = useState(null);

  const [isTripActionModalOpen, setIsTripActionModalOpen] = useState(false);
  const [tripActionMode, setTripActionMode] = useState('start'); // 'start' | 'end'
  const [activeActionBooking, setActiveActionBooking] = useState(null);

  const [isDutySlipModalOpen, setIsDutySlipModalOpen] = useState(false);
  const [dutySlipBooking, setDutySlipBooking] = useState(null);

  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [driverToEdit, setDriverToEdit] = useState(null);

  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState(null);

  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  // Toast feedback
  const [toast, setToast] = useState(null);

  const showToast = useCallback((type, title, message) => {
    setToast({ type, title, message });
  }, []);

  // Fetch from server API on mount if available
  useEffect(() => {
    let mounted = true;
    fetchBookings().then(data => {
      if (mounted && Array.isArray(data) && data.length > 0) {
        setBookings(data);
      }
    });
    return () => { mounted = false; };
  }, []);

  // Handle hash changes and guard operations page with login modal
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validPages = ['home', 'services', 'vehicles', 'destinations', 'about', 'contact', 'operations'];
      if (validPages.includes(hash)) {
        setCurrentPage(hash);
        if (hash === 'operations' && !isAuthenticated()) {
          setIsOwnerLoginModalOpen(true);
        }
      }
    };
    handleHashChange(); // Sync immediately on component mount
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync hash when navigating
  const navigateTo = (pageId) => {
    setCurrentPage(pageId);
    window.location.hash = pageId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (pageId === 'operations' && !isAuthenticated()) {
      setIsOwnerLoginModalOpen(true);
    }
  };

  // Listen to cross-tab storage changes
  useEffect(() => {
    const handleUpdate = () => {
      setBookings(getBookings());
      setVehicles(getVehicles());
      setDrivers(getDrivers());
    };
    window.addEventListener('kadjai_data_updated', handleUpdate);
    return () => window.removeEventListener('kadjai_data_updated', handleUpdate);
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#eab308', '#10b981', '#38bdf8', '#f59e0b']
      });
    } catch {
      // Safe fallback
    }
  };

  /* =========================================================
     OPERATIONS: CREATE / EDIT BOOKING (ADMIN DISPATCH DESK)
  ========================================================= */
  const handleSaveBooking = async (bookingData) => {
    if (bookingToEdit && bookingData.id) {
      // Edit existing
      const updated = bookings.map(b => b.id === bookingData.id ? { ...b, ...bookingData } : b);
      setBookings(updated);
      saveBookings(updated);
      await updateBookingApi(bookingData.id, bookingData);
      showToast('success', 'Booking Updated', `Booking ${bookingData.id} details have been saved.`);
    } else {
      // Create new booking
      const newId = generateBookingId(bookings);
      const newBooking = {
        ...bookingData,
        id: newId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updated = [newBooking, ...bookings];
      setBookings(updated);
      saveBookings(updated);
      await submitBookingEnquiry(newBooking);

      // If vehicle assigned and in progress, update vehicle status
      if (newBooking.vehicleId && newBooking.status === 'In Progress') {
        const updatedVehicles = vehicles.map(v => 
          v.id === newBooking.vehicleId ? { ...v, status: 'On Trip', activeTripId: newId } : v
        );
        setVehicles(updatedVehicles);
        saveVehicles(updatedVehicles);
      }

      triggerConfetti();
      showToast('success', 'New Booking Created!', `Reference ${newId} confirmed for ${newBooking.customerName}.`);
    }

    setIsBookingModalOpen(false);
    setBookingToEdit(null);
  };

  /* =========================================================
     PUBLIC SITE: CUSTOMER INQUIRY SUBMISSION
  ========================================================= */
  const handleCustomerSiteBookingSubmit = async (inquiryData) => {
    const savedBooking = await submitBookingEnquiry(inquiryData);
    const assignedId = savedBooking?.id || generateBookingId(bookings);

    const updated = [
      savedBooking || { ...inquiryData, id: assignedId, status: 'Enquiry Received' },
      ...bookings.filter(b => b.id !== assignedId)
    ];
    setBookings(updated);
    saveBookings(updated);

    triggerConfetti();
    showToast(
      'success', 
      'Booking Request Received!', 
      `Your booking ref is ${assignedId}. Our team will review and confirm driver allocation.`
    );
  };

  /* =========================================================
     OPERATIONS: 7-STAGE STATUS CHANGE
  ========================================================= */
  const handleStatusChange = async (bookingId, newStatus) => {
    const updated = bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b);
    setBookings(updated);
    saveBookings(updated);
    await updateBookingStatusApi(bookingId, newStatus);
    showToast('info', 'Status Updated', `Booking ${bookingId} transitioned to ${newStatus}.`);
  };

  /* =========================================================
     OPERATIONS: START TRIP (RECORD OPENING KM)
  ========================================================= */
  const handleConfirmStartTrip = async ({ bookingId, startKm, departureTime }) => {
    const targetBooking = bookings.find(b => b.id === bookingId);
    if (!targetBooking) return;

    // 1. Update Booking
    const updatedBookings = bookings.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'In Progress',
          startKm: Number(startKm),
          pickupTime: departureTime || b.pickupTime,
          updatedAt: new Date().toISOString(),
        };
      }
      return b;
    });
    setBookings(updatedBookings);
    saveBookings(updatedBookings);
    await updateBookingApi(bookingId, { status: 'In Progress', startKm: Number(startKm) });

    // 2. Update Vehicle to On Trip
    if (targetBooking.vehicleId) {
      const updatedVehicles = vehicles.map(v => {
        if (v.id === targetBooking.vehicleId) {
          return {
            ...v,
            status: 'On Trip',
            currentKm: Number(startKm),
            activeTripId: bookingId,
          };
        }
        return v;
      });
      setVehicles(updatedVehicles);
      saveVehicles(updatedVehicles);
    }

    // 3. Update Driver to On Trip
    if (targetBooking.driverId) {
      const updatedDrivers = drivers.map(d => {
        if (d.id === targetBooking.driverId) {
          return {
            ...d,
            status: 'On Trip',
            activeTripId: bookingId,
          };
        }
        return d;
      });
      setDrivers(updatedDrivers);
      saveDrivers(updatedDrivers);
    }

    setIsTripActionModalOpen(false);
    setActiveActionBooking(null);
    showToast('success', 'Trip Started!', `Opening meter recorded at ${startKm} KM. Vehicle is now on the road.`);
  };

  /* =========================================================
     OPERATIONS: END TRIP (RECORD CLOSING KM & BILL)
  ========================================================= */
  const handleConfirmEndTrip = async (finalTripData) => {
    const targetBooking = bookings.find(b => b.id === finalTripData.bookingId);
    if (!targetBooking) return;

    // 1. Update Booking to Completed with final duty calculations
    const updatedBookings = bookings.map(b => {
      if (b.id === finalTripData.bookingId) {
        return {
          ...b,
          ...finalTripData,
          status: 'Completed',
          updatedAt: new Date().toISOString(),
        };
      }
      return b;
    });
    setBookings(updatedBookings);
    saveBookings(updatedBookings);
    await updateBookingApi(finalTripData.bookingId, { ...finalTripData, status: 'Completed' });

    // 2. Free up Vehicle to Available
    if (targetBooking.vehicleId) {
      const updatedVehicles = vehicles.map(v => {
        if (v.id === targetBooking.vehicleId) {
          return {
            ...v,
            status: 'Available',
            currentKm: Number(finalTripData.endKm),
            activeTripId: null,
          };
        }
        return v;
      });
      setVehicles(updatedVehicles);
      saveVehicles(updatedVehicles);
    }

    // 3. Free up Driver to Available
    if (targetBooking.driverId) {
      const updatedDrivers = drivers.map(d => {
        if (d.id === targetBooking.driverId) {
          return {
            ...d,
            status: 'Available',
            activeTripId: null,
            tripsCompleted: (d.tripsCompleted || 0) + 1,
          };
        }
        return d;
      });
      setDrivers(updatedDrivers);
      saveDrivers(updatedDrivers);
    }

    setIsTripActionModalOpen(false);
    setActiveActionBooking(null);

    // Save duty slip to database
    await saveDutySlipApi({
      bookingId: finalTripData.bookingId,
      openingKm: Number(finalTripData.startKm || targetBooking.startKm),
      closingKm: Number(finalTripData.endKm),
      totalDistanceKm: Number(finalTripData.totalKm),
      billableDistanceKm: Number(finalTripData.billableKm || finalTripData.totalKm),
      baseAmount: Number(finalTripData.baseFare),
      driverBata: Number(finalTripData.driverBataTotal || 0),
      fastagTolls: Number(finalTripData.tollCharges || 0),
      parkingTaxes: Number(finalTripData.parkingCharges || 0),
      nightAllowance: Number(finalTripData.nightCharges || 0),
      totalBilled: Number(finalTripData.totalFare),
      advanceSettled: Number(finalTripData.advancePaid || 0),
      balancePayable: Number(finalTripData.balanceDue || 0),
      paymentMode: finalTripData.paymentMode || 'Cash / UPI',
    });

    // Automatically prompt printable duty slip
    const completedBooking = updatedBookings.find(b => b.id === finalTripData.bookingId);
    setDutySlipBooking(completedBooking);
    setIsDutySlipModalOpen(true);

    showToast('success', 'Trip Completed!', `Closing meter logged at ${finalTripData.endKm} KM. Duty slip generated.`);
  };

  /* =========================================================
     OPERATIONS: DELETE BOOKING
  ========================================================= */
  const handleDeleteBooking = async (bookingId) => {
    const updated = bookings.filter(b => b.id !== bookingId);
    setBookings(updated);
    saveBookings(updated);
    await deleteBookingApi(bookingId);
    setBookingToDelete(null);
    showToast('info', 'Booking Deleted', `Booking ${bookingId} was successfully removed.`);
  };

  /* =========================================================
     OPERATIONS: DRIVER & VEHICLE SAVING
  ========================================================= */
  const handleSaveDriver = (driverData) => {
    let updated;
    const exists = drivers.find(d => d.id === driverData.id);
    if (exists) {
      updated = drivers.map(d => d.id === driverData.id ? driverData : d);
      showToast('success', 'Driver Updated', `Details for ${driverData.name} saved.`);
    } else {
      updated = [...drivers, driverData];
      showToast('success', 'Driver Added', `${driverData.name} added to driver roster.`);
    }
    setDrivers(updated);
    saveDrivers(updated);
    setIsDriverModalOpen(false);
    setDriverToEdit(null);
  };

  const handleSaveVehicle = (vehicleData) => {
    let updated;
    const exists = vehicles.find(v => v.id === vehicleData.id);
    if (exists) {
      updated = vehicles.map(v => v.id === vehicleData.id ? vehicleData : v);
      showToast('success', 'Vehicle Updated', `Vehicle ${vehicleData.plateNumber} updated.`);
    } else {
      updated = [...vehicles, vehicleData];
      showToast('success', 'Vehicle Added', `Vehicle ${vehicleData.plateNumber} added to fleet.`);
    }
    setVehicles(updated);
    saveVehicles(updated);
    setIsVehicleModalOpen(false);
    setVehicleToEdit(null);
  };

  /* =========================================================
     RESET TO SAMPLE DATA
  ========================================================= */
  const handleResetData = () => {
    if (window.confirm('Reset all bookings, fleet vehicles, and drivers to default sample data?')) {
      resetAllData();
      setBookings(getBookings());
      setVehicles(getVehicles());
      setDrivers(getDrivers());
      showToast('info', 'Data Reset', 'All tourist travel data restored to defaults.');
    }
  };

  /* =========================================================
     OWNER AUTHENTICATION HANDLERS
  ========================================================= */
  const handleLoginSuccess = (user) => {
    setIsOwnerLoggedIn(true);
    setIsOwnerLoginModalOpen(false);
    setCurrentPage('operations');
    window.location.hash = 'operations';
    showToast('success', 'Authenticated', `Welcome back, ${user.fullName || 'Proprietor'}!`);
  };

  const handleLogout = () => {
    logoutOwner();
    setIsOwnerLoggedIn(false);
    setCurrentPage('home');
    window.location.hash = 'home';
    showToast('info', 'Signed Out', 'You have been signed out of the Dispatch Desk.');
  };

  // Count active trips
  const activeTripsCount = bookings.filter(b => b.status === 'In Progress').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Universal Sticky Header */}
      <Header
        currentPage={currentPage}
        onNavigate={navigateTo}
        onOpenBooking={() => {
          if (currentPage !== 'home') {
            navigateTo('home');
          }
          setTimeout(() => {
            const el = document.getElementById('booking-enquiry-panel');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        onOpenTrackBooking={() => setIsTrackModalOpen(true)}
        activeTripsCount={activeTripsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        <ErrorBoundary>
          {currentPage === 'home' && (
          <HomePage
            onNavigate={navigateTo}
            defaultDestination={selectedDestination}
            onSelectDestinationForBooking={(dest) => setSelectedDestination(dest)}
            onSubmitBooking={handleCustomerSiteBookingSubmit}
            onOpenTrackBooking={() => setIsTrackModalOpen(true)}
          />
        )}

        {currentPage === 'services' && (
          <ServicesPage
            onNavigate={navigateTo}
            onBookService={() => {
              navigateTo('home');
              setTimeout(() => {
                const el = document.getElementById('booking-enquiry-panel');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
          />
        )}

        {currentPage === 'vehicles' && (
          <VehiclesPage onNavigate={navigateTo} />
        )}

        {currentPage === 'destinations' && (
          <DestinationsPage
            onNavigate={navigateTo}
            onSelectDestinationForBooking={(dest) => setSelectedDestination(dest)}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage 
            onNavigate={navigateTo} 
            onOpenTrackBooking={() => setIsTrackModalOpen(true)}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage onSubmitBooking={handleCustomerSiteBookingSubmit} />
        )}

        {currentPage === 'operations' && (
          isOwnerLoggedIn ? (
            <div className="py-6">
              <AdminDashboard
                bookings={bookings}
                vehicles={vehicles}
                drivers={drivers}
                onNewBooking={(prefill = null) => {
                  setBookingToEdit(prefill ? { ...prefill } : null);
                  setIsBookingModalOpen(true);
                }}
                onEditBooking={(b) => {
                  setBookingToEdit(b);
                  setIsBookingModalOpen(true);
                }}
                onStartTrip={(b) => {
                  setActiveActionBooking(b);
                  setTripActionMode('start');
                  setIsTripActionModalOpen(true);
                }}
                onEndTrip={(b) => {
                  setActiveActionBooking(b);
                  setTripActionMode('end');
                  setIsTripActionModalOpen(true);
                }}
                onViewDutySlip={(b) => {
                  setDutySlipBooking(b);
                  setIsDutySlipModalOpen(true);
                }}
                onDeleteBooking={(b) => setBookingToDelete(b)}
                onStatusChange={handleStatusChange}
                onAddVehicle={() => {
                  setVehicleToEdit(null);
                  setIsVehicleModalOpen(true);
                }}
                onEditVehicle={(v) => {
                  setVehicleToEdit(v);
                  setIsVehicleModalOpen(true);
                }}
                onAddDriver={() => {
                  setDriverToEdit(null);
                  setIsDriverModalOpen(true);
                }}
                onEditDriver={(d) => {
                  setDriverToEdit(d);
                  setIsDriverModalOpen(true);
                }}
                onResetData={handleResetData}
                onLogout={handleLogout}
              />
            </div>
          ) : (
            <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
              <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl shadow-slate-950/50">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-5 shadow-lg shadow-amber-500/10">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
                  Operations Desk Restricted
                </span>

                <h2 className="text-xl font-extrabold text-white mb-2">
                  Operations & Dispatch Portal
                </h2>
                
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  This internal dashboard is restricted to Kadjai Travels management and authorized fleet dispatchers. Please authenticate to manage active duties, duty slips, and customer trips.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => setIsOwnerLoginModalOpen(true)}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3.5 px-6 rounded-xl transition flex items-center justify-center gap-2 text-xs shadow-lg shadow-amber-500/20 cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Sign In to Operations Desk</span>
                  </button>

                  <button
                    onClick={() => navigateTo('home')}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-3 px-6 rounded-xl transition text-xs border border-slate-700 cursor-pointer"
                  >
                    Return to Public Website
                  </button>
                </div>
              </div>
            </div>
          )
        )}
        </ErrorBoundary>
      </main>

      {/* Website Footer (Displayed on all pages, including shortcut to operations) */}
      <Footer onNavigate={navigateTo} />

      {/* =========================================================
          OPERATIONAL MODALS
      ========================================================= */}
      
      {/* 0. Owner Login Modal (Gatekeeper for Operations Desk) */}
      <OwnerLoginModal
        isOpen={isOwnerLoginModalOpen}
        onClose={() => {
          setIsOwnerLoginModalOpen(false);
        }}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* 1. Create / Edit Booking Modal (For Operator) */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setBookingToEdit(null);
        }}
        onSave={handleSaveBooking}
        bookingToEdit={bookingToEdit}
        vehicles={vehicles}
        drivers={drivers}
      />

      {/* 2. Start Trip & End Trip (Odometer Tracker) Modal */}
      <TripActionModal
        isOpen={isTripActionModalOpen}
        onClose={() => {
          setIsTripActionModalOpen(false);
          setActiveActionBooking(null);
        }}
        mode={tripActionMode}
        booking={activeActionBooking}
        vehicle={vehicles.find(v => v.id === activeActionBooking?.vehicleId)}
        onConfirmStart={handleConfirmStartTrip}
        onConfirmEnd={handleConfirmEndTrip}
      />

      {/* 3. Official Printable Duty Slip & Invoice Modal */}
      <DutySlipModal
        isOpen={isDutySlipModalOpen}
        onClose={() => {
          setIsDutySlipModalOpen(false);
          setDutySlipBooking(null);
        }}
        booking={dutySlipBooking}
        vehicle={vehicles.find(v => v.id === dutySlipBooking?.vehicleId)}
        driver={drivers.find(d => d.id === dutySlipBooking?.driverId)}
      />

      {/* 4. Driver Modal */}
      <DriverModal
        isOpen={isDriverModalOpen}
        onClose={() => {
          setIsDriverModalOpen(false);
          setDriverToEdit(null);
        }}
        onSave={handleSaveDriver}
        driverToEdit={driverToEdit}
      />

      {/* 5. Vehicle Modal */}
      <VehicleModal
        isOpen={isVehicleModalOpen}
        onClose={() => {
          setIsVehicleModalOpen(false);
          setVehicleToEdit(null);
        }}
        onSave={handleSaveVehicle}
        vehicleToEdit={vehicleToEdit}
      />

      {/* 6. Customer Track Booking Modal */}
      <TrackBookingModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        bookings={bookings}
        onViewDutySlip={(b) => {
          setDutySlipBooking(b);
          setIsDutySlipModalOpen(true);
        }}
      />

      {/* 7. Delete Booking Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(bookingToDelete)}
        booking={bookingToDelete}
        onConfirm={handleDeleteBooking}
        onCancel={() => setBookingToDelete(null)}
      />

      {/* Toast Feedback */}
      <Toast toast={toast} onClose={() => setToast(null)} />

    </div>
  );
}
