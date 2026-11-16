/* ========================================================
   PORTFOLIO - FELIPE FERRER BARCELÓ
   Lógica Completa: Todos los Chiches, Juegos, Audio y RRII
   ========================================================= */

const root = document.documentElement;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(pointer:fine)").matches;

// ================= 1. MOTOR DE AUDIO TÁCTIL (Web Audio API) =================
let soundEnabled = false;
let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

const SFX = {
  click(freq = 560) {
    if (!soundEnabled) return;
    const ctx = getAudioCtx(); if (!ctx) return;
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.04);
  },
  fanfare() {
    if (!soundEnabled) return;
    const notes = [261.6, 329.6, 392.0, 523.2];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        const ctx = getAudioCtx(); if (!ctx) return;
        const osc = ctx.createOscillator(), gain = ctx.createGain();
        osc.type = "triangle"; osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime + 0.28);
      }, idx * 85);
    });
  },
  pop() {
    if (!soundEnabled) return;
    const ctx = getAudioCtx(); if (!ctx) return;
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.08);
  }
};

const soundToggle = $("#soundToggle");
const soundIcon = $("#soundIcon");
if (soundToggle) {
  soundToggle.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    getAudioCtx();
    soundIcon.className = soundEnabled ? "bi bi-volume-up-fill" : "bi bi-volume-mute-fill";
    toast(soundEnabled ? "🔊 Sonido táctil activado" : "🔇 Sonido desactivado");
    if (soundEnabled) SFX.fanfare();
  });
}
document.addEventListener("click", (e) => {
  if (e.target.closest("button, .chip, .dot, .nav-link, .project-card, .supply-item")) {
    SFX.click(580);
  }
});

// ================= 2. TEMAS (Dark, Light, Retro, War Room) =================
const themeToggle = $("#themeToggle");
const themeIcon = $("#themeIcon");
const themeLabel = $(".theme-label");

const THEMES = ["dark", "light", "retro", "war-room"];
const THEME_META = {
  dark: ["bi bi-sun-fill", "Modo claro", "#101522"],
  light: ["bi bi-lightning-charge-fill", "Modo retro", "#f6f7fb"],
  retro: ["bi bi-shield-shaded", "Sala de situación", "#0a0014"],
  "war-room": ["bi bi-moon-stars-fill", "Modo oscuro", "#041009"]
};

function applyTheme(theme) {
  if (!THEMES.includes(theme)) theme = "dark";
  root.dataset.theme = theme;
  const [icon, label, color] = THEME_META[theme];
  themeIcon.className = icon;
  themeLabel.textContent = label;
  themeToggle.setAttribute("aria-label", label);
  const metaTheme = $('meta[name="theme-color"]');
  if (metaTheme) metaTheme.setAttribute("content", color);
  readColors();
}

let savedTheme = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
try { savedTheme = localStorage.getItem("portfolio-theme") || savedTheme; } catch (e) {}
applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const nextTheme = THEMES[(THEMES.indexOf(root.dataset.theme) + 1) % THEMES.length];
  applyTheme(nextTheme);
  try { localStorage.setItem("portfolio-theme", nextTheme); } catch (e) {}
});

// Color de acento
const accents = $$("[data-accent]");
function setAccent(c) {
  if (c) root.style.setProperty("--accent", c); else root.style.removeProperty("--accent");
  accents.forEach((b) => b.classList.toggle("on", b.dataset.accent === (c || "")));
  try { localStorage.setItem("portfolio-accent", c || ""); } catch (e) {}
  readColors();
}
accents.forEach((b) => b.addEventListener("click", () => setAccent(b.dataset.accent)));
let savedAccent = "";
try { savedAccent = localStorage.getItem("portfolio-accent") || ""; } catch (e) {}
setAccent(savedAccent);

// ================= 3. TRADUCCIÓN i18n (ES / EN) =================
const T = {
  "Solidaridad": "Giving back", "Mundo & RRII": "World & IR", "Mundo": "World", "Modo neón": "Neon mode",
  "Relojes mundiales, diplomacia y": "World clocks, diplomacy and", "cuenta regresiva": "countdown",
  "Útiles para escuelas del": "School supplies for", "norte argentino": "northern Argentina",
  "Más": "More", "repositorios": "repositories", "Columnas y": "Columns and", "reflexiones": "reflections",
  "Bruselas": "Brussels", "Pekín": "Beijing", "Nueva York · ONU": "New York · UN", "Washington D. C.": "Washington, D.C.",
  "Ginebra · ONU": "Geneva · UN", "Tokio": "Tokyo", "Buenos Aires": "Buenos Aires",
  "Hacé click en": "Click on", "Puntos:": "Score:", "Ese es": "That's", "Pasá el mouse por un país.": "Hover over a country.",
  "Ver": "View", "Todos": "All", "Copiar": "Copy", "¡Alias copiado!": "Alias copied!",
  "Quiero ayudar / Coordinar": "I want to help", "Girar Tarjeta (QR)": "Flip Card (QR)",
  "Sobre mí": "About me", "Juegos": "Games", "Contacto": "Contact", "Modo claro": "Light mode", "Modo oscuro": "Dark mode", "Mi camino": "My path",
  "BUEN DÍA, SOY": "GOOD MORNING, I'M", "BUENAS TARDES, SOY": "GOOD AFTERNOON, I'M", "BUENAS NOCHES, SOY": "GOOD EVENING, I'M",
  "Estudiante.": "Student.", "Creador digital.": "Digital creator.", "Futuro politólogo.": "Future political scientist.", "Aprendiz de código.": "Code apprentice.",
  "Ver mis proyectos": "See my projects", "Campaña Solidaria": "Solidarity Campaign", "Contactarme": "Get in touch",
  "DESLIZÁ PARA EXPLORAR": "SCROLL TO EXPLORE", "LO QUE ESTUVE HACIENDO": "WHAT I'VE BEEN UP TO", "Mis": "My", "proyectos": "projects",
  "Adivinar": "Guess", "Memoria": "Memory", "Dilema RRII": "IR Dilemma", "Quiz Capitales": "Capitals Quiz",
  "¡Mensaje enviado! Gracias 💌": "Message sent! Thanks 💌", "No se pudo enviar. Probá de nuevo.": "Couldn't send. Please try again."
};

let lang = "es";
try { lang = localStorage.getItem("portfolio-lang") || "es"; } catch (e) {}
const orig = new WeakMap();
const trText = (k) => T[k] ?? k;
const tr = (s) => (lang === "en" ? trText(s) : s);

function trNode(n) {
  const o = orig.get(n) ?? n.nodeValue, k = o.trim(), p = n.parentElement;
  const v = lang === "en" ? (p?.dataset.en ?? trText(k)) : k;
  if (v !== k || orig.has(n)) { orig.set(n, o); n.nodeValue = o.replace(k, () => v); }
}

