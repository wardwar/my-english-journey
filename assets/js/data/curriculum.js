// Kurikulum mingguan. Setiap minggu: g = fokus grammar, v = tema kosakata,
// s = topik speaking (dipakai di Speaking Lab), w = tugas writing.
// src = id sumber dari resources.js yang dipakai tiap fase. cp = minggu checkpoint.
export const PHASES = [
  {
    id: "p0", name: "Fase 0 · Diagnostic", short: "Diagnostic", level: "Semua level", ielts: "—",
    goal: "Tahu posisi awalmu dan rekam baseline 4 skill, supaya progres bisa dibuktikan nanti.",
    vocabPerWeek: 0,
    src: { grammar: ["bcA"], listen: ["bbc6"], read: ["voa"] },
    exit: "Hasil EF SET tercatat + 1 rekaman speaking + 1 tulisan baseline tersimpan.",
    weeks: [
      {
        title: "Minggu diagnostic", cp: true,
        tasks: [
          { skill: "test", text: "Ikut EF SET (±50 menit). Catat skor & CEFR di halaman Progress.", res: ["efset"], route: "#/progress" },
          { skill: "test", text: "Ikut Cambridge Test your English (±15 menit) sebagai pembanding.", res: ["camtest"] },
          { skill: "speaking", text: "Baseline speaking: rekam Mock IELTS Part 1–2 di Speaking Lab (jangan persiapan, apa adanya).", route: "#/speaking/mock" },
          { skill: "speaking", text: "Baseline pronunciation: 1x Read-aloud di Speaking Lab.", route: "#/speaking/read" },
          { skill: "writing", text: "Baseline writing: tulis 150 kata 'My daily life' di Writing Lab, lalu cek di Write & Improve.", res: ["wi"], route: "#/writing" },
          { skill: "tools", text: "Install Anki & buat deck pertama 'My English Journey'.", res: ["anki", "ankidoc"] },
          { skill: "plan", text: "Isi Pengaturan: tanggal mulai, target band, tanggal rencana tes, menit belajar per hari.", route: "#/settings" },
          { skill: "plan", text: "Pilih fase mulai: hasil A1–A2 → Fase 1, B1 → Fase 2, B2 → Fase 3. Tandai fase sebelumnya 'lewati' di Roadmap." }
        ]
      }
    ]
  },
  {
    id: "p1", name: "Fase 1 · Foundation", short: "Foundation", level: "A1 → A2", ielts: "≤ 4.0",
    goal: "Bisa bicara & menulis tentang diri sendiri, rutinitas, masa lalu dan rencana dengan kalimat sederhana tapi benar.",
    vocabPerWeek: 70,
    src: { grammar: ["bcA", "khan"], listen: ["elllo", "voa"], read: ["voa", "simplewiki"], vocab: ["ox", "g10k"] },
    exit: "EF SET ≥ 31 (A2) dan bisa bicara 2 menit tentang dirimu tanpa berhenti lama.",
    weeks: [
      { g: "to be, subject pronouns, a/an, possessives", v: "diri, keluarga, pekerjaan", s: "Introduce yourself and your family.", w: "Profil diri 60–80 kata." },
      { g: "Present simple (+ / − / ?), adverbs of frequency", v: "rutinitas harian, waktu", s: "Describe your typical day from morning to night.", w: "'My typical day' 80 kata." },
      { g: "Present continuous vs present simple", v: "aktivitas, pakaian", s: "What are you doing this week? What do you usually do?", w: "Pesan ke teman: what I'm doing this week." },
      { g: "There is/are, prepositions of place", v: "rumah, kota, arah", s: "Describe your house and your neighbourhood.", w: "Describe your room (80 kata)." },
      { g: "Countable/uncountable, some/any, much/many", v: "makanan, belanja, harga", s: "Talk about your favourite food and where you buy it.", w: "Pesan: minta teman membeli sesuatu." },
      { g: "Past simple: to be + regular verbs", v: "akhir pekan, waktu lampau", s: "What did you do last weekend?", w: "'My last weekend' 100 kata." },
      { g: "Past simple: irregular verbs, past questions", v: "perjalanan, transportasi", s: "Tell me about a trip you took.", w: "Cerita perjalanan 100 kata." },
      { g: "Comparatives & superlatives", v: "kata sifat kota/orang/benda", s: "Compare your hometown with a big city.", w: "Bandingkan dua tempat (100 kata)." },
      { g: "Future: going to, will, present continuous for plans", v: "rencana, cuaca", s: "What are your plans for next year?", w: "Email undangan akhir pekan." },
      { g: "Modals: can, must, have to, should", v: "aturan, kesehatan", s: "Give advice to a friend who wants to be healthier.", w: "Advice for a new student (100 kata)." },
      { g: "Present perfect: ever/never, experiences", v: "pengalaman, hobi", s: "Talk about things you have never done but want to do.", w: "Places I have visited / want to visit." },
      { g: "Review semua tenses dasar", v: "review 800+ kata", s: "Baseline ulang: rekam Mock Part 1–2 lagi.", w: "Tulis ulang 'My daily life' dan bandingkan dengan baseline.", cp: true }
    ]
  },
  {
    id: "p2", name: "Fase 2 · Intermediate", short: "Intermediate", level: "A2 → B1", ielts: "4.5–5.0",
    goal: "Bisa bercerita, memberi opini dengan alasan, dan mengikuti percakapan tentang topik familiar.",
    vocabPerWeek: 70,
    src: { grammar: ["bcB", "bbcLI", "bbcI"], listen: ["bbc6", "elllo", "voa"], read: ["voa", "simplewiki", "gutenberg"], vocab: ["ox", "evp"] },
    exit: "EF SET ≥ 41 (B1), esai 150 kata sebagian besar benar, ngobrol 5 menit topik familiar.",
    weeks: [
      { g: "Present perfect vs past simple; for/since", v: "hobi & minat", s: "Describe a hobby you have had for a long time.", w: "Email ke teman tentang kabar terbaru (120 kata)." },
      { g: "Past continuous & narrative tenses", v: "kejadian, emosi", s: "Tell a story about a problem you solved.", w: "Cerita pendek: an unexpected day." },
      { g: "Future forms & time clauses (when, as soon as)", v: "kerja & karier", s: "Describe your dream job and how you will get it.", w: "Surat lamaran sederhana." },
      { g: "Zero & first conditional", v: "lingkungan", s: "What will happen if people keep using plastic?", w: "Paragraf sebab–akibat (120 kata)." },
      { g: "Second conditional", v: "uang & gaya hidup", s: "If you could live anywhere, where would you live and why?", w: "Opini: If I were the mayor of my city..." },
      { g: "Modals: possibility, obligation, advice (might, need to, ought to)", v: "masalah kota", s: "What problems does your city have and how can they be solved?", w: "Problem–solution paragraph." },
      { g: "Passive voice (present & past)", v: "proses, produk", s: "Explain how a traditional food from your country is made.", w: "Deskripsi proses (120 kata)." },
      { g: "Relative clauses (who, which, that, where, whose)", v: "karakter & penampilan", s: "Describe a person you admire.", w: "A person who changed my life." },
      { g: "Gerunds & infinitives", v: "kebiasaan & preferensi", s: "Things you enjoy doing and things you avoid doing.", w: "Opini: Is it better to study alone or in a group?" },
      { g: "Reported speech", v: "media & berita", s: "Retell a news story you heard this week.", w: "Ringkas sebuah artikel VOA (100 kata)." },
      { g: "Linking words: although, however, because of, so that", v: "teknologi", s: "Advantages and disadvantages of social media.", w: "Esai pro–kontra 150 kata." },
      { g: "Review: conditionals, passive, relative clauses", v: "review 1.600+ kata", s: "Checkpoint: Mock IELTS Part 1–3 penuh.", w: "Esai opini 150 kata, cek di Write & Improve.", cp: true }
    ]
  },
  {
    id: "p3", name: "Fase 3 · Upper-Intermediate", short: "Upper-Int", level: "B1 → B2", ielts: "5.5–6.5",
    goal: "Fluency nyata: bicara spontan dengan ide berkembang, memahami native speed, menulis argumen yang runtut.",
    vocabPerWeek: 80,
    src: { grammar: ["bcB", "bbcUI", "egp"], listen: ["bbc6", "ted", "sounds"], read: ["bbcnews", "gutenberg", "librivox"], vocab: ["ox", "awl", "evp"] },
    exit: "EF SET ≥ 51 (B2) dan mock IELTS pertama ≥ 5.5 overall.",
    weeks: [
      { g: "Present perfect continuous", v: "studi & pekerjaan", s: "IELTS Part 1: work or study.", w: "Opinion essay: university should be free (200 kata)." },
      { g: "Past perfect & narrative tenses lanjutan", v: "perjalanan", s: "Part 2: Describe a memorable journey.", w: "Cerita 200 kata dengan narrative tenses." },
      { g: "Third & mixed conditionals", v: "keputusan & penyesalan", s: "Part 3: Do people make better decisions when they are older?", w: "Discussion essay: experience vs education." },
      { g: "Modals of deduction (must have, might have, can't have)", v: "misteri, kejutan", s: "Part 2: Describe a time you were surprised.", w: "Paragraf spekulasi tentang foto/kejadian." },
      { g: "Advanced passive (it is said that…, have something done)", v: "teknologi & masyarakat", s: "Part 3: How has technology changed communication?", w: "Opinion essay: technology makes people lonely." },
      { g: "Non-defining & reduced relative clauses", v: "tempat & arsitektur", s: "Part 2: Describe a place you like to visit.", w: "Deskripsi tempat 200 kata (complex sentences)." },
      { g: "Noun phrases & nominalisation (gaya akademik)", v: "pendidikan", s: "Part 3: What makes a good teacher?", w: "Discussion essay: online vs classroom learning." },
      { g: "Cohesion: referencing & linking (this issue, such…)", v: "lingkungan", s: "Part 3: Who is responsible for protecting the environment?", w: "Problem–solution essay: air pollution." },
      { g: "Hedging & softening (tend to, it seems that, arguably)", v: "opini & debat", s: "Part 3: Should celebrities be role models?", w: "Opinion essay dengan hedging." },
      { g: "Contrast structures (whereas, while, the more…the more)", v: "kota vs desa", s: "Part 3: Compare life in cities and the countryside.", w: "Advantages/disadvantages essay." },
      { g: "Wish, if only, would rather, it's time", v: "konsumsi & belanja", s: "Part 2: Describe something you want to buy.", w: "Surat/email keluhan formal." },
      { g: "Inversion & cleft sentences untuk emphasis", v: "karier", s: "Part 3: Is job satisfaction more important than salary?", w: "Opinion essay: salary vs satisfaction." },
      { g: "Phrasal verbs B2 yang sering dipakai", v: "hubungan & sosial", s: "Part 1: friends, free time, weekends.", w: "Email informal 200 kata dengan phrasal verbs." },
      { g: "Collocations (make/do/take, adjective + noun)", v: "kesehatan", s: "Part 2: Describe a healthy habit you have.", w: "Discussion essay: government vs individual responsibility for health." },
      { g: "Natural expressions & idioms (dipakai wajar, bukan hafalan)", v: "budaya & tradisi", s: "Part 3: Are traditions still important today?", w: "Opinion essay: globalisation and local culture." },
      { g: "Academic Word List sublist 1–3", v: "AWL 1–3", s: "Part 3: media & advertising.", w: "Esai 250 kata memakai 10 kata AWL." },
      { g: "Academic Word List sublist 4–6", v: "AWL 4–6", s: "Part 3: science & research funding.", w: "Esai 250 kata memakai 10 kata AWL." },
      { g: "Academic Word List sublist 7–10", v: "AWL 7–10", s: "Part 3: globalisation & travel.", w: "Esai 250 kata memakai 10 kata AWL." },
      { g: "Analisis error pribadi (dari rekaman & tulisan)", v: "review kata yang sering salah", s: "Full mock speaking + bandingkan dengan baseline.", w: "Tulis ulang esai terburuk." },
      { g: "Review & konsolidasi B2", v: "review 3.000+ kata", s: "Checkpoint: Mock IELTS lengkap.", w: "Mock IELTS Writing Task 2 (40 menit).", cp: true }
    ]
  },
  {
    id: "p4", name: "Fase 4 · IELTS Preparation", short: "IELTS Prep", level: "B2 → target", ielts: "6.5–7.5",
    goal: "Kuasai format dan strategi IELTS, naikkan skor lewat mock test berkala dan analisis error.",
    vocabPerWeek: 60,
    src: { grammar: ["egp", "bcG"], listen: ["bcfree", "sounds", "ted"], read: ["bcfree", "bbcnews"], vocab: ["awl"] },
    exit: "3 mock berturut-turut ≥ target band → daftar tes asli.",
    weeks: [
      { g: "Format tes & band descriptors resmi", v: "istilah instruksi IELTS", s: "Full Mock Part 1–3 (diagnostic IELTS).", w: "Diagnostic: Task 2 dalam 40 menit.", ielts: "Baca format 4 section + Speaking band descriptors; kerjakan 1 mock lengkap British Council." },
      { g: "Listening Section 1–2: form, map, MCQ", v: "angka, ejaan, alamat", s: "Part 1 strategi: jawab + alasan + contoh.", w: "Task 2: struktur 4 paragraf.", ielts: "2 listening test + catat tipe soal yang salah." },
      { g: "Listening Section 3–4: diskusi & lecture", v: "kata akademik lecture", s: "Part 1 tanpa jeda panjang (4 menit).", w: "Task 2: opinion essay (agree/disagree).", ielts: "Latihan note-taking dengan TED/BBC Sounds." },
      { g: "Reading: True/False/Not Given, Yes/No/Not Given", v: "parafrase & sinonim", s: "Part 2: teknik 1 menit catatan.", w: "Task 2: discussion essay (both views).", ielts: "2 passage dengan timer 20 menit/passage." },
      { g: "Reading: Matching headings & information", v: "kata penghubung paragraf", s: "Part 2: bicara penuh 2 menit.", w: academicOrGT("Task 1: line & bar graph.", "Task 1: formal letter."), ielts: "Mock lengkap #2.", cp: true },
      { g: "Reading: sentence/summary/table completion", v: "kata tren (rise, plummet…)", s: "Part 3: kembangkan jawaban (opini → alasan → contoh → kontras).", w: academicOrGT("Task 1: table & pie chart.", "Task 1: semi-formal letter."), ielts: "Latihan skimming 3 menit per passage." },
      { g: "Writing Task 1 lanjutan", v: "kata proses & peta", s: "Pronunciation: word stress & intonasi (Read-aloud).", w: academicOrGT("Task 1: process & map.", "Task 1: informal letter."), ielts: "Bandingkan tulisan dengan Writing band descriptors." },
      { g: "Task 2: problem–solution & two-part questions", v: "topik sosial", s: "Part 3: topik abstrak (pendidikan, teknologi).", w: "Task 2: problem–solution.", ielts: "Mock lengkap #3.", cp: true },
      { g: "Manajemen waktu & strategi di bawah tekanan", v: "lexical upgrading", s: "Part 2: 3 cue card berturut-turut.", w: "Task 1 + Task 2 dalam 60 menit.", ielts: "Simulasi kondisi tes (computer/paper sesuai pilihanmu)." },
      { g: "Fokus skill terlemah (lihat Progress)", v: "kata dari error log", s: "Mock speaking penuh, minta partner menilai.", w: "2 esai Task 2.", ielts: "Mock lengkap #4." },
      { g: "Polishing: error log terakhir", v: "review AWL", s: "Mock speaking penuh.", w: "Task 1 + Task 2 dalam 60 menit.", ielts: "Mock lengkap #5. Jika 3 mock ≥ target → daftar tes.", cp: true },
      { g: "Minggu tes: istirahat & review ringan", v: "—", s: "Pemanasan Part 1 tiap pagi.", w: "Baca ulang 2 esai terbaikmu.", ielts: "Cek dokumen (paspor/KTP), lokasi, jadwal. Tidur cukup." }
    ]
  },
  {
    id: "p5", name: "Fase 5 · Advanced & Maintenance", short: "C1", level: "B2+ → C1", ielts: "7.0–8.0",
    goal: "Fluent & natural dalam jangka panjang: nuansa, register akademik/profesional, kepercayaan diri.",
    vocabPerWeek: 40,
    src: { grammar: ["bcG", "bbcTA"], listen: ["sounds", "ted", "librivox"], read: ["stdebooks", "gutenberg", "bbcnews"], vocab: ["evp", "awl"] },
    exit: "IELTS 7.0+ atau ngobrol 30 menit tentang topik apa pun tanpa mencari kata.",
    weeks: [
      { g: "C1 grammar: advanced structures", v: "register formal vs informal", s: "Debat: argue both sides of a topic (5 menit).", w: "Blog post 300 kata di folder journal/ repo." },
      { g: "Nuance: modals & hedging lanjutan", v: "idiom & phrasal verbs C1", s: "Ringkas & komentari 1 TED talk (3 menit).", w: "Review buku/film 300 kata." },
      { g: "Discourse markers dalam percakapan", v: "kosakata bidang kerjamu", s: "Presentasi 5 menit tentang pekerjaanmu.", w: "Email profesional." },
      { g: "Review bulanan + mock speaking", v: "review", s: "Monthly benchmark speaking.", w: "Esai C1 400 kata.", cp: true }
    ],
    repeat: true
  }
];

