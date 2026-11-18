// Panel pengucapan: IPA (Free Dictionary API), audio manusia (Wikimedia Commons / Wiktionary, lisensi CC),
// suara browser (speechSynthesis) normal & lambat, dan latihan rekam-ulang yang dicek Whisper.
import { whisperTranscribe, tokenize } from "./speech.js";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const cache = new Map();

// Bentuk dasar sederhana untuk kata turunan (governments → government, tried → try, …)
function lemmas(w) {
  const out = [w];
  if (w.endsWith("ies")) out.push(w.slice(0, -3) + "y");
  if (w.endsWith("es")) out.push(w.slice(0, -2));
  if (w.endsWith("s") && !w.endsWith("ss")) out.push(w.slice(0, -1));
  if (w.endsWith("ied")) out.push(w.slice(0, -3) + "y");
  if (w.endsWith("ed")) out.push(w.slice(0, -2), w.slice(0, -1));
  if (w.endsWith("ing")) out.push(w.slice(0, -3), w.slice(0, -3) + "e");
  if (w.endsWith("'s")) out.push(w.slice(0, -2));
  return [...new Set(out)].filter((x) => x.length > 1);
}

async function fetchIPA(w) {
  try {
    const r = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + encodeURIComponent(w));
    if (!r.ok) return null;
    const d = await r.json();
    const t = [...new Set(d.flatMap((e) => [e.phonetic, ...(e.phonetics || []).map((p) => p.text)]).filter(Boolean))];
    return t.slice(0, 2);
  } catch { return null; }
}

// Satu request ke Commons untuk semua bentuk kata × aksen (hemat rate limit).
// Melempar error jika request gagal (mis. 429) supaya hasil gagal tidak disimpan di cache.
const ACCENTS = [["us", "🇺🇸 US"], ["uk", "🇬🇧 UK"], ["au", "🇦🇺 AU"]];
async function fetchCommons(forms) {
  const titles = forms.flatMap((w) => ACCENTS.map(([a]) => `File:En-${a}-${w}.ogg`)).join("|");
  const u = "https://commons.wikimedia.org/w/api.php?" + new URLSearchParams({ action: "query", titles, prop: "imageinfo", iiprop: "url", format: "json", origin: "*" });
  const opts = { headers: { "Api-User-Agent": "MyEnglishJourney/1.0 (https://github.com/wardwar/my-english-journey)" } };
  let r = await fetch(u, opts);
  if (r.status === 429) { await new Promise((ok) => setTimeout(ok, 2000)); r = await fetch(u, opts); }
  if (!r.ok) throw new Error("Commons " + r.status);
  const d = await r.json();
  const norm = (t) => t.toLowerCase().replace(/_/g, " ");
  const pages = Object.values(d.query?.pages || {}).filter((x) => !("missing" in x) && x.imageinfo);
  for (const w of forms) {
    const found = ACCENTS.map(([a, label]) => {
      const pg = pages.find((x) => norm(x.title) === norm(`File:En-${a}-${w}.ogg`));
      return pg ? { label, url: pg.imageinfo[0].url, page: pg.imageinfo[0].descriptionurl || "https://commons.wikimedia.org/wiki/" + encodeURIComponent(pg.title) } : null;
    }).filter(Boolean);
    if (found.length) return { base: w, audio: found };
  }
  return { base: forms[0], audio: [] };
}

export async function lookup(word) {
  word = word.toLowerCase();
  if (cache.has(word)) return cache.get(word);
  const p = (async () => {
    const forms = lemmas(word);
    let commonsFailed = false;
    const [com, ipaPair] = await Promise.all([
      fetchCommons(forms).catch(() => { commonsFailed = true; return { base: word, audio: [] }; }),
      (async () => { for (const w of forms) { const ipa = await fetchIPA(w); if (ipa && ipa.length) return [w, ipa]; } return [word, []]; })()
    ]);
    if (commonsFailed) cache.delete(word); // coba lagi saat diklik berikutnya
    return { word, base: com.audio.length ? com.base : ipaPair[0], ipa: ipaPair[1], audio: com.audio, retry: commonsFailed };
  })();
  cache.set(word, p);
  return p;
}

export function speak(text, { rate = 0.9, lang = "en-GB" } = {}) {
  if (!window.speechSynthesis) return false;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang; u.rate = rate;
  const voices = speechSynthesis.getVoices();
  u.voice = voices.find((v) => v.lang === lang) || voices.find((v) => v.lang.startsWith("en")) || null;
  speechSynthesis.speak(u);
  return true;
}
if (window.speechSynthesis) speechSynthesis.getVoices(); // muat daftar suara lebih awal

// Kalimat dalam teks yang memuat kata ke-i (berdasarkan tokenisasi yang sama dengan skor read-aloud)
export function sentenceOf(text, idx) {
  const sents = text.match(/[^.!?]+[.!?]*/g) || [text];
  let n = 0;
  for (const s of sents) { const k = tokenize(s).length; if (idx < n + k) return s.trim(); n += k; }
  return text;
}

// Render teks asli dengan setiap kata bisa diklik. hit (opsional) = array boolean per token → kata salah merah.
export function clickableText(text, hit) {
  const sents = text.match(/[^.!?]+[.!?]*/g) || [text];
  let ti = 0;
  return sents.map((sent) => sent.trim().split(/\s+/).map((raw) => {
    const toks = tokenize(raw);
    if (!toks.length) return esc(raw);
    const bad = hit ? toks.some((_, k) => hit[ti + k] === false) : false;
    const cls = hit ? (bad ? "miss" : "ok") : "";
    ti += toks.length;
    return `<button type="button" class="w ${cls}" data-word="${esc(toks[0])}" data-sent="${esc(sent.trim())}">${esc(raw)}</button>`;
  }).join(" ")).join(" ");
}

