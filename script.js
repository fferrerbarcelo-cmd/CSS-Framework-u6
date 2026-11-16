// Tema oscuro/claro
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeLabel = document.querySelector(".theme-label");

function applyTheme(theme) {
  root.dataset.theme = theme;
  const isDark = theme === "dark";
  themeIcon.className = isDark ? "bi bi-sun-fill" : "bi bi-moon-stars-fill";
  themeLabel.textContent = isDark ? "Modo claro" : "Modo oscuro";
  themeToggle.setAttribute("aria-label", isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
  document.querySelector('meta[name="theme-color"]').setAttribute("content", isDark ? "#101522" : "#f6f7fb");
}

let savedTheme = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
try {
  savedTheme = localStorage.getItem("portfolio-theme") || savedTheme;
} catch (error) {
  // Si el navegador bloquea localStorage, el sitio sigue funcionando.
}
applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  try { localStorage.setItem("portfolio-theme", nextTheme); } catch (error) {}
});

// Mini juego: adivinar un número
const guessForm = document.getElementById("guessForm");
const guessInput = document.getElementById("guessInput");
const gameMessage = document.getElementById("gameMessage");
const attemptCount = document.getElementById("attemptCount");
const resetGame = document.getElementById("resetGame");
const rangeLow = document.getElementById("rangeLow");
const rangeHigh = document.getElementById("rangeHigh");
const rangeFill = document.getElementById("rangeFill");
const bestScore = document.getElementById("bestScore");
let secretNumber;
let attempts;
let gameFinished, low = 1, high = 20, best = null;
try { best = Number(localStorage.getItem("portfolio-best")) || null; } catch (error) {}
if (best) bestScore.textContent = best;
function updateRange() {
  rangeLow.textContent = low;
  rangeHigh.textContent = high;
  rangeFill.style.left = ((low - 1) / 20 * 100) + "%";
  rangeFill.style.width = ((high - low + 1) / 20 * 100) + "%";
}
function saveBest() {
  if (!best || attempts < best) {
    best = attempts;
    try { localStorage.setItem("portfolio-best", best); } catch (error) {}
  }
  bestScore.textContent = best;
}

function startNewGame() {
  secretNumber = Math.floor(Math.random() * 20) + 1;
  attempts = 0;
  low = 1; high = 20; updateRange();
  gameFinished = false;
  attemptCount.textContent = attempts;
  gameMessage.textContent = "Elegí un número entre 1 y 20 para empezar.";
  guessInput.value = "";
  guessInput.disabled = false;
  guessForm.querySelector("button").disabled = false;
  guessInput.focus();
}
guessForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const guess = Number(guessInput.value);
  if (!Number.isInteger(guess) || guess < 1 || guess > 20) {
    gameMessage.textContent = "Ingresá un número entero entre 1 y 20.";
    return;
  }
  if (gameFinished) return;
  attempts++;
  attemptCount.textContent = attempts;
  if (guess === secretNumber) {
    gameMessage.textContent = `¡Exacto! Lo encontraste en ${attempts} ${attempts === 1 ? "intento" : "intentos"}. 🎉`;
    gameFinished = true;
    saveBest();
    confetti();
    guessInput.disabled = true;
    guessForm.querySelector("button").disabled = true;
  } else if (guess < secretNumber) {
    gameMessage.textContent = "Un poco más alto. ¡Probá de nuevo!";
    low = Math.max(low, guess + 1); updateRange();
  } else {
    gameMessage.textContent = "Un poco más bajo. ¡Probá de nuevo!";
    high = Math.min(high, guess - 1); updateRange();
  }
  guessInput.select();
});
resetGame.addEventListener("click", startNewGame);
startNewGame();

// Cursor personalizado y efecto al pasar sobre elementos interactivos
const dot = document.querySelector(".cursor-dot");
const outline = document.querySelector(".cursor-outline");
if (window.matchMedia("(pointer:fine)").matches) {
  document.body.classList.add("cursor-active");
  let mouseX = 0, mouseY = 0;
  document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
    window.__m = { x: mouseX, y: mouseY };
  });
  document.querySelectorAll("a, button, input, textarea").forEach((element) => {
    element.addEventListener("mouseenter", () => outline.classList.add("cursor-hover"));
    element.addEventListener("mouseleave", () => outline.classList.remove("cursor-hover"));
  });
}

// Botón volver arriba y año automático
const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  backToTop.classList.toggle("visible", window.scrollY > 450);
}, { passive: true });
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
document.getElementById("currentYear").textContent = new Date().getFullYear();

/* ================= EXTRAS ================= */
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(pointer:fine)").matches;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

// Barra de progreso y navbar
const progress = $("#scrollProgress"), navbar = $(".site-navbar");
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  navbar.classList.toggle("scrolled", scrollY > 20);
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Entrada del hero escalonada
$$(".hero-content > *").forEach((el, i) => el.style.setProperty("--i", i));

