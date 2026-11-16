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
  showRecords();
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
  guessInput.focus({ preventScroll: true });
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

const T = {
  "Sobre mí": "About me", "Juegos": "Games", "Contacto": "Contact", "Modo claro": "Light mode", "Modo oscuro": "Dark mode", "Mi camino": "My path",
  "BUEN DÍA, SOY": "GOOD MORNING, I'M", "BUENAS TARDES, SOY": "GOOD AFTERNOON, I'M", "BUENAS NOCHES, SOY": "GOOD EVENING, I'M",
  "Estudiante.": "Student.", "Creador digital.": "Digital creator.", "Futuro politólogo.": "Future political scientist.", "Aprendiz de código.": "Code apprentice.",
  "Estudiante, creador digital y futuro estudiante de Ciencias Políticas y Relaciones Internacionales.": "Student, digital creator and future Political Science and International Relations student.",
  "Ver mis proyectos": "See my projects", "Contactarme": "Get in touch", "DESLIZÁ PARA EXPLORAR": "SCROLL TO EXPLORE",
  "Curiosidad": "Curiosity", "LO QUE ESTUVE HACIENDO": "WHAT I'VE BEEN UP TO", "Mis": "My", "proyectos": "projects",
  "Una selección de trabajos y prácticas que fui desarrollando mientras aprendo programación web.": "A selection of work and practice I've built while learning web programming.",
  "Formulario": "Form", "Lista de Supermercado": "Grocery List", "Piedra, Papel o Tijera": "Rock, Paper, Scissors", "¿Puedo jubilarme?": "Can I retire?", "Calculadora de Abastecimiento": "Supply Calculator",
  "Un formulario web de práctica.": "A practice web form.", "Una página de presentación adaptable.": "A responsive landing page.",
  "Galería de productos para una tienda online.": "A product gallery for an online store.", "Una lista interactiva para organizar compras.": "An interactive list to organize shopping.",
  "Un clásico juego hecho con código.": "A classic game made with code.", "Una herramienta para explorar condiciones de jubilación.": "A tool to explore retirement conditions.",
  "Una calculadora para estimar necesidades de abastecimiento.": "A calculator to estimate supply needs.",
  "UN POCO SOBRE MÍ": "A LITTLE ABOUT ME", "Aprender, crear": "Learn, create", "y": "and", "seguir creciendo.": "keep growing.",
  "Soy estudiante del St Brendan's. Estoy aprendiendo HTML, CSS y Bootstrap para crear sitios responsive. Este portfolio es uno de mis primeros proyectos y voy a ir sumando los próximos trabajos que haga durante el año.": "I'm a student at St Brendan's. I'm learning HTML, CSS and Bootstrap to build responsive sites. This portfolio is one of my first projects and I'll keep adding the work I do throughout the year.",
  "En 2027 empiezo la universidad y voy a estudiar Ciencias Políticas y Relaciones Internacionales. Me interesa combinar la tecnología, la creatividad y el análisis de la realidad.": "In 2027 I start university to study Political Science and International Relations. I'm interested in combining technology, creativity and the analysis of reality.",
  "tecnologías": "technologies", "arranco la uni": "starting uni", "Un paso": "One step", "a la vez": "at a time",
  "UN PEQUEÑO EXTRA": "A LITTLE EXTRA", "juegos": "games", "Elegí un juego, batí tu récord y mostrame de qué sos capaz.": "Pick a game, beat your record and show me what you've got.",
  "Elegí un número entre 1 y 20 para empezar.": "Pick a number from 1 to 20 to start.", "Ingresá un número entero entre 1 y 20.": "Enter a whole number from 1 to 20.",
  "Un poco más alto. ¡Probá de nuevo!": "A bit higher. Try again!", "Un poco más bajo. ¡Probá de nuevo!": "A bit lower. Try again!",
  "Tu número": "Your number", "Probar": "Try", "Intentos:": "Attempts:", "· Récord:": "· Best:", "Nuevo número": "New number",
  "¿CHARLAMOS?": "LET'S TALK?", "Si querés dejarme un mensaje, podés hacerlo desde este formulario.": "If you'd like to leave me a message, use this form.",
  "Nombre": "Name", "Correo electrónico": "Email", "Mensaje": "Message", "Enviar mensaje": "Send message", "Tu nombre": "Your name", "Escribí tu mensaje...": "Write your message...",
  "· Hecho con HTML, CSS y JavaScript.": "· Made with HTML, CSS and JavaScript.",
  "Adivinar": "Guess", "Memoria": "Memory", "Cambiar tema": "Toggle theme", "Cambiar idioma": "Switch language", "Lanzar confeti": "Launch confetti", "Escribí un comando...": "Type a command...",
  "¿Cuál es la capital de": "What is the capital of", "¡Terminaste!": "Finished!", "¡A comer!": "Go!", "Perdiste. Puntos:": "Game over. Score:",
  "Brasil": "Brazil", "Francia": "France", "Japón": "Japan", "España": "Spain", "Italia": "Italy", "Canadá": "Canada", "Egipto": "Egypt",
  "París": "Paris", "Tokio": "Tokyo", "Roma": "Rome", "El Cairo": "Cairo",
  "¡Mensaje enviado! Gracias 💌": "Message sent! Thanks 💌", "No se pudo enviar. Probá de nuevo.": "Couldn't send. Please try again."
};
let lang = "es";
try { lang = localStorage.getItem("portfolio-lang") || "es"; } catch (error) {}
const orig = new WeakMap();
const trText = (k) => T[k] ?? k.replace(/^¡Exacto! Lo encontraste en (\d+) intentos?\. 🎉$/, "Got it in $1 tries! 🎉");
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
  $$("[placeholder]").forEach((el) => { el.dataset.es ??= el.placeholder; el.placeholder = lang === "en" ? (T[el.dataset.es] ?? el.dataset.es) : el.dataset.es; });
  $("#langToggle").textContent = lang === "en" ? "ES" : "EN";
  showRecords(); quizRender();
}
new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((n) => { if (n.nodeType === 3 && lang === "en") trNode(n); }))).observe(document.body, { childList: true, subtree: true });

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
const revealEls = $$(".section-heading, .row.g-4 > div, .about-card, .about-copy, .skill-list, .stats, .game-panel, .contact-panel, .timeline li, .skill-bars");
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
  const word = tr(phrases[p]);
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

