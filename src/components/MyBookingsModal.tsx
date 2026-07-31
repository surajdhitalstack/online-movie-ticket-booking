import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, CreditCard, Ticket, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TicketRecord {
  ticketId: string;
  movieId: string;
  movieTitle: string;
  hall: string;
  slot: string;
  seats: string[];
  totalPrice: number;
  paymentMethod: string;
  createdAt: string;
}

interface MyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

export default function MyBookingsModal({ isOpen, onClose, userEmail }: MyBookingsModalProps) {
  const [tickets, setTickets] = useState<TicketRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!isOpen || !userEmail) return;

    setLoading(true);
    setError('');
    fetch(`/api/my-tickets?email=${encodeURIComponent(userEmail)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load tickets');
        return res.json();
      })
      .then((data) => {
        setTickets(data.tickets || []);
      })
      .catch((err) => {
        console.error('Error fetching my tickets:', err);
        setError('Unable to fetch your reservations. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isOpen, userEmail]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xl p-4 flex items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="glass-panel relative w-full max-w-2xl overflow-hidden rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.7)] flex flex-col max-h-[85vh]"
        id="my-bookings-history-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <Ticket className="h-4.5 w-4.5 text-amber-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-200">
              Your Booking Ledger
            </h3>
            <span className="text-[9px] font-mono font-bold bg-amber-500/10 border border-amber-500/25 text-amber-300 px-2.5 py-0.5 rounded-full uppercase leading-none">
              {tickets.length} Saved
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white transition duration-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4 min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-400 space-y-3">
              <Loader2 className="h-6 w-6 text-amber-400 animate-spin" />
              <p className="text-xs uppercase tracking-widest font-mono text-neutral-500">
                Retrieving reservation ledger...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-6 space-y-3">
              <AlertCircle className="h-8 w-8 text-red-400" />
              <p className="text-xs font-semibold text-neutral-200 uppercase tracking-wider">
                Database Unreachable
              </p>
              <p className="text-[10px] text-neutral-500 max-w-xs uppercase tracking-wider font-mono">
                {error}
              </p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-4 text-neutral-400">
              <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-500">
                <Ticket className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-200">
                  No Tickets Booked Yet
                </p>
                <p className="text-[9.5px] text-neutral-500 max-w-sm uppercase tracking-widest font-mono leading-relaxed">
                  Your premium cinema reservation tickets will appear in this ledger once you complete any payment.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5 pr-1">
              {tickets.map((ticket) => (
                <div
                  key={ticket.ticketId}
                  className="bg-white/5 hover:bg-white/8 border border-white/10 rounded-2xl p-5 transition duration-300 relative group flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-3 flex-grow">
                    {/* Top Row: Movie & ID */}
                    <div className="flex items-start justify-between md:justify-start gap-4 flex-wrap">
                      <h4 className="text-sm font-semibold text-white tracking-wide uppercase leading-tight">
                        {ticket.movieTitle}
                      </h4>
                      <span className="font-mono text-[9px] text-amber-300 border border-amber-500/25 bg-amber-500/5 px-2.5 py-0.5 rounded-md uppercase font-bold tracking-widest">
                        {ticket.ticketId}
                      </span>
                    </div>

                    {/* Middle Row: Meta details */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4 text-[10px] text-neutral-300 font-mono">
                      <div className="flex items-center gap-1.5 text-neutral-400">
                        <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{ticket.hall.split(',')[0]}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-400">
                        <Clock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        <span>{ticket.slot}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-400 col-span-2 sm:col-span-1">
                        <Ticket className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        <span className="text-amber-300 font-bold">{ticket.seats.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right side: Payment Method & Total Price */}
                  <div className="flex md:flex-col items-baseline md:items-end justify-between md:justify-center border-t md:border-t-0 border-white/5 pt-3 md:pt-0 shrink-0">
                    <span className="text-xs font-bold text-white font-mono">
                      NRs. {ticket.totalPrice}
                    </span>
                    <span className="text-[8px] text-neutral-500 font-mono uppercase tracking-widest mt-1">
                      via {ticket.paymentMethod.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 text-[9px] text-neutral-500 text-center font-mono tracking-wider uppercase bg-neutral-950/20 shrink-0">
          CinePremium Nepal Cryptographic Reservation Database Ledger
        </div>
      </motion.div>
    </div>
  );
}
