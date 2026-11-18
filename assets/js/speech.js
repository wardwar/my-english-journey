// Mesin Speaking Lab: rekam audio, transkrip live (Web Speech API), deteksi jeda, hitung metrik.
import { FILLERS } from "./data/banks.js";

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
export const canTranscribe = !!SR;
export const canRecord = !!(navigator.mediaDevices && window.MediaRecorder);

export class Session {
  constructor({ lang = "en-GB", onTranscript = () => {}, onLevel = () => {}, onStatus = () => {} } = {}) {
    this.lang = lang; this.onTranscript = onTranscript; this.onLevel = onLevel; this.onStatus = onStatus;
    this.finalText = ""; this.interim = ""; this.confidences = [];
    this.chunks = []; this.pauses = []; this.paused = false;
    this.activeMs = 0; this.silentRun = 0; this.spokeOnce = false;
  }

  async start() {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    this.recorder = new MediaRecorder(this.stream);
    this.recorder.ondataavailable = (e) => e.data.size && this.chunks.push(e.data);
    this.recorder.start(1000);

    // Analisis volume untuk mendeteksi jeda (silence) ≥ 1.5 detik
    const AC = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AC();
    const src = this.ctx.createMediaStreamSource(this.stream);
    this.analyser = this.ctx.createAnalyser(); this.analyser.fftSize = 1024;
    src.connect(this.analyser);
    const buf = new Float32Array(this.analyser.fftSize);
    this.noiseFloor = 0.01;
    const STEP = 100;
    this.tick = setInterval(() => {
      this.analyser.getFloatTimeDomainData(buf);
      let sum = 0; for (const v of buf) sum += v * v;
      const rms = Math.sqrt(sum / buf.length);
      this.onLevel(Math.min(1, rms * 8));
      if (this.paused) return;
      this.activeMs += STEP;
      // adaptasi noise floor pelan-pelan
      if (rms < this.noiseFloor * 1.5) this.noiseFloor = this.noiseFloor * 0.98 + rms * 0.02;
      const speaking = rms > Math.max(0.015, this.noiseFloor * 2.5);
      if (speaking) {
        if (this.spokeOnce && this.silentRun >= 1500) this.pauses.push(this.silentRun);
        this.silentRun = 0; this.spokeOnce = true;
      } else if (this.spokeOnce) this.silentRun += STEP;
    }, STEP);

    if (SR) {
      this.rec = new SR();
      this.rec.lang = this.lang; this.rec.continuous = true; this.rec.interimResults = true;
      this.rec.onresult = (e) => {
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const r = e.results[i];
          if (r.isFinal) {
            this.finalText += r[0].transcript.trim() + " ";
            if (r[0].confidence) this.confidences.push(r[0].confidence);
          } else interim += r[0].transcript;
        }
        this.interim = interim;
        this.onTranscript(this.finalText + interim);
      };
      this.rec.onstart = () => this.onStatus("on");
      this.rec.onerror = (e) => { this.srError = e.error; this.onStatus("error", e.error); };
      this.rec.onend = () => { if (this.running) try { this.rec.start(); } catch {} };
      this.running = true;
      try { this.rec.start(); } catch (e) { this.srError = e.message; this.onStatus("error", e.message); }
    } else this.onStatus("none");
  }

  pause(v) { this.paused = v; if (v) this.silentRun = 0; }

  stop() {
    this.running = false;
    return new Promise((resolve) => {
      try { this.rec && this.rec.stop(); } catch {}
      clearInterval(this.tick);
      const finish = () => {
        this.stream.getTracks().forEach((t) => t.stop());
        try { this.ctx.close(); } catch {}
        const blob = new Blob(this.chunks, { type: this.recorder.mimeType || "audio/webm" });
        resolve({
          blob,
          transcript: (this.finalText + this.interim).trim(),
          seconds: Math.round(this.activeMs / 1000),
          pauses: this.pauses.slice(),
          confidence: this.confidences.length ? this.confidences.reduce((a, b) => a + b, 0) / this.confidences.length : null,
          srError: this.srError || null
        });
      };
      if (this.recorder.state !== "inactive") { this.recorder.onstop = finish; this.recorder.stop(); } else finish();
    });
  }
}

export const tokenize = (t) => (t.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) || []);

// Moving-Average Type-Token Ratio: keragaman kosakata yang tidak bias panjang teks
export function mattr(words, w = 40) {
  if (words.length === 0) return 0;
  if (words.length <= w) return new Set(words).size / words.length;
  let total = 0, n = 0;
  for (let i = 0; i + w <= words.length; i++) { total += new Set(words.slice(i, i + w)).size / w; n++; }
  return total / n;
}

