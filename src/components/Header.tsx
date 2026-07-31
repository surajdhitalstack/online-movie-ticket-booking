import React from 'react';
import { MapPin, Film, User, LogOut, Key, Ticket, Shield } from 'lucide-react';
import { CINEMA_LOCATIONS } from '../data';

interface HeaderProps {
  selectedHall: string;
  onHallChange: (hall: string) => void;
  user: { name: string; email: string; isAdmin?: boolean } | null;
  onSignOut: () => void;
  onSignInClick: () => void;
  onMyBookingsClick: () => void;
  onAdminClick: () => void;
}

export default function Header({ 
  selectedHall, 
  onHallChange,
  user,
  onSignOut,
  onSignInClick,
  onMyBookingsClick,
  onAdminClick
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-neutral-950/40 backdrop-blur-3xl">
      <div className="mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4.5 max-w-7xl md:px-8">
        
        {/* Logo and Brand Title */}
        <div className="flex items-center gap-3" id="brand-logo-section">
          {/* Custom crafted brand insignia */}
          <div className="relative flex h-8 w-8 items-center justify-center shrink-0">
            {/* Outer offset aperture ring with luxury rotate */}
            <div className="absolute inset-0 rounded-full border-2 border-white/10 animate-[spin_10s_linear_infinite]" />
            {/* Overlapping inner creative lens */}
            <div className="absolute inset-1 rounded-full border border-white/60 bg-gradient-to-tr from-white/10 to-transparent backdrop-blur-md" />
            {/* Central focal core */}
            <div className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_#daa520] select-none pointer-events-none" />
          </div>

          <div className="flex flex-col items-start leading-none gap-0.5">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm sm:text-base font-light tracking-[0.14em] text-white uppercase">
                CINE<span className="font-semibold text-amber-400">PREMIUM</span>
              </h1>
              <span className="text-[8px] font-mono tracking-widest text-[#daa520] bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-550/30 uppercase select-none font-bold">
                NPL
              </span>
            </div>
            <span className="text-[9px] tracking-wide text-neutral-400 font-normal leading-tight">
              Secure Exhibition Ticket Portal
            </span>
          </div>
        </div>

        {/* User Session and Location picker layout */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full md:w-auto">
          {/* User Status Profile */}
          {user ? (
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-start">
              {/* Admin Panel Trigger - Visible ONLY if user is Admin */}
              {user.isAdmin && (
                <button
                  type="button"
                  onClick={onAdminClick}
                  className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 active:scale-98 border border-rose-500/20 px-3.5 py-1.5 rounded-xl text-[10px] font-bold text-rose-400 tracking-wider uppercase transition-all duration-300 cursor-pointer shrink-0"
                >
                  <Shield className="h-3.5 w-3.5" />
                  <span>ADMIN PANEL</span>
                </button>
              )}

              {/* My Bookings Trigger */}
              <button
                type="button"
                onClick={onMyBookingsClick}
                className="flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 active:scale-98 border border-amber-500/20 px-3.5 py-1.5 rounded-xl text-[10px] font-bold text-amber-400 tracking-wider uppercase transition-all duration-300 cursor-pointer shrink-0"
              >
                <Ticket className="h-3.5 w-3.5" />
                <span>MY BOOKINGS</span>
              </button>

              <div className="flex items-center gap-2.5 bg-white/5 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-xl text-left shrink-0" id="user-verified-profile-tag">
                <div className="h-6.5 w-6.5 rounded-full bg-white/5 border border-white/20 flex items-center justify-center relative shrink-0">
                  <User className="h-3 w-3 text-neutral-200" />
                  <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 border border-neutral-900" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[7.5px] text-neutral-400 tracking-wider uppercase leading-none font-bold">
                    PATRON EXCLUSIVITY
                  </span>
                  <span className="text-xs font-semibold text-neutral-200 line-clamp-1">
                    {user.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="ml-2 text-neutral-400 hover:text-red-400 active:scale-95 transition-all p-1 cursor-pointer"
                  title="Sign out of Session"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-start">
              <button
                type="button"
                onClick={onSignInClick}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 active:scale-98 border border-white/10 px-3.5 py-1.5 rounded-xl text-[10px] font-medium text-white tracking-wider uppercase transition-all duration-300 cursor-pointer shrink-0"
              >
                <Key className="h-3 w-3 text-amber-400" />
                <span>GUEST PATRON LOGIN</span>
              </button>
            </div>
          )}

          {/* Location Dropdown selector */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3.5 py-1.5 w-full sm:w-auto hover:border-white/20 transition-all duration-300" id="location-picker-container">
            <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <select
              id="cinema-location-picker"
              value={selectedHall}
              onChange={(e) => onHallChange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-neutral-200 outline-none cursor-pointer pr-4 hover:text-white transition-colors border-none"
            >
              {CINEMA_LOCATIONS.map((loc) => (
                <option key={loc} value={loc} className="bg-neutral-950 text-neutral-200 text-xs py-2">
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>
    </header>
  );
}
