import React, { useState, useEffect } from 'react';
import { X, Shield, Lock, CreditCard, Wallet, Landmark, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Movie } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: Movie;
  selectedHall: string;
  selectedSlot: string | null;
  selectedSeats: string[];
  totalPrice: number;
  onPaymentSuccess: (method: string, ticketId: string) => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  movie,
  selectedHall,
  selectedSlot,
  selectedSeats,
  totalPrice,
  onPaymentSuccess,
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'esewa' | 'khalti' | 'card'>('esewa');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-close overlay if escape key pressed
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Credentials Validation
    if (paymentMethod === 'esewa') {
      if (username.trim() !== '9800000000' || password !== 'demo123') {
        setStatus('error');
        setErrorMessage('Invalid digital wallet credentials! Try username: 9800000000 & password: demo123');
        return;
      }
    }

    // Simulate 1.8s API Latency call to eSewa gateway
    setStatus('loading');
    setProcessing(true);

    setTimeout(() => {
      // Success ticket generation
      // Format: QFX-XXXXX-1234
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let randomPart = '';
      for (let i = 0; i < 5; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const generatedTicketId = `QFX-${randomPart}-${randomSuffix}`;
      
      setStatus('success');
      setProcessing(false);
      
      // Delay success navigation slightly to show successful validation checkmark
      setTimeout(() => {
        onPaymentSuccess(paymentMethod, generatedTicketId);
        onClose();
        // Reset states
        setStatus('idle');
      }, 800);
    }, 1805);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-2xl p-4 flex items-start md:items-center justify-center min-h-screen">
      {/* Container Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="glass-panel relative w-full max-w-2xl overflow-hidden rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] flex flex-col md:flex-row my-auto shrink-0"
        id="esewa-payment-checkout-gateway"
      >
        {/* Left pane: Short recap */}
        <div className="w-full md:w-2/5 bg-neutral-950/40 backdrop-blur-md p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10">
          <div className="space-y-4">
            <span className="font-mono text-[9px] font-semibold tracking-wider text-neutral-300 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-full">
              GATEWAY BILLING
            </span>
            <div className="space-y-1 pt-2">
              <h4 className="text-[10px] text-neutral-450 font-semibold uppercase tracking-wider font-mono">Film Booking</h4>
              <p className="text-sm font-semibold text-white uppercase tracking-wide leading-tight">{movie.title}</p>
            </div>
            <div className="space-y-1.5 font-mono text-[10px] text-neutral-300">
              <p><span className="text-neutral-500 font-semibold">VENUE:</span> {selectedHall.split(',')[0]}</p>
              <p><span className="text-neutral-500 font-semibold">SESSION:</span> {selectedSlot}</p>
              <p><span className="text-neutral-500 font-semibold">SEATS:</span> {selectedSeats.join(', ')}</p>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 space-y-1 mt-4 md:mt-0">
            <span className="text-[10px] text-neutral-500 font-mono">DUE AMOUNT</span>
            <div className="text-2xl font-bold text-amber-400 font-mono">NRs. {totalPrice}</div>
            <span className="text-[9.5px] text-neutral-400 flex items-center gap-1">
              <Shield className="h-3.5 w-3.5 text-amber-400 shrink-0" /> Tax & fees included
            </span>
          </div>
        </div>

        {/* Right pane: Forms */}
        <div className="w-full md:w-3/5 p-6 flex flex-col justify-between backdrop-blur-xl bg-neutral-950/10">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-amber-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">SECURE TRANSACTION</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1 text-neutral-450 hover:bg-white/10 hover:text-white transition duration-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Payment options lane */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              {/* eSewa */}
              <button
                type="button"
                onClick={() => { setPaymentMethod('esewa'); setErrorMessage(''); }}
                className={`flex flex-col items-center justify-center py-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  paymentMethod === 'esewa'
                    ? 'border-amber-400/40 bg-white/5 text-amber-400'
                    : 'border-white/5 bg-neutral-950/30 text-neutral-400 hover:border-white/10 hover:text-white'
                }`}
              >
                <Wallet className="h-4 w-4 mb-1" />
                <span className="text-[10px] font-semibold font-sans">eSewa</span>
              </button>

              {/* Khalti */}
              <button
                type="button"
                onClick={() => { setPaymentMethod('khalti'); setErrorMessage(''); }}
                className={`flex flex-col items-center justify-center py-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  paymentMethod === 'khalti'
                    ? 'border-amber-400/40 bg-white/5 text-amber-400'
                    : 'border-white/5 bg-neutral-950/30 text-neutral-400 hover:border-white/10 hover:text-white'
                }`}
              >
                <Landmark className="h-4 w-4 mb-1" />
                <span className="text-[10px] font-semibold font-sans">Khalti</span>
              </button>

              {/* Card */}
              <button
                type="button"
                onClick={() => { setPaymentMethod('card'); setErrorMessage(''); }}
                className={`flex flex-col items-center justify-center py-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-amber-400/40 bg-white/5 text-amber-400'
                    : 'border-white/5 bg-neutral-950/30 text-neutral-400 hover:border-white/10 hover:text-white'
                }`}
              >
                <CreditCard className="h-4 w-4 mb-1" />
                <span className="text-[10px] font-semibold font-sans">Card</span>
              </button>
            </div>

            {/* Simulated Payment Area */}
            <div className="mt-5 bg-white/5 rounded-2xl p-5 border border-white/10">
              <AnimatePresence mode="wait">
                {paymentMethod === 'esewa' && (
                  <motion.form
                    key="esewa-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={handlePaymentSubmit}
                    className="space-y-4"
                  >
                    {/* Header with trademark eSewa layout style */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-sans font-bold text-[10px] text-neutral-300 tracking-wide uppercase px-2.5 py-0.5 bg-white/5 rounded-full border border-white/10">
                          eSewa Digital Wallet
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-neutral-500 font-bold uppercase tracking-wider">EPAY-NP</span>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[8.5px] font-mono font-bold text-neutral-400 uppercase mb-1 tracking-wider">
                          eSewa ID (Email or Phone)
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Demo account: 9800000000"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          disabled={processing}
                          className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-xs font-mono font-medium text-neutral-200 outline-none focus:border-amber-400/40 focus:bg-white/10 focus:ring-1 focus:ring-amber-400/20 transition-all font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[8.5px] font-mono font-bold text-neutral-400 uppercase mb-1 tracking-wider">
                          Web Password
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="Demo password: demo123"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={processing}
                          className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-xs font-mono font-medium text-neutral-200 outline-none focus:border-amber-400/40 focus:bg-white/10 focus:ring-1 focus:ring-amber-400/20 transition-all font-semibold"
                        />
                      </div>
                    </div>

                    {/* Error container */}
                    {status === 'error' && (
                      <div className="flex items-start gap-1.5 rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 text-[10px] text-red-400 leading-normal font-medium leading-relaxed font-sans">
                        <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                        <p>{errorMessage}</p>
                      </div>
                    )}

                    {/* Button */}
                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-400 text-black font-bold text-xs py-3 hover:bg-amber-300 transition cursor-pointer disabled:bg-white/5 disabled:text-neutral-500 tracking-widest shadow-[0_4px_15px_rgba(218,165,32,0.2)] hover:scale-[1.01] active:scale-98 uppercase"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>PROCESSING TRANSFER...</span>
                        </>
                      ) : status === 'success' ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>CREDENTIALS OK</span>
                        </>
                      ) : (
                        <span>PAY WITH ESEWA</span>
                      )}
                    </button>
                  </motion.form>
                )}

                {paymentMethod !== 'esewa' && (
                  <motion.div
                    key="soon-placeholder"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="py-12 text-center text-neutral-400 space-y-3"
                  >
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-amber-400">
                      <CreditCard className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-neutral-200">
                        Method Coming Soon
                      </p>
                      <p className="max-w-xs mx-auto text-[10px] text-neutral-500 py-1.5 leading-relaxed uppercase tracking-wider font-mono">
                        {paymentMethod === 'khalti'
                          ? 'Our Khalti Gateway integration is undergoing compliance checks. Please complete booking using the eSewa option!'
                          : 'Debit or Credit Card checkout processes are undergoing updates. Please use the eSewa Sandbox digital Wallet!'}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 text-[9px] text-neutral-500 text-center font-mono tracking-wider uppercase mt-4">
            Secured payment gateway compliant. Do not refresh page during processing.
          </div>
        </div>
      </motion.div>
    </div>
  );
}