/* ================= EXTRAS 2 ================= */
const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const toast = (msg) => { const t = document.createElement("div"); t.className = "toast-msg"; t.setAttribute("role", "status"); t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 3200); };

// Preloader
const pre = $("#preloader"), hidePre = () => pre.classList.add("done");
if (document.readyState === "complete") setTimeout(hidePre, 600); else addEventListener("load", () => setTimeout(hidePre, 600));
setTimeout(hidePre, 3500);

// Luz que sigue al mouse + cinta infinita
const light = $(".mouse-light");
if (finePointer) addEventListener("mousemove", (e) => { light.style.setProperty("--lx", e.clientX + "px"); light.style.setProperty("--ly", e.clientY + "px"); });
const track = $(".marquee-track"); track.innerHTML += track.innerHTML;

// Texto "descifrándose"
function scramble(el) {
  if (!el || reduceMotion || !el.firstChild) return;
  const n = el.firstChild, final = n.nodeValue; let f = 0;
  const id = setInterval(() => {
    n.nodeValue = final.split("").map((ch, i) => ch === " " || i < f / 1.5 ? ch : "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&"[Math.random() * 29 | 0]).join("");
    if (++f > final.length * 1.5 + 2) { clearInterval(id); n.nodeValue = final; }
  }, 35);
}

// Color de acento
const accents = $$("[data-accent]");
function setAccent(c) {
  if (c) root.style.setProperty("--accent", c); else root.style.removeProperty("--accent");
  accents.forEach((b) => b.classList.toggle("on", b.dataset.accent === (c || "")));
  try { localStorage.setItem("portfolio-accent", c || ""); } catch (error) {}
  readColors();
}
accents.forEach((b) => b.addEventListener("click", () => setAccent(b.dataset.accent)));

// Idioma
$("#langToggle").addEventListener("click", () => {
  lang = lang === "es" ? "en" : "es";
  try { localStorage.setItem("portfolio-lang", lang); } catch (error) {}
  applyLang();
});

// Filtros y modal de proyectos
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

