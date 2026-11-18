// Penyimpanan: state di localStorage, audio rekaman di IndexedDB. Bisa di-export/import JSON.
const KEY = "mej.v2";
const DEFAULT = {
  settings: { start: "", band: 7, testDate: "", minutes: 80, module: "academic", lang: "en-GB", name: "" },
  weeks: {},      // "p1-3": "done" | "skip"
  daily: {},      // "2026-11-18": { 0: true, 2: true }
  speaking: [],   // sesi speaking
  writing: [],    // esai
  scores: [],     // EF SET / mock / IELTS resmi
  journal: []
};

let state;
try { state = { ...structuredClone(DEFAULT), ...(JSON.parse(localStorage.getItem(KEY)) || {}) }; }
catch { state = structuredClone(DEFAULT); }
state.settings = { ...DEFAULT.settings, ...state.settings };

export const S = () => state;
export function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { console.warn(e); } }
export function update(fn) { fn(state); save(); }
export function exportJSON() { return JSON.stringify(state, null, 2); }
export function importJSON(txt) {
  const data = JSON.parse(txt);
  if (!data || typeof data !== "object" || !data.settings) throw new Error("Format backup tidak dikenali");
  state = { ...structuredClone(DEFAULT), ...data, settings: { ...DEFAULT.settings, ...data.settings } };
  save();
}
export function resetAll() { state = structuredClone(DEFAULT); save(); idbClear(); }

// ---- IndexedDB untuk audio
function db() {
  return new Promise((res, rej) => {
    const r = indexedDB.open("mej-audio", 1);
    r.onupgradeneeded = () => r.result.createObjectStore("audio");
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
async function tx(mode, fn) {
  const d = await db();
  return new Promise((res, rej) => {
    const t = d.transaction("audio", mode);
    const out = fn(t.objectStore("audio"));
    t.oncomplete = () => res(out && out.result);
    t.onerror = () => rej(t.error);
  });
}
export const audioPut = (id, blob) => tx("readwrite", (s) => s.put(blob, id)).catch(() => {});
export const audioGet = (id) => tx("readonly", (s) => s.get(id)).catch(() => null);
export const audioDel = (id) => tx("readwrite", (s) => s.delete(id)).catch(() => {});
function idbClear() { tx("readwrite", (s) => s.clear()).catch(() => {}); }

export const today = () => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