function applyLang() {
  root.lang = lang;
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = w.nextNode());) if (n.nodeValue.trim() && !n.parentElement.closest("script,style")) trNode(n);
  $$("[placeholder]").forEach((el) => {
    el.dataset.es ??= el.placeholder;
    el.placeholder = lang === "en" ? (T[el.dataset.es] ?? el.dataset.es) : el.dataset.es;
  });
  $("#langToggle").textContent = lang === "en" ? "ES" : "EN";
  showRecords(); quizRender(); showMapInfo(); renderEssays();
}

$("#langToggle").addEventListener("click", () => {
  lang = lang === "es" ? "en" : "es";
  try { localStorage.setItem("portfolio-lang", lang); } catch (e) {}
  applyLang();
});

// Toast
const toast = (msg) => {
  const t = document.createElement("div"); t.className = "toast-msg";
  t.setAttribute("role", "status"); t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3200);
};

// ================= 4. PRELOADER, SCROLL PROGRESS & NAVBAR =================
const pre = $("#preloader"), hidePre = () => pre.classList.add("done");
if (document.readyState === "complete") setTimeout(hidePre, 600); else addEventListener("load", () => setTimeout(hidePre, 600));
setTimeout(hidePre, 3000);

const progress = $("#scrollProgress"), navbar = $(".site-navbar");
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  navbar.classList.toggle("scrolled", scrollY > 20);
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();

const backToTop = $("#backToTop");
window.addEventListener("scroll", () => backToTop.classList.toggle("visible", window.scrollY > 450), { passive: true });
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
$("#currentYear").textContent = new Date().getFullYear();

// ================= 5. HERO PARTICLES & CURSOR =================
const cv = $("#particles"), ctx = cv.getContext("2d"), hero = $("#inicio");
let pts = [], pw = 0, ph = 0, heroVisible = true, mouse = { x: -999, y: -999 }, col = { a: "#8b7cff", b: "#52d6c7" };

function readColors() {
  const st = getComputedStyle(root);
  col.a = st.getPropertyValue("--accent").trim() || "#8b7cff";
  col.b = st.getPropertyValue("--accent-2").trim() || "#52d6c7";
}

function resizeCanvas() {
  pw = cv.width = hero.clientWidth;
  ph = cv.height = hero.clientHeight;
  pts = Array.from({ length: Math.min(65, Math.floor(pw / 20)) }, () => ({
    x: Math.random() * pw, y: Math.random() * ph, vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5
  }));
}

function drawParticles() {
  requestAnimationFrame(drawParticles);
  if (!heroVisible) return;
  ctx.clearRect(0, 0, pw, ph);
  ctx.fillStyle = col.b; ctx.strokeStyle = col.a;
  pts.forEach((p) => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > pw) p.vx *= -1;
    if (p.y < 0 || p.y > ph) p.vy *= -1;
    ctx.globalAlpha = .7; ctx.beginPath(); ctx.arc(p.x, p.y, 1.8, 0, 7); ctx.fill();
  });
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
      if (d < 120) {
        ctx.globalAlpha = (1 - d / 120) * .35;
        ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
      }
    }
    const dm = Math.hypot(pts[i].x - mouse.x, pts[i].y - mouse.y);
    if (dm < 160) {
      ctx.globalAlpha = (1 - dm / 160) * .6;
      ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
    }
  }
}

if (!reduceMotion) {
  readColors(); resizeCanvas();
  addEventListener("resize", resizeCanvas);
  hero.addEventListener("mousemove", (e) => { const r = hero.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
  hero.addEventListener("mouseleave", () => { mouse.x = mouse.y = -999; });
  new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; }).observe(hero);
  drawParticles();
}

// Cursor suave y estela
const dot = $(".cursor-dot"), ring = $(".cursor-outline"), light = $(".mouse-light");
if (finePointer) {
  document.body.classList.add("cursor-active");
  let rx = 0, ry = 0;
  document.addEventListener("mousemove", (e) => {
    dot.style.left = e.clientX + "px"; dot.style.top = e.clientY + "px";
    light.style.setProperty("--lx", e.clientX + "px"); light.style.setProperty("--ly", e.clientY + "px");
    window.__m = { x: e.clientX, y: e.clientY };
  });
  (function follow() {
    const m = window.__m;
    if (m) { rx += (m.x - rx) * .18; ry += (m.y - ry) * .18; ring.style.left = rx + "px"; ring.style.top = ry + "px"; }
    requestAnimationFrame(follow);
  })();
  document.querySelectorAll("a, button, input, textarea, .chip, .supply-item, .card-3d").forEach((el) => {
    el.addEventListener("mouseenter", () => ring.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => ring.classList.remove("cursor-hover"));
  });
  document.addEventListener("mouseover", (e) => {
    const c = e.target.closest(".project-card");
    ring.classList.toggle("cursor-view", !!c); ring.dataset.label = c ? tr("Ver") : "";
  });
}

// Ripple on click
document.addEventListener("click", (e) => {
  if (reduceMotion || !finePointer) return;
  const r = document.createElement("span");
  r.className = "ripple"; r.style.left = e.clientX + "px"; r.style.top = e.clientY + "px";
  document.body.appendChild(r);
  setTimeout(() => r.remove(), 700);
});

// Tarjetas 3D Tilt con foil
if (finePointer && !reduceMotion) {
  $$(".project-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.setProperty("--rx", `${(.5 - y) * 10}deg`);
      card.style.setProperty("--ry", `${(x - .5) * 12}deg`);
      card.style.setProperty("--mx", `${x * 100}%`);
      card.style.setProperty("--my", `${y * 100}%`);
    });
    card.addEventListener("mouseleave", () => {
      card.style.setProperty("--rx", "0deg"); card.style.setProperty("--ry", "0deg");
    });
  });
}

// Typed text
const typed = $("#typed");
const phrases = ["Estudiante.", "Creador digital.", "Futuro politólogo.", "Aprendiz de código."];
if (reduceMotion) typed.textContent = phrases[0];
else (function type(p = 0, c = 0, del = false) {
  const word = tr(phrases[p]);
  typed.textContent = word.slice(0, c);
  let wait = del ? 40 : 90;
  if (!del && c === word.length) { del = true; wait = 1400; }
  else if (del && c === 0) { del = false; p = (p + 1) % phrases.length; wait = 300; }
  setTimeout(type, wait, p, c + (del ? -1 : 1), del);
})();

// Saludo dinámico según la hora
{
  const h = new Date().getHours();
  $("#greeting").textContent = h < 6 || h >= 20 ? "BUENAS NOCHES, SOY" : h < 13 ? "BUEN DÍA, SOY" : "BUENAS TARDES, SOY";
}

