import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const app = express();
const PORT = 3000;

app.use(express.json());

// --- FIREBASE ADMIN / DB SETUP ---
const configPath = path.join(process.cwd(), "firebase-applet-config.json");
let firebaseConfig: any = null;
if (fs.existsSync(configPath)) {
  try {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch (err) {
    console.error("Failed to parse firebase-applet-config.json:", err);
  }
}

const projectId = firebaseConfig?.projectId || process.env.GOOGLE_CLOUD_PROJECT || "myfirstapplication-1b4f4897";
const databaseId = firebaseConfig?.firestoreDatabaseId || "ai-studio-cinepremiumnepal-98bf12c1-2b51-4ded-85b2-4819f1470737";

let db: any = null;
let useFirestoreFallback = false;

try {
  if (!getApps().length) {
    initializeApp({
      projectId: projectId,
    });
  }
  db = getFirestore(databaseId);
  console.log(`Firebase Admin initialized successfully. Using Database: ${databaseId}`);
} catch (error) {
  console.error("Firebase initialization failed, utilizing local fallback storage:", error);
  useFirestoreFallback = true;
}

// Default list of premium Nepalese and International movies
const DEFAULT_MOVIES = [
  {
    id: "m1",
    title: "Shambhala",
    genre: "Drama • Spiritual • Adventure",
    rating: 9.2,
    duration: 150,
    language: "Nepali (English Subtitles)",
    image: "/src/assets/images/shambhala_poster_1782101620265.jpg",
    description: "In a high-altitude Himalayan polyandrous village, a pregnant woman named Pema embarks on an epic journey of physical and spiritual resilience when her first husband goes missing.",
    gradient: "from-amber-600/30 to-slate-950/90"
  },
  {
    id: "m2",
    title: "Kalki 2898 AD",
    genre: "Sci-Fi • Mythological • Action",
    rating: 8.8,
    duration: 181,
    language: "Hindi (IMAX 3D)",
    image: "/src/assets/images/kalki_poster_1782131656476.jpg",
    description: "When the world is submerged in absolute darkness in a post-apocalyptic Kasi, a set of rebels and an ancient immortal warrior assemble to protect a pregnant lab subject who carries a divine savior.",
    gradient: "from-blue-600/30 to-slate-950/90"
  },
  {
    id: "m3",
    title: "Maha Jatra",
    genre: "Comedy • Crime • Drama",
    rating: 8.6,
    duration: 137,
    language: "Nepali (2D)",
    image: "/src/assets/images/maha_jatra_poster_1782131707359.jpg",
    description: "The hilarious and chaotic misadventures of three middle-class friends who find themselves trapped in a high-stakes, illegal cash-laundering conspiracy in the heart of Kathmandu.",
    gradient: "from-yellow-600/30 to-slate-950/90"
  },
  {
    id: "m4",
    title: "Deadpool & Wolverine",
    genre: "Action • Sci-Fi • Comedy",
    rating: 8.9,
    duration: 127,
    language: "English (Dolby Atmos 3D)",
    image: "https://upload.wikimedia.org/wikipedia/en/4/4c/Deadpool_%26_Wolverine_poster.jpg",
    description: "A listless Wade Wilson toils in civilian life until a threat to his home universe forces him to team up with an extremely reluctant and combat-hardened Wolverine.",
    gradient: "from-rose-600/30 to-slate-950/90"
  },
  {
    id: "m5",
    title: "Purna Bahadur Ko Sarangi",
    genre: "Drama • Musical",
    rating: 9.6,
    duration: 140,
    language: "Nepali (2D)",
    image: "/src/assets/images/purna_bahadur_poster_1782131674114.jpg",
    description: "A touching drama of a father's selfless sacrifices and struggles to provide his son with a better education, using his traditional musical Sarangi instrument in the hills of Nepal.",
    gradient: "from-amber-700/30 to-slate-950/90"
  },
  {
    id: "m6",
    title: "12 Gaun",
    genre: "Action • Thriller",
    rating: 9.3,
    duration: 154,
    language: "Nepali (2D)",
    image: "/src/assets/images/twelve_gaun_poster_1782131690946.jpg",
    description: "A high-octane action thriller highlighting the battle against tyranny and crime lord exploitation in a rugged, isolated set of 12 mountainous villages.",
    gradient: "from-red-700/30 to-slate-950/90"
  },
  {
    id: "m7",
    title: "Interstellar (Re-issue)",
    genre: "Sci-Fi • Epic • Adventure",
    rating: 9.8,
    duration: 169,
    language: "English (IMAX Laser 70mm)",
    image: "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg",
    description: "A team of explorers travel through a newly discovered wormhole in space in an attempt to ensure humanity's survival amidst a global blighted famine.",
    gradient: "from-purple-500/30 to-slate-950/90"
  },
  {
    id: "m8",
    title: "Dune: Part Two",
    genre: "Sci-Fi • Epic • Action",
    rating: 9.5,
    duration: 166,
    language: "English (IMAX 3D Laser)",
    image: "https://upload.wikimedia.org/wikipedia/en/2/27/Dune_Part_Two_poster.jpg",
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family, endeavoring to prevent a terrible future only he can foresee.",
    gradient: "from-amber-600/30 to-slate-950/90"
  }
];

// Local fallback database file
const FALLBACK_DB_PATH = path.join(process.cwd(), "tickets_backup.json");
if (!fs.existsSync(FALLBACK_DB_PATH)) {
  fs.writeFileSync(FALLBACK_DB_PATH, JSON.stringify({ tickets: [], occupied_seats: {}, movies: DEFAULT_MOVIES }, null, 2));
} else {
  // Ensure "movies" key exists in old backups
  try {
    const backup = JSON.parse(fs.readFileSync(FALLBACK_DB_PATH, "utf8"));
    if (!backup.movies || backup.movies.length === 0) {
      backup.movies = DEFAULT_MOVIES;
      fs.writeFileSync(FALLBACK_DB_PATH, JSON.stringify(backup, null, 2));
    }
  } catch (e) {
    console.error("Backup repair failed, recreating", e);
  }
}

// Helper to read fallback data
function readFallbackData() {
  try {
    const data = JSON.parse(fs.readFileSync(FALLBACK_DB_PATH, "utf8"));
    if (!data.movies) data.movies = DEFAULT_MOVIES;
    return data;
  } catch (e) {
    return { tickets: [], occupied_seats: {}, movies: DEFAULT_MOVIES };
  }
}

// Helper to write fallback data
function writeFallbackData(data: any) {
  try {
    fs.writeFileSync(FALLBACK_DB_PATH, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Failed to write to local fallback database:", e);
  }
}

// Seed movies in Firestore on startup if empty
async function seedMoviesInFirestoreIfEmpty() {
  if (useFirestoreFallback || !db) return;
  try {
    const snapshot = await db.collection("movies").get();
    if (snapshot.empty) {
      console.log("Firestore 'movies' collection is empty. Seeding default movies list...");
      for (const m of DEFAULT_MOVIES) {
        await db.collection("movies").doc(m.id).set(m);
      }
      console.log("Firestore default movies successfully seeded!");
    }
  } catch (err: any) {
    console.warn("Firestore access restricted or unavailable, enabling local database fallback:", err?.message || err);
    useFirestoreFallback = true;
  }
}
seedMoviesInFirestoreIfEmpty();

// Seating layouts definitions (synchronized with src/data.ts)
function getHallSeatingLayout(hallName: string) {
  if (hallName.includes("Labim Mall")) {
    return {
      rows: ["A", "B", "C", "D", "E", "F", "G"],
      columns: Array.from({ length: 10 }, (_, i) => i + 1),
      gaps: [3, 8],
    };
  } else if (hallName.includes("Civil Mall")) {
    return {
      rows: ["A", "B", "C", "D", "E", "F", "G", "H"],
      columns: Array.from({ length: 14 }, (_, i) => i + 1),
      gaps: [4, 11],
    };
  } else if (hallName.includes("Eyeplex")) {
    return {
      rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
      columns: Array.from({ length: 12 }, (_, i) => i + 1),
      gaps: [3, 10],
    };
  } else {
    // Default / Chhaya Center layout
    return {
      rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
      columns: Array.from({ length: 12 }, (_, i) => i + 1),
      gaps: [3, 10],
    };
  }
}

// Generate seeded occupied seats to keep booking starts consistent
function getSeededOccupiedSeats(hall: string, movieId: string, slot: string): string[] {
  const layout = getHallSeatingLayout(hall);
  const key = `${hall}-${movieId}-${slot}`;
  
  let seed = 0;
  for (let i = 0; i < key.length; i++) {
    seed += key.charCodeAt(i) * (i + 1);
  }
  
  const seededRandom = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  const generatedOccupied: string[] = [];
  layout.rows.forEach((row) => {
    layout.columns.forEach((col) => {
      if (layout.gaps.includes(col)) return;
      
      const seatId = `${row}${col}`;
      const bookingProbability = 0.05 + (seededRandom() * 0.1); 
      if (seededRandom() < bookingProbability) {
        generatedOccupied.push(seatId);
      }
    });
  });

  return generatedOccupied;
}

// --- API ENDPOINTS ---

// 1. GET occupied seats
app.get("/api/occupied-seats", async (req, res) => {
  const { hall, movieId, slot } = req.query;
  if (!hall || !movieId || !slot) {
    return res.status(400).json({ error: "Missing required query parameters: hall, movieId, slot" });
  }

  const key = `${hall}_${movieId}_${slot}`.replace(/[\s,\/]+/g, "_");
  const seeded = getSeededOccupiedSeats(hall as string, movieId as string, slot as string);

  try {
    if (!useFirestoreFallback && db) {
      const docRef = db.collection("occupied_seats").doc(key);
      const docSnap = await docRef.get();
      if (docSnap.exists) {
        const data = docSnap.data();
        // Merge standard seeded seats + user-booked seats
        const booked = data.seats || [];
        const combined = Array.from(new Set([...seeded, ...booked]));
        return res.json({ seats: combined });
      } else {
        // Initialize with standard seeded seats
        await docRef.set({ seats: [] });
        return res.json({ seats: seeded });
      }
    }
  } catch (err) {
    console.warn("Firestore occupied-seats fetch failed, enabling local database fallback:", err);
    useFirestoreFallback = true;
  }

  // Fallback to local file store
  const localData = readFallbackData();
  const booked = localData.occupied_seats[key] || [];
  const combined = Array.from(new Set([...seeded, ...booked]));
  return res.json({ seats: combined });
});

// 2. POST create ticket
app.post("/api/tickets", async (req, res) => {
  const {
    ticketId,
    movieId,
    movieTitle,
    hall,
    slot,
    seats,
    totalPrice,
    paymentMethod,
    userEmail,
    userName,
  } = req.body;

  if (!ticketId || !movieId || !movieTitle || !hall || !slot || !seats || !totalPrice || !paymentMethod) {
    return res.status(400).json({ error: "Missing required ticket parameters" });
  }

  const ticketObj = {
    ticketId,
    movieId,
    movieTitle,
    hall,
    slot,
    seats,
    totalPrice,
    paymentMethod,
    userEmail: userEmail || "guest",
    userName: userName || "Guest Patron",
    createdAt: new Date().toISOString(),
  };

  const key = `${hall}_${movieId}_${slot}`.replace(/[\s,\/]+/g, "_");

  // Save via Firestore
  let savedToFirestore = false;
  try {
    if (!useFirestoreFallback && db) {
      // Create ticket
      await db.collection("tickets").doc(ticketId).set(ticketObj);

      // Add booked seats to occupied seats
      const docRef = db.collection("occupied_seats").doc(key);
      await db.runTransaction(async (transaction: any) => {
        const docSnap = await transaction.get(docRef);
        let existingBooked: string[] = [];
        if (docSnap.exists) {
          existingBooked = docSnap.data().seats || [];
        }
        const updatedBooked = Array.from(new Set([...existingBooked, ...seats]));
        transaction.set(docRef, { seats: updatedBooked }, { merge: true });
      });

      savedToFirestore = true;
      console.log(`Ticket ${ticketId} saved to Firestore successfully.`);
    }
  } catch (err) {
    console.warn("Firestore reservation saving failed, resorting to local fallback:", err);
    useFirestoreFallback = true;
  }

  // Always write to local file store as fallback and backup
  const localData = readFallbackData();
  localData.tickets.push(ticketObj);
  if (!localData.occupied_seats[key]) {
    localData.occupied_seats[key] = [];
  }
  localData.occupied_seats[key] = Array.from(new Set([...localData.occupied_seats[key], ...seats]));
  writeFallbackData(localData);

  return res.json({
    success: true,
    ticket: ticketObj,
    savedToFirestore,
  });
});

// 3. GET all tickets for a user
app.get("/api/my-tickets", async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: "Missing email parameter" });
  }

  try {
    if (!useFirestoreFallback && db) {
      const snapshot = await db.collection("tickets").where("userEmail", "==", email).orderBy("createdAt", "desc").get();
      const tickets: any[] = [];
      snapshot.forEach((doc: any) => {
        tickets.push(doc.data());
      });
      return res.json({ tickets });
    }
  } catch (err) {
    console.warn("Firestore my-tickets fetch failed, using local database fallback:", err);
    useFirestoreFallback = true;
  }

  // Fallback to local store
  const localData = readFallbackData();
  const tickets = localData.tickets
    .filter((t: any) => t.userEmail === email)
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return res.json({ tickets });
});

