import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Eye, EyeOff, Film, ArrowRight, Shield } from 'lucide-react';

interface OnboardingAuthModalProps {
  onSignIn: (user: { name: string; email: string }) => void;
  onLater: () => void;
}

export default function OnboardingAuthModal({ onSignIn, onLater }: OnboardingAuthModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSignMode, setIsSignMode] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (isSignMode && !password) {
      setError('Please enter your password');
      return;
    }
    if (!isSignMode && !name) {
      setError('Please enter your full name');
      return;
    }

    const resolvedName = name || email.split('@')[0];
    onSignIn({ name: resolvedName, email });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Heavy clean backdrop blur */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-[8px]"
      />

      {/* Main minimal modal frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="glass-panel-heavy relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-3xl w-full max-w-sm overflow-hidden p-6 sm:p-8 text-center"
        id="onboarding-luxury-auth-shell"
      >
        {/* Simple elegant branding icon */}
        <div className="relative mb-6">
          <div className="relative mx-auto h-12 w-12 rounded-full bg-white/5 border border-white/25 flex items-center justify-center mb-4.5">
            <div className="absolute inset-0 rounded-full border border-amber-400/20 animate-ping" />
            <Film className="h-5.5 w-5.5 text-amber-400" />
          </div>
          <h2 className="text-xl font-light text-white tracking-[0.05em] uppercase">
            CINE<span className="font-semibold text-amber-400">PREMIUM</span>
          </h2>
          <p className="text-neutral-400 text-[11px] mt-1.5 leading-relaxed">
            Verify credentials to access custom seating slots, private suites, and instant mobile entry gates.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left relative z-10" id="onboarding-auth-form">
          {error && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-mono font-medium leading-relaxed">
              {error}
            </div>
          )}

          {/* Full Name for signup */}
          {!isSignMode && (
            <div className="space-y-1.5">
              <label className="text-[8.5px] font-mono text-neutral-405 uppercase tracking-widest block font-bold">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-450" />
                <input
                  type="text"
                  required
                  placeholder="e.g., Samir Shrestha"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError('');
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-neutral-200 placeholder-neutral-600 outline-none focus:border-amber-400/40 focus:bg-white/10 focus:ring-1 focus:ring-amber-400/20 transition duration-300"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[8.5px] font-mono text-neutral-405 uppercase tracking-widest block font-bold">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-450" />
              <input
                type="email"
                required
                placeholder="samir@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-neutral-200 placeholder-neutral-600 outline-none focus:border-amber-400/40 focus:bg-white/10 focus:ring-1 focus:ring-amber-400/20 transition duration-300"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[8.5px] font-mono text-neutral-405 uppercase tracking-widest block font-bold">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-3.5 pr-10 text-xs text-neutral-200 placeholder-neutral-600 outline-none focus:border-amber-400/40 focus:bg-white/10 focus:ring-1 focus:ring-amber-400/20 transition duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-450 hover:text-neutral-300 transition-colors py-1"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-3 space-y-3">
            <button
              type="submit"
              className="w-full bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs tracking-widest py-3 px-4 rounded-xl transition duration-300 cursor-pointer flex items-center justify-center gap-1.5 hover:scale-[1.01] active:scale-98 shadow-[0_4px_15px_rgba(218,165,32,0.25)] uppercase"
            >
              <span>{isSignMode ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5px]" />
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignMode(!isSignMode);
                  setError('');
                }}
                className="text-[10px] text-neutral-400 hover:text-amber-400 transition-colors uppercase tracking-wider font-bold"
              >
                {isSignMode 
                  ? "Don't have an account? Sign up here" 
                  : "Already registered? Sign in"}
              </button>
            </div>
          </div>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4 gap-2">
          <div className="h-[1px] bg-white/10 flex-1" />
          <span className="font-mono text-[8px] text-neutral-500 tracking-wider">OR</span>
          <div className="h-[1px] bg-white/10 flex-1" />
        </div>

        {/* Guest access */}
        <div className="space-y-4 relative z-10">
          <button
            type="button"
            onClick={onLater}
            className="w-full bg-white/5 border border-white/10 text-neutral-300 font-semibold text-xs tracking-widest py-2.5 px-4 rounded-xl hover:bg-white/10 transition duration-300 cursor-pointer uppercase hover:scale-[1.01]"
          >
            Continue as Guest
          </button>
          
          <div className="flex items-center justify-center gap-1.5 text-neutral-600 font-mono text-[8px] uppercase tracking-widest leading-none">
            <Shield className="h-3 w-3 text-amber-500/50" />
            <span>Secure encryption protocol active</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
