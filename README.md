# 🧭 My English Journey

Platform coaching pribadi untuk belajar English dari **A1 sampai C1** dan bersiap **IELTS**.
Situs statis (HTML + JavaScript, tanpa build) untuk GitHub Pages. Semua data tersimpan di browser.

**Live:** https://wardwar.github.io/my-english-journey/

## Fitur
| Halaman | Isi |
|---|---|
| 🏠 **Coach** | Rencana belajar hari ini (otomatis dari minggu & hari), streak, catatan coach (pengingat speaking, checkpoint, pace menuju tanggal tes, kriteria terlemah) |
| 🗺️ **Roadmap** | 6 fase, 57 minggu (+ siklus lanjutan) terstruktur: grammar, kosakata, listening, reading, speaking, writing per minggu + checkpoint |
| 🗣️ **Speaking Lab** | Mock IELTS Part 1–3 (timer & persiapan 1 menit), topik bebas (4-3-2), read-aloud; rekam audio, transkrip otomatis, metrik (kata/menit, jeda, filler, keragaman kata, akurasi read-aloud), self-rating 4 kriteria, riwayat & grafik. Read-aloud: klik kata (merah) → IPA, rekaman manusia UK/US (Wikimedia Commons), suara browser normal/lambat, latihan rekam ulang dicek Whisper |
| ✍️ **Writing Lab** | Soal Task 2 & GT letter, timer, word count, checklist, link feedback gratis, self-rating |
| 📈 **Progress** | Catat EF SET / mock / IELTS resmi (overall dibulatkan seperti IELTS), grafik vs target |
| 📚 **Library** | 49 sumber resmi / open / open-source dengan filter skill & label |
| ⚙️ **Pengaturan** | Target band, tanggal tes, menit/hari, modul Academic/GT, export/import backup JSON |

## Fase
| Fase | Level | Perkiraan IELTS | Durasi |
|---|---|---|---|
| 0 · Diagnostic | — | — | 1 minggu |
| 1 · Foundation | A1 → A2 | ≤ 4.0 | 12 minggu |
| 2 · Intermediate | A2 → B1 | 4.5–5.0 | 12 minggu |
| 3 · Upper-Intermediate | B1 → B2 | 5.5–6.5 | 20 minggu |
| 4 · IELTS Preparation | B2 → target | 6.5–7.5 | 12 minggu |
| 5 · Advanced | B2+ → C1 | 7.0–8.0 | berulang |

Estimasi memakai patokan Cambridge ±200 jam belajar terbimbing per level CEFR. Mulai dari fase sesuai hasil tes awal.

## Cara menguji speaking
Lihat tab **Speaking Lab → Cara menilai speaking**. Ringkasnya ada 4 lapisan:
1. **Metrik otomatis** setiap sesi: kecepatan, jeda, filler, keragaman kata, akurasi read-aloud.
2. **Self-assessment mingguan** dengan [IELTS Speaking Band Descriptors](https://ielts.org/cdn/ielts-downloadable-assets/ielts-guidance-and-support/ielts-guides/ielts-speaking-band-descriptors.pdf) resmi.
3. **Penilai manusia** bulanan: partner atau tutor, dengan rubrik yang sama.
4. **Tes resmi** sebagai kalibrasi akhir.

Transkrip live butuh Chrome atau Edge (Web Speech API). Untuk transkrip offline yang akurat bisa memakai [Whisper](https://github.com/openai/whisper).

## Sumber
Hanya sumber dari lembaga resmi (BBC, British Council, Cambridge, Oxford, penyelenggara IELTS, universitas), konten berlisensi terbuka atau domain publik, dan proyek open-source. Situs pihak ketiga diberi label `community`.
Semua link dicek otomatis setiap minggu oleh [`.github/workflows/links.yml`](.github/workflows/links.yml).

## Mengedit
- Kurikulum: `assets/js/data/curriculum.js`
- Sumber: `assets/js/data/resources.js`
- Bank soal speaking/writing & rubrik: `assets/js/data/banks.js`

## Menjalankan lokal
```bash
python3 -m http.server 8000
```
Lalu buka http://localhost:8000. ES module dan mikrofon butuh http(s), tidak bisa lewat `file://`.

## Aktifkan GitHub Pages
Settings repo → **Pages** → Source: *Deploy from a branch* → `main` / `(root)`.
