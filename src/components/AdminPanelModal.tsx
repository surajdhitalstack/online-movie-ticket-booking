import React, { useState, useEffect } from 'react';
import { 
  X, Plus, Trash2, Film, Search, DollarSign, Ticket, 
  TrendingUp, Video, Loader2, AlertCircle, RefreshCw, Eye, ShieldAlert, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Movie } from '../types';

interface TicketRecord {
  ticketId: string;
  movieId: string;
  movieTitle: string;
  hall: string;
  slot: string;
  seats: string[];
  totalPrice: number;
  paymentMethod: string;
  createdAt: string;
  userEmail: string;
  userName: string;
}

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMoviesUpdated: () => void; // Callback to notify App.tsx to reload movies
}

export default function AdminPanelModal({ isOpen, onClose, onMoviesUpdated }: AdminPanelModalProps) {
  const [activeTab, setActiveTab] = useState<'MOVIES' | 'TRANSACTIONS' | 'STATS'>('STATS');
  
  // Movie management states
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loadingMovies, setLoadingMovies] = useState<boolean>(false);
  const [deletingMovieId, setDeletingMovieId] = useState<string | null>(null);
  
  // Add Movie Form states
  const [newMovieTitle, setNewMovieTitle] = useState('');
  const [newMovieGenre, setNewMovieGenre] = useState('');
  const [newMovieRating, setNewMovieRating] = useState('8.5');
  const [newMovieDuration, setNewMovieDuration] = useState('140');
  const [newMovieLanguage, setNewMovieLanguage] = useState('Nepali (2D)');
  const [newMovieImage, setNewMovieImage] = useState('');
  const [newMovieDescription, setNewMovieDescription] = useState('');
  const [newMovieGradient, setNewMovieGradient] = useState('from-amber-600/30 to-slate-950/90');
  const [addSuccess, setAddSuccess] = useState(false);
  const [addError, setAddError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Tickets states
  const [tickets, setTickets] = useState<TicketRecord[]>([]);
  const [loadingTickets, setLoadingTickets] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPaymentMethod, setFilterPaymentMethod] = useState('ALL');

  // Load Movies
  const fetchMovies = () => {
    setLoadingMovies(true);
    fetch('/api/movies')
      .then(res => res.json())
      .then(data => {
        setMovies(data.movies || []);
      })
      .catch(err => console.error("Error loading movies for admin:", err))
      .finally(() => setLoadingMovies(false));
  };

  // Load Tickets
  const fetchTickets = () => {
    setLoadingTickets(true);
    fetch('/api/admin/all-tickets')
      .then(res => res.json())
      .then(data => {
        setTickets(data.tickets || []);
      })
      .catch(err => console.error("Error loading admin tickets:", err))
      .finally(() => setLoadingTickets(false));
  };

  useEffect(() => {
    if (isOpen) {
      fetchMovies();
      fetchTickets();
    }
  }, [isOpen]);

  const handleAddMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMovieTitle || !newMovieGenre || !newMovieDuration || !newMovieImage || !newMovieDescription) {
      setAddError('Please complete all required fields.');
      return;
    }

    setSubmitting(true);
    setAddError('');
    setAddSuccess(false);

    const moviePayload = {
      title: newMovieTitle,
      genre: newMovieGenre,
      rating: parseFloat(newMovieRating) || 8.5,
      duration: parseInt(newMovieDuration) || 120,
      language: newMovieLanguage,
      image: newMovieImage,
      description: newMovieDescription,
      gradient: newMovieGradient
    };

    fetch('/api/movies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(moviePayload)
    })
      .then(res => {
        if (!res.ok) throw new Error('Insertion failed');
        return res.json();
      })
      .then(data => {
        setAddSuccess(true);
        setNewMovieTitle('');
        setNewMovieGenre('');
        setNewMovieImage('');
        setNewMovieDescription('');
        fetchMovies();
        onMoviesUpdated();
        setTimeout(() => setAddSuccess(false), 3000);
      })
      .catch(err => {
        setAddError('Error storing movie. Please try again.');
        console.error(err);
      })
      .finally(() => setSubmitting(false));
  };

  const handleDeleteMovie = (id: string) => {
    if (!confirm('Are you absolutely sure you want to remove this movie from the system?')) return;
    setDeletingMovieId(id);
    fetch(`/api/movies/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(() => {
        fetchMovies();
        onMoviesUpdated();
      })
      .catch(err => console.error("Error deleting movie:", err))
      .finally(() => setDeletingMovieId(null));
  };

  // Helper stats calculations
  const totalRevenue = tickets.reduce((sum, t) => sum + t.totalPrice, 0);
  const totalTickets = tickets.reduce((sum, t) => sum + t.seats.length, 0);

  // Filtered tickets
  const filteredTickets = tickets.filter(t => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      t.ticketId.toLowerCase().includes(query) ||
      t.movieTitle.toLowerCase().includes(query) ||
      t.userEmail.toLowerCase().includes(query) ||
      t.userName.toLowerCase().includes(query);
    
    const matchesMethod = filterPaymentMethod === 'ALL' || t.paymentMethod.toUpperCase() === filterPaymentMethod;
    
    return matchesSearch && matchesMethod;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-2xl p-4 flex items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="glass-panel relative w-full max-w-5xl overflow-hidden rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.85)] border border-white/10 flex flex-col max-h-[90vh]"
        id="cinema-administrative-terminal"
      >
        {/* Terminal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 border-b border-white/10 gap-4 shrink-0 bg-neutral-950/40">
          <div className="flex items-center gap-3">
            <div className="h-8.5 w-8.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Video className="h-4.5 w-4.5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                CinePremium Administrative Hub
              </h3>
              <p className="text-[10px] text-amber-400 font-mono tracking-widest uppercase">
                Secure Terminal / Central Control
              </p>
            </div>
          </div>
          
          {/* Main Hub Tabs */}
          <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('STATS')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'STATS' 
                  ? 'bg-amber-400 text-black shadow-lg' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('MOVIES')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'MOVIES' 
                  ? 'bg-amber-400 text-black shadow-lg' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Movies ({movies.length})
            </button>
            <button
              onClick={() => setActiveTab('TRANSACTIONS')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'TRANSACTIONS' 
                  ? 'bg-amber-400 text-black shadow-lg' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Ledger ({tickets.length})
            </button>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:static rounded-full p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Workspace Body */}
        <div className="flex-grow overflow-y-auto p-6 bg-neutral-950/20">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: OVERVIEW / STATS */}
            {activeTab === 'STATS' && (
              <motion.div
                key="stats-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <DollarSign className="h-20 w-20 text-white" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                      Gross Revenue
                    </span>
                    <h4 className="text-2xl font-bold font-mono text-white mt-1.5">
                      NRs. {totalRevenue.toLocaleString()}
                    </h4>
                    <div className="flex items-center gap-1 mt-3 text-emerald-400 text-[10px] font-mono">
                      <TrendingUp className="h-3 w-3" />
                      <span>100% Real-time Database</span>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Ticket className="h-20 w-20 text-white" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                      Tickets Dispensed
                    </span>
                    <h4 className="text-2xl font-bold font-mono text-amber-400 mt-1.5">
                      {totalTickets} Seats
                    </h4>
                    <div className="flex items-center gap-1 mt-3 text-neutral-400 text-[10px] font-mono">
                      <span>Across {tickets.length} separate bookings</span>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Film className="h-20 w-20 text-white" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                      Active Cinema Catalog
                    </span>
                    <h4 className="text-2xl font-bold font-mono text-white mt-1.5">
                      {movies.length} Screenings
                    </h4>
                    <div className="flex items-center gap-1 mt-3 text-neutral-400 text-[10px] font-mono">
                      <span>Add/remove directly from admin panel</span>
                    </div>
                  </div>
                </div>

                {/* Sub audit logs section */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                        Recent Reservation Activity
                      </h4>
                      <p className="text-[9px] text-neutral-400 font-mono">
                        Real-time system transactions
                      </p>
                    </div>
                    <button 
                      onClick={fetchTickets}
                      className="text-[9.5px] font-bold text-amber-400 flex items-center gap-1.5 bg-amber-400/5 px-2.5 py-1 rounded-lg border border-amber-500/25 cursor-pointer"
                    >
                      <RefreshCw className="h-3 w-3 animate-spin-hover" />
                      RELOAD ACTIVITY
                    </button>
                  </div>

                  {loadingTickets ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-5 w-5 text-amber-400 animate-spin" />
                    </div>
                  ) : tickets.length === 0 ? (
                    <p className="text-[11px] text-neutral-500 uppercase tracking-widest py-8 text-center font-mono">
                      No tickets recorded in system database.
                    </p>
                  ) : (
                    <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                      {tickets.slice(0, 5).map((t) => (
                        <div key={t.ticketId} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white/2 p-3.5 rounded-xl border border-white/5 gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-neutral-200">{t.userName}</span>
                              <span className="text-[9px] text-neutral-500 font-mono">({t.userEmail})</span>
                            </div>
                            <p className="text-[10px] text-neutral-400">
                              Booked <span className="text-amber-400 font-semibold font-mono">{t.seats.join(', ')}</span> for <span className="text-white font-medium">{t.movieTitle}</span> at {t.slot}
                            </p>
                          </div>
                          <div className="sm:text-right shrink-0">
                            <span className="font-mono text-xs font-bold text-white">NRs. {t.totalPrice}</span>
                            <p className="text-[8px] text-neutral-500 font-mono uppercase tracking-widest">{t.ticketId}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB 2: MANAGE MOVIES */}
            {activeTab === 'MOVIES' && (
              <motion.div
                key="movies-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-5 gap-6"
              >
                {/* Movie Insertion Panel */}
                <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                      Insert New Screening
                    </h4>
                    <p className="text-[9px] text-neutral-400 font-mono">
                      Add a title to the active dynamic catalog
                    </p>
                  </div>

                  <form onSubmit={handleAddMovie} className="space-y-3">
                    {addSuccess && (
                      <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-2.5 rounded-xl text-[10px] flex items-center gap-2 font-semibold">
                        <Check className="h-4.5 w-4.5" />
                        <span>Movie successfully cataloged!</span>
                      </div>
                    )}
                    {addError && (
                      <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-2.5 rounded-xl text-[10px] flex items-center gap-2 font-mono">
                        <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                        <span>{addError}</span>
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-neutral-400 font-mono font-bold">
                        Movie Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={newMovieTitle}
                        onChange={(e) => setNewMovieTitle(e.target.value)}
                        placeholder="e.g. Shambala Part II"
                        className="w-full bg-black/40 border border-white/10 focus:border-amber-400 text-xs px-3.5 py-2 rounded-xl text-white outline-none transition"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-neutral-400 font-mono font-bold">
                          Genre *
                        </label>
                        <input
                          type="text"
                          required
                          value={newMovieGenre}
                          onChange={(e) => setNewMovieGenre(e.target.value)}
                          placeholder="e.g. Action • Drama"
                          className="w-full bg-black/40 border border-white/10 focus:border-amber-400 text-xs px-3.5 py-2 rounded-xl text-white outline-none transition"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-neutral-400 font-mono font-bold">
                          Rating *
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          required
                          value={newMovieRating}
                          onChange={(e) => setNewMovieRating(e.target.value)}
                          placeholder="8.5"
                          className="w-full bg-black/40 border border-white/10 focus:border-amber-400 text-xs px-3.5 py-2 rounded-xl text-white outline-none transition"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-neutral-400 font-mono font-bold">
                          Duration (minutes) *
                        </label>
                        <input
                          type="number"
                          required
                          value={newMovieDuration}
                          onChange={(e) => setNewMovieDuration(e.target.value)}
                          placeholder="140"
                          className="w-full bg-black/40 border border-white/10 focus:border-amber-400 text-xs px-3.5 py-2 rounded-xl text-white outline-none transition"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wider text-neutral-400 font-mono font-bold">
                          Language & Format
                        </label>
                        <input
                          type="text"
                          value={newMovieLanguage}
                          onChange={(e) => setNewMovieLanguage(e.target.value)}
                          placeholder="Nepali (2D)"
                          className="w-full bg-black/40 border border-white/10 focus:border-amber-400 text-xs px-3.5 py-2 rounded-xl text-white outline-none transition"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-neutral-400 font-mono font-bold">
                        Poster Image URL *
                      </label>
                      <input
                        type="url"
                        required
                        value={newMovieImage}
                        onChange={(e) => setNewMovieImage(e.target.value)}
                        placeholder="https://images.unsplash.com/... or relative path"
                        className="w-full bg-black/40 border border-white/10 focus:border-amber-400 text-xs px-3.5 py-2 rounded-xl text-white outline-none transition"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-neutral-400 font-mono font-bold">
                        Description *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={newMovieDescription}
                        onChange={(e) => setNewMovieDescription(e.target.value)}
                        placeholder="Brief summary of the film plot..."
                        className="w-full bg-black/40 border border-white/10 focus:border-amber-400 text-xs p-3.5 rounded-xl text-white outline-none transition resize-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-neutral-400 font-mono font-bold">
                        Hero Color Gradient (Tailwind Class)
                      </label>
                      <select
                        value={newMovieGradient}
                        onChange={(e) => setNewMovieGradient(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 focus:border-amber-400 text-xs px-3 py-2 rounded-xl text-white outline-none transition"
                      >
                        <option value="from-amber-600/30 to-slate-950/90">Amber Glow</option>
                        <option value="from-blue-600/30 to-slate-950/90">Deep Indigo Blue</option>
                        <option value="from-yellow-600/30 to-slate-950/90">Saffron Gold</option>
                        <option value="from-rose-600/30 to-slate-950/90">Rosewood Red</option>
                        <option value="from-red-700/30 to-slate-950/90">Blood Crimson</option>
                        <option value="from-purple-500/30 to-slate-950/90">Royal Purple</option>
                        <option value="from-emerald-500/20 to-zinc-900/90">Jade Forest Green</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-neutral-900 font-bold text-xs py-2.5 rounded-xl uppercase tracking-wider transition shadow-lg mt-2 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {submitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="h-4.5 w-4.5" />
                      )}
                      <span>Insert Screening</span>
                    </button>
                  </form>
                </div>

                {/* Movie Grid Catalog Controller */}
                <div className="lg:col-span-3 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col h-full overflow-hidden">
                  <div className="flex items-center justify-between mb-4.5">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                        Movie Catalog Index
                      </h4>
                      <p className="text-[9px] text-neutral-400 font-mono">
                        Active screenings list
                      </p>
                    </div>
                  </div>

                  {loadingMovies ? (
                    <div className="flex justify-center items-center flex-grow py-24">
                      <Loader2 className="h-5 w-5 text-amber-400 animate-spin" />
                    </div>
                  ) : movies.length === 0 ? (
                    <p className="text-xs text-neutral-500 py-12 text-center uppercase tracking-widest font-mono">
                      No movies present in catalog index.
                    </p>
                  ) : (
                    <div className="space-y-3.5 overflow-y-auto max-h-[500px] flex-grow pr-1.5">
                      {movies.map((m) => (
                        <div
                          key={m.id}
                          className="bg-white/3 border border-white/10 rounded-2xl p-4.5 flex items-center justify-between gap-4 group"
                        >
                          <div className="flex items-center gap-4.5 min-w-0">
                            {/* Tiny thumbnail */}
                            <img
                              src={m.image}
                              alt={m.title}
                              referrerPolicy="no-referrer"
                              className="h-14 w-10.5 rounded-lg object-cover bg-neutral-900 border border-white/10 shrink-0 shadow-md"
                              onError={(e) => {
                                // Fallback image placeholder
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=150';
                              }}
                            />
                            <div className="min-w-0 space-y-1">
                              <h5 className="text-sm font-bold text-white tracking-wide truncate uppercase leading-tight">
                                {m.title}
                              </h5>
                              <p className="text-[10px] text-amber-400 font-mono font-semibold">
                                {m.genre}
                              </p>
                              <p className="text-[9.5px] text-neutral-400 font-mono">
                                {m.duration} mins • {m.language} • {m.rating} ★
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            disabled={deletingMovieId === m.id}
                            onClick={() => handleDeleteMovie(m.id)}
                            className="bg-red-500/10 text-red-400 border border-red-500/25 p-2 rounded-xl hover:bg-red-500 hover:text-white transition duration-200 cursor-pointer disabled:opacity-50 shrink-0"
                            title="De-list Movie from Catalog"
                          >
                            {deletingMovieId === m.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB 3: SYSTEM TRANSACTION LEDGER */}
            {activeTab === 'TRANSACTIONS' && (
              <motion.div
                key="transactions-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Search & Filter Headers */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl">
                  {/* Search bar */}
                  <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3.5 top-2.5 h-4.5 w-4.5 text-neutral-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search Ledger (Ticket ID, Movie, Patron Email...)"
                      className="w-full bg-black/40 border border-white/10 focus:border-amber-400 text-xs pl-10.5 pr-4 py-2 rounded-xl text-white outline-none transition font-mono"
                    />
                  </div>

                  {/* Payment filter */}
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <span className="text-[9.5px] font-bold text-neutral-400 font-mono uppercase shrink-0">
                      Method:
                    </span>
                    <select
                      value={filterPaymentMethod}
                      onChange={(e) => setFilterPaymentMethod(e.target.value)}
                      className="bg-black/40 border border-white/10 focus:border-amber-400 text-xs px-3 py-1.5 rounded-xl text-neutral-200 outline-none transition"
                    >
                      <option value="ALL">ALL CHANNELS</option>
                      <option value="ESewa">ESEWA</option>
                      <option value="Khalti">KHALTI</option>
                      <option value="IME Pay">IME PAY</option>
                      <option value="Card">CARD PAY</option>
                    </select>
                  </div>
                </div>

                {/* Ledger Listing */}
                {loadingTickets ? (
                  <div className="flex justify-center items-center py-24">
                    <Loader2 className="h-6 w-6 text-amber-400 animate-spin" />
                  </div>
                ) : filteredTickets.length === 0 ? (
                  <p className="text-xs text-neutral-500 py-16 text-center uppercase tracking-widest font-mono border border-dashed border-white/10 rounded-2xl">
                    No transactions matching parameters found in ledger indices.
                  </p>
                ) : (
                  <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                    {filteredTickets.map((t) => (
                      <div
                        key={t.ticketId}
                        className="bg-white/2 hover:bg-white/4 border border-white/8 rounded-2xl p-5 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-2.5 flex-grow">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/5 border border-amber-500/20 px-2.5 py-0.5 rounded-lg tracking-widest">
                              {t.ticketId}
                            </span>
                            <span className="text-[10px] text-white font-bold uppercase truncate max-w-[200px]">
                              {t.movieTitle}
                            </span>
                            <span className="text-[8.5px] text-neutral-500 font-mono">
                              {new Date(t.createdAt).toLocaleString()}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[10px] text-neutral-400 font-mono">
                            <div>
                              <span className="block text-[8px] uppercase text-neutral-500">Theatre</span>
                              <span className="text-neutral-200 font-semibold truncate block">{t.hall.split(',')[0]}</span>
                            </div>
                            <div>
                              <span className="block text-[8px] uppercase text-neutral-500">Showtime</span>
                              <span className="text-neutral-200 font-semibold block">{t.slot}</span>
                            </div>
                            <div>
                              <span className="block text-[8px] uppercase text-neutral-500">Patron</span>
                              <span className="text-neutral-200 font-semibold truncate block" title={`${t.userName} (${t.userEmail})`}>
                                {t.userName}
                              </span>
                            </div>
                            <div>
                              <span className="block text-[8px] uppercase text-neutral-500">Reserved Seats</span>
                              <span className="text-amber-400 font-bold block">{t.seats.join(', ')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Total Payment details right block */}
                        <div className="flex md:flex-col items-baseline md:items-end justify-between md:justify-center border-t md:border-t-0 border-white/5 pt-3 md:pt-0 shrink-0">
                          <span className="text-sm font-bold text-white font-mono">
                            NRs. {t.totalPrice}
                          </span>
                          <span className="text-[8.5px] text-amber-400 font-mono font-semibold uppercase mt-1 bg-amber-500/5 px-2 py-0.5 border border-amber-500/20 rounded-md">
                            {t.paymentMethod.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Terminal Footer */}
        <div className="p-4 border-t border-white/10 text-[9px] text-neutral-500 text-center font-mono tracking-wider uppercase bg-neutral-950/40 shrink-0">
          <span className="flex items-center justify-center gap-1.5">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
            SECURED CRYPTOGRAPHIC CINEMA ACCESS KERNEL - SHIELDED TRANSACTIONS LOGS
          </span>
        </div>
      </motion.div>
    </div>
  );
}