// 4. GET all movies
app.get("/api/movies", async (req, res) => {
  try {
    if (!useFirestoreFallback && db) {
      const snapshot = await db.collection("movies").get();
      if (!snapshot.empty) {
        const movies: any[] = [];
        snapshot.forEach((doc: any) => {
          movies.push(doc.data());
        });
        return res.json({ movies });
      }
    }
  } catch (err) {
    console.warn("Firestore fetch movies failed, using local fallback database:", err);
    useFirestoreFallback = true;
  }

  // Fallback
  const localData = readFallbackData();
  return res.json({ movies: localData.movies || DEFAULT_MOVIES });
});

// 5. POST add movie
app.post("/api/movies", async (req, res) => {
  const { title, genre, rating, duration, language, image, description, gradient } = req.body;
  if (!title || !genre || !duration || !image || !description) {
    return res.status(400).json({ error: "Missing required fields to insert movie" });
  }

  const generatedId = "m-" + Date.now();
  const movieObj = {
    id: generatedId,
    title,
    genre,
    rating: Number(rating) || 8.0,
    duration: Number(duration),
    language: language || "Nepali (2D)",
    image,
    description,
    gradient: gradient || "from-amber-600/30 to-slate-950/90"
  };

  try {
    if (!useFirestoreFallback && db) {
      await db.collection("movies").doc(generatedId).set(movieObj);
      console.log(`Movie ${title} saved to Firestore.`);
    }
  } catch (err) {
    console.warn("Firestore save movie failed, utilizing local fallback:", err);
    useFirestoreFallback = true;
  }

  // Write to local database as well
  const localData = readFallbackData();
  if (!localData.movies) localData.movies = [...DEFAULT_MOVIES];
  localData.movies.push(movieObj);
  writeFallbackData(localData);

  return res.json({ success: true, movie: movieObj });
});