// ================= 6. SCROLL REVEAL, CONTADORES & SCRAMBLE =================
function countUp(box) {
  $$("[data-count]", box).forEach((n) => {
    const end = Number(n.dataset.count), t0 = performance.now();
    (function tick(t) {
      const p = Math.min((t - t0) / 1300, 1);
      n.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  });
}

function scramble(el) {
  if (!el || reduceMotion || !el.firstChild) return;
  const n = el.firstChild, final = n.nodeValue; let f = 0;
  const id = setInterval(() => {
    n.nodeValue = final.split("").map((ch, i) => ch === " " || i < f / 1.5 ? ch : "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&"[Math.random() * 29 | 0]).join("");
    if (++f > final.length * 1.5 + 2) { clearInterval(id); n.nodeValue = final; }
  }, 35);
}

const revealEls = $$(".section-heading, .row.g-4 > div, .about-card, .passport-card, .about-copy, .skill-list, .stats, .game-panel, .contact-panel, .timeline li, .skill-bars, .clock-card, .countdown, .map-card, .info-card, .donate-panel, .term, .kit-calculator-card, .goal-tracker-card");
revealEls.forEach((el) => {
  el.classList.add("reveal");
  el.style.setProperty("--d", `${[...el.parentElement.children].indexOf(el) % 3 * 90}ms`);
});

const revealObs = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (!e.isIntersecting) return;
  e.target.classList.add("in");
  if (e.target.matches(".stats")) countUp(e.target);
  if (e.target.matches(".section-heading")) scramble($(".eyebrow", e.target));
  revealObs.unobserve(e.target);
}), { threshold: 0.15 });
revealEls.forEach((el) => revealObs.observe(el));

// Nav Spy
const navLinks = $$(".nav-link");
const spy = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (e.isIntersecting) navLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === `#${e.target.id}`));
}), { rootMargin: "-45% 0px -50% 0px" });
$$("main section").forEach((s) => spy.observe(s));

// Confeti
function confetti() {
  if (reduceMotion) return;
  SFX.fanfare();
  const c = document.createElement("canvas");
  c.className = "confetti"; c.width = innerWidth; c.height = innerHeight;
  document.body.appendChild(c);
  const g = c.getContext("2d"), colors = ["#8b7cff", "#52d6c7", "#ffd166", "#ef4444", "#ffffff"];
  const bits = Array.from({ length: 140 }, () => ({
    x: innerWidth / 2, y: innerHeight * .6, vx: (Math.random() - .5) * 16, vy: -Math.random() * 16 - 4,
    s: Math.random() * 7 + 4, r: Math.random() * 6, vr: (Math.random() - .5) * .3, c: colors[Math.floor(Math.random() * 5)]
  }));
  let f = 0;
  (function step() {
    g.clearRect(0, 0, c.width, c.height);
    bits.forEach((b) => {
      b.vy += .35; b.x += b.vx; b.y += b.vy; b.r += b.vr;
      g.save(); g.translate(b.x, b.y); g.rotate(b.r); g.fillStyle = b.c; g.fillRect(-b.s / 2, -b.s / 2, b.s, b.s * .6); g.restore();
    });
    if (++f < 150) requestAnimationFrame(step); else c.remove();
  })();
}

// Konami Code
const konami = "ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a";
let keys = [];
addEventListener("keydown", (e) => { keys = [...keys, e.key].slice(-10); if (keys.join() === konami) confetti(); });

// ================= 7. RELOJES MUNDIALES 2.0 & TIME TRAVELER =================
const CITIES = [
  { name: "Buenos Aires", tz: "America/Argentina/Buenos_Aires", flag: "🇦🇷" },
  { name: "Washington D. C.", tz: "America/New_York", flag: "🇺🇸" },
  { name: "Bruselas · UE", tz: "Europe/Brussels", flag: "🇪🇺" },
  { name: "Ginebra · ONU", tz: "Europe/Zurich", flag: "🇨🇭" },
  { name: "Pekín", tz: "Asia/Shanghai", flag: "🇨🇳" },
  { name: "Tokio", tz: "Asia/Tokyo", flag: "🇯🇵" }
];

const clocksGrid = $("#clocks");
let simulatedOffsetHours = 0; // Para el time traveler

function buildClocksHTML() {
  clocksGrid.innerHTML = CITIES.map((c, i) => `
    <div class="clock-card" data-idx="${i}">
      <svg class="mini-analog-clock" viewBox="0 0 50 50">
        <circle class="clock-face" cx="25" cy="25" r="23"/>
        <line class="clock-hour-hand" id="h-hand-${i}" x1="25" y1="25" x2="25" y2="13"/>
        <line class="clock-min-hand" id="m-hand-${i}" x1="25" y1="25" x2="25" y2="8"/>
        <circle class="clock-center-dot" cx="25" cy="25" r="2.5"/>
      </svg>
      <b>${c.flag} ${c.name}</b>
      <time id="digi-time-${i}">--:--:--</time>
      <span class="clock-status-tag" id="status-tag-${i}">--</span>
    </div>
  `).join("");
}
buildClocksHTML();

function updateClocks() {
  const baseTime = new Date(Date.now() + simulatedOffsetHours * 3600000);
  CITIES.forEach((c, i) => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      hour: "numeric", minute: "numeric", second: "numeric", hourCycle: "h23", timeZone: c.tz
    });
    const parts = formatter.formatToParts(baseTime);
    const h = Number(parts.find(p => p.type === "hour").value);
    const m = Number(parts.find(p => p.type === "minute").value);
    const s = Number(parts.find(p => p.type === "second").value);

    // Mover agujas analógicas
    const hDeg = (h % 12) * 30 + m * 0.5;
    const mDeg = m * 6;
    const hHand = $(`#h-hand-${i}`);
    const mHand = $(`#m-hand-${i}`);
    if (hHand) hHand.style.transform = `rotate(${hDeg}deg)`;
    if (mHand) mHand.style.transform = `rotate(${mDeg}deg)`;

    // Digital & Estado
    const digi = $(`#digi-time-${i}`);
    if (digi) digi.textContent = `${h < 7 || h >= 20 ? "🌙" : "☀️"} ${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;

    const tag = $(`#status-tag-${i}`);
    const isOpen = h >= 9 && h < 18;
    if (tag) {
      tag.className = `clock-status-tag ${isOpen ? "status-open" : "status-closed"}`;
      tag.textContent = isOpen ? "🟢 Horario diplomático activo" : "🌙 Cancillería cerrada";
    }
  });

  // Cuenta regresiva a la universidad
  const UNI_START = new Date("2027-03-01T00:00:00-03:00");
  const diff = Math.max(0, UNI_START - baseTime);
  const vals = [diff / 864e5, (diff / 36e5) % 24, (diff / 6e4) % 60, (diff / 1e3) % 60].map(Math.floor);
  $$("#countdown strong").forEach((s, idx) => { s.textContent = String(vals[idx]).padStart(2, "0"); });
}
setInterval(updateClocks, 1000);
updateClocks();

