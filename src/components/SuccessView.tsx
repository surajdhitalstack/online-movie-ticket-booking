import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { 
  Check, 
  Download, 
  ArrowLeft, 
  Ticket, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle,
  Shield
} from 'lucide-react';
import { Movie } from '../types';
import { motion } from 'motion/react';

interface SuccessProps {
  ticketId: string;
  movie: Movie;
  selectedHall: string;
  selectedSlot: string | null;
  selectedSeats: string[];
  totalPrice: number;
  paymentMethod: string;
  onReset: () => void;
}

const SECURITY_HMAC_SALT = 'CINEPREMIUM_HMAC_SALT_2026_NEPAL';

// Native browser crypto SHA-256 helper
const computeSHA256 = async (message: string): Promise<string> => {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

export default function SuccessView({
  ticketId,
  movie,
  selectedHall,
  selectedSlot,
  selectedSeats,
  totalPrice,
  paymentMethod,
  onReset,
}: SuccessProps) {
  const [authenticHash, setAuthenticHash] = useState<string>('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // Generate authentic master verification signature on mount
  useEffect(() => {
    const initHash = async () => {
      const payload = `CinePremiumNepal_v1|${ticketId}|${movie.title}|${selectedHall}|${selectedSlot}|${selectedSeats.join(', ')}|${totalPrice}|${SECURITY_HMAC_SALT}`;
      const hash = await computeSHA256(payload);
      setAuthenticHash(hash);
    };
    initHash();
  }, [ticketId, movie.title, selectedHall, selectedSlot, selectedSeats, totalPrice]);

  // Generate single authentic QR code image URL
  useEffect(() => {
    if (ticketId && authenticHash) {
      QRCode.toDataURL(
        `CinePremium-Verified|Ticket:${ticketId}|Hash:${authenticHash}`,
        {
          margin: 1,
          width: 256,
          color: {
            dark: '#ffffff', // Crisp premium white matrix modules
            light: '#0a0a0c', // Dark rich backdrop
          }
        }
      )
        .then(url => setQrCodeDataUrl(url))
        .catch(err => console.error('Error generating authentic QR Code', err));
    }
  }, [ticketId, authenticHash]);

  const handleDownloadQrCode = () => {
    if (!qrCodeDataUrl) return;
    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = `CinePremium-Ticket-${ticketId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="mx-auto max-w-xl px-4 py-12 md:py-16 pb-20"
      id="payment-success-ticket-dashboard"
    >
      <div className="text-center space-y-6">
        {/* Minimalist Apple success badge with pulsing glass ring */}
        <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/5 border border-white/25 text-amber-400">
          <div className="absolute inset-0 rounded-full border border-amber-400/20 animate-ping" />
          <Check className="h-6 w-6 stroke-[3px]" />
        </div>

        {/* Quiet, confident heading */}
        <div className="space-y-1.5">
          <h2 className="text-2xl font-light text-white tracking-widest uppercase">
            Reservation <span className="font-semibold text-amber-400">Confirmed</span>
          </h2>
          <p className="text-xs text-neutral-400 font-normal max-w-md mx-auto">
            Your premium exhibition admission is secured. Please present the cryptographic QR code at the private arena gates.
          </p>
        </div>

        {/* The Elegantly Detailed Pass Card */}
        <div className="glass-panel rounded-3xl overflow-hidden p-6 sm:p-8 text-left shadow-[0_30px_70px_rgba(0,0,0,0.6)] relative">
          
          {/* Subtle brand bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-400 font-bold leading-none">
              CinePremium Pass
            </span>
            <span className="font-mono text-[8.5px] uppercase tracking-wider text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full bg-amber-500/10 font-bold">
              Verified / {paymentMethod.toUpperCase()}
            </span>
          </div>

          {/* QR Code Presentation */}
          <div className="py-8 flex flex-col items-center justify-center border-b border-white/10">
            <div className="relative p-2.5 bg-neutral-950/80 border border-white/10 rounded-2xl max-w-[170px] aspect-square flex items-center justify-center shadow-2xl">
              {/* Corner brackets */}
              <div className="absolute top-1.5 left-1.5 w-3.5 h-3.5 border-t border-l border-amber-400/30" />
              <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 border-t border-r border-amber-400/30" />
              <div className="absolute bottom-1.5 left-1.5 w-3.5 h-3.5 border-b border-l border-amber-400/30" />
              <div className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 border-b border-r border-amber-400/30" />
              
              {qrCodeDataUrl ? (
                <img 
                  src={qrCodeDataUrl} 
                  alt="Boarding QR Code" 
                  className="w-36 h-36 object-contain"
                />
              ) : (
                <div className="w-36 h-36 bg-neutral-900 rounded animate-pulse" />
              )}
            </div>
            <div className="mt-4 text-center">
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-500 block leading-none font-bold">
                Verification ID
              </span>
              <span className="font-mono text-sm font-semibold text-amber-300 tracking-[0.18em] uppercase block mt-1.5 select-all">
                {ticketId}
              </span>
            </div>
          </div>

          {/* Core Ticket Information */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-5 py-6 border-b border-white/10 text-xs">
            <div>
              <span className="font-mono text-[8.5px] font-bold uppercase tracking-widest text-neutral-500 block">Film Exhibit</span>
              <span className="font-semibold text-neutral-100 block mt-1 leading-snug">{movie.title}</span>
            </div>
            <div>
              <span className="font-mono text-[8.5px] font-bold uppercase tracking-widest text-neutral-500 block">Theatre Exhibition</span>
              <span className="font-semibold text-neutral-100 block mt-1 leading-snug">{selectedHall.split(',')[0]}</span>
            </div>
            <div>
              <span className="font-mono text-[8.5px] font-bold uppercase tracking-widest text-neutral-500 block">Scheduled Time</span>
              <span className="font-semibold text-neutral-100 block mt-1 leading-snug">{selectedSlot}</span>
            </div>
            <div>
              <span className="font-mono text-[8.5px] font-bold uppercase tracking-widest text-neutral-500 block">Seats Reserved</span>
              <span className="font-semibold text-amber-300 block mt-1 leading-snug font-mono tracking-wider">{selectedSeats.join(', ')}</span>
            </div>
            <div>
              <span className="font-mono text-[8.5px] font-bold uppercase tracking-widest text-neutral-500 block">Registered PAN</span>
              <span className="font-mono font-bold text-neutral-400 block mt-1">609210452</span>
            </div>
            <div>
              <span className="font-mono text-[8.5px] font-bold uppercase tracking-widest text-neutral-500 block">Total Remitted</span>
              <span className="font-bold text-white block mt-1 text-sm font-mono text-amber-400">NRs. {totalPrice}</span>
            </div>
          </div>

          {/* Cryptographic Ledger Proof */}
          <div className="pt-5 space-y-2">
            <div className="flex items-center gap-1.5 text-neutral-350 font-mono text-[8.5px] uppercase tracking-widest font-bold">
              <Shield className="h-3.5 w-3.5 text-amber-400" />
              <span>Digital Security Certificate</span>
            </div>
            {authenticHash ? (
              <p className="font-mono text-[9px] text-neutral-400 break-all leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10 select-all font-semibold">
                {authenticHash}
              </p>
            ) : (
              <div className="bg-white/5 p-3 rounded-xl h-9 animate-pulse border border-white/10" />
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full">
          {/* Download */}
          <button
            type="button"
            onClick={handleDownloadQrCode}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs tracking-widest py-3.5 px-6.5 transition duration-300 cursor-pointer shadow-[0_4px_15px_rgba(218,165,32,0.25)] shrink-0 hover:scale-[1.01] active:scale-98 uppercase"
          >
            <Download className="h-4.5 w-4.5 text-black stroke-[2.5px]" />
            <span>Download Pass</span>
          </button>

          {/* Return Home */}
          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10 font-bold text-xs tracking-widest py-3.5 px-6.5 transition duration-300 cursor-pointer hover:scale-[1.01] active:scale-98 uppercase"
          >
            <ArrowLeft className="h-4.5 w-4.5 text-neutral-300 stroke-[2.5px]" />
            <span>Return to Lobby</span>
          </button>
        </div>

        <p className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest pt-2">
          CINEPREMIUM NEPAL MULTIPLEXES © 2026
        </p>
      </div>
    </motion.div>
  );
}