// Panel pengucapan untuk satu kata
export function openPanel(box, { word, sentence, lang = "en-GB", whisperModel }) {
  box.hidden = false;
  box.innerHTML = `<div class="pron">
    <div class="row between"><span><b class="pw">${esc(word)}</b> <span class="ipa muted">memuat IPA…</span></span><button class="btn ghost sm" data-pc="close">✕</button></div>
    <div class="row wrap pa"><span class="small muted">Mencari rekaman suara manusia…</span></div>
    <div class="row wrap">
      <button class="btn sm" data-pc="tts">🔊 Suara browser</button>
      <button class="btn ghost sm" data-pc="slow">🐢 Lambat</button>
      ${sentence ? `<button class="btn ghost sm" data-pc="sent">💬 Dalam kalimat</button>` : ""}
    </div>
    ${sentence ? `<p class="small muted">“${esc(sentence)}”</p>` : ""}
    <div class="practice"><b class="small">Latihan:</b> dengar contoh → ucapkan → bandingkan.
      <div class="row wrap"><button class="btn rec sm" data-pc="rec">● Rekam ucapanku</button><span class="small pr"></span></div><div class="mine"></div></div>
    <p class="small muted">${'<a href="https://dictionary.cambridge.org/dictionary/english/' + encodeURIComponent(word) + '" target="_blank" rel="noopener">Cambridge Dictionary ↗</a> · <a href="https://youglish.com/pronounce/' + encodeURIComponent(word) + '/english" target="_blank" rel="noopener">YouGlish ↗</a>'}</p>
  </div>`;
  box.scrollIntoView({ behavior: "smooth", block: "nearest" });

  lookup(word).then((info) => {
    if (!box.isConnected || box.querySelector(".pw")?.textContent !== word) return;
    box.querySelector(".ipa").textContent = info.ipa.length ? info.ipa.join("  ·  ") : "(IPA tidak ditemukan)";
    box.querySelector(".pa").innerHTML = info.audio.length
      ? info.audio.map((a, i) => `<button class="btn sm" data-pc="human" data-i="${i}">▶ ${a.label}</button>`).join("") +
        `<span class="small muted">Rekaman manusia${info.base !== word ? " untuk “" + esc(info.base) + "”" : ""} · <a href="${info.audio[0].page}" target="_blank" rel="noopener">Wikimedia Commons (CC)</a></span>`
      : info.retry ? `<span class="small muted">Server rekaman sedang sibuk — klik katanya lagi sebentar lagi, atau pakai suara browser.</span>`
      : `<span class="small muted">Belum ada rekaman manusia untuk kata ini — pakai suara browser atau YouGlish.</span>`;
    box._audio = info.audio;
  });

  let rec = null;
  box.onclick = async (e) => {
    const b = e.target.closest("[data-pc]"); if (!b) return;
    const k = b.dataset.pc;
    if (k === "close") { box.hidden = true; box.innerHTML = ""; speechSynthesis?.cancel(); }
    if (k === "tts") speak(word, { rate: 0.85, lang });
    if (k === "slow") speak(word, { rate: 0.45, lang });
    if (k === "sent") speak(sentence, { rate: 0.85, lang });
    if (k === "human") {
      const a = new Audio(box._audio[+b.dataset.i].url);
      a.play().catch(() => { speak(word, { rate: 0.85, lang }); });
    }
    if (k === "rec") {
      const pr = box.querySelector(".pr");
      if (rec) { rec.stop(); return; }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const chunks = []; rec = new MediaRecorder(stream);
        rec.ondataavailable = (ev) => ev.data.size && chunks.push(ev.data);
        rec.onstop = async () => {
          stream.getTracks().forEach((t) => t.stop()); rec = null;
          b.textContent = "● Rekam lagi";
          const blob = new Blob(chunks, { type: chunks[0]?.type || "audio/webm" });
          box.querySelector(".mine").innerHTML = `<audio controls src="${URL.createObjectURL(blob)}"></audio>`;
          pr.textContent = "Mengecek dengan Whisper…";
          try {
            const heard = await whisperTranscribe(blob, { model: whisperModel, onProgress: (s, pct, mb) => { if (s === "download") pr.textContent = `Mengunduh model (${mb} MB, sekali saja)… ${pct}%`; } });
            const ok = tokenize(heard).some((t) => lemmas(t).includes(word.toLowerCase()) || lemmas(word.toLowerCase()).includes(t));
            pr.innerHTML = ok ? `✅ Terdengar jelas: “${esc(heard)}”` : `❌ Terdengar: “${esc(heard || "—")}”. Dengarkan contoh lagi, ucapkan pelan & jelas.`;
          } catch (err) { pr.textContent = "Tidak bisa mengecek otomatis (" + err.message + "). Bandingkan dengan telinga."; }
        };
        rec.start(); b.textContent = "■ Stop"; pr.textContent = "Ucapkan kata itu (bisa 2–3 kali), lalu klik Stop.";
        setTimeout(() => rec && rec.state === "recording" && rec.stop(), 6000);
      } catch (err) { pr.textContent = "Mikrofon tidak bisa diakses: " + err.message; }
    }
  };
}
