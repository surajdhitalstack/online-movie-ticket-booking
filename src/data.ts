import { Movie, UpcomingMovie, ImmersiveEvent } from './types';

export const CINEMA_LOCATIONS = [
  'QFX Chhaya Center, Thamel',
  'QFX Labim Mall, Lalitpur',
  'QFX Civil Mall, Kathmandu',
  'One Cinemas, Eyeplex Mall, Baneshwor',
  'One Cinemas, Kalimati Trade Center',
  'iNi Cinemas, Bishwojyoti Mall, Jamal',
  'FCUBE Cinemas, Chabahil',
  'BSR Movies, Gongabu BG Mall',
  'QFX Jalma, Narayangarh',
  'QFX Cinema, Cinema Chowk, Pokhara',
];

export const MOVIES: Movie[] = [
  {
    id: 'm1',
    title: 'Shambhala',
    genre: 'Drama • Spiritual • Adventure',
    rating: 9.2,
    duration: 150,
    language: 'Nepali (English Subtitles)',
    image: 'https://images.unsplash.com/photo-1486916856992-e4db22c8df33?auto=format&fit=crop&q=80&w=1200',
    description: 'In a high-altitude Himalayan polyandrous village, a pregnant woman named Pema embarks on an epic journey of physical and spiritual resilience when her first husband goes missing.',
    gradient: 'from-amber-600/30 to-slate-950/90',
  },
  {
    id: 'm2',
    title: 'Kalki 2898 AD',
    genre: 'Sci-Fi • Mythological • Action',
    rating: 8.8,
    duration: 181,
    language: 'Hindi (IMAX 3D)',
    image: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=1200',
    description: 'When the world is submerged in absolute darkness in a post-apocalyptic Kasi, a set of rebels and an ancient immortal warrior assemble to protect a pregnant lab subject who carries a divine savior.',
    gradient: 'from-blue-600/30 to-slate-950/90',
  },
  {
    id: 'm3',
    title: 'Maha Jatra',
    genre: 'Comedy • Crime • Drama',
    rating: 8.6,
    duration: 137,
    language: 'Nepali (2D)',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200',
    description: 'The hilarious and chaotic misadventures of three middle-class friends who find themselves trapped in a high-stakes, illegal cash-laundering conspiracy in the heart of Kathmandu.',
    gradient: 'from-yellow-600/30 to-slate-950/90',
  },
  {
    id: 'm4',
    title: 'Deadpool & Wolverine',
    genre: 'Action • Sci-Fi • Comedy',
    rating: 8.9,
    duration: 127,
    language: 'English (Dolby Atmos 3D)',
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=1200',
    description: 'A listless Wade Wilson toils in civilian life until a threat to his home universe forces him to team up with an extremely reluctant and combat-hardened Wolverine.',
    gradient: 'from-rose-600/30 to-slate-950/90',
  },
  {
    id: 'm5',
    title: 'Purna Bahadur Ko Sarangi',
    genre: 'Drama • Musical',
    rating: 9.6,
    duration: 140,
    language: 'Nepali (2D)',
    image: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&q=80&w=1200',
    description: "A touching drama of a father's selfless sacrifices and struggles to provide his son with a better education, using his traditional musical Sarangi instrument in the hills of Nepal.",
    gradient: 'from-amber-700/30 to-slate-950/90',
  },
  {
    id: 'm6',
    title: '12 Gaun',
    genre: 'Action • Thriller',
    rating: 9.3,
    duration: 154,
    language: 'Nepali (2D)',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=1200',
    description: "A high-octane action thriller highlighting the battle against tyranny and crime lord exploitation in a rugged, isolated set of 12 mountainous villages.",
    gradient: 'from-red-700/30 to-slate-950/90',
  },
  {
    id: 'm7',
    title: 'Interstellar (Re-issue)',
    genre: 'Sci-Fi • Epic • Adventure',
    rating: 9.8,
    duration: 169,
    language: 'English (IMAX Laser 70mm)',
    image: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&q=80&w=1200',
    description: 'A team of explorers travel through a newly discovered wormhole in space in an attempt to ensure humanity\'s survival amidst a global blighted famine.',
    gradient: 'from-purple-500/30 to-slate-950/90',
  },
  {
    id: 'm8',
    title: 'Dune: Part Two',
    genre: 'Sci-Fi • Epic • Action',
    rating: 9.5,
    duration: 166,
    language: 'English (IMAX 3D Laser)',
    image: 'https://images.unsplash.com/photo-1547483238-f400e65ccd56?auto=format&fit=crop&q=80&w=1200',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family, endeavoring to prevent a terrible future only he can foresee.',
    gradient: 'from-amber-600/30 to-slate-950/90',
  },
];

export const UPCOMING_MOVIES: UpcomingMovie[] = [
  {
    id: 'u1',
    title: 'Pooja, Sir',
    genre: 'Drama • Crime • Social',
    releaseDate: 'Releasing Soon',
    gradient: 'from-emerald-500/20 to-zinc-900/90',
    image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'u2',
    title: 'Avatar: Fire and Ash',
    genre: 'Sci-Fi • Epic • Fantasy',
    releaseDate: 'Releasing Nov 2026',
    gradient: 'from-fuchsia-500/20 to-zinc-900/90',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'u3',
    title: 'Singham Again',
    genre: 'Action • Thriller',
    releaseDate: 'Releasing Next Friday',
    gradient: 'from-sky-500/20 to-zinc-900/90',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'u4',
    title: 'Kabaddi 5',
    genre: 'Comedy • Cultural • Romance',
    releaseDate: 'Releasing Dashain',
    gradient: 'from-rose-500/20 to-zinc-900/90',
    image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&q=80&w=400',
  },
];

