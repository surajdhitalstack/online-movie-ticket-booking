import React from 'react';
import { Clock, Calendar, ShieldCheck } from 'lucide-react';
import { TIME_SLOTS } from '../data';
import { motion } from 'motion/react';

interface TimeSlotsProps {
  selectedSlot: string | null;
  onSlotSelect: (slot: string) => void;
}

export default function TimeSlots({ selectedSlot, onSlotSelect }: TimeSlotsProps) {
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <section className="space-y-6" id="session-time-slots-section">
      <div className="flex flex-col gap-3 border-b border-white/5 pb-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-amber-400" />
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-400">
              TIME SCHEDULES
            </span>
          </div>
          <h3 className="text-lg font-light tracking-wide text-white uppercase sm:text-xl">
            Available <span className="font-semibold text-neutral-100">Showtimes</span>
          </h3>
        </div>
        
        {/* Today's Date Tag built with glass pill */}
        <div className="flex items-center gap-2.5 self-start rounded-full glass-pill px-4.5 py-1.5 font-mono text-[9.5px] text-neutral-300">
          <Calendar className="h-3 w-3 text-amber-400" />
          <span className="tracking-widest uppercase">{todayFormatted}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {/* Time slot buttons in grid */}
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-5">
          {TIME_SLOTS.map((slot, index) => {
            const isSelected = selectedSlot === slot;
            return (
              <motion.button
                key={slot}
                type="button"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                onClick={() => onSlotSelect(slot)}
                className={`group flex items-center justify-center gap-2 rounded-2xl border py-3 px-4 text-xs font-bold tracking-widest transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 bg-amber-400 text-black shadow-[0_4px_20px_rgba(218,165,32,0.25)] scale-[1.03]'
                    : 'glass-pill text-neutral-300 hover:scale-[1.01]'
                }`}
              >
                <Clock className={`h-3.5 w-3.5 ${isSelected ? 'text-black stroke-[2.5px]' : 'text-neutral-500 group-hover:text-amber-400 transition-colors'}`} />
                <span className="font-mono">{slot}</span>
              </motion.button>
            );
          })}
        </div>
        
        <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-mono mt-1">
          <ShieldCheck className="h-3.5 w-3.5 text-amber-400/60" />
          <span className="uppercase tracking-wider">Select an exhibition session to unlock interactive seating.</span>
        </div>
      </div>
    </section>
  );
}