// Time Traveler Slider
const ttSlider = $("#ttSlider"), ttVal = $("#ttVal"), ttReset = $("#ttReset");
if (ttSlider) {
  const currentHour = new Date().getHours() + new Date().getMinutes() / 60;
  ttSlider.value = currentHour;
  ttSlider.addEventListener("input", (e) => {
    const val = Number(e.target.value);
    const hrs = Math.floor(val), mins = Math.floor((val % 1) * 60);
    ttVal.textContent = `${String(hrs).padStart(2,"0")}:${String(mins).padStart(2,"0")} hs`;
    simulatedOffsetHours = val - currentHour;
    updateClocks();
  });
  ttReset.addEventListener("click", () => {
    simulatedOffsetHours = 0;
    const nowH = new Date().getHours() + new Date().getMinutes() / 60;
    ttSlider.value = nowH;
    ttVal.textContent = `${String(new Date().getHours()).padStart(2,"0")}:${String(new Date().getMinutes()).padStart(2,"0")} hs`;
    updateClocks();
    toast("⏰ Relojes sincronizados con la hora real");
  });
}

// Citas de Estadistas & Diplomáticos
const QUOTES = [
  { text: "El verdadero liderazgo político busca armonizar la virtud con la realidad.", author: "Nicolás Maquiavelo" },
  { text: "El poder y la violencia son opuestos; donde uno domina absolutamente, el otro está ausente.", author: "Hannah Arendt" },
  { text: "La diplomacia es el arte de hacer que otra persona se salga con la tuya.", author: "David Frost" },
  { text: "El coraje es lo que se necesita para levantarse y hablar; el coraje también es lo que se necesita para sentarse y escuchar.", author: "Winston Churchill" },
  { text: "La educación es el arma más poderosa que puedes usar para cambiar el mundo.", author: "Nelson Mandela" },
  { text: "La suprema excelencia consiste en quebrar la resistencia del enemigo sin luchar.", author: "Sun Tzu" }
];
let qIdx = 0;
$("#quoteNext").addEventListener("click", () => {
  qIdx = (qIdx + 1) % QUOTES.length;
  $("#quoteText").textContent = `"${QUOTES[qIdx].text}"`;
  $("#quoteAuthor").textContent = `— ${QUOTES[qIdx].author}`;
  SFX.pop();
});

// ================= 8. SOLIDARIDAD: CALCULADORA, TARJETA 3D & STICKERS =================
// Calculadora de kit escolar
const kitPrices = { Cuaderno: 1200, Cartuchera: 2500, Geometría: 1500, Mochila: 12000 };
let kitQuantities = { Cuaderno: 1, Cartuchera: 1, Geometría: 0, Mochila: 0 };

function updateKitTotal() {
  let total = 0, count = 0;
  const items = $$(".supply-item");
  items.forEach((item) => {
    const p = Number(item.dataset.price);
    const q = Number($(".supply-qty", item).textContent);
    total += p * q;
    count += q;
  });
  $("#kitTotal").textContent = `$${total.toLocaleString("es-AR")} ARS`;
  const imp = $("#kitImpact");
  if (total === 0) imp.textContent = "Sumá al menos un útil para calcular el impacto escolar.";
  else if (total < 5000) imp.textContent = "¡Con esto cubrís el material básico de escritura para 1 alumno rural!";
  else if (total < 15000) imp.textContent = "¡Genial! Con este aporte equipás a un alumno con cartuchera y cuadernos para medio año.";
  else imp.textContent = "¡Impacto extraordinario! Equipás mochilas completas listas para estudiar.";
}

$$(".supply-item").forEach((item) => {
  const qtyEl = $(".supply-qty", item);
  $(".btn-qty.plus", item).addEventListener("click", () => {
    qtyEl.textContent = Number(qtyEl.textContent) + 1;
    updateKitTotal(); SFX.click(620);
  });
  $(".btn-qty.minus", item).addEventListener("click", () => {
    const cur = Number(qtyEl.textContent);
    if (cur > 0) { qtyEl.textContent = cur - 1; updateKitTotal(); SFX.click(480); }
  });
});
updateKitTotal();

// Tarjeta 3D Flip
const card3D = $("#solidarityCard");
const flipBtn = $("#flipCardBtn");
function toggleCardFlip() {
  card3D.classList.toggle("flipped");
  SFX.pop();
}
if (card3D) card3D.addEventListener("click", toggleCardFlip);
if (flipBtn) flipBtn.addEventListener("click", toggleCardFlip);

// Botón Copiar Alias
const btnCopyAlias = $("#btnCopyAlias");
if (btnCopyAlias) {
  btnCopyAlias.addEventListener("click", (e) => {
    e.stopPropagation();
    const alias = $("#cardAliasText").textContent.trim();
    navigator.clipboard?.writeText(alias).then(() => {
      toast("¡Alias copiado al portapapeles! 🎉");
      confetti();
    });
  });
}

$("#donateContact").addEventListener("click", () => {
  $("#contacto").scrollIntoView({ behavior: "smooth" });
  const m = $("#mensaje");
  if (m) {
    m.value = "Hola Felipe, quiero coordinar para colaborar con la campaña solidaria de útiles para el norte.";
    setTimeout(() => m.focus(), 600);
  }
});

// Muro de Stickers de Aliento
const corkBoard = $("#corkBoard");
$$(".btn-sticker").forEach((btn) => {
  btn.addEventListener("click", () => {
    const pin = document.createElement("div");
    pin.className = "cork-pin";
    pin.textContent = btn.dataset.text;
    pin.style.left = `${Math.random() * 60 + 10}%`;
    pin.style.top = `${Math.random() * 50 + 15}%`;
    pin.style.transform = `rotate(${(Math.random() - 0.5) * 16}deg)`;
    corkBoard.appendChild(pin);
    toast("¡Mensaje pegado en el mural! 📌");
    SFX.pop();
  });
});

// ================= 9. FILTROS & MODALES DE PROYECTOS =================
const cards = $$(".row.g-4 > div");
cards.forEach((c) => {
  const t = $(".project-type", c).textContent.toLowerCase();
  c.dataset.tags = [/html|css/.test(t) && "html", /bootstrap/.test(t) && "bootstrap", /javascript|js|lógica/.test(t) && "js"].filter(Boolean).join(" ");
});

