import React from 'react';
import { Armchair } from 'lucide-react';
import { getHallSeatingLayout, getSeatCategoryAndPrice } from '../data';
import { motion } from 'motion/react';

interface SeatGridProps {
  selectedSlot: string | null;
  selectedSeats: string[];
  onSeatToggle: (seatId: string) => void;
  selectedHall: string;
  occupiedSeats: string[];
}

export default function SeatGrid({
  selectedSlot,
  selectedSeats,
  onSeatToggle,
  selectedHall,
  occupiedSeats,
}: SeatGridProps) {
  if (!selectedSlot) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-12 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-amber-400 mb-4">
          <Armchair className="h-5 w-5" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
          Auditorium Seating Locked
        </p>
        <p className="max-w-xs text-[11px] text-neutral-500 mt-1.5 leading-relaxed">
          Please select an exhibition showtime session above to unlock the interactive seat reservation layout.
        </p>
      </div>
    );
  }

  const { rows, columns, gaps } = getHallSeatingLayout(selectedHall);

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="premium-card space-y-8 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      id="seat-grid-selection-section"
    >
      {/* Title */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-amber-400 animate-pulse" />
            <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-300">
              Reserve Seats
            </h3>
          </div>
          <p className="text-[10px] text-neutral-550 font-mono">
            HALL: {selectedHall.split(',')[0]}
          </p>
        </div>
        <span className="glass-pill font-mono text-[10px] text-neutral-200 px-3.5 py-1 rounded-full border border-white/10 select-none">
          {selectedSlot}
        </span>
      </div>

      {/* Screen Visualization */}
      <div className="relative flex flex-col items-center justify-center py-6" id="theater-screen-visualization">
        <div className="w-[85%] h-1 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent shadow-[0_0_20px_rgba(218,165,32,0.3)] animate-pulse" />
        <span className="font-mono text-[9px] tracking-[0.35em] text-neutral-400 uppercase text-center mt-3 mr-[-0.35em] select-none">
          Screen Direction
        </span>
      </div>

      {/* Seat Matrix layout */}
      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="min-w-[760px] sm:min-w-[850px] flex flex-col items-center space-y-3 px-4 select-none">
          {rows.map((row) => {
            return (
              <div key={row} className="flex items-center gap-4.5">
                {/* Left Row Indicator label */}
                <div className="w-6 text-center text-[10px] font-semibold text-neutral-600">
                  {row}
                </div>

                {/* Grid array of seats with spacing gaps */}
                <div className="flex items-center gap-2 sm:gap-2.5">
                  {columns.map((col) => {
                    // Check if this column is a gap/aisle walkway
                    const isGap = gaps.includes(col);
                    if (isGap) {
                      return (
                        <div
                          key={`gap-${col}`}
                          className="w-5 sm:w-8 h-9 sm:h-10 flex items-center justify-center pointer-events-none"
                        />
                      );
                    }

                    const seatId = `${row}${col}`;
                    const isOccupied = occupiedSeats.includes(seatId);
                    const isSelected = selectedSeats.includes(seatId);
                    const { category, price, bgClass } = getSeatCategoryAndPrice(row, rows);

                    let seatBg = bgClass;
                    if (isOccupied) {
                      seatBg = 'border-white/10 bg-neutral-950 opacity-20 text-neutral-700 cursor-not-allowed';
                    } else if (isSelected) {
                      seatBg = 'border-white bg-white text-black font-semibold scale-105';
                    }

                    return (
                      <button
                        key={seatId}
                        id={`seat-cell-${seatId}`}
                        disabled={isOccupied}
                        onClick={() => onSeatToggle(seatId)}
                        title={`${seatId} - ${category} (NRs. ${price})`}
                        className={`group relative flex h-8.5 w-8.5 sm:h-9.5 sm:w-9.5 items-center justify-center rounded-xl border text-[10.5px] sm:text-[11.5px] font-mono transition-all duration-200 cursor-pointer ${seatBg}`}
                      >
                        {isSelected ? (
                          <span className="scale-105 font-bold">✓</span>
                        ) : isOccupied ? (
                          <span>×</span>
                        ) : (
                          <span>{col}</span>
                        )}
                        
                        {/* Interactive popup price hint on hover (except occupied) */}
                        {!isOccupied && !isSelected && (
                          <div className="pointer-events-none absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-25 text-center">
                            <div className="bg-neutral-950/95 backdrop-blur-md text-amber-300 border border-white/15 text-[9px] px-3 py-1 rounded-lg font-mono shadow-2xl whitespace-nowrap uppercase tracking-wider font-bold">
                              {seatId} • {category} • NRs. {price}
                            </div>
                            <div className="w-1.5 h-1.5 bg-neutral-950/95 border-r border-b border-white/15 rotate-45 mt-[-4px] backdrop-blur-md" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Right Row Indicator label */}
                <div className="w-6 text-center text-[10px] font-semibold text-neutral-600">
                  {row}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seat Pricing Categories Info Map */}
      <div className="grid grid-cols-1 gap-4 rounded-2xl bg-white/5 border border-white/10 p-5 sm:grid-cols-3 text-xs backdrop-blur-2xl">
        <div className="flex items-center gap-3.5 px-3 py-1">
          <div className="h-3 w-3 rounded-md bg-white/5 border border-white/10 shrink-0" />
          <div className="flex flex-col">
            <span className="font-semibold text-neutral-200">Economy Lounge</span>
            <span className="text-[10px] font-mono text-neutral-500 font-bold uppercase tracking-wide">NRs. 200 / seat</span>
          </div>
        </div>
        <div className="flex items-center gap-3.5 px-3 py-1">
          <div className="h-3 w-3 rounded-md bg-amber-500/10 border border-amber-500/30 shrink-0" />
          <div className="flex flex-col">
            <span className="font-semibold text-amber-300">Luxury Armchairs</span>
            <span className="text-[10px] font-mono text-neutral-500 font-bold uppercase tracking-wide">NRs. 380 / seat</span>
          </div>
        </div>
        <div className="flex items-center gap-3.5 px-3 py-1">
          <div className="h-3 w-3 rounded-md bg-rose-500/10 border border-rose-500/30 shrink-0" />
          <div className="flex flex-col">
            <span className="font-semibold text-rose-350">Royal Balcony</span>
            <span className="text-[10px] font-mono text-neutral-500 font-bold uppercase tracking-wide">NRs. 450 / seat</span>
          </div>
        </div>
      </div>

      {/* Seat color state legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] font-mono text-neutral-400 border-t border-white/10 pt-4 uppercase tracking-wider select-none font-medium">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-white/5 border border-white/10" />
          <span className="text-neutral-400">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-amber-400 border border-amber-400 shadow-[0_0_8px_#daa520]" />
          <span className="text-amber-400 font-bold">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-neutral-950 border border-white/10 opacity-30 flex items-center justify-center text-[9px] text-neutral-600">×</div>
          <span className="text-neutral-550">Occupied</span>
        </div>
      </div>
    </motion.section>
  );
}
