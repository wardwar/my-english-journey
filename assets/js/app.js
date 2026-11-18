import { PHASES, DAY_TEMPLATE } from "./data/curriculum.js";
import { RESOURCES, byId } from "./data/resources.js";
import { PART1, PART2, READ_ALOUD, SPEAKING_RUBRIC, WRITING_PROMPTS, WRITING_CHECK } from "./data/banks.js";
import { Session, canRecord, canTranscribe, metrics, indicative, readAloudScore, ieltsRound, tokenize, whisperTranscribe } from "./speech.js";
import { S, update, save, exportJSON, importJSON, resetAll, audioPut, audioGet, audioDel, today, uid } from "./store.js";

// ---------- helpers
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const shuffle = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
const fmtDate = (d) => new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 864e5);
const SKILL_ICON = { vocab: "🗂️", grammar: "🧩", listening: "🎧", reading: "📖", speaking: "🗣️", pronunciation: "👄", writing: "✍️", test: "📊", tools: "🧰", plan: "🧭", ielts: "🎯" };
const resLink = (id) => { const r = byId[id]; return r ? `<a class="chip-link" href="${r.url}" target="_blank" rel="noopener">↗ ${esc(r.name.split(" — ")[0].split(" (")[0])}</a>` : ""; };
const routeLink = (href, label) => `<a class="chip-link internal" href="${href}">→ ${esc(label)}</a>`;
const writingText = (w) => (w && typeof w === "object" ? (S().settings.module === "gt" ? w.gt : w.academic) : w);