$("#filters").addEventListener("click", (e) => {
  const b = e.target.closest("[data-filter]"); if (!b) return;
  $$("[data-filter]").forEach((x) => x.classList.toggle("active", x === b));
  let i = 0;
  cards.forEach((c) => {
    const show = b.dataset.filter === "all" || c.dataset.tags.includes(b.dataset.filter);
    c.hidden = !show;
    if (show) { c.classList.remove("in"); c.style.setProperty("--d", `${i++ % 3 * 90}ms`); void c.offsetWidth; c.classList.add("in"); }
  });
});

const pm = $("#projectModal");
cards.forEach((c) => $(".project-card", c).addEventListener("click", (e) => {
  if (e.ctrlKey || e.metaKey || e.shiftKey) return;
  e.preventDefault();
  const a = e.currentTarget;
  $("img", pm).src = $("img", a).src; $("img", pm).alt = $("img", a).alt;
  $(".project-type", pm).textContent = $(".project-type", a).textContent;
  $("h3", pm).textContent = $("h3", a).textContent;
  $(".pm-body p", pm).textContent = $("p", a).textContent;
  $("a", pm).href = a.href;
  pm.showModal();
}));
$("[data-close]").addEventListener("click", () => pm.close());

// ================= 10. MINI JUEGOS =================
// Pestañas
$$("[data-pane]").forEach((b) => b.addEventListener("click", () => {
  $$("[data-pane]").forEach((x) => x.classList.toggle("active", x === b));
  $$(".pane").forEach((p) => { p.hidden = p.id !== `pane-${b.dataset.pane}`; });
  if (b.dataset.pane !== "snake") snakeStop();
  showRecords();
}));

// Juego 1: Adivinar número
const guessForm = $("#guessForm"), guessInput = $("#guessInput"), gameMessage = $("#gameMessage");
const attemptCount = $("#attemptCount"), resetGame = $("#resetGame");
const rangeLow = $("#rangeLow"), rangeHigh = $("#rangeHigh"), rangeFill = $("#rangeFill"), bestScore = $("#bestScore");
let secretNumber, attempts, gameFinished, low = 1, high = 20, best = null;
try { best = Number(localStorage.getItem("portfolio-best")) || null; } catch (e) {}
if (best) bestScore.textContent = best;

function updateRange() {
  rangeLow.textContent = low; rangeHigh.textContent = high;
  rangeFill.style.left = ((low - 1) / 20 * 100) + "%";
  rangeFill.style.width = ((high - low + 1) / 20 * 100) + "%";
}
function startNewGame() {
  secretNumber = Math.floor(Math.random() * 20) + 1;
  attempts = 0; low = 1; high = 20; updateRange();
  gameFinished = false; attemptCount.textContent = attempts;
  gameMessage.textContent = "Elegí un número entre 1 y 20 para empezar.";
  guessInput.value = ""; guessInput.disabled = false;
  guessForm.querySelector("button").disabled = false;
  guessInput.focus({ preventScroll: true });
}
guessForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const guess = Number(guessInput.value);
  if (!Number.isInteger(guess) || guess < 1 || guess > 20) return;
  if (gameFinished) return;
  attempts++; attemptCount.textContent = attempts;
  if (guess === secretNumber) {
    gameMessage.textContent = `¡Exacto! Lo encontraste en ${attempts} ${attempts === 1 ? "intento" : "intentos"}. 🎉`;
    gameFinished = true; confetti();
    if (!best || attempts < best) { best = attempts; try { localStorage.setItem("portfolio-best", best); } catch (e) {} }
    bestScore.textContent = best; showRecords();
    guessInput.disabled = true; guessForm.querySelector("button").disabled = true;
  } else if (guess < secretNumber) {
    gameMessage.textContent = "Un poco más alto. ¡Probá de nuevo!"; low = Math.max(low, guess + 1); updateRange();
  } else {
    gameMessage.textContent = "Un poco más bajo. ¡Probá de nuevo!"; high = Math.min(high, guess - 1); updateRange();
  }
});
resetGame.addEventListener("click", startNewGame);
startNewGame();

// Juego 2: Memoria
const memGrid = $("#memGrid");
const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
let memFirst = null, memLock = false, memMoves = 0, memLeft = 8;
function memStart() {
  const flags = ["🇦🇷", "🇧🇷", "🇨🇱", "🇺🇾", "🇪🇸", "🇫🇷", "🇯🇵", "🇺🇸"];
  memGrid.innerHTML = shuffle([...flags, ...flags]).map((f) => `<button class="mem-card" type="button" data-f="${f}" aria-label="Carta"><span>${f}</span></button>`).join("");
  memFirst = null; memLock = false; memMoves = 0; memLeft = 8; $("#memMoves").textContent = 0;
}
memGrid.addEventListener("click", (e) => {
  const c = e.target.closest(".mem-card");
  if (!c || memLock || c.classList.contains("up")) return;
  c.classList.add("up");
  if (!memFirst) { memFirst = c; return; }
  $("#memMoves").textContent = ++memMoves;
  if (memFirst.dataset.f === c.dataset.f) {
    memFirst.classList.add("ok"); c.classList.add("ok"); memFirst = null;
    if (--memLeft === 0) { confetti(); }
  } else {
    memLock = true; const a = memFirst; memFirst = null;
    setTimeout(() => { a.classList.remove("up"); c.classList.remove("up"); memLock = false; }, 750);
  }
});
$("#memReset").addEventListener("click", memStart);
memStart();

// Juego 3: Snake
const sc = $("#snakeCv"), sg = sc.getContext("2d"), SN = 15, SS = 20;
let snake = [], dir = { x: 1, y: 0 }, nextDir = dir, food = { x: 0, y: 0 }, snakeScoreV = 0, snakeTimer = null;
function snakeStop() { clearInterval(snakeTimer); snakeTimer = null; }
function placeFood() { do { food = { x: Math.random() * SN | 0, y: Math.random() * SN | 0 }; } while (snake.some((s) => s.x === food.x && s.y === food.y)); }
function snakeDraw() {
  sg.clearRect(0, 0, 300, 300);
  sg.fillStyle = col.b; sg.beginPath(); sg.arc(food.x * SS + SS / 2, food.y * SS + SS / 2, 7, 0, 7); sg.fill();
  sg.fillStyle = col.a;
  snake.forEach((s, i) => { sg.globalAlpha = i ? .75 : 1; sg.fillRect(s.x * SS + 1, s.y * SS + 1, SS - 2, SS - 2); });
  sg.globalAlpha = 1;
}
function snakeTick() {
  dir = nextDir;
  const h = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
  if (h.x < 0 || h.y < 0 || h.x >= SN || h.y >= SN || snake.some((s) => s.x === h.x && s.y === h.y)) {
    snakeStop(); $("#snakeInfo").textContent = `Perdiste. Puntos: ${snakeScoreV}`; return;
  }
  snake.unshift(h);
  if (h.x === food.x && h.y === food.y) { $("#snakeScore").textContent = ++snakeScoreV; placeFood(); SFX.pop(); } else snake.pop();
  snakeDraw();
}
$("#snakeStart").addEventListener("click", () => {
  readColors();
  snake = [{ x: 7, y: 7 }, { x: 6, y: 7 }, { x: 5, y: 7 }]; dir = nextDir = { x: 1, y: 0 };
  snakeScoreV = 0; $("#snakeScore").textContent = 0; placeFood(); snakeDraw();
  $("#snakeInfo").textContent = "¡A comer!";
  clearInterval(snakeTimer); snakeTimer = setInterval(snakeTick, 120);
});
addEventListener("keydown", (e) => {
  if (!snakeTimer || $("#pane-snake").hidden) return;
  const m = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] }[e.key];
  if (m && (m[0] !== -dir.x || m[1] !== -dir.y)) { e.preventDefault(); nextDir = { x: m[0], y: m[1] }; }
});