// Aparecer al hacer scroll + contadores
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
const revealEls = $$(".section-heading, .row.g-4 > div, .about-card, .about-copy, .skill-list, .stats, .game-panel, .contact-panel");
revealEls.forEach((el) => {
  el.classList.add("reveal");
  el.style.setProperty("--d", `${[...el.parentElement.children].indexOf(el) % 3 * 90}ms`);
});
const revealObs = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (!e.isIntersecting) return;
  e.target.classList.add("in");
  if (e.target.matches(".stats")) countUp(e.target);
  revealObs.unobserve(e.target);
}), { threshold: 0.15 });
revealEls.forEach((el) => revealObs.observe(el));

// Link activo según la sección
const navLinks = $$(".nav-link");
const spy = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (e.isIntersecting) navLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === `#${e.target.id}`));
}), { rootMargin: "-45% 0px -50% 0px" });
$$("main section").forEach((s) => spy.observe(s));

// Texto que se escribe solo
const typed = $("#typed");
const phrases = ["Estudiante.", "Creador digital.", "Futuro politólogo.", "Aprendiz de código."];
if (reduceMotion) typed.textContent = phrases[0];
else (function type(p = 0, c = 0, del = false) {
  const word = phrases[p];
  typed.textContent = word.slice(0, c);
  let wait = del ? 40 : 90;
  if (!del && c === word.length) { del = true; wait = 1400; }
  else if (del && c === 0) { del = false; p = (p + 1) % phrases.length; wait = 300; }
  setTimeout(type, wait, p, c + (del ? -1 : 1), del);
})();

// Partículas del hero (siguen los colores del tema)
const cv = $("#particles"), ctx = cv.getContext("2d"), hero = $("#inicio");
let pts = [], pw = 0, ph = 0, heroVisible = true, mouse = { x: -999, y: -999 }, col = { a: "#8b7cff", b: "#52d6c7" };
function readColors() {
  const st = getComputedStyle(root);
  col.a = st.getPropertyValue("--accent").trim();
  col.b = st.getPropertyValue("--accent-2").trim();
}
function resizeCanvas() {
  pw = cv.width = hero.clientWidth;
  ph = cv.height = hero.clientHeight;
  pts = Array.from({ length: Math.min(70, Math.floor(pw / 18)) }, () => ({
    x: Math.random() * pw, y: Math.random() * ph, vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5
  }));
}
function line(x1, y1, x2, y2, alpha) {
  ctx.globalAlpha = alpha; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
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
      if (d < 120) line(pts[i].x, pts[i].y, pts[j].x, pts[j].y, (1 - d / 120) * .35);
    }
    const dm = Math.hypot(pts[i].x - mouse.x, pts[i].y - mouse.y);
    if (dm < 170) line(pts[i].x, pts[i].y, mouse.x, mouse.y, (1 - dm / 170) * .6);
  }
}
if (!reduceMotion) {
  readColors(); resizeCanvas();
  addEventListener("resize", resizeCanvas);
  themeToggle.addEventListener("click", readColors);
  hero.addEventListener("mousemove", (e) => { const r = hero.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
  hero.addEventListener("mouseleave", () => { mouse.x = mouse.y = -999; });
  new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; }).observe(hero);
  drawParticles();
}

// Cursor: el aro sigue al mouse con suavidad + onda al hacer click
const ring = $(".cursor-outline");
let rx = 0, ry = 0;
(function follow() {
  const m = window.__m;
  if (m) { rx += (m.x - rx) * .18; ry += (m.y - ry) * .18; ring.style.left = rx + "px"; ring.style.top = ry + "px"; }
  requestAnimationFrame(follow);
})();
document.addEventListener("click", (e) => {
  if (reduceMotion || !finePointer) return;
  const r = document.createElement("span");
  r.className = "ripple"; r.style.left = e.clientX + "px"; r.style.top = e.clientY + "px";
  document.body.appendChild(r);
  setTimeout(() => r.remove(), 700);
});

// Tarjetas 3D con brillo y botones magnéticos
if (finePointer && !reduceMotion) {
  $$(".project-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.setProperty("--rx", `${(.5 - y) * 10}deg`);
      card.style.setProperty("--ry", `${(x - .5) * 12}deg`);
      card.style.setProperty("--mx", `${x * 100}%`);
      card.style.setProperty("--my", `${y * 100}%`);
    });
    card.addEventListener("mouseleave", () => { card.style.setProperty("--rx", "0deg"); card.style.setProperty("--ry", "0deg"); });
  });
  $$(".btn-primary-custom, .btn-outline-custom, .theme-toggle").forEach((b) => {
    b.addEventListener("mousemove", (e) => {
      const r = b.getBoundingClientRect();
      b.style.translate = `${(e.clientX - r.left - r.width / 2) * .2}px ${(e.clientY - r.top - r.height / 2) * .3}px`;
    });
    b.addEventListener("mouseleave", () => { b.style.translate = ""; });
  });
}

// Confeti (al ganar el juego o con el código Konami: ↑↑↓↓←→←→ B A)
function confetti() {
  if (reduceMotion) return;
  const c = document.createElement("canvas");
  c.className = "confetti"; c.width = innerWidth; c.height = innerHeight;
  document.body.appendChild(c);
  const g = c.getContext("2d"), colors = ["#8b7cff", "#52d6c7", "#ffd166", "#ff6b9d", "#ffffff"];
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
const konami = "ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a";
let keys = [];
addEventListener("keydown", (e) => { keys = [...keys, e.key].slice(-10); if (keys.join() === konami) confetti(); });
