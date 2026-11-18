// Library sumber belajar. Semua URL dicek otomatis oleh .github/workflows/links.yml
// tag: official = lembaga resmi (BBC, British Council, Cambridge, Oxford, IELTS partners, universitas)
//      open = domain publik / lisensi terbuka, open-source = kode terbuka di GitHub,
//      community = situs pihak ketiga gratis yang populer (bukan resmi)
// skill: test, grammar, vocab, listening, reading, speaking, pronunciation, writing, ielts, tools
export const RESOURCES = [
  // ---- Tes level
  { id: "efset", name: "EF SET — tes English gratis (skor CEFR)", url: "https://www.efset.org/", skill: ["test"], level: "A1–C2", tag: "free", desc: "Tes reading + listening 50 menit, hasil skala CEFR. Bisa diulang tiap checkpoint." },
  { id: "camtest", name: "Cambridge English — Test your English", url: "https://www.cambridgeenglish.org/test-your-english/", skill: ["test"], level: "A1–C2", tag: "official", desc: "Tes cepat dari Cambridge untuk perkiraan level." },
  { id: "bctest", name: "British Council — Test your English", url: "https://learnenglish.britishcouncil.org/test-your-english", skill: ["test"], level: "A1–C1", tag: "official", desc: "Tes level LearnEnglish; hasilnya mengarahkan ke materi sesuai level." },

  // ---- Grammar
  { id: "bcA", name: "British Council — A1–A2 grammar", url: "https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2", skill: ["grammar"], level: "A1–A2", tag: "official", desc: "Pola: tes → penjelasan → tes. Ikuti urutan topik." },
  { id: "bcB", name: "British Council — B1–B2 grammar", url: "https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2", skill: ["grammar"], level: "B1–B2", tag: "official", desc: "Lanjutan dengan format yang sama." },
  { id: "bcG", name: "British Council — Grammar (C1 & English grammar reference)", url: "https://learnenglish.britishcouncil.org/free-resources/grammar", skill: ["grammar"], level: "B2–C1", tag: "official", desc: "Bagian C1 grammar + grammar reference lengkap." },
  { id: "khan", name: "Khan Academy — Grammar", url: "https://www.khanacademy.org/humanities/grammar", skill: ["grammar"], level: "A2–B2", tag: "free", desc: "Video + latihan grammar terstruktur (non-profit)." },
  { id: "egp", name: "English Grammar Profile (Cambridge)", url: "https://englishprofile.org/", skill: ["grammar"], level: "A1–C2", tag: "official", desc: "Database Cambridge: struktur grammar yang dikuasai di tiap level CEFR (pilih English Grammar Profile)." },

  // ---- Course terstruktur
  { id: "bbc", name: "BBC Learning English", url: "https://www.bbc.co.uk/learningenglish", skill: ["listening", "grammar", "vocab"], level: "A1–C1", tag: "official", desc: "Pusat semua course & seri BBC Learning English." },
  { id: "bbcLI", name: "BBC — Lower Intermediate course", url: "https://www.bbc.co.uk/learningenglish/english/course/lower-intermediate", skill: ["listening", "grammar"], level: "A2–B1", tag: "official", desc: "30 unit video + kuis + grammar." },
  { id: "bbcI", name: "BBC — Intermediate course", url: "https://www.bbc.co.uk/learningenglish/english/course/intermediate", skill: ["listening", "grammar"], level: "B1", tag: "official", desc: "Lanjutan Lower Intermediate." },
  { id: "bbcUI", name: "BBC — Upper Intermediate course", url: "https://www.bbc.co.uk/learningenglish/english/course/upper-intermediate", skill: ["listening", "grammar"], level: "B1–B2", tag: "official", desc: "Course B2." },
  { id: "bbcTA", name: "BBC — Towards Advanced course", url: "https://www.bbc.co.uk/learningenglish/english/course/towards-advanced", skill: ["listening", "speaking"], level: "B2–C1", tag: "official", desc: "Menuju near-native." },
  { id: "bbc6", name: "BBC — 6 Minute English", url: "https://www.bbc.co.uk/learningenglish/english/features/6-minute-english", skill: ["listening", "vocab"], level: "B1–B2", tag: "official", desc: "Podcast 6 menit + transcript + kosakata. Sangat cocok untuk rutinitas harian." },
  { id: "bc", name: "British Council LearnEnglish", url: "https://learnenglish.britishcouncil.org/", skill: ["listening", "reading", "writing", "speaking"], level: "A1–C1", tag: "official", desc: "Latihan per skill & level (filter A1–C1)." },
  { id: "openlearn", name: "OpenLearn (The Open University) — English language", url: "https://www.open.edu/openlearn/languages/english-language", skill: ["reading", "writing"], level: "B1–C1", tag: "official", desc: "Kursus gratis universitas, banyak berlisensi Creative Commons." },

  // ---- Vocabulary
  { id: "ox", name: "Oxford 3000 & 5000", url: "https://www.oxfordlearnersdictionaries.com/wordlists/oxford3000-5000", skill: ["vocab"], level: "A1–C1", tag: "official", desc: "Daftar kata inti per level CEFR dari Oxford University Press." },
  { id: "evp", name: "English Vocabulary Profile (Cambridge)", url: "https://englishprofile.org/", skill: ["vocab"], level: "A1–C2", tag: "official", desc: "Cek level CEFR tiap kata & maknanya (pilih English Vocabulary Profile)." },
  { id: "awl", name: "Academic Word List — Victoria University of Wellington", url: "https://www.wgtn.ac.nz/lals/resources/academicwordlist", skill: ["vocab", "ielts"], level: "B2–C1", tag: "official", desc: "570 word family akademik (Coxhead). Wajib untuk IELTS Academic." },
  { id: "g10k", name: "google-10000-english (GitHub)", url: "https://github.com/first20hours/google-10000-english", skill: ["vocab"], level: "A1–B2", tag: "open-source", desc: "10.000 kata paling sering dipakai, urut frekuensi." },
  { id: "anki", name: "Anki — aplikasi flashcard SRS", url: "https://apps.ankiweb.net/", skill: ["vocab", "tools"], level: "Semua", tag: "open-source", desc: "Spaced repetition: review kata tepat sebelum lupa. Gratis di desktop & Android." },
  { id: "ankigh", name: "ankitects/anki (source code)", url: "https://github.com/ankitects/anki", skill: ["tools"], level: "Semua", tag: "open-source", desc: "Kode sumber Anki (AGPL)." },
  { id: "ankidoc", name: "Anki Manual — Getting Started", url: "https://docs.ankiweb.net/manual/getting-started", skill: ["tools"], level: "Semua", tag: "open-source", desc: "Cara membuat deck & kartu pertama." },

  // ---- Listening
  { id: "voa", name: "VOA Learning English", url: "https://learningenglish.voanews.com/", skill: ["listening", "reading"], level: "A2–B1", tag: "open", desc: "Berita pelan + transcript. Konten VOA umumnya domain publik." },
  { id: "elllo", name: "ELLLO — English Listening Lesson Library Online", url: "https://elllo.org/", skill: ["listening"], level: "A1–B2", tag: "free", desc: "Ribuan percakapan asli berbagai aksen dengan transcript & kuis." },
  { id: "esllab", name: "Randall's ESL Cyber Listening Lab", url: "https://www.esl-lab.com/", skill: ["listening"], level: "A2–B2", tag: "community", desc: "Latihan listening bertingkat dengan kuis." },
  { id: "ted", name: "TED Talks", url: "https://www.ted.com/talks", skill: ["listening", "speaking"], level: "B1–C1", tag: "free", desc: "Talk dengan transcript interaktif. Bagus untuk shadowing & ide Part 3." },
  { id: "sounds", name: "BBC Sounds (podcast & radio)", url: "https://www.bbc.co.uk/sounds", skill: ["listening"], level: "B2–C1", tag: "official", desc: "Podcast native speed (aksen British)." },
  { id: "librivox", name: "LibriVox — audiobook domain publik", url: "https://librivox.org/", skill: ["listening", "reading"], level: "B1–C1", tag: "open", desc: "Dengar sambil baca teks Gutenberg yang sama." },

  // ---- Reading
  { id: "simplewiki", name: "Simple English Wikipedia", url: "https://simple.wikipedia.org/", skill: ["reading"], level: "A2–B1", tag: "open", desc: "Wikipedia dengan bahasa sederhana (CC BY-SA)." },
  { id: "gutenberg", name: "Project Gutenberg", url: "https://www.gutenberg.org/", skill: ["reading"], level: "B1–C1", tag: "open", desc: "70.000+ ebook domain publik." },
  { id: "stdebooks", name: "Standard Ebooks", url: "https://standardebooks.org/", skill: ["reading"], level: "B2–C1", tag: "open", desc: "Ebook domain publik yang dirapikan; proyek open-source." },
  { id: "bbcnews", name: "BBC News", url: "https://www.bbc.com/news", skill: ["reading"], level: "B2–C1", tag: "free", desc: "Artikel native untuk latihan reading & topik IELTS." },

  // ---- Speaking & pronunciation
  { id: "camdict", name: "Cambridge Dictionary (audio UK/US + IPA)", url: "https://dictionary.cambridge.org/", skill: ["pronunciation", "vocab"], level: "Semua", tag: "official", desc: "Cek pengucapan & contoh kalimat." },
  { id: "youglish", name: "YouGlish", url: "https://youglish.com/", skill: ["pronunciation"], level: "B1–C1", tag: "community", desc: "Dengar kata/frasa diucapkan di ribuan video asli." },
  { id: "cv", name: "Mozilla Common Voice", url: "https://commonvoice.mozilla.org/en", skill: ["speaking", "pronunciation"], level: "B1–C1", tag: "open-source", desc: "Baca kalimat dengan suara — latihan read-aloud sambil menyumbang data open (CC0)." },
  { id: "whisper", name: "OpenAI Whisper (open-source speech-to-text)", url: "https://github.com/openai/whisper", skill: ["speaking", "tools"], level: "Semua", tag: "open-source", desc: "Transkrip rekamanmu secara akurat & offline; tempel hasilnya ke Speaking Lab." },
  { id: "praat", name: "Praat — analisis suara & intonasi", url: "https://github.com/praat/praat", skill: ["pronunciation", "tools"], level: "B2–C1", tag: "open-source", desc: "Lihat pitch/intonasi suaramu vs native (lanjutan)." },

  // ---- Writing
  { id: "wi", name: "Cambridge Write & Improve", url: "https://writeandimprove.com/", skill: ["writing"], level: "A1–C2", tag: "official", desc: "Feedback otomatis & estimasi level CEFR dari Cambridge. Gratis." },
  { id: "lt", name: "LanguageTool", url: "https://languagetool.org/", skill: ["writing", "tools"], level: "Semua", tag: "open-source", desc: "Grammar & style checker." },
  { id: "ltgh", name: "languagetool-org/languagetool (source code)", url: "https://github.com/languagetool-org/languagetool", skill: ["tools"], level: "Semua", tag: "open-source", desc: "Kode sumber LanguageTool (LGPL)." },

  // ---- IELTS
  { id: "ielts", name: "IELTS.org — situs resmi", url: "https://ielts.org/", skill: ["ielts"], level: "B1–C1", tag: "official", desc: "Format tes, sample questions, band descriptors resmi." },
  { id: "spkbd", name: "IELTS Speaking Band Descriptors (PDF resmi)", url: "https://ielts.org/cdn/ielts-downloadable-assets/ielts-guidance-and-support/ielts-guides/ielts-speaking-band-descriptors.pdf", skill: ["ielts", "speaking"], level: "B1–C1", tag: "official", desc: "Kriteria penilaian speaking yang dipakai examiner." },
  { id: "bcfree", name: "British Council — Free IELTS practice tests (Academic)", url: "https://takeielts.britishcouncil.org/prepare/ielts-free-practice-mock-tests/academic", skill: ["ielts", "test"], level: "B1–C1", tag: "official", desc: "Latihan resmi 4 skill dengan waktu asli." },
  { id: "bcfreegt", name: "British Council — Free IELTS practice tests (General Training)", url: "https://takeielts.britishcouncil.org/prepare/ielts-free-practice-mock-tests/general-training", skill: ["ielts", "test"], level: "B1–C1", tag: "official", desc: "Versi General Training." },
  { id: "idp", name: "IDP IELTS — Prepare", url: "https://ielts.idp.com/prepare", skill: ["ielts"], level: "B1–C1", tag: "official", desc: "Artikel, sample test, webinar gratis dari IDP (penyelenggara IELTS di Indonesia)." },
  { id: "camielts", name: "Cambridge English — IELTS preparation", url: "https://www.cambridgeenglish.org/exams-and-tests/ielts/preparation/", skill: ["ielts"], level: "B1–C1", tag: "official", desc: "Info buku latihan resmi Cambridge IELTS (berbayar) & materi gratis." },
  { id: "liz", name: "IELTS Liz", url: "https://ieltsliz.com/", skill: ["ielts", "speaking", "writing"], level: "B1–C1", tag: "community", desc: "Strategi & contoh jawaban gratis dari mantan examiner trainer." },
  { id: "adv", name: "IELTS Advantage", url: "https://www.ieltsadvantage.com/", skill: ["ielts", "writing"], level: "B2–C1", tag: "community", desc: "Strategi writing & speaking." }
];

export const byId = Object.fromEntries(RESOURCES.map((r) => [r.id, r]));