// Juego 4: Quiz de Capitales
const Q = [["🇦🇷", "Argentina", "Buenos Aires"], ["🇧🇷", "Brasil", "Brasilia"], ["🇨🇱", "Chile", "Santiago"], ["🇫🇷", "Francia", "París"], ["🇯🇵", "Japón", "Tokio"], ["🇪🇸", "España", "Madrid"], ["🇮🇹", "Italia", "Roma"], ["🇨🇦", "Canadá", "Ottawa"], ["🇦🇺", "Australia", "Canberra"], ["🇪🇬", "Egipto", "El Cairo"]];
let order = [], qi = 0, quizScoreV = 0, quizLock = false, opts = [];
function quizRender() {
  if (!order.length) return;
  const qEl = $("#quizQ"), oEl = $("#quizOpts");
  if (qi >= 8) { qEl.textContent = `¡Terminaste! ${quizScoreV}/8`; oEl.innerHTML = ""; return; }
  const [fl, c, cap] = order[qi];
  qEl.textContent = `${fl} ¿Cuál es la capital de ${c}?`;
  if (!opts.length) opts = shuffle([cap, ...shuffle(Q.filter((x) => x[2] !== cap)).slice(0, 3).map((x) => x[2])]);
  oEl.innerHTML = opts.map((o) => `<button type="button" class="chip" data-a="${o}">${o}</button>`).join("");
}
function quizReset() { order = shuffle(Q).slice(0, 8); qi = 0; quizScoreV = 0; quizLock = false; opts = []; $("#quizScore").textContent = 0; quizRender(); }
$("#quizOpts").addEventListener("click", (e) => {
  const b = e.target.closest("[data-a]"); if (!b || quizLock) return;
  quizLock = true;
  const right = order[qi][2], ok = b.dataset.a === right;
  if (ok) { quizScoreV++; SFX.pop(); }
  b.classList.add(ok ? "ok" : "bad");
  $$("[data-a]", $("#quizOpts")).forEach((x) => { if (x.dataset.a === right) x.classList.add("ok"); });
  $("#quizScore").textContent = quizScoreV;
  setTimeout(() => {
    qi++; quizLock = false; opts = [];
    if (qi >= 8 && quizScoreV >= 6) confetti();
    quizRender();
  }, 900);
});
$("#quizReset").addEventListener("click", quizReset);
quizReset();

// Juego 5: Dilema Diplomático (RRII)
const DILEMMAS = [
  {
    title: "Cumbre de Ayuda Humanitaria",
    text: "Un país vecino sufre una catástrofe climática y solicita paso franco por nuestras fronteras para convoyes internacionales de rescate.",
    choiceA: "A: Abrir fronteras con protocolo de seguridad acelerado.",
    choiceB: "B: Exigir inspecciones minuciosas para evitar tensiones de soberanía.",
    effectA: { peace: 15, econ: -5, rep: 15 },
    effectB: { peace: -10, econ: 5, rep: -10 }
  },
  {
    title: "Acuerdo de Cooperación Energética",
    text: "Se propone un tratado regional para compartir infraestructura hidroeléctrica que beneficiará la matriz limpia pero requiere compartir datos estratégicos.",
    choiceA: "A: Firmar el tratado e impulsar el multilateralismo regional.",
    choiceB: "B: Posponer la firma para priorizar la soberanía energética propia.",
    effectA: { peace: 10, econ: 15, rep: 10 },
    effectB: { peace: -5, econ: -10, rep: -5 }
  }
];
let diploIdx = 0, diploStats = { peace: 70, econ: 60, rep: 65 };
function renderDiplo() {
  const d = DILEMMAS[diploIdx % DILEMMAS.length];
  $("#diploTitle").textContent = d.title;
  $("#diploScenario").textContent = d.text;
  const btns = $$("#diploChoices button");
  btns[0].textContent = d.choiceA; btns[1].textContent = d.choiceB;
  $("#diploPeace").textContent = `${Math.min(100, Math.max(0, diploStats.peace))}%`;
  $("#diploEcon").textContent = `${Math.min(100, Math.max(0, diploStats.econ))}%`;
  $("#diploRep").textContent = `${Math.min(100, Math.max(0, diploStats.rep))}%`;
}
$("#diploChoices").addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  const choice = b.dataset.choice;
  const d = DILEMMAS[diploIdx % DILEMMAS.length];
  const eff = choice === "A" ? d.effectA : d.effectB;
  diploStats.peace += eff.peace; diploStats.econ += eff.econ; diploStats.rep += eff.rep;
  diploIdx++;
  toast("Decisión diplomática ejecutada 🕊️");
  renderDiplo();
  if (diploStats.peace >= 85) confetti();
});
$("#diploReset").addEventListener("click", () => {
  diploStats = { peace: 70, econ: 60, rep: 65 }; diploIdx = 0; renderDiplo();
});
renderDiplo();

function showRecords() {
  $("#records").textContent = `🏆 Récord Adivinar: ${best ?? "–"} intentos`;
}
showRecords();

