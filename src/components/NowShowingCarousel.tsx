import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Star, Clock, Globe, Ticket, ChevronDown } from 'lucide-react';
import { Movie } from '../types';
import { MOVIES } from '../data';
import { motion, AnimatePresence } from 'motion/react';

interface NowShowingCarouselProps {
  selectedMovieId: string;
  onMovieSelect: (id: string) => void;
}

export default function NowShowingCarousel({
  selectedMovieId,
  onMovieSelect,
}: NowShowingCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const autoplayTimer = useRef<NodeJS.Timeout | null>(null);

  // Sync index if selection comes from outer components (like the grid)
  useEffect(() => {
    const matchedIndex = MOVIES.findIndex((m) => m.id === selectedMovieId);
    if (matchedIndex !== -1 && matchedIndex !== currentIndex) {
      setCurrentIndex(matchedIndex);
    }
  }, [selectedMovieId]);

  // Autoplay loop definition
  useEffect(() => {
    if (autoplayTimer.current) {
      clearInterval(autoplayTimer.current);
    }

    if (isPlaying) {
      autoplayTimer.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % MOVIES.length);
      }, 4000); // Auto-plays every 4 seconds
    }

    return () => {
      if (autoplayTimer.current) {
        clearInterval(autoplayTimer.current);
      }
    };
  }, [isPlaying]);

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % MOVIES.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex - 1 + MOVIES.length) % MOVIES.length);
  };

  const handleDotClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(index);
  };

  const activeMovie = MOVIES[currentIndex];

  const handleSelectMovie = () => {
    onMovieSelect(activeMovie.id);
    // Dynamic scroll helper to move smoothly down to schedules
    const targetElement = document.getElementById('session-showtimes-scheduler-section');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const isOuterSelected = selectedMovieId === activeMovie.id;

  return (
    <section 
      className="relative overflow-hidden w-full bg-black border-b border-white/5 group/carousel" 
      id="now-showing-spotlight-autoplay-carousel"
    >
      {/* Main Slide Carousel Area */}
      <div className="relative h-[70vh] sm:h-[80vh] md:h-[85vh] lg:h-[90vh] xl:h-[92vh] min-h-[550px] sm:min-h-[650px] md:min-h-[750px] lg:min-h-[850px] xl:min-h-[920px] w-full flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMovie.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 h-full w-full"
            onClick={handleSelectMovie}
          >
            {/* Slide Poster Image with responsive object position */}
            <img
              src={activeMovie.image}
              alt={activeMovie.title}
              className="h-full w-full object-cover object-[center_20%] sm:object-[center_15%] filter brightness-60 contrast-[1.05]"
              referrerPolicy="no-referrer"
            />

            {/* Absolute rich dark styling gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />

            {/* Interactive metadata/content display overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10 flex flex-col justify-end text-left max-w-3xl space-y-2.5 sm:space-y-4">
              
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="glass-pill rounded-full px-3.5 py-1 text-[9px] font-bold tracking-widest text-amber-400 uppercase select-none">
                  NOW EXHIBITING
                </span>
                
                <div className="glass-pill flex items-center gap-1 rounded-full px-3 py-1 text-[9px] text-white font-bold font-mono select-none">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span>{activeMovie.rating}</span>
                </div>

                <div className="glass-pill flex items-center gap-1 rounded-full px-3 py-1 text-[9px] text-neutral-200 font-bold font-mono select-none">
                  <Clock className="h-3 w-3 text-amber-400" />
                  <span>{activeMovie.duration} MIN</span>
                </div>
              </div>

              {/* Title Header */}
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-tight text-white uppercase leading-none">
                {activeMovie.title}
              </h1>

              {/* Description body */}
              <p className="text-xs sm:text-[13px] text-neutral-300 max-w-2xl font-normal leading-relaxed line-clamp-2 sm:line-clamp-3">
                {activeMovie.description}
              </p>

              {/* Action layout */}
              <div className="pt-2 flex flex-wrap gap-3 items-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectMovie();
                  }}
                  className={`flex items-center gap-1.5 px-4.5 py-2 rounded-lg text-[11px] font-medium tracking-wide transition-all duration-200 cursor-pointer ${
                    isOuterSelected 
                      ? 'bg-neutral-800 border border-white/10 text-white' 
                      : 'bg-white hover:bg-neutral-100 text-black'
                  }`}
                >
                  <Ticket className="h-3.5 w-3.5 shrink-0" />
                  <span>{isOuterSelected ? 'Active Selection (Choose Showtime)' : 'Select & Book Film'}</span>
                </button>

                <div className="hidden sm:flex items-center gap-1.5 text-neutral-450 font-mono text-[9px] tracking-wider">
                  <span className="h-1 w-1 rounded-full bg-neutral-650" />
                  <span>{activeMovie.language}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Manual Left/Right navigation handles - hidden on mobile, visible on lg hover */}
      <button
        type="button"
        onClick={handlePrev}
        className="absolute left-6 top-1/2 -translate-y-1/2 h-11 w-11 flex items-center justify-center rounded-full glass-pill text-white hover:scale-105 active:scale-95 transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 z-20 cursor-pointer shadow-2xl hidden md:flex"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="h-5.5 w-5.5 text-neutral-200" />
      </button>

      <button
        type="button"
        onClick={handleNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 h-11 w-11 flex items-center justify-center rounded-full glass-pill text-white hover:scale-105 active:scale-95 transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 z-20 cursor-pointer shadow-2xl hidden md:flex"
        aria-label="Next Slide"
      >
        <ChevronRight className="h-5.5 w-5.5 text-neutral-200" />
      </button>

      {/* Control Dots & Autoplay state overlay */}
      <div className="absolute bottom-6 right-6 flex items-center gap-2.5 px-3.5 py-2 rounded-full glass-pill shadow-xl z-20 font-mono text-[10px]">
        
        {/* Toggle Play/Pause */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsPlaying(!isPlaying);
          }}
          className="text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer"
          title={isPlaying ? "Pause Slideshow" : "Play Slideshow"}
        >
          {isPlaying ? (
            <Pause className="h-3 w-3 fill-current" />
          ) : (
            <Play className="h-3 w-3 fill-current" />
          )}
        </button>

        <div className="h-2.5 w-[1px] bg-white/10" />

        {/* Bullet indicators */}
        <div className="flex gap-1">
          {MOVIES.map((movie, idx) => {
            const isSlideActive = idx === currentIndex;
            return (
              <button
                key={movie.id}
                type="button"
                onClick={(e) => handleDotClick(idx, e)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  isSlideActive ? 'w-3.5 bg-white' : 'w-1.5 bg-neutral-600 hover:bg-neutral-500'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            );
          })}
        </div>
      </div>

      {/* Elegant Clickable Scroll Down Indicator */}
      <div 
        onClick={() => {
          const targetElement = document.getElementById('session-showtimes-scheduler-section');
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer animate-bounce text-neutral-450 hover:text-white transition-colors text-[9px] tracking-widest font-mono select-none z-20"
      >
        <span>SCROLL TO EXPLORE</span>
        <ChevronDown className="h-4 w-4" />
      </div>
    </section>
  );
}
