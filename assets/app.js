(function () {
  const C = window.CURRICULUM;
  const $ = (s) => document.querySelector(s);
  const store = {
    get(k, d) { try { const v = localStorage.getItem("mej:" + k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem("mej:" + k, JSON.stringify(v)); } catch {} }
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let done = store.get("done", {});

  // Nav
  $("#nav .wrap").innerHTML = [["target","Target"],["daily","Harian"],["map","Level"]]
    .concat(C.phases.map((p, i) => [p.id, "Fase " + i])).concat([["repos","Repo"],["log","Jurnal"]])
    .map(([id, t]) => `<a href="#${id}">${t}</a>`).join("");

  // Daily + map + repos
  $("#dailyList").innerHTML = C.daily.map((d) => `<li><span class="m">${d.min}'</span><div><strong>${esc(d.title)}</strong><br><span class="muted small">${esc(d.note)}</span></div></li>`).join("");
  $("#mapBody").innerHTML = C.bands.map((b) => `<tr><td>${b.cefr}</td><td>${b.ielts}</td></tr>`).join("");
  $("#repoList").innerHTML = C.repos.map((r) => `<li><a href="${r.url}" target="_blank" rel="noopener">${esc(r.name)}</a> — <span class="muted">${esc(r.note)}</span></li>`).join("");

  // Phases
  $("#phases").innerHTML = C.phases.map((p) => {
    const groups = {};
    p.resources.forEach((r) => (groups[r.cat] = groups[r.cat] || []).push(r));
    return `<details class="card phase" id="${p.id}">
      <summary>
        <div class="head"><span class="title">${esc(p.title)}</span><span class="badge" data-badge="${p.id}"></span></div>
        <span class="muted small">${esc(p.level)} · ${esc(p.weeks)} · ${esc(p.hours)}</span>
        <div class="mini"><div data-mini="${p.id}"></div></div>
      </summary>
      <div class="body">
        <p><strong>Tujuan:</strong> ${esc(p.goal)}</p>
        <h3>Checklist</h3>
        <ul class="checks">${p.tasks.map((t, i) => `<li><label><input type="checkbox" data-key="${p.id}-${i}" ${done[p.id + "-" + i] ? "checked" : ""}><span>${esc(t)}</span></label></li>`).join("")}</ul>
        <h3>Sumber belajar</h3>
        <ul class="res">${p.resources.map((r) => `<li><span class="cat">${esc(r.cat)}</span><a href="${r.url}" target="_blank" rel="noopener">${esc(r.name)}</a><span class="tag ${r.tag}">${r.tag}</span></li>`).join("")}</ul>
        <div class="milestone"><strong>Milestone lulus:</strong> ${esc(p.milestone)}</div>
      </div></details>`;
  }).join("");

  function updateProgress() {
    let all = 0, ok = 0;
    C.phases.forEach((p) => {
      const n = p.tasks.length;
      const d = p.tasks.filter((_, i) => done[p.id + "-" + i]).length;
      all += n; ok += d;
      document.querySelector(`[data-mini="${p.id}"]`).style.width = (d / n) * 100 + "%";
      document.querySelector(`[data-badge="${p.id}"]`).textContent = d + "/" + n;
    });
    const pct = Math.round((ok / all) * 100);
    $("#totalPct").textContent = pct + "%";
    $("#totalBar").style.width = pct + "%";
    $("#totalSub").textContent = ok + " dari " + all + " tugas selesai";
  }
  document.addEventListener("change", (e) => {
    const k = e.target.dataset && e.target.dataset.key;
    if (!k) return;
    done[k] = e.target.checked; store.set("done", done); updateProgress();
  });
  updateProgress();

  // Target
  const bands = []; for (let b = 5; b <= 9; b += 0.5) bands.push(b);
  $("#targetBand").innerHTML = bands.map((b) => `<option value="${b}">${b.toFixed(1)}</option>`).join("");
  $("#targetBand").value = store.get("band", 7);
  $("#testDate").value = store.get("date", "");
  $("#hoursDay").value = store.get("hours", 1.5);
  function updateCountdown() {
    store.set("band", $("#targetBand").value); store.set("date", $("#testDate").value); store.set("hours", $("#hoursDay").value);
    const d = $("#testDate").value;
    if (!d) { $("#countdown").textContent = "Pilih tanggal tes untuk melihat hitung mundur."; return; }
    const days = Math.ceil((new Date(d) - new Date()) / 864e5);
    const hrs = Math.max(0, days) * parseFloat($("#hoursDay").value || 0);
    $("#countdown").textContent = days < 0 ? "Tanggal sudah lewat." : `${days} hari lagi · ±${Math.round(hrs)} jam belajar tersedia`;
  }
  ["#targetBand", "#testDate", "#hoursDay"].forEach((s) => $(s).addEventListener("input", updateCountdown));
  updateCountdown();

  // Journal
  let entries = store.get("journal", []);
  function renderEntries() {
    $("#entries").innerHTML = entries.slice().reverse().map((e) => `<li><span class="muted small">${esc(e.d)}</span><br>${esc(e.t).replace(/\n/g, "<br>")}</li>`).join("");
  }
  $("#saveJournal").onclick = () => {
    const t = $("#journal").value.trim(); if (!t) return;
    entries.push({ d: new Date().toLocaleString("id-ID"), t }); store.set("journal", entries);
    $("#journal").value = ""; $("#journalMsg").textContent = "Tersimpan ✔"; renderEntries();
  };
  renderEntries();

  $("#reset").onclick = () => { if (confirm("Hapus semua progress & jurnal di browser ini?")) { try { Object.keys(localStorage).filter((k) => k.startsWith("mej:")).forEach((k) => localStorage.removeItem(k)); } catch {} location.reload(); } };
})();
