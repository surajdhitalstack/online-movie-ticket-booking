import React from 'react';
import { ShieldAlert, CreditCard, Award, HelpCircle, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-neutral-950 text-slate-400 py-12 px-4 md:px-8 mt-16 select-none" id="ticketing-regulatory-footer">
      <div className="mx-auto max-w-7xl space-y-10">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand/Compliance sector */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-black text-slate-100 tracking-wider">
              CINE<span className="text-accent-gold">PREMIUM</span> NEPAL
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Nepal's leading digital luxury cine-lobby ticketing standard. Offering instant seat reservations, dynamic lounge allocation, and seamless digital checkout.
            </p>
            {/* Government compliance and secure payment tags */}
            <div className="flex flex-col gap-2 pt-1 font-mono text-[9px] font-bold">
              <span className="inline-flex items-center gap-1.5 rounded bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 text-emerald-400 w-fit">
                🇳🇵 NEPAL FILM BOARD COMPLIANT
              </span>
              <span className="inline-flex items-center gap-1.5 rounded bg-amber-500/10 border border-accent-gold/25 px-2.5 py-1 text-accent-gold w-fit">
                💳 SECURE ESEWA PAYMENT SYSTEMS
              </span>
            </div>
          </div>

          {/* Multiplex Network directory */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-black text-slate-205 uppercase tracking-widest border-b border-white/5 pb-1 max-w-[120px]">
              MULTIPLEXES
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li className="hover:text-accent-gold transition cursor-pointer">QFX Chhaya Center, Thamel</li>
              <li className="hover:text-accent-gold transition cursor-pointer">QFX Labim Mall, Lalitpur</li>
              <li className="hover:text-accent-gold transition cursor-pointer">One Cinemas, Eyeplex Baneshwor</li>
              <li className="hover:text-accent-gold transition cursor-pointer">iNi Cinemas, Jamal Kathmandu</li>
              <li className="hover:text-accent-gold transition cursor-pointer">FCUBE Cinemas, Chabahil</li>
            </ul>
          </div>

          {/* Corporate Support Links */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-black text-slate-205 uppercase tracking-widest border-b border-white/5 pb-1 max-w-[120px]">
              SUPPORT
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li className="hover:text-accent-gold transition cursor-pointer">Ticketing Cancellation Manual</li>
              <li className="hover:text-accent-gold transition cursor-pointer">Corporate Lounge Allocations</li>
              <li className="hover:text-accent-gold transition cursor-pointer">Privacy & Cookie Integrity</li>
              <li className="hover:text-accent-gold transition cursor-pointer">Nepal Consumer Affairs Helpdesk</li>
              <li className="hover:text-accent-gold transition cursor-pointer">Security Core Regulations</li>
            </ul>
          </div>

          {/* Direct Address support */}
          <div className="space-y-3 text-xs font-medium">
            <h4 className="font-display text-xs font-black text-slate-205 uppercase tracking-widest border-b border-white/5 pb-1 max-w-[125px]">
              CONTACT OFFICE
            </h4>
            <div className="space-y-3 text-slate-400 font-mono text-[11px]">
              <div className="flex gap-2">
                <MapPin className="h-4 w-4 text-accent-gold shrink-0" />
                <span>Level 4, Civil Mall, Kathmandu, Nepal</span>
              </div>
              <div className="flex gap-2">
                <Phone className="h-4 w-4 text-accent-gold shrink-0" />
                <span>+977-1-4218901, +977-1-4218902</span>
              </div>
              <div className="flex gap-2 font-sans text-xs">
                <Mail className="h-4 w-4 text-accent-gold shrink-0" />
                <span>help@cinepremium.com.np</span>
              </div>
            </div>
          </div>

        </div>

        {/* Regulatory Disclaimers and Anti-Piracy notice */}
        <div className="border-t border-white/5 pt-6 flex flex-col gap-4 text-[10px] leading-relaxed text-slate-500 font-mono sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="flex items-center gap-1.5 text-slate-400 font-extrabold uppercase text-[9px]">
              <ShieldAlert className="h-3.5 w-3.5 text-red-500" />
              <span>REGULATORY DISCLOSURES & ANTI-PIRACY BILL 2026</span>
            </p>
            <p>
              Recording or sharing audios/videos of live theater projections inside CinePremium multiplexes is strictly punishable under the Protection of Cinematographic work Act (No. 49210-NP).
            </p>
          </div>
          <div className="shrink-0 text-slate-400">
            <span className="font-bold text-slate-350">PAN No:</span> <strong className="text-accent-gold">609210452</strong>
          </div>
        </div>

        {/* Bottom copyright segment */}
        <div className="border-t border-white/5 pt-4 text-center text-[10px] text-slate-600 font-medium flex flex-col gap-2 sm:flex-row sm:justify-between">
          <p>© 2026 CinePremium Nepal Ltd. All Rights Reserved. Reg Code: 49210-NP</p>
          <p className="font-mono text-[9px] text-slate-600 uppercase tracking-widest">
            Crafted for Nepali Cinema Patrons
          </p>
        </div>

      </div>
    </footer>
  );
}