// ---------- curriculum navigation
const ALL_WEEKS = PHASES.flatMap((p, pi) => p.weeks.map((w, wi) => ({ p, pi, w, wi, key: `${p.id}-${wi}` })));
function currentWeek() {
  const st = S().weeks;
  const pending = ALL_WEEKS.find((x) => !st[x.key] && x.p.id !== "p5");
  if (pending) return pending;
  // Fase 5 berulang: siklus 4 minggu berdasarkan jumlah minggu p5 yang selesai
  const p5 = PHASES[PHASES.length - 1];
  const doneP5 = Object.keys(st).filter((k) => k.startsWith("p5-")).length;
  const wi = doneP5 % p5.weeks.length;
  return { p: p5, pi: PHASES.length - 1, w: p5.weeks[wi], wi, key: `p5-${wi}`, cycle: Math.floor(doneP5 / p5.weeks.length) + 1 };
}
function weekTasks(p, w) {
  if (w.tasks) return w.tasks.map((t) => ({ skill: t.skill, text: t.text, links: (t.res || []).map(resLink).join("") + (t.route ? routeLink(t.route, "Buka di platform") : "") }));
  const s = p.src, out = [];
  out.push({ skill: "grammar", text: `Grammar: <b>${esc(w.g)}</b> — pelajari, kerjakan latihan, lalu buat 5 kalimat tentang hidupmu.`, links: s.grammar.map(resLink).join("") });
  if (p.vocabPerWeek) out.push({ skill: "vocab", text: `Vocabulary: ${p.vocabPerWeek} kata/frasa baru tema <b>${esc(w.v)}</b> → masukkan ke Anki (kalimat contoh, bukan cuma terjemahan).`, links: (s.vocab || []).map(resLink).join("") + resLink("anki") });
  out.push({ skill: "listening", text: "Listening: 5 sesi × 20 menit; 1 sesi dictation (tulis ulang 1 menit audio).", links: s.listen.map(resLink).join("") });
  out.push({ skill: "reading", text: "Reading: 3 teks; catat 5 collocation per teks.", links: s.read.map(resLink).join("") });
  out.push({ skill: "speaking", text: `Speaking: <b>${esc(w.s)}</b> — rekam min. 3× minggu ini di Speaking Lab.`, links: routeLink(`#/speaking/free?topic=${encodeURIComponent(w.s)}`, "Rekam topik ini") });
  out.push({ skill: "writing", text: `Writing: ${esc(writingText(w.w))}`, links: routeLink("#/writing", "Writing Lab") + resLink("wi") });
  if (w.ielts) out.push({ skill: "ielts", text: `IELTS: ${esc(w.ielts)}`, links: resLink("bcfree") + resLink("spkbd") + resLink("idp") });
  if (w.cp) out.push({ skill: "test", text: "<b>Checkpoint:</b> ulangi EF SET, catat skor di Progress, dan lakukan Speaking Benchmark (Mock IELTS).", links: resLink("efset") + routeLink("#/progress", "Catat skor") + routeLink("#/speaking/mock", "Mock speaking") });
  return out;
}
function dayPlan(cw, date = new Date()) {
  const { p, w } = cw;
  const scale = (m) => Math.max(5, Math.round((m * (S().settings.minutes || 80)) / 80 / 5) * 5);
  if (w.tasks) return w.tasks.map((t) => ({ skill: t.skill, min: null, text: t.text, links: (t.res || []).map(resLink).join("") + (t.route ? routeLink(t.route, "Buka") : "") }));
  const L = (ids) => (ids || []).map(resLink).join("");
  const topicLink = routeLink(`#/speaking/free?topic=${encodeURIComponent(w.s)}`, "Speaking Lab");
  const T = {
    anki: [`Anki: review semua kartu + ${Math.ceil((p.vocabPerWeek || 30) / 6)} kata baru (tema: ${esc(w.v)}).`, resLink("anki")],
    grammarLearn: [`Pelajari grammar minggu ini: <b>${esc(w.g)}</b>.`, L(p.src.grammar)],
    grammarPractice: [`Latihan soal: ${esc(w.g)}. Catat kesalahanmu.`, L(p.src.grammar)],
    grammarReview: [`Review ${esc(w.g)}: tulis 5 kalimat tentang hidupmu, ucapkan keras-keras.`, ""],
    listen: ["Listening aktif: dengar 1×tanpa transcript, 1×dengan transcript, catat 5 frasa.", L(p.src.listen)],
    dictation: ["Dictation: tulis ulang 1 menit audio kata per kata, lalu cocokkan transcript.", L(p.src.listen)],
    read: ["Baca 1 teks; tandai 5 collocation & 1 struktur grammar menarik.", L(p.src.read)],
    shadow: [`Shadowing 10 menit (tiru audio kalimat per kalimat), lalu rekam 1 menit: “${esc(w.s)}”`, topicLink],
    speakTopic: [`Rekam 2 menit topik: “${esc(w.s)}”. Dengar ulang & catat 3 perbaikan.`, topicLink],
    readAloud: ["Read-aloud di Speaking Lab: cek kata yang belum jelas pengucapannya.", routeLink("#/speaking/read", "Read-aloud") + resLink("youglish")],
    mock: [cw.pi >= 3 ? "Mock IELTS Part 2: cue card 1 menit persiapan + 2 menit bicara." : `Bicara 2 menit tanpa berhenti: “${esc(w.s)}”`, cw.pi >= 3 ? routeLink("#/speaking/mock", "Mock") : topicLink],
    benchmark: ["Benchmark mingguan: Mock IELTS Part 1–3, nilai dengan rubrik.", routeLink("#/speaking/mock", "Mock IELTS")],
    writeDraft: [`Draft writing: ${esc(writingText(w.w))}`, routeLink("#/writing", "Writing Lab")],
    writeFinish: ["Selesaikan tulisan & cek di Write & Improve / LanguageTool.", resLink("wi") + resLink("lt")],
    writeReview: ["Revisi tulisan minggu ini dari feedback; tulis ulang kalimat yang salah.", routeLink("#/writing", "Writing Lab")],
    fun: ["Input santai: series/film/podcast English yang kamu suka (subtitle English).", resLink("ted") + resLink("sounds")],
    reflect: ["Refleksi mingguan: apa yang meningkat, apa yang sulit? Tandai minggu selesai.", routeLink("#/roadmap", "Roadmap")]
  };
  return DAY_TEMPLATE[date.getDay()].map((b) => ({ skill: b.skill, min: scale(b.min), text: T[b.k][0], links: T[b.k][1] }));
}
function streak() {
  const st = S();
  const active = (d) => Object.values(st.daily[d] || {}).filter(Boolean).length >= 2 || st.speaking.some((x) => x.date.slice(0, 10) === d);
  const d = new Date(); let n = 0;
  const key = (x) => x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0");
  if (!active(key(d))) d.setDate(d.getDate() - 1);
  while (active(key(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function latestOverall() {
  const sc = S().scores.filter((x) => x.overall != null).sort((a, b) => a.date.localeCompare(b.date));
  return sc.length ? sc[sc.length - 1] : null;
}
function weeksRemainingToIELTS() {
  const st = S().weeks;
  return ALL_WEEKS.filter((x) => x.pi <= 4 && !st[x.key]).length;
}

// ---------- coach notes (aturan sederhana)
function coachNotes() {
  const st = S(), set = st.settings, notes = [];
  if (!set.start) notes.push(["start", "Mulai dari <b>Fase 0 · Diagnostic</b>: ambil tes level & rekam baseline. Isi tanggal mulai di <a href='#/settings'>Pengaturan</a>."]);
  const lastSp = st.speaking.map((x) => x.date).sort().pop();
  const spGap = lastSp ? daysBetween(lastSp.slice(0, 10), today()) : null;
  if (spGap === null) notes.push(["warn", "Belum ada rekaman speaking. Speaking hanya naik kalau kamu <b>bicara & mendengar ulang dirimu</b>. <a href='#/speaking/free'>Rekam 1 menit sekarang</a>."]);
  else if (spGap >= 3) notes.push(["warn", `Sudah <b>${spGap} hari</b> tanpa latihan speaking. Rekam 2 menit hari ini — sedikit tapi rutin.`]);
  const lastBench = st.scores.map((x) => x.date).sort().pop();
  if (set.start && (!lastBench || daysBetween(lastBench, today()) > 30)) notes.push(["cp", "Sudah lebih dari 30 hari sejak tes terakhir. Waktunya <b>checkpoint</b>: EF SET + Mock speaking, catat di <a href='#/progress'>Progress</a>."]);
  if (set.testDate) {
    const daysLeft = daysBetween(today(), set.testDate);
    const need = weeksRemainingToIELTS() * 7;
    if (daysLeft > 0 && need > daysLeft) notes.push(["warn", `Tes IELTS ${daysLeft} hari lagi, tapi roadmap butuh ±${need} hari lagi. Pertimbangkan menambah menit belajar, melewati minggu yang sudah kamu kuasai, atau memundurkan tanggal tes.`]);
    else if (daysLeft > 0) notes.push(["ok", `Tes IELTS ${daysLeft} hari lagi — kamu on track (sisa roadmap ±${need} hari).`]);
  }
  const sp = st.speaking.filter((x) => x.metrics && x.metrics.words > 30).slice(-3);
  if (sp.length) {
    const m = sp[sp.length - 1].metrics;
    if (m.wpm < 90) notes.push(["tip", `Kecepatan bicaramu ${m.wpm} kata/menit (natural ±120–150). Latih <b>shadowing</b> & ulangi topik yang sama 3× — tiap kali lebih cepat (teknik 4-3-2).`]);
    if (m.pausesPerMin > 3) notes.push(["tip", `Jeda panjang ${m.pausesPerMin}×/menit. Siapkan “chunk” pengisi alami: <i>“That's an interesting question…”, “Let me think…”, “What I mean is…”</i>.`]);
    if (m.mattr && m.mattr < 0.6) notes.push(["tip", "Kosakatamu banyak berulang. Sebelum bicara, tulis 5 kata topik yang lebih spesifik lalu paksa dirimu memakainya."]);
  }
  const rated = st.speaking.filter((x) => x.ratings && Object.values(x.ratings).every((v) => v)).slice(-3);
  if (rated.length) {
    const avg = {}; Object.keys(SPEAKING_RUBRIC).forEach((k) => (avg[k] = rated.reduce((a, x) => a + +x.ratings[k], 0) / rated.length));
    const weakest = Object.entries(avg).sort((a, b) => a[1] - b[1])[0];
    const TIPS = { fc: "latihan 4-3-2 dan linking words", lr: "collocation & parafrase topik IELTS", gra: "1 struktur kompleks baru per minggu, pakai saat bicara", p: "read-aloud + shadowing + word stress (YouGlish)" };
    notes.push(["tip", `Kriteria speaking terlemah (3 sesi terakhir): <b>${SPEAKING_RUBRIC[weakest[0]].name}</b> (${weakest[1].toFixed(1)}). Fokus: ${TIPS[weakest[0]]}.`]);
  }
  if (!notes.length) notes.push(["ok", "Semua berjalan baik. Konsisten adalah kuncinya — lanjutkan rencana hari ini."]);
  return notes;
}

// ---------- views
const VIEWS = {};

VIEWS.coach = () => {
  const st = S(), cw = currentWeek(), plan = dayPlan(cw), t = today();
  const done = st.daily[t] || {};
  const doneCount = plan.filter((_, i) => done[i]).length;
  const lo = latestOverall();
  const weekNo = cw.p.weeks.length > 1 ? `Minggu ${cw.wi + 1}/${cw.p.weeks.length}` : "";
  const totalW = ALL_WEEKS.filter((x) => x.pi <= 4).length, doneW = ALL_WEEKS.filter((x) => x.pi <= 4 && st.weeks[x.key]).length;
  return `
  <section class="hero-card">
    <div>
      <p class="eyebrow">${esc(cw.p.name)} · ${esc(cw.p.level)} ${cw.cycle ? "· siklus " + cw.cycle : ""}</p>
      <h1>${st.settings.name ? "Hi " + esc(st.settings.name) + "! " : ""}${weekNo || esc(cw.w.title || "")}</h1>
      <p class="muted">${cw.w.g ? "Fokus: <b>" + esc(cw.w.g) + "</b> · Speaking: “" + esc(cw.w.s) + "”" : esc(cw.p.goal)}</p>
    </div>
    <a class="btn" href="#/roadmap">Lihat roadmap</a>
  </section>
  <div class="stats">
    <div class="stat"><span>🔥 Streak</span><b>${streak()} hari</b></div>
    <div class="stat"><span>🧭 Roadmap</span><b>${doneW}/${totalW} minggu</b></div>
    <div class="stat"><span>🗣️ Sesi speaking</span><b>${st.speaking.length}</b></div>
    <div class="stat"><span>🎯 Skor terakhir / target</span><b>${lo ? lo.overall : "—"} / ${st.settings.band}</b></div>
  </div>
  <section class="card">
    <div class="row between"><h2>📅 Rencana hari ini</h2><span class="pill">${doneCount}/${plan.length} selesai</span></div>
    <ul class="tasks">${plan.map((b, i) => `
      <li class="${done[i] ? "done" : ""}">
        <label><input type="checkbox" data-day="${i}" ${done[i] ? "checked" : ""}>
        <span class="ic">${SKILL_ICON[b.skill] || "•"}</span>
        <span>${b.min ? `<span class="min">${b.min} mnt</span> ` : ""}${b.text}</span></label>
        ${b.links ? `<div class="links">${b.links}</div>` : ""}
      </li>`).join("")}</ul>
  </section>
  <section class="card">
    <h2>🧑‍🏫 Catatan coach</h2>
    <ul class="notes">${coachNotes().map(([k, n]) => `<li class="note-${k}">${n}</li>`).join("")}</ul>
  </section>
  <section class="card">
    <h2>📌 Target minggu ini</h2>
    <ul class="tasks">${weekTasks(cw.p, cw.w).map((t) => `<li><div><span class="ic">${SKILL_ICON[t.skill] || "•"}</span> ${t.text}</div><div class="links">${t.links}</div></li>`).join("")}</ul>
    <div class="row"><button class="btn" data-week-done="${cw.key}">✔ Tandai minggu ini selesai</button></div>
  </section>`;
};
VIEWS.coach.bind = (root) => {
  root.addEventListener("change", (e) => {
    const i = e.target.dataset.day; if (i == null) return;
    update((s) => { (s.daily[today()] = s.daily[today()] || {})[i] = e.target.checked; });
    render();
  });
  root.addEventListener("click", (e) => {
    const k = e.target.dataset.weekDone; if (!k) return;
    if (confirm("Tandai minggu ini selesai dan lanjut ke minggu berikutnya?")) { update((s) => (s.weeks[k] = "done")); render(); window.scrollTo(0, 0); }
  });
};

VIEWS.roadmap = () => {
  const st = S(), cw = currentWeek();
  return `
  <h1>🗺️ Roadmap</h1>
  <p class="muted">Estimasi total ±57 minggu dari A1 sampai siap IELTS dengan ±80 menit/hari. Cambridge memperkirakan ±200 jam belajar terbimbing per level CEFR — patokan, bukan janji. Kalau tes awalmu sudah B1/B2, tandai fase sebelumnya “lewati”.</p>
  <table class="map"><thead><tr><th>CEFR</th><th>EF SET</th><th>Perkiraan IELTS</th></tr></thead><tbody>
    <tr><td>A2</td><td>31–40</td><td>3.5–4.0</td></tr><tr><td>B1</td><td>41–50</td><td>4.0–5.0</td></tr>
    <tr><td>B2</td><td>51–60</td><td>5.5–6.5</td></tr><tr><td>C1</td><td>61–70</td><td>7.0–8.0</td></tr></tbody></table>
  <p class="small muted">Pemetaan CEFR ↔ IELTS bersifat perkiraan (lihat ielts.org). Skala EF SET dari efset.org.</p>
  ${PHASES.map((p) => {
    const n = p.weeks.length, d = p.weeks.filter((_, i) => st.weeks[`${p.id}-${i}`]).length;
    const open = cw.p.id === p.id;
    return `<details class="card phase" ${open ? "open" : ""}>
      <summary><div class="row between"><b>${esc(p.name)}</b><span class="pill">${p.repeat ? "berulang" : d + "/" + n}</span></div>
        <span class="small muted">${esc(p.level)} · IELTS ${esc(p.ielts)} · ${n} minggu${p.repeat ? " per siklus" : ""}</span>
        <div class="bar"><div style="width:${p.repeat ? 0 : (d / n) * 100}%"></div></div></summary>
      <p><b>Tujuan:</b> ${esc(p.goal)}</p>
      <p class="milestone"><b>Syarat lulus fase:</b> ${esc(p.exit)}</p>
      <div class="row wrap">${p.repeat ? "" : `<button class="btn ghost sm" data-skip-phase="${p.id}">Lewati fase ini (sudah kuasai)</button>`}</div>
      <ol class="weeks">${p.weeks.map((w, i) => {
        const key = `${p.id}-${i}`, stt = st.weeks[key];
        return `<li class="${stt ? "is-" + stt : ""} ${cw.key === key ? "current" : ""}">
          <details><summary><span class="row between"><span><b>${w.title || "Minggu " + (i + 1)}</b>${w.cp ? ' <span class="pill cp">checkpoint</span>' : ""} ${w.g ? "· " + esc(w.g) : ""}</span>
            <span class="pill">${stt === "done" ? "✔ selesai" : stt === "skip" ? "dilewati" : cw.key === key ? "sekarang" : ""}</span></span></summary>
            <ul class="tasks">${weekTasks(p, w).map((t) => `<li><div><span class="ic">${SKILL_ICON[t.skill] || "•"}</span> ${t.text}</div><div class="links">${t.links}</div></li>`).join("")}</ul>
            <div class="row"><button class="btn sm" data-week="${key}" data-val="done">✔ Selesai</button>
            <button class="btn ghost sm" data-week="${key}" data-val="">Reset</button></div>
          </details></li>`;
      }).join("")}</ol>
    </details>`;
  }).join("")}`;
};
VIEWS.roadmap.bind = (root) => root.addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  if (b.dataset.week) { update((s) => { if (b.dataset.val) s.weeks[b.dataset.week] = b.dataset.val; else delete s.weeks[b.dataset.week]; }); render(); }
  if (b.dataset.skipPhase) {
    const p = PHASES.find((x) => x.id === b.dataset.skipPhase);
    if (confirm(`Tandai semua minggu ${p.name} sebagai dilewati?`)) { update((s) => p.weeks.forEach((_, i) => { if (!s.weeks[`${p.id}-${i}`]) s.weeks[`${p.id}-${i}`] = "skip"; })); render(); }
  }
});

// ---------- Speaking Lab
const SPEAK_TABS = [["mock", "Mock IELTS"], ["free", "Topik bebas"], ["read", "Read-aloud"], ["history", "Riwayat"], ["guide", "Cara menilai speaking"]];
let speakSession = null;

VIEWS.speaking = (sub = "mock", q = {}) => {
  const tabs = `<nav class="tabs">${SPEAK_TABS.map(([k, l]) => `<a href="#/speaking/${k}" class="${sub === k ? "active" : ""}">${l}</a>`).join("")}</nav>`;
  const warn = !canRecord ? `<p class="alert">Browser ini tidak mendukung rekaman. Pakai Chrome/Edge versi terbaru.</p>`
    : "";
  const howto = `<details class="card howto" ${S().speaking.length ? "" : "open"}><summary><b>❓ Cara pakai Speaking Lab</b></summary><ol class="small">
    <li>Pilih mode: <b>Mock IELTS</b> (latihan format tes), <b>Topik bebas</b> (latihan harian), atau <b>Read-aloud</b> (cek pengucapan).</li>
    <li>Klik <b>● Mulai rekam</b> → izinkan mikrofon → bicara. Di Mock, klik <b>Lanjut ›</b> untuk pindah Part (Part 2 ada 1 menit persiapan).</li>
    <li>Klik <b>■ Selesai</b>. Rekaman otomatis ditranskrip — kalau transkrip live kosong, platform menjalankan <b>Whisper di browser</b> (unduh model ±80 MB sekali saja, lalu tersimpan).</li>
    <li>Lihat metrik, dengarkan audionya, lalu <b>nilai 4 kriteria</b> dan tulis catatan error. Klik <b>💾 Simpan</b>.</li>
    <li>Lihat perkembangan di tab <b>Riwayat</b>. Penjelasan metode penilaian di tab <b>Cara menilai speaking</b>.</li></ol>
    <p class="small muted">Transkrip live (saat merekam) hanya ada di Chrome/Edge desktop & butuh internet. Whisper berjalan di semua browser modern.</p></details>`;
  let body = "";
  if (sub === "guide") body = speakingGuide();
  else if (sub === "history") body = speakingHistory();
  else body = `<div id="lab"></div>`;
  return `<h1>🗣️ Speaking Lab</h1>${tabs}${sub !== "guide" && sub !== "history" ? warn + howto : ""}${body}`;
};
VIEWS.speaking.bind = (root, sub = "mock", q = {}) => {
  if (sub === "history") return bindHistory(root);
  if (sub === "guide") return;
  const lab = $("#lab", root);
  if (sub === "mock") setupMock(lab);
  if (sub === "free") setupFree(lab, q.topic);
  if (sub === "read") setupRead(lab);
};

function setupMock(lab) {
  const p1 = pick(PART1), p2 = pick(PART2);
  const steps = [
    { label: "Part 1 · Interview (4–5 menit)", html: `<p class="muted">Topik: <b>${esc(p1.topic)}</b>. Jawab tiap pertanyaan 2–4 kalimat: jawaban + alasan + contoh.</p><ol>${p1.q.map((x) => `<li>${esc(x)}</li>`).join("")}</ol>` },
    { label: "Part 2 · Persiapan (1 menit)", prep: 60, html: cueCard(p2) + `<p class="muted">Rekaman tetap jalan tapi waktu ini <b>tidak dihitung</b>. Buat catatan kata kunci.</p>` },
    { label: "Part 2 · Bicara (1–2 menit)", talk: 120, html: cueCard(p2) + `<p class="muted">Usahakan bicara penuh sampai 2 menit.</p>` },
    { label: "Part 3 · Discussion (4–5 menit)", html: `<p class="muted">Jawab lebih panjang & abstrak: opini → alasan → contoh → sisi lain.</p><ol>${p2.part3.map((x) => `<li>${esc(x)}</li>`).join("")}</ol>` }
  ];
  runLab(lab, { mode: "mock", title: `Mock: ${p1.topic} / ${p2.card}`, steps, reroll: () => setupMock(lab) });
}
const cueCard = (c) => `<div class="cue"><b>${esc(c.card)}</b><p>You should say:</p><ul>${c.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul></div>`;

function setupFree(lab, topic) {
  const cw = currentWeek();
  topic = topic || cw.w.s || pick(PART2).card;
  lab.innerHTML = `<div class="card"><label>Topik (boleh diganti)<input id="topic" value="${esc(topic)}"></label>
    <p class="small muted">Teknik <b>4-3-2</b>: bicara topik yang sama 3× berturut-turut — 4 menit, lalu 3 menit, lalu 2 menit. Fluency naik cepat.</p>
    <div class="row wrap"><button class="btn ghost sm" id="rand">🎲 Topik acak</button></div></div><div id="lab2"></div>`;
  const go = () => runLab($("#lab2", lab), { mode: "free", title: $("#topic", lab).value, steps: [{ label: "Bicara 1–4 menit", html: `<p class="big">“${esc($("#topic", lab).value)}”</p>` }] });
  $("#rand", lab).onclick = () => { $("#topic", lab).value = pick([...PART2.map((x) => x.card), ...PART1.flatMap((x) => x.q)]); go(); };
  $("#topic", lab).onchange = go;
  go();
}

function setupRead(lab) {
  lab.innerHTML = `<div class="card"><label>Pilih level teks <select id="lvl">${["A2", "B1", "B2", "C1"].map((l) => `<option>${l}</option>`).join("")}</select></label>
  <p class="small muted">Baca keras-keras dengan jelas & natural. Mesin speech-recognition mengecek kata mana yang <b>tidak terdengar jelas</b>. Ini proxy kejelasan pengucapan, bukan penilaian aksen.</p></div><div id="lab2"></div>`;
  const go = () => {
    const lv = $("#lvl", lab).value, t = pick(READ_ALOUD.filter((x) => x.level === lv));
    runLab($("#lab2", lab), { mode: "read", title: `Read-aloud ${lv}`, target: t.text, steps: [{ label: "Baca teks ini", html: `<p class="big read">${esc(t.text)}</p>` }], reroll: go });
  };
  $("#lvl", lab).onchange = go;
  go();
}

function runLab(el, cfg) {
  let step = 0, t0 = 0, timer = null, prepLeft = 0;
  const draw = () => {
    const s = cfg.steps[step];
    el.innerHTML = `<div class="card lab">
      <div class="row between"><b>${esc(s.label)}</b><span class="pill">${step + 1}/${cfg.steps.length}</span></div>
      <div class="prompt">${s.html}</div>
      <div class="rec-bar"><div class="meter"><div id="lvlbar"></div></div><span id="clock" class="clock">00:00</span></div>
      <div class="row wrap">
        <button class="btn rec" id="start">● Mulai rekam</button>
        <button class="btn" id="next" hidden>Lanjut ›</button>
        <button class="btn danger" id="stop" hidden>■ Selesai</button>
        ${cfg.reroll ? `<button class="btn ghost sm" id="reroll">🎲 Ganti soal</button>` : ""}
      </div>
      <div class="live"><span class="small muted">Transkrip live: <b id="srst">${canTranscribe ? "menunggu rekaman" : "tidak didukung browser ini → Whisper akan dipakai setelah selesai"}</b></span><p id="live">…</p></div>
    </div>`;
  };
  draw();
  const updateStepUI = () => {
    const s = cfg.steps[step];
    $(".prompt", el).innerHTML = s.html;
    $(".lab .row b", el).textContent = s.label;
    $(".lab .pill", el).textContent = `${step + 1}/${cfg.steps.length}`;
    $("#next", el).hidden = step >= cfg.steps.length - 1;
    if (s.prep && speakSession) { speakSession.pause(true); prepLeft = s.prep; } else if (speakSession) speakSession.pause(false);
  };
  el.onclick = async (e) => {
    const id = e.target.id;
    if (id === "reroll") cfg.reroll();
    if (id === "start") {
      try {
        speakSession = new Session({ lang: S().settings.lang, onTranscript: (t) => { const l = $("#live", el); if (l) l.textContent = t.slice(-400); }, onLevel: (v) => { const b = $("#lvlbar", el); if (b) b.style.width = v * 100 + "%"; },
          onStatus: (st, err) => { const x = $("#srst", el); if (x) x.textContent = st === "on" ? "aktif ✔" : st === "error" ? `error (${err}) → Whisper akan dipakai setelah selesai` : "tidak tersedia → Whisper akan dipakai setelah selesai"; } });
        await speakSession.start();
      } catch (err) { alert("Mikrofon tidak bisa diakses: " + err.message); speakSession = null; return; }
      $("#start", el).hidden = true; $("#stop", el).hidden = false; $("#next", el).hidden = cfg.steps.length < 2;
      const rr = $("#reroll", el); if (rr) rr.hidden = true;
      t0 = Date.now(); updateStepUI();
      const srst = $("#srst", el);
      if (srst && canTranscribe) { srst.textContent = "menghubungkan…"; setTimeout(() => { if (srst.isConnected && srst.textContent === "menghubungkan…") srst.textContent = "tidak merespons → Whisper akan dipakai setelah selesai"; }, 5000); }
      timer = setInterval(() => {
        const c = $("#clock", el); if (!c) return clearInterval(timer);
        if (prepLeft > 0) {
          prepLeft--; c.textContent = `Persiapan ${prepLeft}s`; c.classList.add("prep");
          if (prepLeft === 0) { c.classList.remove("prep"); step++; updateStepUI(); }
          return;
        }
        const sec = Math.round(speakSession.activeMs / 1000);
        c.textContent = String(Math.floor(sec / 60)).padStart(2, "0") + ":" + String(sec % 60).padStart(2, "0");
      }, 1000);
    }
    if (id === "next") { prepLeft = 0; $("#clock", el).classList.remove("prep"); step++; updateStepUI(); }
    if (id === "stop") {
      clearInterval(timer);
      const r = await speakSession.stop(); speakSession = null;
      showResult(el, cfg, r);
    }
  };
}

function ratingForm(prefix, rubric, values = {}) {
  return Object.entries(rubric).map(([k, c]) => `
    <div class="rate"><label>${esc(c.name)}
      <select data-rate="${k}"><option value="">—</option>${[3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9].map((v) => `<option ${+values[k] === v ? "selected" : ""}>${v}</option>`).join("")}</select></label>
      <details><summary class="small">Lihat deskripsi band</summary><ul class="small">${Object.entries(c.levels).map(([b, d]) => `<li><b>${b}</b> — ${esc(d)}</li>`).join("")}</ul></details>
    </div>`).join("");
}

function showResult(el, cfg, r) {
  const url = URL.createObjectURL(r.blob);
  el.innerHTML = `<div class="card">
    <h2>Hasil sesi</h2>
    <audio controls src="${url}"></audio>
    <p class="small muted">Dengarkan ulang sekarang <b>dan</b> besok (telinga lebih objektif setelah jeda). ${r.srError ? "Catatan transkrip: " + esc(r.srError) : ""}</p>
    <label>Transkrip (bisa diedit)
      <textarea id="tr" rows="5" placeholder="Transkrip akan muncul di sini…">${esc(r.transcript)}</textarea></label>
    <p class="small" id="wst"></p>
    <div class="row wrap"><button class="btn ghost sm" id="whisper">🎙️ Transkrip ulang dengan Whisper</button><button class="btn ghost sm" id="recalc">↻ Hitung ulang metrik</button></div>
    <div id="met"></div>
    <h3>Nilai dirimu (pakai band descriptors)</h3>
    <p class="small muted">Rujukan resmi: ${resLink("spkbd")} Ringkasan di bawah adalah parafrase sederhana.</p>
    <div class="rates">${ratingForm("s", SPEAKING_RUBRIC)}</div>
    <p>Overall (self): <b id="ov">—</b></p>
    <label>Catatan: error yang kamu dengar / kata yang dicari-cari<textarea id="notes" rows="3" placeholder="mis. salah 'he don't', lupa kata 'commute', jeda lama di Part 3"></textarea></label>
    <div class="row wrap"><button class="btn" id="save">💾 Simpan sesi</button><a class="btn ghost" href="${url}" download="speaking-${today()}.webm">⬇ Download audio</a><button class="btn ghost" id="discard">Buang</button></div>
  </div>`;
  let m;
  const calc = () => {
    const tr = $("#tr", el).value;
    m = metrics({ transcript: tr, seconds: r.seconds, pauses: r.pauses, confidence: r.confidence });
    const ind = indicative(m);
    let ra = "";
    if (cfg.target) {
      const s = readAloudScore(cfg.target, tr);
      m.accuracy = s.accuracy;
      ra = `<div class="card inset"><b>Kejelasan read-aloud: ${s.accuracy}%</b><p class="read">${s.words.map((w, i) => `<span class="${s.hit[i] ? "ok" : "miss"}">${esc(w)}</span>`).join(" ")}</p>
      <p class="small muted">Kata merah = tidak dikenali mesin. Cek pengucapannya di ${resLink("camdict")}${resLink("youglish")}</p></div>`;
    }
    if (!m.words) { $("#met", el).innerHTML = `<p class="alert">Belum ada transkrip, jadi metrik belum bisa dihitung. Tunggu Whisper selesai, atau ketik transkrip lalu klik “Hitung ulang”.</p>`; return; }
    $("#met", el).innerHTML = `<div class="metrics">
      ${mt("Durasi bicara", m.seconds + " dtk")}${mt("Jumlah kata", m.words)}
      ${mt("Kecepatan", m.wpm + " kata/mnt", "Natural ±120–150. <90 terasa lambat.")}
      ${mt("Jeda ≥1.5 dtk", m.pauses + " (" + m.pausesPerMin + "/mnt)", "Target < 2/mnt. Terpanjang " + m.longestPause + " dtk.")}
      ${mt("Filler", m.fillers + " (" + m.fillersPerMin + "/mnt)", Object.keys(m.fillerList).length ? Object.entries(m.fillerList).map(([k, v]) => k + "×" + v).join(", ") : "Transkrip otomatis sering membuang 'um/uh' — dengar audionya.")}
      ${mt("Keragaman kata (MATTR)", m.mattr, "0.55 rendah · 0.65 baik · 0.72+ sangat beragam")}
      ${mt("Kata panjang (≥7 huruf)", m.longWordPct + "%", "Proxy kata kurang umum")}
      ${m.confidence != null ? mt("Keyakinan mesin", Math.round(m.confidence * 100) + "%", "Proxy kejelasan ucapan") : ""}
    </div>
    ${ind ? `<p class="small">Indikasi otomatis (BUKAN skor resmi): Fluency ≈ <b>${ind.fc}</b>, Lexical ≈ <b>${ind.lr}</b>. Grammar & Pronunciation harus dinilai telinga (kamu/partner).</p>` : ""}${ra}`;
  };
  const mt = (k, v, hint = "") => `<div class="metric"><span>${k}</span><b>${v}</b>${hint ? `<small>${hint}</small>` : ""}</div>`;
  calc();
  let busy = false;
  const runWhisper = async () => {
    if (busy) return; busy = true;
    const st = $("#wst", el), btn = $("#whisper", el); btn.disabled = true;
    try {
      const text = await whisperTranscribe(r.blob, { model: S().settings.whisper, onProgress: (k, pct, mb) => {
        st.textContent = k === "download" ? `⬇ Mengunduh model Whisper (${mb} MB, hanya sekali)… ${pct}%` : k === "decode" ? "🔊 Membaca audio…" : "✍️ Mentranskrip… (bisa 10–60 detik)";
      } });
      if (!$("#tr", el)) return;
      $("#tr", el).value = text;
      st.textContent = text ? "✔ Transkrip Whisper selesai. Periksa & koreksi bila perlu." : "Whisper tidak menemukan ucapan. Pastikan mikrofon benar & suara terdengar di audio.";
      calc();
    } catch (err) {
      st.textContent = "Whisper gagal: " + err.message + ". Kamu bisa mengetik transkrip manual lalu klik Hitung ulang.";
    } finally { busy = false; btn.disabled = false; }
  };
  if (!r.transcript) runWhisper();
  const ratings = () => Object.fromEntries($$("[data-rate]", el).map((s) => [s.dataset.rate, s.value ? +s.value : null]));
  const ovr = () => { const v = Object.values(ratings()); return v.every((x) => x) ? ieltsRound(v.reduce((a, b) => a + b, 0) / v.length) : null; };
  el.onchange = (e) => { if (e.target.dataset.rate) $("#ov", el).textContent = ovr() ?? "—"; };
  el.onclick = async (e) => {
    if (e.target.id === "recalc") calc();
    if (e.target.id === "whisper") runWhisper();
    if (e.target.id === "discard" && confirm("Buang rekaman ini?")) render();
    if (e.target.id === "save") {
      calc();
      const id = uid();
      await audioPut(id, r.blob);
      update((s) => s.speaking.push({ id, date: new Date().toISOString(), mode: cfg.mode, title: cfg.title, transcript: $("#tr", el).value, metrics: m, ratings: ratings(), overall: ovr(), notes: $("#notes", el).value }));
      location.hash = "#/speaking/history";
    }
  };
}

function speakingHistory() {
  const sp = S().speaking.slice().reverse();
  if (!sp.length) return `<div class="card"><p>Belum ada sesi. <a href="#/speaking/mock">Mulai Mock IELTS</a> atau <a href="#/speaking/free">topik bebas</a>.</p></div>`;
  const asc = S().speaking.slice();
  return `<div class="card"><h2>Tren</h2>
    ${lineChart([
      { name: "Self-rating overall", color: "var(--c1)", pts: asc.filter((x) => x.overall).map((x) => [x.date, x.overall]) }
    ], { min: 3, max: 9, target: +S().settings.band })}
    ${lineChart([{ name: "Kata/menit", color: "var(--c2)", pts: asc.filter((x) => x.metrics?.words).map((x) => [x.date, x.metrics.wpm]) }], { min: 40, max: 180, target: 120, targetLabel: "120 wpm" })}
  </div>
  ${sp.map((x) => `<details class="card hist"><summary><div class="row between"><span><b>${fmtDate(x.date)}</b> · ${esc(x.mode)} · ${esc(x.title).slice(0, 70)}</span><span class="pill">${x.overall ?? "—"}</span></div>
    <span class="small muted">${x.metrics ? `${x.metrics.wpm} wpm · ${x.metrics.pauses} jeda · MATTR ${x.metrics.mattr}${x.metrics.accuracy != null ? " · read-aloud " + x.metrics.accuracy + "%" : ""}` : ""}</span></summary>
    <div class="row wrap"><button class="btn sm" data-play="${x.id}">▶ Putar audio</button>${!x.metrics?.words ? `<button class="btn ghost sm" data-retr="${x.id}">🎙️ Transkrip dengan Whisper</button>` : ""}<button class="btn ghost sm" data-del="${x.id}">Hapus</button></div><div id="a-${x.id}"></div>
    ${x.ratings ? `<p class="small">${Object.entries(x.ratings).map(([k, v]) => `${SPEAKING_RUBRIC[k].name}: <b>${v ?? "—"}</b>`).join(" · ")}</p>` : ""}
    ${x.notes ? `<p class="small"><b>Catatan:</b> ${esc(x.notes)}</p>` : ""}
    <p class="small muted">${esc(x.transcript)}</p></details>`).join("")}`;
}
function bindHistory(root) {
  root.onclick = async (e) => {
    const p = e.target.dataset.play, d = e.target.dataset.del;
    if (p) { const b = await audioGet(p); $("#a-" + p, root).innerHTML = b ? `<audio controls autoplay src="${URL.createObjectURL(b)}"></audio>` : `<p class="small muted">Audio tidak ada di browser ini.</p>`; }
    const rt = e.target.dataset.retr;
    if (rt) {
      const blob = await audioGet(rt), box = $("#a-" + rt, root);
      if (!blob) { box.innerHTML = `<p class="small muted">Audio tidak ada di browser ini.</p>`; return; }
      e.target.disabled = true;
      try {
        const text = await whisperTranscribe(blob, { model: S().settings.whisper, onProgress: (k, pct, mb) => (box.innerHTML = `<p class="small">${k === "download" ? `⬇ Mengunduh model (${mb} MB, sekali saja)… ${pct}%` : "✍️ Mentranskrip…"}</p>`) });
        update((s) => { const x = s.speaking.find((y) => y.id === rt); const old = x.metrics || {}; x.transcript = text; x.metrics = { ...metrics({ transcript: text, seconds: old.seconds || 0, pauses: new Array(old.pauses || 0).fill(0) }), longestPause: old.longestPause || 0 }; });
        render();
      } catch (err) { box.innerHTML = `<p class="small">Whisper gagal: ${esc(err.message)}</p>`; e.target.disabled = false; }
    }
    if (d && confirm("Hapus sesi ini?")) { await audioDel(d); update((s) => (s.speaking = s.speaking.filter((x) => x.id !== d))); render(); }
  };
}

function speakingGuide() {
  return `<div class="card prose">
  <h2>Bagaimana cara menguji speaking sendiri?</h2>
  <p>Speaking tidak bisa diuji dengan pilihan ganda. Jadi platform ini memakai <b>4 lapisan penilaian</b>, dari yang otomatis sampai yang resmi. Makin tinggi lapisannya, makin akurat (dan makin mahal).</p>
  <h3>Lapisan 1 · Metrik otomatis (setiap sesi, gratis)</h3>
  <ul>
    <li><b>Kecepatan (kata/menit)</b> dan <b>jeda ≥1.5 detik</b> → indikator <i>Fluency</i>. Speaker band 7 umumnya bicara lancar tanpa jeda panjang mencari kata.</li>
    <li><b>Filler</b> (um, uh, you know, like) → kebiasaan yang mengganggu fluency.</li>
    <li><b>MATTR</b> (keragaman kata) & % kata panjang → indikator <i>Lexical Resource</i>.</li>
    <li><b>Read-aloud accuracy</b> → apakah mesin bisa memahami ucapanmu: proxy <i>intelligibility</i> (Pronunciation).</li>
  </ul>
  <p class="small muted">Metrik ini bagus untuk melihat <b>tren</b>, bukan skor. Grammar & kualitas ide tidak bisa diukur mesin sederhana.</p>
  <h3>Lapisan 2 · Self-assessment dengan rubrik resmi (setiap minggu)</h3>
  <ol>
    <li>Rekam Mock IELTS (Part 1–3) setiap Sabtu — format sama agar bisa dibandingkan.</li>
    <li>Besoknya, dengarkan ulang sambil membaca transkrip. Tandai: error grammar, kata yang diulang, jeda, salah ucap.</li>
    <li>Beri nilai 4 kriteria (Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, Pronunciation) memakai ${resLink("spkbd")}.</li>
    <li>Overall = rata-rata 4 kriteria, dibulatkan ke 0.5 terdekat (sama seperti IELTS).</li>
    <li>Pilih <b>1 kriteria terlemah</b> sebagai fokus minggu depan — coach akan mengingatkan.</li>
  </ol>
  <p class="small muted">Tips jujur: pemula cenderung memberi nilai terlalu tinggi ±0.5–1 band. Kalau ragu di antara dua band, pilih yang lebih rendah.</p>
  <h3>Lapisan 3 · Penilai manusia (minimal sebulan sekali)</h3>
  <ul>
    <li>Speaking partner / language exchange / teman yang skor IELTS-nya sudah tinggi: kirim rekaman Mock + minta mereka menilai dengan rubrik yang sama.</li>
    <li>Bandingkan nilai mereka dengan self-rating-mu → kamu belajar mengkalibrasi telingamu.</li>
    <li>Opsional berbayar: mock speaking dengan tutor/examiner (IDP & British Council punya layanan persiapan).</li>
  </ul>
  <h3>Lapisan 4 · Tes resmi</h3>
  <p>Skor IELTS asli adalah kalibrasi akhir. Catat di <a href="#/progress">Progress</a> dan bandingkan dengan self-rating terakhirmu.</p>
  <h3>Alat open-source pendukung</h3>
  <ul>
    <li>${resLink("whisper")} transkrip rekaman lebih akurat & offline (menangkap filler lebih baik). Tempel hasilnya di kolom transkrip, lalu “Hitung ulang”.</li>
    <li>${resLink("praat")} lihat intonasi & pitch (lanjutan).</li>
    <li>${resLink("cv")} latihan read-aloud tambahan.</li>
  </ul>
  <h3>Latihan yang terbukti menaikkan speaking</h3>
  <ul>
    <li><b>4-3-2</b>: topik sama, 4 → 3 → 2 menit. Melatih kecepatan tanpa menurunkan isi.</li>
    <li><b>Shadowing</b>: tiru audio native kalimat per kalimat (intonasi, stress, linking).</li>
    <li><b>Record–listen–redo</b>: rekam, dengar, perbaiki 3 hal, rekam ulang.</li>
    <li><b>Chunk bank</b>: kumpulkan frasa siap pakai (<i>“It depends on…”, “On the other hand…”, “A good example of this is…”</i>).</li>
  </ul>
  <p class="small muted">Privasi: audio disimpan di browser kamu (IndexedDB). Transkrip live di Chrome diproses oleh layanan speech recognition browser (Google). Gunakan Whisper jika ingin sepenuhnya offline.</p>
  </div>`;
}

// ---------- Writing Lab
const WRITING_RUBRIC = {
  tr: { name: "Task Response / Achievement", levels: { 5: "Menjawab sebagian; ide kurang berkembang.", 6: "Menjawab semua bagian; beberapa ide kurang didukung.", 7: "Posisi jelas sepanjang esai; ide utama berkembang & didukung.", 8: "Menjawab penuh; ide sangat berkembang & relevan." } },
  cc: { name: "Coherence & Cohesion", levels: { 5: "Ada struktur tapi paragraf/penghubung lemah.", 6: "Runtut; penghubung efektif tapi kadang mekanis.", 7: "Progresi jelas; penghubung beragam; tiap paragraf punya ide sentral.", 8: "Urutan logis; cohesion terkelola baik." } },
  lr: { name: "Lexical Resource", levels: { 5: "Terbatas; error ejaan/pilihan kata sering.", 6: "Memadai; ada usaha kata kurang umum, ada error.", 7: "Fleksibel; collocation & kata kurang umum; error sesekali.", 8: "Luas & tepat; error jarang." } },
  gra: { name: "Grammatical Range & Accuracy", levels: { 5: "Kalimat kompleks terbatas & sering salah.", 6: "Campuran sederhana & kompleks; error tidak mengganggu.", 7: "Banyak kalimat kompleks; sering bebas error.", 8: "Struktur beragam; mayoritas tanpa error." } }
};
VIEWS.writing = () => `
  <h1>✍️ Writing Lab</h1>
  <div class="card">
    <div class="row wrap"><label>Tipe <select id="wtype"><option value="">Acak</option>${[...new Set(WRITING_PROMPTS.map((p) => p.type))].map((t) => `<option>${t}</option>`).join("")}</select></label>
    <button class="btn ghost sm" id="newp">🎲 Soal baru</button></div>
    <div id="prompt" class="prompt"></div>
    <p class="small muted">Academic Task 1 (grafik) pakai soal resmi di ${resLink("bcfree")}. Untuk soal custom, ketik di kolom soal.</p>
    <label>Soal<textarea id="q" rows="2"></textarea></label>
    <div class="row between"><span class="clock" id="wclock">--:--</span><button class="btn sm" id="wtimer">⏱ Mulai timer</button></div>
    <textarea id="essay" rows="14" placeholder="Tulis di sini…"></textarea>
    <p class="small"><b id="wc">0</b> kata · target <b id="wt">250</b></p>
    <h3>Checklist sebelum submit</h3>
    <ul class="checks">${WRITING_CHECK.map((c) => `<li><label><input type="checkbox"> ${esc(c)}</label></li>`).join("")}</ul>
    <h3>Feedback eksternal (gratis)</h3>
    <div class="links">${resLink("wi")}${resLink("lt")}<button class="btn ghost sm" id="copy">📋 Copy teks</button></div>
    <h3>Nilai (setelah dapat feedback)</h3>
    <div class="rates">${ratingForm("w", WRITING_RUBRIC)}</div>
    <label>Level CEFR dari Write & Improve (opsional)<input id="cefr" placeholder="mis. B1 high"></label>
    <div class="row"><button class="btn" id="wsave">💾 Simpan</button></div>
  </div>
  <h2>Riwayat tulisan</h2>
  ${S().writing.slice().reverse().map((x) => `<details class="card hist"><summary><div class="row between"><span><b>${fmtDate(x.date)}</b> · ${esc(x.q).slice(0, 80)}…</span><span class="pill">${x.overall ?? x.cefr ?? "—"}</span></div><span class="small muted">${x.words} kata${x.cefr ? " · W&I " + esc(x.cefr) : ""}</span></summary><p class="pre">${esc(x.text)}</p><button class="btn ghost sm" data-wdel="${x.id}">Hapus</button></details>`).join("") || `<p class="muted">Belum ada tulisan.</p>`}
`;
VIEWS.writing.bind = (root) => {
  let timer = null, cur;
  const setPrompt = () => {
    const t = $("#wtype", root).value;
    cur = pick(WRITING_PROMPTS.filter((p) => !t || p.type === t));
    $("#prompt", root).innerHTML = `<span class="pill">${esc(cur.type)} · ${cur.min} mnt · min ${cur.words} kata</span>`;
    $("#q", root).value = cur.q; $("#wt", root).textContent = cur.words; $("#wclock", root).textContent = String(cur.min).padStart(2, "0") + ":00";
  };
  setPrompt();
  const count = () => ($("#wc", root).textContent = tokenize($("#essay", root).value).length);
  $("#essay", root).oninput = count;
  $("#wtype", root).onchange = setPrompt; $("#newp", root).onclick = setPrompt;
  $("#wtimer", root).onclick = () => {
    clearInterval(timer); let left = cur.min * 60;
    timer = setInterval(() => {
      const c = $("#wclock", root); if (!c) return clearInterval(timer);
      left--; c.textContent = String(Math.floor(Math.max(left, 0) / 60)).padStart(2, "0") + ":" + String(Math.max(left, 0) % 60).padStart(2, "0");
      if (left <= 0) { clearInterval(timer); c.classList.add("prep"); c.textContent = "Waktu habis!"; }
    }, 1000);
  };
  $("#copy", root).onclick = () => navigator.clipboard?.writeText($("#essay", root).value).then(() => ($("#copy", root).textContent = "✔ Tersalin"));
  $("#wsave", root).onclick = () => {
    const text = $("#essay", root).value.trim(); if (!text) return alert("Tulisan masih kosong.");
    const r = Object.fromEntries($$("[data-rate]", root).map((s) => [s.dataset.rate, s.value ? +s.value : null]));
    const v = Object.values(r);
    update((s) => s.writing.push({ id: uid(), date: new Date().toISOString(), q: $("#q", root).value, text, words: tokenize(text).length, ratings: r, overall: v.every((x) => x) ? ieltsRound(v.reduce((a, b) => a + b, 0) / v.length) : null, cefr: $("#cefr", root).value }));
    clearInterval(timer); render();
  };
  root.addEventListener("click", (e) => { const d = e.target.dataset.wdel; if (d && confirm("Hapus tulisan ini?")) { update((s) => (s.writing = s.writing.filter((x) => x.id !== d))); render(); } });
};

// ---------- Progress
const efCefr = (n) => (n <= 30 ? "A1" : n <= 40 ? "A2" : n <= 50 ? "B1" : n <= 60 ? "B2" : n <= 70 ? "C1" : "C2");
VIEWS.progress = () => {
  const st = S(), sc = st.scores.slice().sort((a, b) => a.date.localeCompare(b.date));
  return `<h1>📈 Progress</h1>
  <div class="card"><h2>Catat skor tes</h2>
    <div class="grid">
      <label>Jenis <select id="stype"><option value="efset">EF SET</option><option value="mock">Mock IELTS</option><option value="ielts">IELTS resmi</option><option value="other">Tes lain (catatan)</option></select></label>
      <label>Tanggal <input type="date" id="sdate" value="${today()}"></label>
    </div>
    <div id="sfields"></div>
    <div class="row"><button class="btn" id="ssave">+ Simpan skor</button></div>
  </div>
  <div class="card"><h2>Grafik</h2>
    <h3>IELTS (mock & resmi)</h3>
    ${lineChart([{ name: "Overall", color: "var(--c1)", pts: sc.filter((x) => x.type !== "efset" && x.overall).map((x) => [x.date, x.overall]) }], { min: 3, max: 9, target: +st.settings.band })}
    <h3>EF SET</h3>
    ${lineChart([{ name: "EF SET", color: "var(--c2)", pts: sc.filter((x) => x.type === "efset").map((x) => [x.date, x.ef]) }], { min: 0, max: 100, bands: [[31, "A2"], [41, "B1"], [51, "B2"], [61, "C1"], [71, "C2"]] })}
  </div>
  <div class="card"><h2>Riwayat</h2>
    <table class="map"><thead><tr><th>Tanggal</th><th>Jenis</th><th>Detail</th><th>Hasil</th><th></th></tr></thead><tbody>
    ${sc.slice().reverse().map((x) => `<tr><td>${fmtDate(x.date)}</td><td>${{ efset: "EF SET", mock: "Mock", ielts: "IELTS resmi", other: "Lain" }[x.type]}</td>
      <td class="small">${x.type === "efset" ? "Skor " + x.ef : x.type === "other" ? esc(x.note) : `L ${x.l} · R ${x.r} · W ${x.w} · S ${x.s}`}</td>
      <td><b>${x.type === "efset" ? x.cefr : x.overall ?? "—"}</b></td><td><button class="btn ghost sm" data-sdel="${x.id}">×</button></td></tr>`).join("") || `<tr><td colspan="5" class="muted">Belum ada skor.</td></tr>`}
    </tbody></table>
  </div>
  <div class="card"><h2>Ringkasan latihan</h2><div class="stats">
    <div class="stat"><span>Sesi speaking</span><b>${st.speaking.length}</b></div>
    <div class="stat"><span>Menit bicara direkam</span><b>${Math.round(st.speaking.reduce((a, x) => a + (x.metrics?.seconds || 0), 0) / 60)}</b></div>
    <div class="stat"><span>Tulisan</span><b>${st.writing.length}</b></div>
    <div class="stat"><span>Kata ditulis</span><b>${st.writing.reduce((a, x) => a + x.words, 0)}</b></div>
  </div></div>`;
};
VIEWS.progress.bind = (root) => {
  const fields = () => {
    const t = $("#stype", root).value;
    $("#sfields", root).innerHTML = t === "efset" ? `<label>Skor EF SET (0–100)<input type="number" id="ef" min="0" max="100"></label>`
      : t === "other" ? `<label>Catatan (mis. Cambridge test: B1)<input id="note"></label>`
      : `<div class="grid">${["l:Listening", "r:Reading", "w:Writing", "s:Speaking"].map((x) => { const [k, n] = x.split(":"); return `<label>${n}<input type="number" step="0.5" min="0" max="9" id="b${k}"></label>`; }).join("")}</div>`;
  };
  fields(); $("#stype", root).onchange = fields;
  $("#ssave", root).onclick = () => {
    const t = $("#stype", root).value, rec = { id: uid(), type: t, date: $("#sdate", root).value || today() };
    if (t === "efset") { const v = +$("#ef", root).value; if (!v) return alert("Isi skor."); rec.ef = v; rec.cefr = efCefr(v); }
    else if (t === "other") { rec.note = $("#note", root).value; }
    else {
      for (const k of ["l", "r", "w", "s"]) { const v = parseFloat($("#b" + k, root).value); if (isNaN(v)) return alert("Isi semua 4 skill."); rec[k] = v; }
      rec.overall = ieltsRound((rec.l + rec.r + rec.w + rec.s) / 4);
    }
    update((s) => s.scores.push(rec)); render();
  };
  root.addEventListener("click", (e) => { const d = e.target.dataset.sdel; if (d && confirm("Hapus skor?")) { update((s) => (s.scores = s.scores.filter((x) => x.id !== d))); render(); } });
};

// ---------- Library
const SKILLS = ["test", "grammar", "vocab", "listening", "reading", "speaking", "pronunciation", "writing", "ielts", "tools"];
let libFilter = { skill: "", tag: "", q: "" };
VIEWS.library = () => `
  <h1>📚 Library sumber</h1>
  <div class="card small">
    <b>Kriteria “valid & legit”:</b> sumber dari lembaga resmi (BBC, British Council, Cambridge, Oxford University Press, penyelenggara IELTS, universitas), konten berlisensi terbuka/domain publik, atau proyek open-source di GitHub. Situs pihak ketiga populer diberi label <span class="tag community">community</span>.
    Semua link dicek otomatis tiap minggu oleh GitHub Actions (<code>.github/workflows/links.yml</code>).
  </div>
  <div class="filters">
    <input id="lq" placeholder="Cari…" value="${esc(libFilter.q)}">
    <div class="chips">${["", ...SKILLS].map((s) => `<button class="chip ${libFilter.skill === s ? "on" : ""}" data-skill="${s}">${s ? SKILL_ICON[s] + " " + s : "Semua"}</button>`).join("")}</div>
    <div class="chips">${["", "official", "free", "open", "open-source", "community"].map((t) => `<button class="chip ${libFilter.tag === t ? "on" : ""}" data-tag="${t}">${t || "Semua label"}</button>`).join("")}</div>
  </div>
  <div class="lib">${RESOURCES.filter((r) => (!libFilter.skill || r.skill.includes(libFilter.skill)) && (!libFilter.tag || r.tag === libFilter.tag) && (!libFilter.q || (r.name + r.desc).toLowerCase().includes(libFilter.q.toLowerCase())))
    .map((r) => `<a class="res card" href="${r.url}" target="_blank" rel="noopener">
      <div class="row between"><b>${esc(r.name)}</b><span class="tag ${r.tag}">${r.tag}</span></div>
      <p class="small">${esc(r.desc)}</p>
      <span class="small muted">${r.skill.map((s) => SKILL_ICON[s]).join(" ")} · ${esc(r.level)} · ${new URL(r.url).hostname.replace("www.", "")}</span></a>`).join("")}</div>`;
VIEWS.library.bind = (root) => {
  root.onclick = (e) => {
    const b = e.target.closest(".chip"); if (!b) return;
    if (b.dataset.skill !== undefined) libFilter.skill = b.dataset.skill;
    if (b.dataset.tag !== undefined) libFilter.tag = b.dataset.tag;
    render();
  };
  $("#lq", root).oninput = (e) => { libFilter.q = e.target.value; const pos = e.target.selectionStart; render(); const i = $("#lq"); i.focus(); i.setSelectionRange(pos, pos); };
};

// ---------- Settings
VIEWS.settings = () => {
  const s = S().settings;
  return `<h1>⚙️ Pengaturan</h1>
  <div class="card"><div class="grid">
    <label>Nama panggilan<input id="name" value="${esc(s.name)}"></label>
    <label>Tanggal mulai<input type="date" id="start" value="${esc(s.start)}"></label>
    <label>Target band IELTS<select id="band">${[5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9].map((b) => `<option ${+s.band === b ? "selected" : ""}>${b}</option>`).join("")}</select></label>
    <label>Rencana tanggal tes IELTS<input type="date" id="testDate" value="${esc(s.testDate)}"></label>
    <label>Menit belajar per hari<input type="number" id="minutes" min="20" max="300" step="10" value="${s.minutes}"></label>
    <label>Modul IELTS<select id="module"><option value="academic" ${s.module === "academic" ? "selected" : ""}>Academic</option><option value="gt" ${s.module === "gt" ? "selected" : ""}>General Training</option></select></label>
    <label>Model Whisper (transkrip rekaman)<select id="whisper"><option value="Xenova/whisper-base.en" ${s.whisper === "Xenova/whisper-base.en" ? "selected" : ""}>base.en — lebih akurat (±80 MB)</option><option value="Xenova/whisper-tiny.en" ${s.whisper === "Xenova/whisper-tiny.en" ? "selected" : ""}>tiny.en — lebih cepat/ringan (±40 MB)</option></select></label>
    <label>Aksen transkrip live<select id="lang"><option value="en-GB" ${s.lang === "en-GB" ? "selected" : ""}>English (UK)</option><option value="en-US" ${s.lang === "en-US" ? "selected" : ""}>English (US)</option><option value="en-AU" ${s.lang === "en-AU" ? "selected" : ""}>English (AU)</option></select></label>
  </div><p class="small muted">Tersimpan otomatis.</p></div>
  <div class="card"><h2>Backup data</h2>
    <p class="small">Progress disimpan di browser ini. Export rutin (mis. tiap minggu) dan simpan file JSON-nya — bisa juga di-commit ke folder <code>journal/</code> repo kamu. Audio tidak ikut di-export (download manual dari Speaking Lab).</p>
    <div class="row wrap"><button class="btn" id="exp">⬇ Export JSON</button><label class="btn ghost">⬆ Import JSON<input type="file" id="imp" accept="application/json" hidden></label><button class="btn danger" id="reset">Reset semua</button></div>
  </div>`;
};
VIEWS.settings.bind = (root) => {
  root.oninput = (e) => {
    const k = e.target.id; if (!(k in S().settings)) return;
    update((s) => (s.settings[k] = e.target.type === "number" ? +e.target.value : e.target.value));
  };
  $("#exp", root).onclick = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([exportJSON()], { type: "application/json" }));
    a.download = `english-journey-backup-${today()}.json`; a.click();
  };
  $("#imp", root).onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try { importJSON(await f.text()); alert("Data berhasil di-import."); render(); } catch (err) { alert("Gagal import: " + err.message); }
  };
  $("#reset", root).onclick = () => { if (confirm("Hapus SEMUA progress, rekaman & tulisan di browser ini?")) { resetAll(); render(); } };
};