export function countFillers(text) {
  const t = " " + text.toLowerCase().replace(/[^a-z' ]/g, " ") + " ";
  const found = {};
  let total = 0;
  for (const f of FILLERS) {
    const m = t.match(new RegExp(" " + f + " ", "g"));
    if (m) { found[f] = m.length; total += m.length; }
  }
  return { total, found };
}

export function metrics({ transcript = "", seconds = 0, pauses = [], confidence = null }) {
  const words = tokenize(transcript);
  const mins = Math.max(seconds, 1) / 60;
  const wpm = Math.round(words.length / mins);
  const fill = countFillers(transcript);
  const lexical = mattr(words);
  const longWords = words.filter((w) => w.length >= 7).length;
  const sentences = transcript.split(/[.!?]+/).filter((s) => s.trim()).length || 1;
  return {
    words: words.length, seconds, wpm,
    fillers: fill.total, fillerList: fill.found, fillersPerMin: +(fill.total / mins).toFixed(1),
    pauses: pauses.length, pausesPerMin: +(pauses.length / mins).toFixed(1),
    longestPause: pauses.length ? +(Math.max(...pauses) / 1000).toFixed(1) : 0,
    mattr: +lexical.toFixed(2), longWordPct: words.length ? Math.round((longWords / words.length) * 100) : 0,
    confidence: confidence == null ? null : +confidence.toFixed(2),
    avgSentence: Math.round(words.length / sentences)
  };
}

// Indikasi kasar (BUKAN skor resmi) hanya untuk Fluency dan Lexical
export function indicative(m) {
  if (!m.words) return null;
  let fc = m.wpm < 70 ? 4 : m.wpm < 90 ? 5 : m.wpm < 110 ? 6 : m.wpm < 140 ? 7 : 7.5;
  if (m.pausesPerMin > 4) fc -= 1; else if (m.pausesPerMin > 2.5) fc -= 0.5;
  if (m.fillersPerMin > 6) fc -= 0.5;
  let lr = m.mattr < 0.55 ? 4.5 : m.mattr < 0.62 ? 5 : m.mattr < 0.68 ? 6 : m.mattr < 0.74 ? 7 : 7.5;
  if (m.longWordPct >= 18) lr += 0.5;
  const clamp = (x) => Math.max(3, Math.min(8, Math.round(x * 2) / 2));
  return { fc: clamp(fc), lr: clamp(lr) };
}

// Akurasi read-aloud: kata target yang terucap, urutan dijaga (LCS)
export function readAloudScore(target, said) {
  const a = tokenize(target), b = tokenize(said);
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--)
    for (let j = b.length - 1; j >= 0; j--)
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const hit = new Array(a.length).fill(false);
  let i = 0, j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { hit[i] = true; i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++;
  }
  const ok = hit.filter(Boolean).length;
  return { accuracy: a.length ? Math.round((ok / a.length) * 100) : 0, words: a, hit };
}

// IELTS overall: rata-rata dibulatkan ke 0.5 terdekat (.25 → naik .5, .75 → naik 1)
export const ieltsRound = (x) => Math.round(x * 2) / 2;

// ---- Whisper di browser (open-source, via transformers.js). Model diunduh sekali lalu di-cache browser.
const TRANSFORMERS = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.1/+esm";
const asrCache = {};
export async function whisperTranscribe(blob, { model = "Xenova/whisper-base.en", onProgress = () => {} } = {}) {
  if (!asrCache[model]) {
    asrCache[model] = (async () => {
      const { pipeline } = await import(TRANSFORMERS);
      const files = {};
      return pipeline("automatic-speech-recognition", model, {
        progress_callback: (p) => {
          if (p.status === "progress" && p.total) {
            files[p.file] = [p.loaded, p.total];
            const v = Object.values(files), loaded = v.reduce((a, x) => a + x[0], 0), total = v.reduce((a, x) => a + x[1], 0);
            onProgress("download", Math.round((loaded / total) * 100), Math.round(total / 1e6));
          }
        }
      });
    })();
    asrCache[model].catch(() => delete asrCache[model]);
  }
  const asr = await asrCache[model];
  onProgress("decode");
  const AC = window.AudioContext || window.webkitAudioContext;
  const ac = new AC({ sampleRate: 16000 });
  const buf = await ac.decodeAudioData(await blob.arrayBuffer());
  ac.close();
  let audio = buf.getChannelData(0);
  if (buf.numberOfChannels > 1) {
    const b = buf.getChannelData(1); audio = audio.map((v, i) => (v + b[i]) / 2);
  }
  onProgress("transcribe");
  const out = await asr(audio, { chunk_length_s: 30, stride_length_s: 5 });
  return (Array.isArray(out) ? out.map((o) => o.text).join(" ") : out.text).trim();
}