// 6. DELETE remove movie
app.delete("/api/movies/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (!useFirestoreFallback && db) {
      await db.collection("movies").doc(id).delete();
      console.log(`Movie ${id} deleted from Firestore.`);
    }
  } catch (err) {
    console.warn("Firestore delete movie failed, utilizing local fallback:", err);
    useFirestoreFallback = true;
  }

  // Write to local database as well
  const localData = readFallbackData();
  if (!localData.movies) localData.movies = [...DEFAULT_MOVIES];
  localData.movies = localData.movies.filter((m: any) => m.id !== id);
  writeFallbackData(localData);

  return res.json({ success: true, message: "Movie deleted successfully" });
});

// 7. GET all tickets (Administrative Audit Log)
app.get("/api/admin/all-tickets", async (req, res) => {
  try {
    if (!useFirestoreFallback && db) {
      const snapshot = await db.collection("tickets").get();
      const tickets: any[] = [];
      snapshot.forEach((doc: any) => {
        tickets.push(doc.data());
      });
      const sortedTickets = tickets.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return res.json({ tickets: sortedTickets });
    }
  } catch (err) {
    console.warn("Firestore all-tickets fetch failed, utilizing local fallback database:", err);
    useFirestoreFallback = true;
  }

  // Fallback to local store
  const localData = readFallbackData();
  const tickets = [...(localData.tickets || [])].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return res.json({ tickets });
});

// --- VITE DEV OR PRODUCTION STATICS HANDLER ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