// ---------- chart (SVG sederhana)
function lineChart(series, { min, max, target, targetLabel, bands = [] }) {
  const all = series.flatMap((s) => s.pts);
  if (all.length === 0) return `<p class="small muted">Belum ada data.</p>`;
  const W = 600, H = 200, P = 30;
  const xs = all.map((p) => +new Date(p[0])), x0 = Math.min(...xs), x1 = Math.max(...xs) || x0 + 1;
  const X = (d) => P + ((+new Date(d) - x0) / (x1 - x0 || 1)) * (W - 2 * P);
  const Y = (v) => H - P - ((Math.min(max, Math.max(min, v)) - min) / (max - min)) * (H - 2 * P);
  const grid = bands.map(([v, l]) => `<line x1="${P}" x2="${W - P}" y1="${Y(v)}" y2="${Y(v)}" class="grid"/><text x="${W - P + 4}" y="${Y(v) + 4}" class="lbl">${l}</text>`).join("");
  const tgt = target != null ? `<line x1="${P}" x2="${W - P}" y1="${Y(target)}" y2="${Y(target)}" class="target"/><text x="${P + 4}" y="${Y(target) - 4}" class="lbl">target ${targetLabel || target}</text>` : "";
  const lines = series.map((s) => s.pts.length ? `<polyline fill="none" stroke="${s.color}" stroke-width="2.5" points="${s.pts.map((p) => X(p[0]) + "," + Y(p[1])).join(" ")}"/>${s.pts.map((p) => `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="4" fill="${s.color}"><title>${fmtDate(p[0])}: ${p[1]}</title></circle>`).join("")}` : "").join("");
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img"><text x="2" y="${Y(max) + 4}" class="lbl">${max}</text><text x="2" y="${Y(min)}" class="lbl">${min}</text>${grid}${tgt}${lines}</svg>
    <div class="legend small">${series.map((s) => `<span><i style="background:${s.color}"></i>${s.name}</span>`).join("")}</div>`;
}

// ---------- router
const NAV = [["", "🏠", "Coach"], ["roadmap", "🗺️", "Roadmap"], ["speaking", "🗣️", "Speaking"], ["writing", "✍️", "Writing"], ["progress", "📈", "Progress"], ["library", "📚", "Library"], ["settings", "⚙️", "Pengaturan"]];
function render() {
  if (speakSession) { speakSession.stop(); speakSession = null; }
  const [path, qs] = location.hash.replace(/^#\/?/, "").split("?");
  const [view, sub] = path.split("/");
  const q = Object.fromEntries(new URLSearchParams(qs || ""));
  const name = VIEWS[view] ? view : "coach";
  $("#nav").innerHTML = NAV.map(([k, i, l]) => `<a href="#/${k}" class="${(k || "coach") === name ? "active" : ""}"><span>${i}</span>${l}</a>`).join("");
  const root = $("#app");
  const fresh = root.cloneNode(false); root.replaceWith(fresh);
  fresh.innerHTML = VIEWS[name](sub, q);
  VIEWS[name].bind && VIEWS[name].bind(fresh, sub, q);
}
window.addEventListener("hashchange", () => { render(); window.scrollTo(0, 0); });
render();