// Writing task di Fase 4 berbeda untuk Academic dan General Training
function academicOrGT(a, gt) { return { academic: a, gt }; }

// Template harian (0 = Minggu … 6 = Sabtu). min = menit dasar untuk 80 menit/hari.
export const DAY_TEMPLATE = {
  1: [
    { skill: "vocab", min: 15, k: "anki" },
    { skill: "grammar", min: 25, k: "grammarLearn" },
    { skill: "listening", min: 25, k: "listen" },
    { skill: "speaking", min: 15, k: "shadow" }
  ],
  2: [
    { skill: "vocab", min: 15, k: "anki" },
    { skill: "reading", min: 25, k: "read" },
    { skill: "speaking", min: 20, k: "speakTopic" },
    { skill: "writing", min: 20, k: "writeDraft" }
  ],
  3: [
    { skill: "vocab", min: 15, k: "anki" },
    { skill: "grammar", min: 20, k: "grammarPractice" },
    { skill: "listening", min: 25, k: "dictation" },
    { skill: "pronunciation", min: 20, k: "readAloud" }
  ],
  4: [
    { skill: "vocab", min: 15, k: "anki" },
    { skill: "reading", min: 25, k: "read" },
    { skill: "writing", min: 25, k: "writeFinish" },
    { skill: "speaking", min: 15, k: "speakTopic" }
  ],
  5: [
    { skill: "vocab", min: 15, k: "anki" },
    { skill: "listening", min: 25, k: "listen" },
    { skill: "grammar", min: 15, k: "grammarReview" },
    { skill: "speaking", min: 25, k: "mock" }
  ],
  6: [
    { skill: "vocab", min: 15, k: "anki" },
    { skill: "speaking", min: 25, k: "benchmark" },
    { skill: "writing", min: 15, k: "writeReview" },
    { skill: "listening", min: 25, k: "fun" }
  ],
  0: [
    { skill: "listening", min: 30, k: "fun" },
    { skill: "plan", min: 15, k: "reflect" }
  ]
};