// Paleta de comandos (Ctrl/⌘ + K)
const pal = $("#palette"), palIn = $("#palInput"), palList = $("#palList");
const go = (h) => $(h).scrollIntoView({ behavior: "smooth" });
const cmds = [["Portfolio", () => go("#portfolio")], ["Sobre mí", () => go("#acerca-de-mi")], ["Mi camino", () => go("#camino")], ["Juegos", () => go("#juego")], ["Contacto", () => go("#contacto")], ["Cambiar tema", () => themeToggle.click()], ["Cambiar idioma", () => $("#langToggle").click()], ["Lanzar confeti", confetti]];
let palSel = 0;
function palRender() {
  const q = palIn.value.toLowerCase(), list = cmds.filter((c) => tr(c[0]).toLowerCase().includes(q));
  palSel = Math.min(palSel, Math.max(0, list.length - 1));
  palList.innerHTML = list.map((c, i) => `<li class="${i === palSel ? "sel" : ""}" data-i="${cmds.indexOf(c)}">${tr(c[0])}</li>`).join("");
}
function palOpen() { palIn.value = ""; palSel = 0; palRender(); pal.showModal(); palIn.focus(); }
function palRun(i) { pal.close(); cmds[i][1](); }
$("#openPalette").addEventListener("click", palOpen);
addEventListener("keydown", (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); pal.open ? pal.close() : palOpen(); } });
palIn.addEventListener("input", () => { palSel = 0; palRender(); });
palIn.addEventListener("keydown", (e) => {
  const items = $$("li", palList);
  if (e.key === "ArrowDown" && items.length) { palSel = (palSel + 1) % items.length; palRender(); e.preventDefault(); }
  else if (e.key === "ArrowUp" && items.length) { palSel = (palSel - 1 + items.length) % items.length; palRender(); e.preventDefault(); }
  else if (e.key === "Enter" && items[palSel]) palRun(Number(items[palSel].dataset.i));
});
palList.addEventListener("click", (e) => { const li = e.target.closest("li"); if (li) palRun(Number(li.dataset.i)); });
[pm, pal].forEach((d) => d.addEventListener("click", (e) => { if (e.target === d) d.close(); }));

// Formulario sin recargar
const form = $("#contacto form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = $("button[type=submit]", form); btn.disabled = true;
  try {
    const r = await fetch(form.action, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
    if (!r.ok) throw new Error("send");
    toast(tr("¡Mensaje enviado! Gracias 💌")); form.reset(); confetti();
  } catch (error) { toast(tr("No se pudo enviar. Probá de nuevo.")); }
  btn.disabled = false;
});

// Récords de todos los juegos
let rec = {};
try { rec = JSON.parse(localStorage.getItem("portfolio-records")) || {}; } catch (error) {}
function showRecords() {
  const f = (v) => v ?? "–";
  $("#records").textContent = `🏆 ${tr("Adivinar")}: ${f(best)} · ${tr("Memoria")}: ${f(rec.memory)} · Snake: ${f(rec.snake)} · Quiz: ${f(rec.quiz)}`;
}
function setRecord(k, v, lowerBetter) {
  if (rec[k] == null || (lowerBetter ? v < rec[k] : v > rec[k])) {
    rec[k] = v;
    try { localStorage.setItem("portfolio-records", JSON.stringify(rec)); } catch (error) {}
  }
  showRecords();
}

// Pestañas de juegos
let snakeTimer = null;
function snakeStop() { clearInterval(snakeTimer); snakeTimer = null; }
$$("[data-pane]").forEach((b) => b.addEventListener("click", () => {
  $$("[data-pane]").forEach((x) => x.classList.toggle("active", x === b));
  $$(".pane").forEach((p) => { p.hidden = p.id !== `pane-${b.dataset.pane}`; });
  if (b.dataset.pane !== "snake") snakeStop();
  showRecords();
}));

// Memoria
const memGrid = $("#memGrid");
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
    if (--memLeft === 0) { setRecord("memory", memMoves, true); confetti(); }
  } else {
    memLock = true; const a = memFirst; memFirst = null;
    setTimeout(() => { a.classList.remove("up"); c.classList.remove("up"); memLock = false; }, 750);
  }
});
$("#memReset").addEventListener("click", memStart);