// ================= 11. MAPA INTERACTIVO (D3 & TopoJSON) =================
const WORLD = { Argentina: ["Argentina", "🇦🇷", "Buenos Aires"], Brazil: ["Brasil", "🇧🇷", "Brasilia"], Chile: ["Chile", "🇨🇱", "Santiago"], Uruguay: ["Uruguay", "🇺🇾", "Montevideo"], Paraguay: ["Paraguay", "🇵🇾", "Asunción"], Bolivia: ["Bolivia", "🇧🇴", "Sucre"], Peru: ["Perú", "🇵🇪", "Lima"], Colombia: ["Colombia", "🇨🇴", "Bogotá"], Mexico: ["México", "🇲🇽", "Ciudad de México"], "United States of America": ["Estados Unidos", "🇺🇸", "Washington D. C."], Canada: ["Canadá", "🇨🇦", "Ottawa"], France: ["Francia", "🇫🇷", "París"], Spain: ["España", "🇪🇸", "Madrid"], Italy: ["Italia", "🇮🇹", "Roma"], Germany: ["Alemania", "🇩🇪", "Berlín"], Russia: ["Rusia", "🇷🇺", "Moscú"], China: ["China", "🇨🇳", "Pekín"], Japan: ["Japón", "🇯🇵", "Tokio"], India: ["India", "🇮🇳", "Nueva Delhi"], Australia: ["Australia", "🇦🇺", "Canberra"], Egypt: ["Egipto", "🇪🇬", "El Cairo"] };
const mapTip = document.createElement("div"); mapTip.className = "map-tip"; mapTip.hidden = true;
let mapState = "loading", mapTarget = null, mapScore = 0;

function showMapInfo() {
  const el = $("#mapInfo");
  if (!el) return;
  if (mapState === "loading") el.textContent = tr("Cargando mapa…");
  else if (mapState === "error") el.textContent = tr("No se pudo cargar el mapa.");
  else el.textContent = mapTarget ? `${tr("Hacé click en")}: ${WORLD[mapTarget][1]} ${WORLD[mapTarget][0]} · ${tr("Puntos:")} ${mapScore}` : tr("Pasá el mouse por un país.");
}
function mapNext() { const k = Object.keys(WORLD); mapTarget = k[Math.random() * k.length | 0]; showMapInfo(); }
$("#mapGame").addEventListener("click", () => {
  if (mapState !== "ready") return;
  if (mapTarget) mapTarget = null; else { mapScore = 0; mapNext(); }
  $("#mapGame").classList.toggle("active", !!mapTarget); mapTip.hidden = true; showMapInfo();
});

const loadScript = (src) => new Promise((ok, no) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
async function initMap() {
  const box = $("#map"); if (!box) return;
  try {
    await loadScript("https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js");
    await loadScript("https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js");
    const world = await (await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json")).json();
    const feats = topojson.feature(world, world.objects.countries).features, W = 960, H = 500;
    const path = d3.geoPath(d3.geoNaturalEarth1().fitSize([W, H], { type: "Sphere" }));
    const svg = d3.select(box).append("svg").attr("viewBox", `0 0 ${W} ${H}`).attr("role", "img");
    svg.append("path").attr("class", "sphere").attr("d", path({ type: "Sphere" }));
    svg.selectAll(".country").data(feats).join("path").attr("class", (d) => "country" + (WORLD[d.properties.name] ? " known" : "")).attr("d", path)
      .on("mousemove click", (e, d) => {
        const n = d.properties.name;
        if (e.type === "click" && mapTarget) {
          if (n === mapTarget) { mapScore++; confetti(); mapNext(); } else toast(`Ese es ${WORLD[n] ? WORLD[n][0] : n}`);
          return;
        }
        if (mapTarget) return;
        const r = box.getBoundingClientRect();
        mapTip.hidden = false; mapTip.style.left = e.clientX - r.left + 12 + "px"; mapTip.style.top = e.clientY - r.top + 12 + "px";
        mapTip.textContent = WORLD[n] ? `${WORLD[n][1]} ${WORLD[n][0]} · Capital: ${WORLD[n][2]}` : n;
      })
      .on("mouseleave", () => { mapTip.hidden = true; });
    box.appendChild(mapTip); mapState = "ready";
  } catch (err) { mapState = "error"; }
  showMapInfo();
}
new IntersectionObserver(([e], o) => { if (e.isIntersecting) { o.disconnect(); initMap(); } }, { rootMargin: "300px" }).observe($("#mundo"));

// ================= 12. TERMINAL INTERACTIVA & EASTER EGGS =================
const termOut = $("#termOut"), termIn = $("#termIn"), hist = []; let hi = 0;
const print = (txt, cls) => { const d = document.createElement("div"); if (cls) d.className = cls; d.textContent = txt; termOut.appendChild(d); termOut.scrollTop = termOut.scrollHeight; };
const alias = { projects: "proyectos", contact: "contacto", donate: "donar", theme: "tema", language: "idioma", lang: "idioma", time: "hora", confetti: "confeti" };

const CMDS = {
  help: () => "Comandos: about, proyectos, skills, contacto, donar, tema, idioma, hora, confeti, matrix, cita, viaje, paz, sonido, whoami, clear",
  about: () => $(".about-copy").textContent.trim(),
  whoami: () => "felipe - estudiante y futuro politólogo / diplomático",
  proyectos: () => cards.map((c) => "· " + $("h3", c).textContent).join("\n"),
  skills: () => "HTML5 · CSS3 · Bootstrap 5 · JavaScript DOM · Análisis Político & RRII",
  contacto: () => { $("#contacto").scrollIntoView({ behavior: "smooth" }); return "Te llevo al formulario de contacto…"; },
  donar: () => { $("#solidaridad").scrollIntoView({ behavior: "smooth" }); return "Gracias por sumarte a ayudar a las escuelas del norte 💛"; },
  tema: () => { themeToggle.click(); return "Tema cambiado"; },
  idioma: () => { $("#langToggle").click(); return "Idioma cambiado"; },
  hora: () => new Date().toLocaleTimeString("es-AR"),
  confeti: () => { confetti(); return "🎉 ¡Fiesta!"; },
  sonido: () => { soundToggle.click(); return "Estado de sonido modificado"; },
  cita: () => { const q = QUOTES[Math.floor(Math.random() * QUOTES.length)]; return `"${q.text}" — ${q.author}`; },
  viaje: () => {
    const destinos = ["Ginebra (Sede ONU)", "Washington D.C. (OEA)", "Bruselas (Parlamento Europeo)", "Tokio (Cancillería)", "París (UNESCO)"];
    return `✈️ Vuelo diplomático emitido hacia: ${destinos[Math.floor(Math.random() * destinos.length)]}`;
  },
  paz: () => "🕊️ Tratado de no agresión y cooperación mutua ratificado por unanimidad.",
  clear: () => { termOut.textContent = ""; return ""; },
  sudo: () => "Buen intento 😏"
};

// Easter egg Matrix
CMDS.matrix = () => {
  const canvas = document.createElement("canvas");
  canvas.id = "matrixCanvas"; canvas.width = innerWidth; canvas.height = innerHeight;
  document.body.appendChild(canvas);
  const mctx = canvas.getContext("2d");
  const katakana = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポ1234567890ABCDEF";
  const fontSize = 16, columns = Math.floor(canvas.width / fontSize), drops = Array(columns).fill(1);
  let frameId;
  function drawMatrix() {
    mctx.fillStyle = "rgba(0, 0, 0, 0.05)"; mctx.fillRect(0, 0, canvas.width, canvas.height);
    mctx.fillStyle = "#00ff66"; mctx.font = `${fontSize}px monospace`;
    for (let i = 0; i < drops.length; i++) {
      const text = katakana.charAt(Math.floor(Math.random() * katakana.length));
      mctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    frameId = requestAnimationFrame(drawMatrix);
  }
  drawMatrix();
  function exitMatrix() { cancelAnimationFrame(frameId); canvas.remove(); window.removeEventListener("keydown", onKey); }
  function onKey(e) { if (e.key === "Escape") exitMatrix(); }
  canvas.addEventListener("click", exitMatrix); window.addEventListener("keydown", onKey);
  return "🟢 The Matrix activado. Tocá la pantalla o ESC para salir.";
};

$("#termForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const raw = termIn.value.trim(); termIn.value = ""; if (!raw) return;
  hist.push(raw); hi = hist.length; print("$ " + raw, "cmd");
  const c = raw.toLowerCase().split(" ")[0], k = alias[c] ?? c;
  const out = Object.hasOwn(CMDS, k) ? CMDS[k]() : `Comando no encontrado: ${c}. Escribí help.`;
  if (out) print(out);
});
termIn.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && hi > 0) termIn.value = hist[--hi];
  else if (e.key === "ArrowDown") termIn.value = hist[++hi] ?? "";
});
$("#term").addEventListener("click", () => termIn.focus());
print("Bienvenido a la terminal de Felipe. Escribí help para ver los comandos disponibles.");