export const IMMERSIVE_EVENTS: ImmersiveEvent[] = [
  {
    id: 'e1',
    title: 'Nepal Indie Film Festival 2026',
    label: 'FESTIVAL TICKET',
    description: 'Showcasing ground-breaking narrative shorts and cinematic innovations from native creators across the country.',
    venue: 'QFX Chhaya Center',
    image: 'https://picsum.photos/seed/indiefilm/600/400',
  },
  {
    id: 'e2',
    title: 'Retro Hollywood IMAX Night',
    label: 'FAN EVENT',
    description: 'Exclusive 4K remaster screening of Interstellar with live orchestral introduction and custom high-fidelity audio system.',
    venue: 'One Cinemas, Eyeplex Mall',
    image: 'https://picsum.photos/seed/retroimax/600/400',
  },
  {
    id: 'e3',
    title: 'Anime Cosplay Screening Block',
    label: 'COMMUNITY NIGHT',
    description: 'Dress as your favorite character and enjoy custom merchandise stalls, visual arts showcase, and dual sensory audio.',
    venue: 'QFX Labim Mall',
    image: 'https://picsum.photos/seed/cosplay/600/400',
  },
];

export const TIME_SLOTS = [
  '10:00 AM',
  '01:30 PM',
  '04:45 PM',
  '08:00 PM',
  '11:15 PM',
];

export const PRE_OCCUPIED_SEATS = ['A3', 'A4', 'B1', 'C7', 'C8', 'D5', 'E11'];

export interface SeatingLayout {
  rows: string[];
  columns: number[];
  gaps: number[];
}

export function getHallSeatingLayout(hallName: string): SeatingLayout {
  if (hallName.includes('Labim Mall')) {
    return {
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      columns: Array.from({ length: 10 }, (_, i) => i + 1),
      gaps: [3, 8],
    };
  } else if (hallName.includes('Civil Mall')) {
    return {
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      columns: Array.from({ length: 14 }, (_, i) => i + 1),
      gaps: [4, 11],
    };
  } else if (hallName.includes('Eyeplex')) {
    return {
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
      columns: Array.from({ length: 12 }, (_, i) => i + 1),
      gaps: [6],
    };
  } else if (hallName.includes('Kalimati')) {
    return {
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      columns: Array.from({ length: 10 }, (_, i) => i + 1),
      gaps: [5],
    };
  } else if (hallName.includes('Jamal')) {
    return {
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      columns: Array.from({ length: 12 }, (_, i) => i + 1),
      gaps: [4, 9],
    };
  } else if (hallName.includes('Chabahil')) {
    return {
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      columns: Array.from({ length: 12 }, (_, i) => i + 1),
      gaps: [3, 10],
    };
  } else if (hallName.includes('Gongabu')) {
    return {
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
      columns: Array.from({ length: 14 }, (_, i) => i + 1),
      gaps: [4, 11],
    };
  } else if (hallName.includes('Jalma')) {
    return {
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      columns: Array.from({ length: 12 }, (_, i) => i + 1),
      gaps: [5],
    };
  } else if (hallName.includes('Pokhara')) {
    return {
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      columns: Array.from({ length: 11 }, (_, i) => i + 1),
      gaps: [3, 9],
    };
  } else {
    // Default (Thamel / fallbacks)
    return {
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      columns: Array.from({ length: 12 }, (_, i) => i + 1),
      gaps: [4, 9],
    };
  }
}

export interface SeatCategoryInfo {
  category: 'Economy' | 'Luxury' | 'Premium';
  price: number;
  label: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

export function getSeatCategoryAndPrice(row: string, totalRows: string[]): SeatCategoryInfo {
  const index = totalRows.indexOf(row);
  if (index === -1) {
    return {
      category: 'Economy',
      price: 200,
      label: 'Economy (Front)',
      colorClass: 'text-slate-400',
      bgClass: 'bg-white/5 border-white/10 text-[#94a3b8] hover:border-slate-400 hover:text-white',
      borderClass: 'border-white/10'
    };
  }
  
  const numRows = totalRows.length;
  const economyCount = Math.floor(numRows * 0.3) || 2; 
  const luxuryCount = Math.floor(numRows * 0.4) || 2; 

  if (index < economyCount) {
    return {
      category: 'Economy',
      price: 200,
      label: 'Economy (Front)',
      colorClass: 'text-slate-400',
      bgClass: 'bg-white/5 border-white/10 text-[#94a3b8] hover:border-slate-400 hover:text-white',
      borderClass: 'border-white/10'
    };
  } else if (index < economyCount + luxuryCount) {
    return {
      category: 'Luxury',
      price: 380,
      label: 'Luxury Lounge (Middle)',
      colorClass: 'text-[#daa520] font-semibold',
      bgClass: 'bg-[#daa520]/5 border-[#daa520]/15 text-[#daa520] hover:border-[#daa520] hover:bg-[#daa520]/25 hover:text-white',
      borderClass: 'border-[#daa520]/25'
    };
  } else {
    return {
      category: 'Premium',
      price: 450,
      label: 'Premium Balcony (Back)',
      colorClass: 'text-rose-400 font-bold',
      bgClass: 'bg-rose-500/5 border-rose-500/20 text-rose-400 hover:border-rose-500 hover:bg-rose-500/15 hover:text-white',
      borderClass: 'border-rose-500/20'
    };
  }
}
