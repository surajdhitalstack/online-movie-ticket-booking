import React from 'react';
import { Film, MapPin, Clock, Armchair, ArrowRight, ShieldCheck } from 'lucide-react';
import { Movie } from '../types';

interface SidebarProps {
  movie: Movie;
  selectedHall: string;
  selectedSlot: string | null;
  selectedSeats: string[];
  totalPrice: number;
  onProceed: () => void;
}

export default function Sidebar({
  movie,
  selectedHall,
  selectedSlot,
  selectedSeats,
  totalPrice,
  onProceed,
}: SidebarProps) {
  const hasSeats = selectedSeats.length > 0;

  return (
    <aside className="lg:sticky lg:top-[105px] w-full space-y-4" id="booking-sidebar-invoice">
      <div className="premium-card rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        
        {/* Simple Minimalist Header */}
        <div className="flex items-center gap-2 border-b border-white/5 pb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-200">
            Reservation Invoice
          </h3>
        </div>

        {/* Invoice Itemized Details */}
        <div className="pt-4 space-y-4">
          {/* Cinema Hall venue */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-neutral-400 uppercase tracking-widest leading-none">
              <MapPin className="h-3.5 w-3.5 text-amber-400" />
              <span>Multiplex Venue</span>
            </div>
            <p className="text-xs font-semibold text-neutral-255 pl-5">
              {selectedHall}
            </p>
          </div>

          {/* Active Film Selected */}
          <div className="flex flex-col gap-1 py-2 border-t border-white/10">
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-neutral-400 uppercase tracking-widest leading-none">
              <Film className="h-3.5 w-3.5 text-amber-400" />
              <span>Exhibition Title</span>
            </div>
            <p className="text-xs font-semibold text-neutral-255 pl-5">
              {movie.title}
            </p>
            <p className="text-[10px] text-neutral-500 pl-5">
              {movie.genre} • {movie.language}
            </p>
          </div>

          {/* Showtime Allocation */}
          <div className="flex flex-col gap-1 py-2 border-t border-white/10">
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-neutral-400 uppercase tracking-widest leading-none">
              <Clock className="h-3.5 w-3.5 text-amber-400" />
              <span>Session Time</span>
            </div>
            {selectedSlot ? (
              <p className="text-xs font-semibold text-neutral-255 pl-5 font-mono">
                {selectedSlot} (Today)
              </p>
            ) : (
              <p className="text-xs font-medium text-neutral-500 italic pl-5">
                No session selected yet
              </p>
            )}
          </div>

          {/* Reserved Seats listing */}
          <div className="flex flex-col gap-1.5 py-2 border-t border-white/10">
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-neutral-400 uppercase tracking-widest leading-none">
              <Armchair className="h-3.5 w-3.5 text-amber-400" />
              <span>Seats Reserved</span>
            </div>
            {hasSeats ? (
              <div className="flex flex-wrap gap-1.5 pl-5">
                {selectedSeats.map((seat) => (
                  <span
                    key={seat}
                    className="inline-flex items-center justify-center rounded-lg bg-white/5 border border-white/10 px-2.5 py-0.5 text-[10px] font-semibold font-mono text-white hover:bg-white/10 transition-colors"
                  >
                    {seat}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs font-medium text-neutral-500 italic pl-5">
                No seats selected yet
              </p>
            )}
          </div>
        </div>

        {/* Pricing Subtotal Area */}
        <div className="mt-5 border border-white/10 bg-white/5 backdrop-blur-xl rounded-2xl p-4.5 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-neutral-400">
            <span className="font-mono">Subtotal Cost</span>
            <span className="font-mono">NRs. {totalPrice}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-neutral-400">
            <span className="font-mono">Surcharge / GST</span>
            <span className="font-mono text-emerald-400">INCLUDED</span>
          </div>
          <div className="flex items-center justify-between border-t border-white/10 pt-2.5">
            <span className="text-[10px] text-neutral-300 font-semibold uppercase tracking-wider">Total</span>
            <span className="text-base font-bold text-amber-400 font-mono">
              NRs. {totalPrice}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          disabled={!hasSeats}
          onClick={onProceed}
          className={`mt-5 w-full h-11.5 flex items-center justify-center gap-2 rounded-2xl text-xs font-bold tracking-widest transition-all duration-300 ${
            hasSeats
              ? 'bg-amber-400 hover:bg-amber-300 text-black cursor-pointer shadow-[0_5px_20px_rgba(218,165,32,0.3)] hover:scale-[1.01] active:scale-98'
              : 'bg-white/5 text-neutral-550 cursor-not-allowed border border-white/5'
          }`}
        >
          <span>PROCEED TO PAYMENT</span>
          <ArrowRight className="h-4 w-4 shrink-0 stroke-[2.5px]" />
        </button>

        {/* Security badge compliant info */}
        <div className="flex items-center justify-center gap-1.5 text-[9px] text-neutral-500 font-mono text-center mt-4 uppercase tracking-widest">
          <ShieldCheck className="h-3.5 w-3.5 text-neutral-500" />
          <span>Secured payment gateway</span>
        </div>
      </div>
    </aside>
  );
}