// ================= 13. COMMAND PALETTE (Ctrl+K) =================
const pal = $("#palette"), palIn = $("#palInput"), palList = $("#palList");
const go = (h) => $(h).scrollIntoView({ behavior: "smooth" });
const cmds = [
  ["Portfolio", () => go("#portfolio")],
  ["Sobre mí", () => go("#acerca-de-mi")],
  ["Mundo & RRII", () => go("#mundo")],
  ["Solidaridad", () => go("#solidaridad")],
  ["Juegos", () => go("#juego")],
  ["Terminal", () => { go("#terminal"); setTimeout(() => $("#termIn").focus(), 700); }],
  ["Contacto", () => go("#contacto")],
  ["Cambiar tema", () => themeToggle.click()],
  ["Cambiar idioma", () => $("#langToggle").click()],
  ["Lanzar confeti", confetti]
];
let palSel = 0;
function palRender() {
  const q = palIn.value.toLowerCase(), list = cmds.filter((c) => tr(c[0]).toLowerCase().includes(q));
  palSel = Math.min(palSel, Math.max(0, list.length - 1));
  palList.innerHTML = list.map((c, i) => `<li class="${i === palSel ? "sel" : ""}" data-i="${cmds.indexOf(c)}">${tr(c[0])}</li>`).join("");
}
function palOpen() { palIn.value = ""; palSel = 0; palRender(); pal.showModal(); palIn.focus(); }
function palRun(i) { pal.close(); cmds[i][1](); }
$("#openPalette").addEventListener("click", palOpen);
addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault(); pal.open ? pal.close() : palOpen();
  }
});
palIn.addEventListener("input", () => { palSel = 0; palRender(); });
palIn.addEventListener("keydown", (e) => {
  const items = $$("li", palList);
  if (e.key === "ArrowDown" && items.length) { palSel = (palSel + 1) % items.length; palRender(); e.preventDefault(); }
  else if (e.key === "ArrowUp" && items.length) { palSel = (palSel - 1 + items.length) % items.length; palRender(); e.preventDefault(); }
  else if (e.key === "Enter" && items[palSel]) palRun(Number(items[palSel].dataset.i));
});
palList.addEventListener("click", (e) => { const li = e.target.closest("li"); if (li) palRun(Number(li.dataset.i)); });
[pm, pal, $("#essayModal")].forEach((d) => d.addEventListener("click", (e) => { if (e.target === d) d.close(); }));

// ================= 14. CONTACT FORM AJAX =================
const contactForm = $("#contacto form");
contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = $("button[type=submit]", contactForm); btn.disabled = true;
  try {
    const r = await fetch(contactForm.action, {
      method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(contactForm)))
    });
    if (!r.ok) throw new Error("send");
    toast("¡Mensaje enviado con éxito! Te responderé a la brevedad 💌");
    contactForm.reset(); confetti();
  } catch (err) { toast("No se pudo enviar. Por favor probá de nuevo."); }
  btn.disabled = false;
});

// ================= 15. GITHUB REPOS =================
(async () => {
  try {
    const r = await fetch("https://api.github.com/users/fferrerbarcelo-cmd/repos?sort=updated&per_page=30");
    if (!r.ok) return;
    const shown = [...cards.map((c) => $(".project-card", c).href.toLowerCase()), location.href.toLowerCase()];
    const repos = (await r.json()).filter((p) => !p.fork && !p.name.toLowerCase().endsWith(".github.io") && !shown.some((h) => h.includes(`/${p.name.toLowerCase()}/`)));
    if (!repos.length) return;
    const grid = $("#repoGrid");
    repos.slice(0, 9).forEach((p) => {
      const a = document.createElement("a"); a.className = "repo"; a.href = p.homepage || p.html_url; a.target = "_blank"; a.rel = "noopener noreferrer";
      const b = document.createElement("b"), d = document.createElement("p"), s = document.createElement("small");
      b.textContent = p.name; d.textContent = p.description || ""; s.textContent = p.language || "Code";
      a.append(b, d, s); grid.appendChild(a);
    });
    $("#github").hidden = false;
  } catch (e) {}
})();

// ================= 16. AJUSTES DE ACCESIBILIDAD =================
let fs = 100, hc = false;
try { fs = Number(localStorage.getItem("portfolio-fs")) || 100; hc = localStorage.getItem("portfolio-hc") === "1"; } catch (e) {}
function applyRead() {
  root.style.fontSize = fs + "%"; root.classList.toggle("hc", hc);
  try { localStorage.setItem("portfolio-fs", fs); localStorage.setItem("portfolio-hc", hc ? "1" : "0"); } catch (e) {}
}
$("#fontPlus").addEventListener("click", () => { fs = Math.min(140, fs + 10); applyRead(); });
$("#fontMinus").addEventListener("click", () => { fs = Math.max(80, fs - 10); applyRead(); });
$("#contrastBtn").addEventListener("click", () => { hc = !hc; applyRead(); });
applyRead();

applyLang();

