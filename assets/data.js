// Kurikulum: edit file ini untuk mengubah isi situs. Semua link = sumber gratis / open / publik.
window.CURRICULUM = {
  daily: [
    { min: 20, title: "Vocabulary (Anki / spaced repetition)", note: "10 kata baru + review. Simpan kata dalam kalimat, bukan terjemahan saja." },
    { min: 25, title: "Listening aktif", note: "Dengar 1 audio pendek, ulangi 2x: pertama tanpa transcript, kedua dengan transcript. Catat 3 frasa baru." },
    { min: 20, title: "Reading / Grammar", note: "1 artikel atau 1 topik grammar + latihan." },
    { min: 15, title: "Output: speaking atau writing", note: "Rekam 1–2 menit suara (selang-seling hari) atau tulis paragraf. Output = kunci fluency." }
  ],
  bands: [
    { cefr: "A2", ielts: "3.5–4.0" }, { cefr: "B1", ielts: "4.5–5.0" },
    { cefr: "B2", ielts: "5.5–6.5" }, { cefr: "C1", ielts: "7.0–8.0" }
  ],
  phases: [
    {
      id: "p0", title: "Fase 0 — Diagnostic & Baseline", level: "Semua level", weeks: "Minggu 1", hours: "5–8 jam",
      goal: "Tahu posisi awal (CEFR & perkiraan band IELTS) supaya mulai dari fase yang tepat.",
      tasks: [
        "Ikut EF SET (reading + listening) dan catat skor/CEFR",
        "Ikut Cambridge 'Test your English' dan catat hasilnya",
        "Rekam 1 menit self-intro dalam English (simpan sebagai baseline speaking)",
        "Tulis 150 kata tentang 'my daily life' (baseline writing)",
        "Tentukan target band IELTS & tanggal tes (isi di bagian Target di atas)",
        "Install Anki, buat deck pertama"
      ],
      resources: [
        { cat: "Tes level", name: "EF SET (gratis, CEFR)", url: "https://www.efset.org/", tag: "free" },
        { cat: "Tes level", name: "Cambridge English — Test your English", url: "https://www.cambridgeenglish.org/test-your-english/", tag: "free" },
        { cat: "Tools", name: "Anki (open-source, GitHub)", url: "https://github.com/ankitects/anki", tag: "open-source" }
      ],
      milestone: "Hasil tes + rekaman + tulisan baseline tersimpan. Kamu tahu mulai dari Fase 1, 2, atau 3."
    },
    {
      id: "p1", title: "Fase 1 — Foundation", level: "A1 → A2", weeks: "Minggu 2–13 (±12 minggu)", hours: "±150–200 jam",
      goal: "Bisa memahami & memakai kalimat sehari-hari: perkenalan, rutinitas, belanja, arah, masa lalu & rencana sederhana.",
      tasks: [
        "Kuasai tenses dasar: present simple/continuous, past simple, going to/will",
        "Hafal 1.000 kata paling umum (Oxford 3000 level A1–A2)",
        "Pronunciation: alfabet fonetik (IPA) & minimal pairs (ship/sheep, etc.)",
        "Dengar 3 audio/minggu level A1–A2 dan tulis ulang (dictation) 1 per minggu",
        "Baca 2 teks pendek/minggu level A2",
        "Speaking: 3 monolog 1 menit/minggu (rutinitas, keluarga, kota)",
        "Writing: 1 email/pesan pendek 50–80 kata per minggu"
      ],
      resources: [
        { cat: "Course terstruktur", name: "BBC Learning English (Course, Grammar, Vocabulary)", url: "https://www.bbc.co.uk/learningenglish", tag: "free" },
        { cat: "Course terstruktur", name: "British Council LearnEnglish (filter level A1–A2)", url: "https://learnenglish.britishcouncil.org/", tag: "free" },
        { cat: "Grammar", name: "British Council — Grammar", url: "https://learnenglish.britishcouncil.org/grammar", tag: "free" },
        { cat: "Grammar", name: "Khan Academy — Grammar", url: "https://www.khanacademy.org/humanities/grammar", tag: "free" },
        { cat: "Vocabulary", name: "Oxford 3000 & 5000 (daftar resmi per CEFR)", url: "https://www.oxfordlearnersdictionaries.com/wordlists/oxford3000-5000", tag: "free" },
        { cat: "Vocabulary", name: "google-10000-english (GitHub, frekuensi kata)", url: "https://github.com/first20hours/google-10000-english", tag: "open-source" },
        { cat: "Listening", name: "VOA Learning English (audio + transcript, level rendah)", url: "https://learningenglish.voanews.com/", tag: "free" },
        { cat: "Listening", name: "Elllo (ribuan audio dgn transcript & quiz)", url: "https://elllo.org/", tag: "free" },
        { cat: "Pronunciation", name: "Cambridge Dictionary (audio UK/US + IPA)", url: "https://dictionary.cambridge.org/", tag: "free" },
        { cat: "Pronunciation", name: "YouGlish (kata dalam video asli)", url: "https://youglish.com/", tag: "free" },
        { cat: "Grammar ref", name: "English Grammar Profile (apa yang dipakai di tiap CEFR)", url: "https://www.englishprofile.org/english-grammar-profile", tag: "free" },
        { cat: "Pelengkap", name: "GCFGlobal — English", url: "https://edu.gcfglobal.org/en/topics/english/", tag: "free" }
      ],
      milestone: "Skor EF SET ≥ A2 dan bisa ngobrol/rekam 2 menit tentang diri sendiri tanpa berhenti lama."
    },
    {
      id: "p2", title: "Fase 2 — Intermediate", level: "A2 → B1", weeks: "Minggu 14–25 (±12 minggu)", hours: "±180–220 jam",
      goal: "Bisa mengikuti percakapan topik familiar, menulis teks koheren, dan menceritakan pengalaman/opini sederhana.",
      tasks: [
        "Grammar: perfect tenses, conditionals 0–2, passive, modals, relative clauses, reported speech",
        "Vocabulary 2.000 → 3.000 kata (Oxford 3000 lengkap) + collocations",
        "Listening: podcast/berita pelan 20–30 menit/hari, mulai kurangi transcript",
        "Reading: 3 artikel/minggu (news in levels, simplified Wikipedia)",
        "Speaking: 2 menit monolog topik acak, rekam & dengar ulang; mulai cari speaking partner",
        "Writing: 1 esai opini 120–150 kata/minggu, kirim ke Write & Improve untuk feedback",
        "Baca 1 graded reader / cerita pendek"
      ],
      resources: [
        { cat: "Course terstruktur", name: "BBC Learning English — Intermediate (6 Minute English, English at Work)", url: "https://www.bbc.co.uk/learningenglish", tag: "free" },
        { cat: "Course terstruktur", name: "British Council LearnEnglish (B1)", url: "https://learnenglish.britishcouncil.org/", tag: "free" },
        { cat: "Course terstruktur", name: "OpenLearn (Open University) — English language", url: "https://www.open.edu/openlearn/languages/english-language", tag: "free" },
        { cat: "Reading", name: "Simple English Wikipedia", url: "https://simple.wikipedia.org/", tag: "open" },
        { cat: "Reading", name: "Project Gutenberg (buku domain publik)", url: "https://www.gutenberg.org/", tag: "open" },
        { cat: "Reading", name: "VOA Learning English", url: "https://learningenglish.voanews.com/", tag: "free" },
        { cat: "Listening", name: "TED Talks (aktifkan subtitle English)", url: "https://www.ted.com/talks", tag: "free" },
        { cat: "Listening", name: "LibriVox (audiobook domain publik)", url: "https://librivox.org/", tag: "open" },
        { cat: "Listening", name: "Randall's ESL Cyber Listening Lab", url: "https://www.esl-lab.com/", tag: "free" },
        { cat: "Writing", name: "Cambridge Write & Improve (feedback otomatis, gratis)", url: "https://writeandimprove.com/", tag: "free" },
        { cat: "Vocabulary", name: "English Vocabulary Profile (kata per CEFR)", url: "https://www.englishprofile.org/wordlists", tag: "free" },
        { cat: "Speaking", name: "Mozilla Common Voice (baca kalimat, latih ucapan; data open)", url: "https://commonvoice.mozilla.org/en", tag: "open" }
      ],
      milestone: "Skor EF SET ≈ B1. Bisa menulis esai 150 kata dengan grammar sebagian besar benar & ngobrol 5 menit tentang topik familiar."
    },
    {
      id: "p3", title: "Fase 3 — Upper-Intermediate", level: "B1 → B2", weeks: "Minggu 26–45 (±20 minggu)", hours: "±300–350 jam",
      goal: "Fluency nyata: pahami teks/diskusi kompleks, bicara spontan, tulis argumen jelas. Ini 'gerbang' IELTS 5.5–6.5.",
      tasks: [
        "Grammar B2: conditionals 3 & mixed, inversion, complex noun phrases, linking devices, hedging",
        "Vocabulary: Oxford 5000 (B2) + Academic Word List (570 headwords)",
        "Listening tanpa subtitle: podcast/YouTube native speed, 40+ menit/hari",
        "Reading: artikel panjang (BBC, The Guardian, Wikipedia) + catat collocations",
        "Speaking: shadowing 15 menit/hari + 1 sesi speaking partner/minggu",
        "Writing: 2 esai/minggu (opini, discussion, problem–solution) dengan feedback",
        "Mulai familiarisasi format IELTS (kenali 4 section tanpa tekanan waktu)"
      ],
      resources: [
        { cat: "Vocabulary", name: "Academic Word List — Victoria University of Wellington", url: "https://www.wgtn.ac.nz/lals/resources/academicwordlist", tag: "free" },
        { cat: "Vocabulary", name: "Oxford 3000 & 5000", url: "https://www.oxfordlearnersdictionaries.com/wordlists/oxford3000-5000", tag: "free" },
        { cat: "Grammar", name: "English Grammar Profile (B2)", url: "https://www.englishprofile.org/english-grammar-profile", tag: "free" },
        { cat: "Grammar", name: "British Council LearnEnglish — Grammar (B2)", url: "https://learnenglish.britishcouncil.org/grammar", tag: "free" },
        { cat: "Listening", name: "BBC Radio 4 / BBC Sounds (podcast native)", url: "https://www.bbc.co.uk/sounds", tag: "free" },
        { cat: "Listening", name: "TED Talks", url: "https://www.ted.com/talks", tag: "free" },
        { cat: "Reading", name: "BBC News", url: "https://www.bbc.com/news", tag: "free" },
        { cat: "Reading", name: "Project Gutenberg", url: "https://www.gutenberg.org/", tag: "open" },
        { cat: "Writing", name: "Cambridge Write & Improve", url: "https://writeandimprove.com/", tag: "free" },
        { cat: "Pronunciation", name: "YouGlish", url: "https://youglish.com/", tag: "free" },
        { cat: "Test", name: "Cambridge English — materi latihan gratis (B2 First)", url: "https://www.cambridgeenglish.org/learning-english/free-resources/", tag: "free" }
      ],
      milestone: "Skor EF SET ≥ B2 dan mock IELTS pertama (Fase 4) menghasilkan ≥ 5.5 overall."
    },
    {
      id: "p4", title: "Fase 4 — IELTS Preparation", level: "B2 → target band 6.5–7.5", weeks: "Minggu 46–57 (±12 minggu)", hours: "±150–200 jam",
      goal: "Menguasai format & strategi 4 skill IELTS, lalu naikkan skor lewat mock test berkala dan feedback.",
      tasks: [
        "Pelajari format resmi: Listening (4 section/40 soal), Reading (3 passage/40 soal), Writing (Task 1 & 2), Speaking (3 part)",
        "Mock test lengkap tiap 2 minggu dengan waktu asli; catat error log",
        "Listening: latih tipe soal (MCQ, matching, map labelling, form completion)",
        "Reading: latih skimming/scanning, True/False/Not Given, Matching Headings",
        "Writing Task 1: pola deskripsi grafik/proses/peta; Task 2: struktur 4 paragraf + 250+ kata",
        "Speaking: latih Part 1–3 dengan timer, rekam, evaluasi kriteria (Fluency, Lexical, Grammar, Pronunciation)",
        "Daftar tes (IDP / British Council) ~6 minggu sebelum target tanggal"
      ],
      resources: [
        { cat: "Resmi", name: "IELTS.org — official preparation resources", url: "https://ielts.org/", tag: "official" },
        { cat: "Resmi", name: "British Council — Prepare for IELTS (gratis & berbayar)", url: "https://takeielts.britishcouncil.org/take-ielts/prepare", tag: "official" },
        { cat: "Resmi", name: "IDP IELTS — Prepare", url: "https://ielts.idp.com/prepare", tag: "official" },
        { cat: "Resmi", name: "Band Descriptors (Writing/Speaking) — IELTS.org", url: "https://ielts.org/", tag: "official" },
        { cat: "Writing", name: "Cambridge Write & Improve (mode IELTS)", url: "https://writeandimprove.com/", tag: "free" },
        { cat: "Latihan", name: "IELTS Liz (strategi gratis)", url: "https://ieltsliz.com/", tag: "free" },
        { cat: "Latihan", name: "IELTS Advantage (tips & latihan)", url: "https://www.ieltsadvantage.com/", tag: "free" },
        { cat: "Latihan", name: "Cambridge IELTS (buku resmi Cambridge — beli/pinjam)", url: "https://www.cambridgeenglish.org/exams-and-tests/ielts/preparation/", tag: "official" },
        { cat: "Listening", name: "BBC Sounds, TED (aksen UK/US/AU)", url: "https://www.bbc.co.uk/sounds", tag: "free" }
      ],
      milestone: "3 mock test berturut-turut ≥ target band. Siap daftar tes asli."
    },
    {
      id: "p5", title: "Fase 5 — Advanced / Maintenance", level: "B2+ → C1", weeks: "Berkelanjutan", hours: "±5–7 jam/minggu",
      goal: "Fluent & natural: nuansa, idiom, register akademik/profesional, tahan lama.",
      tasks: [
        "Baca buku English native (fiction/non-fiction) 30 menit/hari",
        "Tonton serial/film tanpa subtitle, lalu shadowing adegan favorit",
        "Menulis jurnal/blog English mingguan di repo ini",
        "Speaking club / language exchange 2x/minggu",
        "Ulangi mock IELTS tiap 3 bulan untuk cek maintenance"
      ],
      resources: [
        { cat: "Reading", name: "Project Gutenberg", url: "https://www.gutenberg.org/", tag: "open" },
        { cat: "Reading", name: "Standard Ebooks (ebook domain publik berkualitas, open-source)", url: "https://standardebooks.org/", tag: "open" },
        { cat: "Listening", name: "LibriVox", url: "https://librivox.org/", tag: "open" },
        { cat: "Listening", name: "BBC Sounds", url: "https://www.bbc.co.uk/sounds", tag: "free" },
        { cat: "Vocabulary", name: "English Vocabulary Profile (C1)", url: "https://www.englishprofile.org/wordlists", tag: "free" }
      ],
      milestone: "IELTS 7.0+ atau kemampuan ngobrol 30 menit tanpa mencari kata."
    }
  ],
  repos: [
    { name: "ankitects/anki", url: "https://github.com/ankitects/anki", note: "Aplikasi flashcard spaced-repetition (open-source)." },
    { name: "first20hours/google-10000-english", url: "https://github.com/first20hours/google-10000-english", note: "10.000 kata English paling sering dipakai." },
    { name: "dwyl/english-words", url: "https://github.com/dwyl/english-words", note: "Daftar kata English besar (untuk project/spell check)." }
  ]
};