// Snake
const sc = $("#snakeCv"), sg = sc.getContext("2d"), SN = 15, SS = 20;
let snake = [], dir = { x: 1, y: 0 }, nextDir = dir, food = { x: 0, y: 0 }, snakeScoreV = 0, t0 = null;
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
    snakeStop();
    $("#snakeInfo").textContent = `${tr("Perdiste. Puntos:")} ${snakeScoreV}`;
    if (snakeScoreV) setRecord("snake", snakeScoreV);
    return;
  }
  snake.unshift(h);
  if (h.x === food.x && h.y === food.y) { $("#snakeScore").textContent = ++snakeScoreV; placeFood(); } else snake.pop();
  snakeDraw();
}
$("#snakeStart").addEventListener("click", () => {
  readColors();
  snake = [{ x: 7, y: 7 }, { x: 6, y: 7 }, { x: 5, y: 7 }]; dir = nextDir = { x: 1, y: 0 };
  snakeScoreV = 0; $("#snakeScore").textContent = 0; placeFood(); snakeDraw();
  $("#snakeInfo").textContent = tr("¡A comer!");
  clearInterval(snakeTimer); snakeTimer = setInterval(snakeTick, 120);
});
const steer = (m) => { if (m[0] !== -dir.x || m[1] !== -dir.y) nextDir = { x: m[0], y: m[1] }; };
addEventListener("keydown", (e) => {
  if (!snakeTimer || $("#pane-snake").hidden) return;
  const m = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] }[e.key];
  if (m) { e.preventDefault(); steer(m); }
});
sc.addEventListener("touchstart", (e) => { t0 = e.touches[0]; }, { passive: true });
sc.addEventListener("touchend", (e) => {
  if (!t0 || !snakeTimer) return;
  const t = e.changedTouches[0], dx = t.clientX - t0.clientX, dy = t.clientY - t0.clientY;
  steer(Math.abs(dx) > Math.abs(dy) ? [Math.sign(dx), 0] : [0, Math.sign(dy)]);
});

// Quiz de capitales
const Q = [["🇦🇷", "Argentina", "Buenos Aires"], ["🇧🇷", "Brasil", "Brasilia"], ["🇨🇱", "Chile", "Santiago"], ["🇫🇷", "Francia", "París"], ["🇯🇵", "Japón", "Tokio"], ["🇪🇸", "España", "Madrid"], ["🇮🇹", "Italia", "Roma"], ["🇨🇦", "Canadá", "Ottawa"], ["🇦🇺", "Australia", "Canberra"], ["🇪🇬", "Egipto", "El Cairo"]];
let order = [], qi = 0, quizScoreV = 0, quizLock = false, opts = [];
function quizRender() {
  if (!order.length) return;
  const qEl = $("#quizQ"), oEl = $("#quizOpts");
  if (qi >= 8) { qEl.textContent = `${tr("¡Terminaste!")} ${quizScoreV}/8`; oEl.innerHTML = ""; return; }
  const [fl, c, cap] = order[qi];
  qEl.textContent = `${fl} ${tr("¿Cuál es la capital de")} ${tr(c)}?`;
  if (!opts.length) opts = shuffle([cap, ...shuffle(Q.filter((x) => x[2] !== cap)).slice(0, 3).map((x) => x[2])]);
  oEl.innerHTML = opts.map((o) => `<button type="button" class="chip" data-a="${o}">${tr(o)}</button>`).join("");
}
function quizReset() { order = shuffle(Q).slice(0, 8); qi = 0; quizScoreV = 0; quizLock = false; opts = []; $("#quizScore").textContent = 0; quizRender(); }
$("#quizOpts").addEventListener("click", (e) => {
  const b = e.target.closest("[data-a]"); if (!b || quizLock) return;
  quizLock = true;
  const right = order[qi][2], ok = b.dataset.a === right;
  if (ok) quizScoreV++;
  b.classList.add(ok ? "ok" : "bad");
  $$("[data-a]", $("#quizOpts")).forEach((x) => { if (x.dataset.a === right) x.classList.add("ok"); });
  $("#quizScore").textContent = quizScoreV;
  setTimeout(() => {
    qi++; quizLock = false; opts = [];
    if (qi >= 8) { setRecord("quiz", quizScoreV); if (quizScoreV >= 6) confetti(); }
    quizRender();
  }, 900);
});
$("#quizReset").addEventListener("click", quizReset);

// Arranque
{ const h = new Date().getHours(); $("#greeting").textContent = h < 6 || h >= 20 ? "BUENAS NOCHES, SOY" : h < 13 ? "BUEN DÍA, SOY" : "BUENAS TARDES, SOY"; }
memStart(); quizReset();
let savedAccent = "";
try { savedAccent = localStorage.getItem("portfolio-accent") || ""; } catch (error) {}
setAccent(savedAccent);
applyLang();
