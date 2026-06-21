import React from 'react';
import { Calendar, MapPin, Sparkles, Award } from 'lucide-react';
import { IMMERSIVE_EVENTS } from '../data';
import { motion } from 'motion/react';

export default function SpecialEvents() {
  return (
    <section className="space-y-6" id="special-cinematic-events-section">
      {/* Section Header */}
      <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-5 pt-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-400">
              EXCLUSIVE PERFORMANCES
            </span>
          </div>
          <h3 className="text-xl font-light tracking-wide text-white uppercase sm:text-2xl">
            Immersive <span className="font-semibold text-neutral-100">Special Events</span>
          </h3>
          <p className="text-[11px] text-neutral-500 max-w-md">
            Unforgettable premium lounges, special private screenings, and star-studded celebratory galas.
          </p>
        </div>
        
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="font-mono text-[9.5px] text-neutral-400 bg-white/5 px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest font-bold">
            Private Access
          </span>
        </div>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {IMMERSIVE_EVENTS.map((evt, index) => (
          <motion.div
            key={evt.id}
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="group relative flex flex-col overflow-hidden rounded-3xl transition-all duration-300 glass-panel hover:border-amber-400/25 hover:scale-[1.01] hover:shadow-[0_20px_50px_rgba(218,165,32,0.1)]"
          >
            {/* Poster / Event Banner backdrop image */}
            <div className="relative h-44 overflow-hidden bg-neutral-950">
              <img
                src={evt.image}
                alt={evt.title}
                className="h-full w-full object-cover filter brightness-75 transition-transform duration-700 ease-out group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07070c] via-transparent to-transparent opacity-80" />

              {/* Event Category label badge */}
              <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 rounded-full glass-pill border border-amber-400/20 text-[9px] font-bold tracking-widest text-amber-400 px-3.5 py-1 uppercase shadow-xl select-none">
                <Award className="h-3 w-3 shrink-0 text-amber-400" />
                <span>{evt.label}</span>
              </div>
            </div>

            {/* Core Info Details */}
            <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
              <div className="space-y-1.5">
                <h4 className="text-[14px] font-semibold text-neutral-200 uppercase tracking-wide leading-tight group-hover:text-amber-300 transition-colors duration-200">
                  {evt.title}
                </h4>
                <p className="text-xs text-neutral-400 font-normal leading-relaxed">
                  {evt.description}
                </p>
              </div>

              {/* Venue Marker */}
              <div className="pt-3 border-t border-white/5 flex items-center gap-1.5 text-[10px] text-neutral-400 font-bold font-mono tracking-wider">
                <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span className="truncate uppercase">{evt.venue}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
