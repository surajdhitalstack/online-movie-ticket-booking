export interface Movie {
  id: string;
  title: string;
  genre: string;
  rating: number;
  duration: number;
  language: string;
  image: string;
  description: string;
  gradient: string;
}

export interface UpcomingMovie {
  id: string;
  title: string;
  genre: string;
  releaseDate: string;
  gradient: string;
  image: string;
}

export interface ImmersiveEvent {
  id: string;
  title: string;
  label: string;
  description: string;
  venue: string;
  image: string;
}

export interface Seat {
  id: string; // e.g. "A3"
  row: string; // "A"
  number: number; // 3
  category: 'Premium' | 'Standard' | 'Economy';
  price: number;
  status: 'available' | 'selected' | 'occupied';
}

export interface BookingState {
  currentMovieId: string;
  selectedHall: string;
  selectedTimeSlot: string | null;
  selectedSeats: string[]; // array of seat IDs
  selectedPaymentMethod: 'esewa' | 'khalti' | 'card';
  generatedTicketId: string;
  isPaused: boolean;
}
