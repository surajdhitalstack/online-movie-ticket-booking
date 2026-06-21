import React from 'react';
import { Star, Film, Check, Play } from 'lucide-react';
import { Movie } from '../types';
import { MOVIES } from '../data';
import { motion } from 'motion/react';

interface MovieGridProps {
  selectedMovieId: string;
  onMovieSelect: (id: string) => void;
}

export default function MovieGrid({ selectedMovieId, onMovieSelect }: MovieGridProps) {
  return (
    <section className="space-y-6" id="now-showing-grid-section">
      {/* Dynamic Header */}
      <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-5 pt-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-400">
              CURATED SELECTIONS
            </span>
          </div>
          <h3 className="text-xl font-light tracking-wide text-white uppercase sm:text-2xl">
            Featured <span className="font-semibold text-neutral-100">Exhibitions</span>
          </h3>
          <p className="text-[11px] text-neutral-500 max-w-md">
            Handpicked sensory masterpieces showing in ultra-premium lounges and laser auditoriums.
          </p>
        </div>
        
        {/* Available Count Tag with premium minimalist typography */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center gap-2.5 rounded-full glass-pill px-4.5 py-1.5 text-[9px] sm:text-[10px] font-mono text-neutral-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400/50 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400"></span>
            </span>
            <span className="tracking-widest uppercase font-mono">{MOVIES.length} EXHIBITIONS LIVE today</span>
          </div>
        </div>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:gap-8">
        {MOVIES.map((movie, index) => {
          const isActive = movie.id === selectedMovieId;
          return (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.04 }}
              onClick={() => onMovieSelect(movie.id)}
              className={`group relative flex flex-col overflow-hidden rounded-3xl transition-all duration-300 cursor-pointer select-none ${
                isActive
                  ? 'glass-panel border-amber-400/35 shadow-[0_20px_50px_rgba(218,165,32,0.15)] scale-[1.02]'
                  : 'glass-panel hover:border-white/15 hover:scale-[1.01]'
              }`}
            >
              {/* Aspect-ratio Poster Container */}
              <div className="relative aspect-[10/14] overflow-hidden bg-neutral-950">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent opacity-90 transition-opacity group-hover:opacity-80" />

                {/* Selected Accent border indicator */}
                {isActive && (
                  <div className="absolute inset-0 border-[3px] border-amber-400/40 pointer-events-none rounded-t-3xl z-20 m-0" />
                )}

                {/* Hover Play action HUD */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-2xl transition-transform duration-300 scale-90 group-hover:scale-100">
                    <Play className="h-5 w-5 fill-black text-black ml-0.5" />
                  </div>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 rounded-full glass-pill px-3 py-1 text-[10px] font-bold text-white z-10">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="font-mono text-neutral-155">{movie.rating}</span>
                </div>

                {/* Exhibition Format Tag at bottom corner of poster */}
                <div className="absolute bottom-3.5 left-3.5 flex items-center gap-1 z-10 font-mono text-[8.5px] tracking-widest text-neutral-200 glass-pill px-3 py-1 rounded-full uppercase">
                  {movie.language.includes('IMAX') ? 'IMAX 3D' : movie.language.includes('Atmos') ? 'Atmos 3D' : 'Laser 2D'}
                </div>
              </div>

              {/* Movie info details */}
              <div className="flex flex-1 flex-col p-5 space-y-3 justify-between">
                <div>
                  <h4 className={`text-[13px] font-medium leading-snug transition-colors duration-200 line-clamp-1 ${
                    isActive ? 'text-amber-300 font-semibold' : 'text-neutral-200 group-hover:text-white'
                  }`}>
                    {movie.title}
                  </h4>
                  <span className="text-[10.5px] text-neutral-500 font-medium tracking-normal line-clamp-1 block mt-1.5">
                    {movie.genre.split(' • ').join('  /  ')}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[9.5px] text-neutral-500 font-mono">
                  <span>{movie.duration} MIN</span>
                  <span className="flex items-center gap-1">
                    {isActive ? (
                      <span className="flex items-center gap-1 text-amber-400 font-bold tracking-widest text-[9px]">
                        <Check className="h-3 w-3 text-amber-400 stroke-[3.5px] animate-pulse" />
                        <span>SELECTED</span>
                      </span>
                    ) : (
                      <span className="text-neutral-500/80 group-hover:text-neutral-300 tracking-wider">TAP TO BOOK</span>
                    )}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
