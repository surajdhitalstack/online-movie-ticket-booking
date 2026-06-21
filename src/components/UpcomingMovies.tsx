import React from 'react';
import { Calendar, Flame, AlertCircle } from 'lucide-react';
import { UPCOMING_MOVIES } from '../data';
import { motion } from 'motion/react';

export default function UpcomingMovies() {
  return (
    <section className="space-y-6" id="upcoming-movies-section">
      {/* Section Header */}
      <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-5 pt-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-400">
              COMING ATTRACTIONS
            </span>
          </div>
          <h3 className="text-xl font-light tracking-wide text-white uppercase sm:text-2xl">
            Expected <span className="font-semibold text-neutral-100">Blockbusters</span>
          </h3>
          <p className="text-[11px] text-neutral-500 max-w-md">
            Highly anticipated global masterpieces and Nepali stories coming soon to our multi-screen arenas.
          </p>
        </div>
        
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="font-mono text-[9.5px] text-neutral-400 glass-pill px-3.5 py-1.5 rounded-full uppercase tracking-widest font-bold">
            Premiering soon
          </span>
        </div>
      </div>

      {/* Cards list */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {UPCOMING_MOVIES.map((movie, index) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="group relative overflow-hidden rounded-3xl transition-all duration-300 glass-panel p-4.5 hover:border-amber-400/25 hover:-translate-y-1 hover:scale-[1.01] select-none"
          >
            {/* Background Decorative Gradient according to specified movie color tints */}
            <div className={`absolute inset-0 bg-gradient-to-br ${movie.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />

            <div className="relative flex items-center gap-4 z-10">
              {/* Thumbnail Mini-Poster mock */}
              <div className="relative h-20 w-15 shrink-0 overflow-hidden rounded-xl bg-neutral-950 border border-white/10 shadow-lg">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="h-full w-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-500 ease-out"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Core Text Info */}
              <div className="space-y-1.5 w-full min-w-0">
                <h4 className="text-[13.5px] font-semibold text-neutral-200 leading-snug truncate group-hover:text-amber-300 transition-colors duration-200">
                  {movie.title}
                </h4>
                <p className="text-[10px] font-mono text-neutral-500 truncate uppercase font-bold tracking-wider">
                  {movie.genre.split(' • ').slice(0, 2).join(' / ')}
                </p>

                {/* Date Label Badge */}
                <div className="pt-1 flex items-center gap-1.5 text-[10px] text-amber-400 font-bold font-mono tracking-wider">
                  <Calendar className="h-3 w-3 shrink-0" />
                  <span className="uppercase">{movie.releaseDate}</span>
                </div>
              </div>
            </div>

            {/* Aesthetic under-line color accent matching the card theme with luxury glow */}
            <div className="absolute bottom-0 left-0 h-[2.5px] w-0 bg-amber-400 shadow-[0_0_8px_#daa520] group-hover:w-full transition-all duration-500" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
