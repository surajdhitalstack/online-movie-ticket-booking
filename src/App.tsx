/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MovieGrid from './components/MovieGrid';
import NowShowingCarousel from './components/NowShowingCarousel';
import TimeSlots from './components/TimeSlots';
import SeatGrid from './components/SeatGrid';
import Sidebar from './components/Sidebar';
import PaymentModal from './components/PaymentModal';
import SuccessView from './components/SuccessView';
import UpcomingMovies from './components/UpcomingMovies';
import SpecialEvents from './components/SpecialEvents';
import Footer from './components/Footer';
import { MOVIES, CINEMA_LOCATIONS, getHallSeatingLayout, getSeatCategoryAndPrice } from './data';
import { motion, AnimatePresence } from 'motion/react';
import OnboardingAuthModal from './components/OnboardingAuthModal';
import { ArrowRight } from 'lucide-react';

export default function App() {
  // User Authentication hooks
  const [user, setUser] = useState<{ name: string; email: string } | null>(() => {
    try {
      const saved = localStorage.getItem('cinepremium_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [showAuthModal, setShowAuthModal] = useState<boolean>(() => {
    try {
      return !localStorage.getItem('cinepremium_user');
    } catch {
      return true;
    }
  });

  const handleUserSignIn = (profile: { name: string; email: string }) => {
    setUser(profile);
    localStorage.setItem('cinepremium_user', JSON.stringify(profile));
    setShowAuthModal(false);
  };

  const handleUserSignOut = () => {
    setUser(null);
    localStorage.removeItem('cinepremium_user');
  };

  const handleLater = () => {
    setShowAuthModal(false);
  };

  // Cinema Hall selection
  const [selectedHall, setSelectedHall] = useState<string>(CINEMA_LOCATIONS[0]);
  
  // Selected Film spotlight
  const [selectedMovieId, setSelectedMovieId] = useState<string>(MOVIES[0].id);
  const activeMovie = MOVIES.find((m) => m.id === selectedMovieId) || MOVIES[0];

  // Showtime slot allocation
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  // Seat reservations mapping array
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  
  // Occupied seats that randomize for every combination of hall, movie, and showtime
  const [occupiedSeats, setOccupiedSeats] = useState<string[]>([]);

  // Randomize occupied seats for each individual combination of hall, movie, and timeslot slot
  useEffect(() => {
    if (!selectedTimeSlot) {
      setOccupiedSeats([]);
      return;
    }

    const layout = getHallSeatingLayout(selectedHall);
    const key = `${selectedHall}-${selectedMovieId}-${selectedTimeSlot}`;
    
    // Seed-based PRNG to make selected slot persistent & stable
    let seed = 0;
    for (let i = 0; i < key.length; i++) {
      seed += key.charCodeAt(i) * (i + 1);
    }
    
    const seededRandom = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    const generatedOccupied: string[] = [];
    layout.rows.forEach((row) => {
      layout.columns.forEach((col) => {
        if (layout.gaps.includes(col)) return; // skip walkways
        
        const seatId = `${row}${col}`;
        // Book between 5% and 15% of the seats randomly based on the seed
        const bookingProbability = 0.05 + (seededRandom() * 0.1); 
        if (seededRandom() < bookingProbability) {
          generatedOccupied.push(seatId);
        }
      });
    });

    setOccupiedSeats(generatedOccupied);
  }, [selectedHall, selectedMovieId, selectedTimeSlot]);
  
  // Carousel states
  const [isCarouselPaused, setIsCarouselPaused] = useState<boolean>(false);
  const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(false);

  // Billing and Payment status overlays
  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);
  const [viewState, setViewState] = useState<'LOBBY' | 'SUCCESS'>('LOBBY');
  const [successDetails, setSuccessDetails] = useState<{
    ticketId: string;
    paymentMethod: string;
  } | null>(null);

  // 1. AUTO-CAROUSEL logic
  // Cycles through spotlit movie assets every 5 seconds unless paused or user has interacted
  useEffect(() => {
    // Do not rotate if viewing success screens, checkout bills, when slot/seats are active, or if user manually interacted
    if (viewState === 'SUCCESS' || isPaymentOpen || selectedTimeSlot || isCarouselPaused || hasUserInteracted) {
      return;
    }

    const interval = setInterval(() => {
      setSelectedMovieId((currentId) => {
        const index = MOVIES.findIndex((m) => m.id === currentId);
        const nextIndex = (index + 1) % MOVIES.length;
        return MOVIES[nextIndex].id;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [viewState, isPaymentOpen, selectedTimeSlot, isCarouselPaused, hasUserInteracted]);

  // Reset secondary session selection when movie selection shifts
  const handleMovieSelect = (id: string) => {
    setSelectedMovieId(id);
    setSelectedTimeSlot(null);
    setSelectedSeats([]);
    setHasUserInteracted(true);
  };

  // Reset seats chosen when showtime slot shifts
  const handleTimeSlotSelect = (slot: string) => {
    setSelectedTimeSlot(slot);
    setSelectedSeats([]);
    setHasUserInteracted(true);
    
    // Smooth scroll down to the Seating Selection Area when slot is selected
    setTimeout(() => {
      const targetElement = document.getElementById('auditorium-seat-reservation-section');
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Toggle seat selection
  const handleSeatToggle = (seatId: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
    setHasUserInteracted(true);
  };

  // Cumulative dynamic seat cost pricing compilation
  const calculateTotalPrice = () => {
    const layout = getHallSeatingLayout(selectedHall);
    return selectedSeats.reduce((sum, seatId) => {
      const row = seatId.charAt(0);
      const { price } = getSeatCategoryAndPrice(row, layout.rows);
      return sum + price;
    }, 0);
  };

  const totalPrice = calculateTotalPrice();

  // Execute confirmation
  const handlePaymentSuccess = (method: string, ticketId: string) => {
    setSuccessDetails({ ticketId, paymentMethod: method });
    setViewState('SUCCESS');
    // Scroll window back to top immediately so receipt is visible
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Restore state for lobby re-entries
  const handleLobbyReturn = () => {
    setSelectedSeats([]);
    setSelectedTimeSlot(null);
    setSuccessDetails(null);
    setHasUserInteracted(false);
    setSelectedMovieId(MOVIES[0].id);
    setViewState('LOBBY');
    // Scroll smoothly to top on layout re-entries
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-cinema-dark relative overflow-hidden flex flex-col justify-between selection:bg-accent-gold/25 selection:text-white antialiased">
      {/* Dynamic Ambient Liquid Glass background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[15%] left-[-15%] w-[60vw] h-[60vw] min-w-[300px] max-w-[650px] rounded-full bg-[#daa520]/10 blur-[130px] animate-blob-one mix-blend-screen" />
        <div className="absolute top-[45%] right-[-15%] w-[55vw] h-[55vw] min-w-[280px] max-w-[600px] rounded-full bg-indigo-600/10 blur-[120px] animate-blob-two mix-blend-screen" />
        <div className="absolute bottom-[5%] left-[15%] w-[50vw] h-[50vw] min-w-[250px] max-w-[550px] rounded-full bg-rose-500/5 blur-[140px] animate-blob-three mix-blend-screen" />
      </div>

      <div className="w-full relative z-10 flex-grow flex flex-col justify-between">
        {/* Core Header Navigation Bar */}
        <Header 
          selectedHall={selectedHall} 
          onHallChange={setSelectedHall}
          user={user}
          onSignOut={handleUserSignOut}
          onSignInClick={() => setShowAuthModal(true)}
        />

        <AnimatePresence mode="wait">
          {viewState === 'LOBBY' ? (
            <motion.div
              key="lobby-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Main Wide Auto-playing Spotlight Carousel Banner */}
              <NowShowingCarousel
                selectedMovieId={selectedMovieId}
                onMovieSelect={handleMovieSelect}
              />

              {/* Main Booking Content Grid split */}
              <main className="mx-auto max-w-7xl px-6 py-12 md:px-8 space-y-12 pb-24 lg:pb-12">
                
                {/* Step 1: Movie Selection & Scheduled Times Selector (Spans Full Width dynamically) */}
                <div className="space-y-10" id="session-showtimes-scheduler-section">
                  <MovieGrid
                    selectedMovieId={selectedMovieId}
                    onMovieSelect={handleMovieSelect}
                  />

                  <TimeSlots
                    selectedSlot={selectedTimeSlot}
                    onSlotSelect={handleTimeSlotSelect}
                  />
                </div>

                {/* Step 2: Interactive Seating Selection and Sticky Reservation Invoice right next to each other on full screen/desktop */}
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start pt-4" id="auditorium-seat-reservation-section">
                  {/* Left Side: Seating Selection Arena */}
                  <div className="flex-1 w-full lg:max-w-4xl">
                    <SeatGrid
                      selectedSlot={selectedTimeSlot}
                      selectedSeats={selectedSeats}
                      onSeatToggle={handleSeatToggle}
                      selectedHall={selectedHall}
                      occupiedSeats={occupiedSeats}
                    />
                  </div>

                  {/* Right Side: Floating Sticky Checkout Invoice positioned right next to Seating Selection */}
                  <div className="w-full lg:w-[360px] shrink-0 lg:sticky lg:top-24 self-start z-10">
                    <Sidebar
                      movie={activeMovie}
                      selectedHall={selectedHall}
                      selectedSlot={selectedTimeSlot}
                      selectedSeats={selectedSeats}
                      totalPrice={totalPrice}
                      onProceed={() => setIsPaymentOpen(true)}
                    />
                  </div>
                </div>

                {/* Upcoming blockbuster releases shelves */}
                <UpcomingMovies />

                {/* Immersive cinematic neighborhood highlights */}
                <SpecialEvents />
              </main>

              {/* Mobile/Tablet Adaptive Sticky Bottom Payment Bar */}
              <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40 bg-zinc-950/85 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-bold leading-none mb-1">
                    {selectedSeats.length > 0 ? `${selectedSeats.length} SEAT${selectedSeats.length > 1 ? 'S' : ''} SELECTION` : 'SELECT ANY SEATS'}
                  </span>
                  <p className="text-sm font-bold text-amber-400 font-mono leading-none">
                    NRs. {totalPrice}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={selectedSeats.length === 0}
                  onClick={() => setIsPaymentOpen(true)}
                  className={`flex items-center justify-center gap-2 rounded-xl text-[10px] font-bold tracking-widest px-5 h-10 transition-all duration-300 uppercase shrink-0 ${
                    selectedSeats.length > 0
                      ? 'bg-amber-400 text-black shadow-[0_4px_15px_rgba(218,165,32,0.25)] hover:scale-[1.01] active:scale-98 cursor-pointer'
                      : 'bg-white/5 text-zinc-500 border border-white/5 cursor-not-allowed'
                  }`}
                >
                  <span>PROCEED</span>
                  <ArrowRight className="h-4 w-4 stroke-[2.5px]" />
                </button>
              </div>
            </motion.div>
          ) : (
            successDetails && (
              <SuccessView
                ticketId={successDetails.ticketId}
                movie={activeMovie}
                selectedHall={selectedHall}
                selectedSlot={selectedTimeSlot}
                selectedSeats={selectedSeats}
                totalPrice={totalPrice}
                paymentMethod={successDetails.paymentMethod}
                onReset={handleLobbyReturn}
              />
            )
          )}
        </AnimatePresence>

        {/* Payment Modal checkout gatekeeper */}
        <AnimatePresence>
          {isPaymentOpen && (
            <PaymentModal
              isOpen={isPaymentOpen}
              onClose={() => setIsPaymentOpen(false)}
              movie={activeMovie}
              selectedHall={selectedHall}
              selectedSlot={selectedTimeSlot}
              selectedSeats={selectedSeats}
              totalPrice={totalPrice}
              onPaymentSuccess={handlePaymentSuccess}
            />
          )}
        </AnimatePresence>

        {/* Onboarding Authentication Overlay Portal */}
        <AnimatePresence>
          {showAuthModal && (
            <OnboardingAuthModal
              onSignIn={handleUserSignIn}
              onLater={handleLater}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Nepal film regulatory compliant footer */}
      <Footer />
    </div>
  );
}
