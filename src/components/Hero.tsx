import React from 'react';
import { Star, Clock, Globe, Film, Info } from 'lucide-react';
import { Movie } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface HeroProps {
  movie: Movie;
}

export default function Hero({ movie }: HeroProps) {
  return (
    <div className="relative overflow-hidden w-full h-[400px] md:h-[480px] lg:h-[550px] border-b border-white/5 bg-cinema-dark">
      {/* Background Poster Image with Cinematic Fades */}
      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 h-full w-full"
        >
          <img
            src={movie.image}
            alt={movie.title}
            className="h-full w-full object-cover object-top opacity-50 filter brightness-95"
            referrerPolicy="no-referrer"
          />
          {/* Deep Cinematic Overlay Vibe. Gold & Dark Blue hues */}
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark via-cinema-dark/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-cinema-dark via-transparent to-cinema-dark/40" />
        </motion.div>
      </AnimatePresence>

      {/* Hero Content Information Container */}
      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-8 md:px-8 lg:pb-12 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-2xl space-y-4"
          >
            {/* Spot Tag */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-accent-gold/20 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-accent-gold shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              IN THE SPOTLIGHT
            </div>

            {/* Title */}
            <h2 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl uppercase leading-none drop-shadow-md">
              {movie.title.split(' ')[0]} <span className="text-accent-gold">{movie.title.split(' ').slice(1).join(' ')}</span>
            </h2>

            {/* Metadata Badges */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#94a3b8] font-medium">
              {/* Rating */}
              <div className="flex items-center gap-1 rounded bg-[#daa520]/10 border border-[#daa520]/25 px-2 py-0.5 text-accent-gold">
                <Star className="h-3 w-3 fill-accent-gold" />
                <span className="font-semibold">{movie.rating} / 10</span>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-1 text-[#94a3b8] bg-white/5 px-2.5 py-0.5 rounded border border-white/5">
                <Clock className="h-3 w-3 text-slate-400" />
                <span>{movie.duration} min</span>
              </div>

              {/* Genre */}
              <div className="flex items-center gap-1 text-[#94a3b8] bg-white/5 px-2.5 py-0.5 rounded border border-white/5 font-mono text-[10px] uppercase tracking-wide">
                <span>{movie.genre}</span>
              </div>

              {/* Audio/Language specs */}
              <div className="flex items-center gap-1 text-[#94a3b8] bg-white/5 px-2.5 py-0.5 rounded border border-white/5">
                <Globe className="h-3 w-3 text-slate-400" />
                <span>{movie.language}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-[#94a3b8] max-w-xl leading-relaxed italic drop-shadow-md line-clamp-3">
              "{movie.description}"
            </p>

            {/* Interaction Hook Call to Action */}
            <div className="pt-2 flex items-center gap-2">
              <div className="animate-bounce flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/10 border border-accent-gold/40 text-accent-gold text-xs font-bold">
                ⚡
              </div>
              <span className="font-display text-xs font-bold uppercase tracking-wider text-accent-gold">
                Choose a session below to reserve your auditorium ticket
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
