// Tema oscuro/claro
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeLabel = document.querySelector(".theme-label");

const THEMES = ["dark", "light", "retro"];
const THEME_META = { dark: ["bi bi-sun-fill", "Modo claro", "#101522"], light: ["bi bi-lightning-charge-fill", "Modo neón", "#f6f7fb"], retro: ["bi bi-moon-stars-fill", "Modo oscuro", "#0a0014"] };
function applyTheme(theme) {
  if (!THEMES.includes(theme)) theme = "dark";
  root.dataset.theme = theme;
  const [icon, label, color] = THEME_META[theme];
  themeIcon.className = icon;
  themeLabel.textContent = label;
  themeToggle.setAttribute("aria-label", label);
  document.querySelector('meta[name="theme-color"]').setAttribute("content", color);
}

let savedTheme = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
try {
  savedTheme = localStorage.getItem("portfolio-theme") || savedTheme;
} catch (error) {
  // Si el navegador bloquea localStorage, el sitio sigue funcionando.
}
applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const nextTheme = THEMES[(THEMES.indexOf(root.dataset.theme) + 1) % THEMES.length];
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
    gameWin();
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
  "Consejo de": "Security", "Seguridad": "Council", "ONU": "UN", "Norte argentino": "Northern Argentina", "Solidaridad": "Giving back", "Mundo": "World", "Modo neón": "Neon mode", "Relojes, mapa y": "Clocks, map and", "cuenta regresiva": "countdown",
  "Útiles para el": "School supplies for the", "norte argentino": "northern Argentina", "Más": "More", "repositorios": "repositories", "Columnas y": "Columns and", "reflexiones": "reflections",
  "Bruselas": "Brussels", "Pekín": "Beijing", "Nueva York · ONU": "New York · UN", "Washington D. C.": "Washington, D.C.", "Ciudad de México": "Mexico City", "Berlín": "Berlin", "Moscú": "Moscow", "Nueva Delhi": "New Delhi",
  "Hacé click en": "Click on", "Puntos:": "Score:", "Ese es": "That's", "Pasá el mouse por un país.": "Hover over a country.", "No se pudo cargar el mapa.": "Couldn't load the map.", "Cargando mapa…": "Loading map…",
  "Ver": "View", "Todos": "All", "min de lectura": "min read", "Copiar": "Copy", "Donar online": "Donate online", "¡Alias copiado!": "Alias copied!",
  "Estoy armando el canal oficial para recibir aportes. Mientras tanto, escribime y lo coordinamos.": "I'm setting up the official way to receive contributions. Meanwhile, write to me and we'll sort it out.",
  "Hola, quiero colaborar con los útiles para las escuelas rurales del norte.": "Hi, I'd like to help with the school supplies for rural schools in the north.",
  "Quiero ayudar": "I want to help",
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
  showRecords(); quizRender(); renderDonate(); showMapInfo(); renderEssays(); unBuild();
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
const revealEls = $$(".section-heading, .row.g-4 > div, .about-card, .about-copy, .skill-list, .stats, .game-panel, .contact-panel, .timeline li, .skill-bars, .clock, .countdown, .map-card, .info-card, .donate-panel, .term, .un-card");
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
const cmds = [["Portfolio", () => go("#portfolio")], ["Sobre mí", () => go("#acerca-de-mi")], ["Mi camino", () => go("#camino")], ["Juegos", () => go("#juego")], ["Mundo", () => go("#mundo")], ["ONU", () => go("#onu")], ["Solidaridad", () => go("#solidaridad")], ["Terminal", () => { go("#terminal"); setTimeout(() => $("#termIn").focus({ preventScroll: true }), 700); }], ["Contacto", () => go("#contacto")], ["Cambiar tema", () => themeToggle.click()], ["Cambiar idioma", () => $("#langToggle").click()], ["Lanzar confeti", confetti]];
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
[pm, pal, $("#essayModal")].forEach((d) => d.addEventListener("click", (e) => { if (e.target === d) d.close(); }));

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
  $("#records").textContent = `🏆 ${tr("Adivinar")}: ${f(best)} · ${tr("Memoria")}: ${f(rec.memory)} · Snake: ${f(rec.snake)} · Quiz: ${f(rec.quiz)} · ONU: ${rec.onu ? "⭐".repeat(rec.onu) : "–"}`;
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
    if (--memLeft === 0) { setRecord("memory", memMoves, true); gameWin(); }
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
    if (qi >= 8) { setRecord("quiz", quizScoreV); if (quizScoreV >= 6) gameWin(); }
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

/* ================= EXTRAS 3 ================= */
const L = (es, en) => (lang === "en" ? en : es);
const loadScript = (src) => new Promise((ok, no) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); });

// Relojes del mundo + cuenta regresiva
const ZONES = [["Buenos Aires", "America/Argentina/Buenos_Aires"], ["Washington D. C.", "America/New_York"], ["Bruselas", "Europe/Brussels"], ["Pekín", "Asia/Shanghai"], ["Nueva York · ONU", "America/New_York"]];
const UNI_START = new Date("2027-03-01T00:00:00-03:00"); // fecha estimada: cambiala cuando sepas la real
const clocksEl = $("#clocks");
clocksEl.innerHTML = ZONES.map((z) => `<div class="clock"><b>${z[0]}</b><time></time><small></small></div>`).join("");
function tickClocks() {
  const now = new Date(), loc = lang === "en" ? "en-US" : "es-AR";
  $$(".clock", clocksEl).forEach((el, i) => {
    const tz = ZONES[i][1], h = Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: tz }).format(now));
    $("time", el).textContent = `${h < 7 || h >= 20 ? "🌙" : "☀️"} ${now.toLocaleTimeString("en-GB", { timeZone: tz })}`;
    $("small", el).textContent = now.toLocaleDateString(loc, { weekday: "short", day: "numeric", month: "short", timeZone: tz });
  });
  const d = Math.max(0, UNI_START - now), v = [d / 864e5, d / 36e5 % 24, d / 6e4 % 60, d / 1e3 % 60].map(Math.floor);
  $$("#countdown strong").forEach((s, i) => { s.textContent = String(v[i]).padStart(2, "0"); });
}
setInterval(tickClocks, 1000); tickClocks();

// Mapa interactivo (d3 + world-atlas desde CDN) y juego "ubicá el país"
const WORLD = { Argentina: ["Argentina", "🇦🇷", "Buenos Aires"], Brazil: ["Brasil", "🇧🇷", "Brasilia"], Chile: ["Chile", "🇨🇱", "Santiago"], Uruguay: ["Uruguay", "🇺🇾", "Montevideo"], Paraguay: ["Paraguay", "🇵🇾", "Asunción"], Bolivia: ["Bolivia", "🇧🇴", "Sucre / La Paz"], Peru: ["Perú", "🇵🇪", "Lima"], Colombia: ["Colombia", "🇨🇴", "Bogotá"], Mexico: ["México", "🇲🇽", "Ciudad de México"], "United States of America": ["Estados Unidos", "🇺🇸", "Washington D. C."], Canada: ["Canadá", "🇨🇦", "Ottawa"], France: ["Francia", "🇫🇷", "París"], Spain: ["España", "🇪🇸", "Madrid"], Italy: ["Italia", "🇮🇹", "Roma"], Germany: ["Alemania", "🇩🇪", "Berlín"], Russia: ["Rusia", "🇷🇺", "Moscú"], China: ["China", "🇨🇳", "Pekín"], Japan: ["Japón", "🇯🇵", "Tokio"], India: ["India", "🇮🇳", "Nueva Delhi"], Australia: ["Australia", "🇦🇺", "Canberra"], Egypt: ["Egipto", "🇪🇬", "El Cairo"], "South Africa": ["Sudáfrica", "🇿🇦", "Pretoria"] };
const wName = (k) => (WORLD[k] ? (lang === "en" ? k : WORLD[k][0]) : k);
const mapTip = document.createElement("div"); mapTip.className = "map-tip"; mapTip.hidden = true;
let mapState = "loading", mapTarget = null, mapScore = 0;
function showMapInfo() {
  const el = $("#mapInfo");
  if (mapState === "loading") el.textContent = tr("Cargando mapa…");
  else if (mapState === "error") el.textContent = tr("No se pudo cargar el mapa.");
  else el.textContent = mapTarget ? `${tr("Hacé click en")}: ${WORLD[mapTarget][1]} ${wName(mapTarget)} · ${tr("Puntos:")} ${mapScore}` : tr("Pasá el mouse por un país.");
}
function mapNext() { const k = Object.keys(WORLD); mapTarget = k[Math.random() * k.length | 0]; showMapInfo(); }
$("#mapGame").addEventListener("click", () => {
  if (mapState !== "ready") return;
  if (mapTarget) mapTarget = null; else { mapScore = 0; mapNext(); }
  $("#mapGame").classList.toggle("active", !!mapTarget); mapTip.hidden = true; showMapInfo();
});
async function initMap() {
  const box = $("#map");
  try {
    const world = await worldData();
    const feats = topojson.feature(world, world.objects.countries).features, W = 960, H = 500;
    const path = d3.geoPath(d3.geoNaturalEarth1().fitSize([W, H], { type: "Sphere" }));
    const svg = d3.select(box).append("svg").attr("viewBox", `0 0 ${W} ${H}`).attr("role", "img").attr("aria-label", "Mapa del mundo");
    svg.append("path").attr("class", "sphere").attr("d", path({ type: "Sphere" }));
    svg.selectAll(".country").data(feats).join("path").attr("class", (d) => "country" + (WORLD[d.properties.name] ? " known" : "")).attr("d", path)
      .on("mousemove click", (e, d) => {
        const n = d.properties.name;
        if (e.type === "click" && mapTarget) {
          if (n === mapTarget) { mapScore++; mapNext(); } else toast(`${tr("Ese es")} ${wName(n)}`);
          return;
        }
        if (mapTarget) return;
        const r = box.getBoundingClientRect();
        mapTip.hidden = false; mapTip.style.left = e.clientX - r.left + 12 + "px"; mapTip.style.top = e.clientY - r.top + 12 + "px";
        mapTip.textContent = WORLD[n] ? `${WORLD[n][1]} ${wName(n)} · ${tr(WORLD[n][2])}` : n;
      })
      .on("mouseleave", () => { mapTip.hidden = true; });
    box.appendChild(mapTip); mapState = "ready";
  } catch (error) { mapState = "error"; }
  showMapInfo();
}
new IntersectionObserver(([e], o) => { if (e.isIntersecting) { o.disconnect(); initMap(); } }, { rootMargin: "300px" }).observe($("#mundo"));

// Donaciones: completá alias y/o link cuando tengas el canal oficial
const DONATIONS = { alias: "", link: "" };
function renderDonate() {
  const dm = $("#donateMethods"); dm.textContent = "";
  if (!DONATIONS.alias && !DONATIONS.link) {
    const p = document.createElement("p"); p.className = "game-message";
    p.textContent = tr("Estoy armando el canal oficial para recibir aportes. Mientras tanto, escribime y lo coordinamos.");
    dm.appendChild(p); return;
  }
  const row = document.createElement("div"); row.className = "don-row";
  if (DONATIONS.alias) {
    row.innerHTML = `<span>Alias:</span><strong></strong><button class="chip" type="button"></button>`;
    $("strong", row).textContent = DONATIONS.alias; $("button", row).textContent = tr("Copiar");
    $("button", row).addEventListener("click", () => navigator.clipboard?.writeText(DONATIONS.alias).then(() => toast(tr("¡Alias copiado!"))));
  }
  if (DONATIONS.link) {
    const a = document.createElement("a"); a.className = "chip"; a.href = DONATIONS.link; a.target = "_blank"; a.rel = "noopener noreferrer"; a.textContent = tr("Donar online"); row.appendChild(a);
  }
  dm.appendChild(row);
}
$("#donateContact").addEventListener("click", () => {
  go("#contacto");
  const m = $("#mensaje"); if (!m.value) m.value = tr("Hola, quiero colaborar con los útiles para las escuelas rurales del norte.");
  setTimeout(() => m.focus({ preventScroll: true }), 700);
});

// Columnas: agregá tus textos acá y la sección aparece sola
const ESSAYS = [
  // { title: "Título", date: "2026-11-10", tag: "Política", body: "Primer párrafo.\n\nSegundo párrafo." },
];
let essayTag = "all";
function renderEssays() {
  if (!ESSAYS.length) return;
  $("#columnas").hidden = false;
  const tags = ["all", ...new Set(ESSAYS.map((e) => e.tag))];
  $("#essayFilters").innerHTML = tags.map((t) => `<button class="chip${t === essayTag ? " active" : ""}" type="button" data-tag="${t}">${t === "all" ? tr("Todos") : t}</button>`).join("");
  const list = $("#essayList"); list.textContent = "";
  ESSAYS.filter((e) => essayTag === "all" || e.tag === essayTag).sort((a, b) => b.date.localeCompare(a.date)).forEach((e) => {
    const min = Math.max(1, Math.ceil(e.body.split(/\s+/).length / 200));
    const meta = `${new Date(e.date + "T12:00:00").toLocaleDateString(lang === "en" ? "en-US" : "es-AR", { day: "numeric", month: "long", year: "numeric" })} · ${min} ${tr("min de lectura")}`;
    const b = document.createElement("button"); b.type = "button"; b.className = "essay";
    b.innerHTML = `<span class="project-type"></span><h3></h3><small></small>`;
    $(".project-type", b).textContent = e.tag; $("h3", b).textContent = e.title; $("small", b).textContent = meta;
    b.addEventListener("click", () => {
      $("#emTag").textContent = e.tag; $("#emTitle").textContent = e.title; $("#emMeta").textContent = meta;
      const body = $("#emBody"); body.textContent = "";
      e.body.split(/\n\n+/).forEach((t) => { const p = document.createElement("p"); p.textContent = t; body.appendChild(p); });
      $("#essayModal").showModal();
    });
    list.appendChild(b);
  });
}
$("#essayFilters").addEventListener("click", (e) => { const b = e.target.closest("[data-tag]"); if (b) { essayTag = b.dataset.tag; renderEssays(); } });
$("[data-close2]").addEventListener("click", () => $("#essayModal").close());

// Repositorios nuevos de GitHub (aparecen solos)
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
  } catch (error) {}
})();

// Mini terminal
const termOut = $("#termOut"), termIn = $("#termIn"), hist = []; let hi = 0;
const print = (txt, cls) => { const d = document.createElement("div"); if (cls) d.className = cls; d.textContent = txt; termOut.appendChild(d); termOut.scrollTop = termOut.scrollHeight; };
const alias = { projects: "proyectos", contact: "contacto", donate: "donar", theme: "tema", language: "idioma", lang: "idioma", time: "hora", confetti: "confeti" };
const CMDS = {
  help: () => L("Comandos: about, proyectos, skills, contacto, donar, tema, idioma, hora, confeti, whoami, clear", "Commands: about, projects, skills, contact, donate, theme, language, time, confetti, whoami, clear"),
  about: () => $(".about-copy").textContent.trim(),
  whoami: () => "felipe",
  proyectos: () => cards.map((c) => "· " + $("h3", c).textContent).join("\n"),
  skills: () => "HTML · CSS · Bootstrap · JavaScript",
  contacto: () => { go("#contacto"); return L("Te llevo al formulario…", "Taking you to the form…"); },
  donar: () => { go("#solidaridad"); return L("Gracias por pensar en ayudar 💛", "Thanks for thinking of helping 💛"); },
  tema: () => { themeToggle.click(); return "ok"; },
  idioma: () => { $("#langToggle").click(); return "ok"; },
  hora: () => new Date().toLocaleTimeString(lang === "en" ? "en-US" : "es-AR"),
  confeti: () => { confetti(); return "🎉"; },
  clear: () => { termOut.textContent = ""; return ""; },
  sudo: () => L("Buen intento 😏", "Nice try 😏")
};
$("#termForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const raw = termIn.value.trim(); termIn.value = ""; if (!raw) return;
  hist.push(raw); hi = hist.length; print("$ " + raw, "cmd");
  const c = raw.toLowerCase().split(" ")[0], k = alias[c] ?? c;
  const out = Object.hasOwn(CMDS, k) ? CMDS[k]() : L(`Comando no encontrado: ${c}. Probá help.`, `Command not found: ${c}. Try help.`);
  if (out) print(out);
});
termIn.addEventListener("keydown", (e) => { if (e.key === "ArrowUp" && hi > 0) termIn.value = hist[--hi]; else if (e.key === "ArrowDown") termIn.value = hist[++hi] ?? ""; });
$("#term").addEventListener("click", () => termIn.focus());
print(L("Bienvenido. Escribí help para ver los comandos.", "Welcome. Type help to see the commands."));

// Estela del cursor, etiqueta "Ver" sobre tarjetas
if (finePointer && !reduceMotion) {
  const tc = document.createElement("canvas"); tc.className = "trail"; document.body.appendChild(tc);
  const tg = tc.getContext("2d"); let tp = [];
  const fit = () => { tc.width = innerWidth; tc.height = innerHeight; };
  fit(); addEventListener("resize", fit);
  addEventListener("mousemove", (e) => tp.push({ x: e.clientX, y: e.clientY, a: 1 }));
  (function loop() {
    tg.clearRect(0, 0, tc.width, tc.height);
    tp = tp.filter((p) => (p.a -= .035) > 0);
    tp.forEach((p) => { tg.globalAlpha = p.a * .6; tg.fillStyle = col.b; tg.beginPath(); tg.arc(p.x, p.y, 3 * p.a + 1, 0, 7); tg.fill(); });
    requestAnimationFrame(loop);
  })();
}
document.addEventListener("mouseover", (e) => {
  const c = e.target.closest(".project-card");
  ring.classList.toggle("cursor-view", !!c); ring.dataset.label = c ? tr("Ver") : "";
});

// Cortina entre secciones
const curtain = document.createElement("div"); curtain.className = "curtain"; document.body.appendChild(curtain);
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a || a.getAttribute("href").length < 2) return;
  const t = $(a.getAttribute("href")); if (!t) return;
  e.preventDefault();
  const nav = $("#navbarNav"); if (nav.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(nav).hide();
  if (reduceMotion) { t.scrollIntoView(); return; }
  curtain.classList.remove("in"); void curtain.offsetWidth; curtain.classList.add("in");
  setTimeout(() => { root.style.scrollBehavior = "auto"; t.scrollIntoView(); root.style.scrollBehavior = ""; }, 380);
});

// Ajustes de lectura
let fs = 100, hc = false;
try { fs = Number(localStorage.getItem("portfolio-fs")) || 100; hc = localStorage.getItem("portfolio-hc") === "1"; } catch (error) {}
function applyRead() {
  root.style.fontSize = fs + "%"; root.classList.toggle("hc", hc);
  try { localStorage.setItem("portfolio-fs", fs); localStorage.setItem("portfolio-hc", hc ? "1" : "0"); } catch (error) {}
}
$("#fontPlus").addEventListener("click", () => { fs = Math.min(140, fs + 10); applyRead(); });
$("#fontMinus").addEventListener("click", () => { fs = Math.max(80, fs - 10); applyRead(); });
$("#contrastBtn").addEventListener("click", () => { hc = !hc; applyRead(); });
applyRead();

/* ================= EXTRAS 4 ================= */
let worldP;
const worldData = () => (worldP ??= (async () => {
  await loadScript("https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js");
  await loadScript("https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js");
  return (await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json")).json();
})().catch((error) => { worldP = null; throw error; }));
function gameWin() { confetti(); mascotCheer(); }

// Mascota Condi (sección de donaciones)
const stage = $("#mascotStage"), condi = $("#condi"), bub = $("#condiBubble"), mbtn = $("#donateContact");
let cx = 10, cdir = 1, cst = "walk", cuntil = 0, nextStop = 0, mVisible = false, pointed = false, greeted = false, mlast = 0;
const setC = (s) => { cst = s; condi.className = "condi " + s; };
function placeBub() { bub.style.left = Math.max(0, Math.min(cx - 10, stage.clientWidth - bub.offsetWidth)) + "px"; }
function say(msg, ms = 3200) {
  bub.textContent = msg; bub.hidden = false; placeBub();
  clearTimeout(say.t); say.t = setTimeout(() => { bub.hidden = true; }, ms);
}
function stopFor(state, ms, msg) { setC(state); cuntil = performance.now() + ms; if (msg) say(msg, ms); }
const btnX = () => { const r = mbtn.getBoundingClientRect(), s = stage.getBoundingClientRect(); return r.left + r.width / 2 - s.left - 42; };
function mascotCheer() {
  if (mVisible) stopFor("cheer", 2400, L("¡Ganaste! 🎉 Me emociono. ¿Ayudás con los útiles?", "You won! 🎉 I'm so excited. Will you help with the supplies?"));
  else toast(L("¡Condi te felicita! 🦅 Visitalo en Solidaridad.", "Condi says congrats! 🦅 Visit him in Giving back."));
}
(function mloop(t) {
  requestAnimationFrame(mloop);
  const dt = Math.min(50, t - mlast) / 1000; mlast = t;
  if (!mVisible || reduceMotion) return;
  const max = Math.max(0, stage.clientWidth - 84);
  if (cst === "walk") {
    cx += cdir * 48 * dt;
    if (cx <= 0) { cx = 0; cdir = 1; } else if (cx >= max) { cx = max; cdir = -1; }
    if (Math.abs(cx - btnX()) > 90) pointed = false;
    if (!pointed && Math.abs(cx - btnX()) < 5) { pointed = true; stopFor("talk", 3600, L("¡Acá podés ayudar! 👇", "Here's where you can help! 👇")); }
    else if (t > nextStop) stopFor("idle", 1600);
  } else if (t > cuntil) { setC("walk"); nextStop = t + 4000 + Math.random() * 3000; }
  condi.style.left = cx + "px"; condi.style.transform = cdir < 0 ? "scaleX(-1)" : "";
  if (!bub.hidden) placeBub();
})(0);
new IntersectionObserver(([e]) => {
  mVisible = e.isIntersecting;
  if (mVisible) {
    nextStop = performance.now() + 3000;
    if (!greeted) { greeted = true; stopFor("talk", 3400, L("¡Hola! Soy Condi 🦅 Te acompaño por acá.", "Hi! I'm Condi 🦅 I'll keep you company here.")); }
  }
}, { threshold: .3 }).observe(stage);
const facts = () => [L("Cada cuaderno cuenta 📓", "Every notebook counts 📓"), L("Tocá «Quiero ayudar» y escribile a Felipe 💛", "Tap “I want to help” and write to Felipe 💛"), L("El cóndor andino vuela sobre la cordillera. ¡Yo prefiero caminar! 😄", "The Andean condor soars over the Andes. I prefer walking! 😄"), L("Ganá un juego y me vas a ver festejar 🎉", "Win a game and you'll see me celebrate 🎉"), L("Compartí esta página con alguien 💌", "Share this page with someone 💌")];
const condiTalk = () => { const f = facts(); stopFor("talk", 3000, f[Math.random() * f.length | 0]); };
condi.addEventListener("click", condiTalk);
condi.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); condiTalk(); } });

// Simulador del Consejo de Seguridad: ¡negociá antes de votar! (la composición cambia sola en 2027)
const P5 = [["🇺🇸", "Estados Unidos", "United States", 1], ["🇬🇧", "Reino Unido", "United Kingdom", 1], ["🇫🇷", "Francia", "France", 1], ["🇷🇺", "Rusia", "Russia", 1], ["🇨🇳", "China", "China", 1]];
const E_BOTH = [["🇧🇭", "Baréin", "Bahrain", 0], ["🇨🇴", "Colombia", "Colombia", 0], ["🇨🇩", "RD del Congo", "DR Congo", 0], ["🇱🇻", "Letonia", "Latvia", 0], ["🇱🇷", "Liberia", "Liberia", 0]];
const E_2026 = [["🇩🇰", "Dinamarca", "Denmark", 0], ["🇬🇷", "Grecia", "Greece", 0], ["🇵🇰", "Pakistán", "Pakistan", 0], ["🇵🇦", "Panamá", "Panama", 0], ["🇸🇴", "Somalia", "Somalia", 0]];
const E_2027 = [["🇦🇹", "Austria", "Austria", 0], ["🇰🇬", "Kirguistán", "Kyrgyzstan", 0], ["🇵🇹", "Portugal", "Portugal", 0], ["🇹🇹", "Trinidad y Tobago", "Trinidad and Tobago", 0], ["🇿🇼", "Zimbabue", "Zimbabwe", 0]];
const UN = [...P5, ...(new Date().getFullYear() >= 2027 ? E_2027 : E_2026), ...E_BOTH];
const UNR = [
  { t: ["Ayuda humanitaria", "Humanitarian aid"], d: ["Enviar ayuda humanitaria a una región golpeada por una crisis. (Fácil)", "Send humanitarian aid to a region hit by a crisis. (Easy)"], mean: 1, ap: 7 },
  { t: ["Misión de paz", "Peacekeeping mission"], d: ["Desplegar cascos azules para vigilar un alto el fuego. (Medio)", "Deploy peacekeepers to monitor a ceasefire. (Medium)"], mean: 0, ap: 7 },
  { t: ["Sanciones", "Sanctions"], d: ["Imponer sanciones económicas a un gobierno que rompió un acuerdo. (Difícil)", "Impose economic sanctions on a government that broke an agreement. (Hard)"], mean: -1, ap: 8 }
];
const ACTS = {
  ayuda: { icon: "💰", cost: 2, es: "Ayuda económica", en: "Economic aid" },
  favor: { icon: "🤝", cost: 1, es: "Favor futuro", en: "Future favor" },
  texto: { icon: "📝", cost: 1, es: "Cambiar el texto", en: "Amend the text" },
  presion: { icon: "📢", cost: 1, es: "Presión pública", en: "Public pressure" },
  espiar: { icon: "🔍", cost: 1, es: "Investigar", en: "Investigate" }
};
const WANTS = Object.keys(ACTS).slice(0, 4);
const unGrid = $("#unGrid"), sleep = (ms) => new Promise((r) => setTimeout(r, ms)), clampN = (v, a, b) => Math.max(a, Math.min(b, v));
const stV = (s) => (s >= 1 ? "y" : s <= -1 ? "n" : "a"), moodE = (s) => ["😠", "😠", "😕", "😐", "🙂", "😄", "😄"][s + 3];
const vlabel = { y: () => L("Sí", "Yes"), n: () => "No", a: () => L("Abst.", "Abst.") };
let unRes = 0, unSt = [], unWant = [], unKnown = [], unAp = 0, unSel = -1, unBusy = false, unDone = false;
const unName = (i) => L(UN[i][1], UN[i][2]);
function unResult(text, kind) { const r = $("#unResult"); r.hidden = !text; r.textContent = text || ""; r.className = "un-result " + (kind || ""); }
function logAdd(msg) { const d = document.createElement("div"), box = $("#unLog"); d.textContent = msg; box.prepend(d); while (box.children.length > 4) box.lastChild.remove(); }
function unFx(i, txt) { const el = $$(".un-c", unGrid)[i]; if (!el) return; const f = document.createElement("span"); f.className = "fx"; f.textContent = txt; el.appendChild(f); setTimeout(() => f.remove(), 900); }
function unPaint(shown = UN.length) {
  let y = 0, n = 0, a = 0;
  $$(".un-c", unGrid).forEach((el, i) => {
    const v = stV(unSt[i]), on = i < shown;
    el.dataset.v = on ? v : ""; el.classList.toggle("sel", i === unSel);
    $(".mood", el).textContent = moodE(unSt[i]);
    $(".want", el).textContent = unKnown[i] ? ACTS[unWant[i]].icon : "";
    $("em", el).textContent = on ? vlabel[v]() : "?";
    if (on) { if (v === "y") y++; else if (v === "n") n++; else a++; }
  });
  $("#unY").textContent = y; $("#unN").textContent = n; $("#unA").textContent = a;
  $("#unMeter").style.width = (y / UN.length * 100) + "%"; $("#unMeter").classList.toggle("ok", y >= 9);
  $("#unAp").innerHTML = "⚡ " + Array.from({ length: UNR[unRes].ap }, (_, i) => `<span class="ap-dot${i < unAp ? " on" : ""}"></span>`).join("");
  const w = unSel >= 0 ? ACTS[unWant[unSel]] : null;
  $("#unHint").textContent = unDone ? "" : unSel < 0 ? L("Elegí un país para negociar con él.", "Pick a country to negotiate with.")
    : unKnown[unSel] ? L(`${unName(unSel)} valora: ${w.icon} ${w.es}.`, `${unName(unSel)} values: ${w.icon} ${w.en}.`)
    : L(`Negociando con ${unName(unSel)}. ¿Qué le ofrecés? (probá 🔍 para saber qué le importa)`, `Negotiating with ${unName(unSel)}. What do you offer? (try 🔍 to learn what it cares about)`);
  $$("#unActs button").forEach((b) => { b.disabled = unBusy || unDone || unSel < 0 || unAp < ACTS[b.dataset.a].cost; });
  $("#unVote").disabled = unBusy || unDone; $("#unVote").classList.toggle("beat", unAp <= 0 && !unDone && !unBusy);
}
function unBuild() {
  if (unBusy) return;
  $("#unRes").innerHTML = UNR.map((r, i) => `<button class="chip${i === unRes ? " active" : ""}" type="button" data-r="${i}">${L(...r.t)}</button>`).join("");
  $("#unDesc").textContent = L(...UNR[unRes].d);
  $("#unActs").innerHTML = Object.entries(ACTS).map(([k, a]) => `<button class="chip" type="button" data-a="${k}">${a.icon} ${L(a.es, a.en)} · ${a.cost}⚡</button>`).join("");
  unGrid.innerHTML = UN.map((c, i) => `<button class="un-c" type="button" data-i="${i}"><span class="want"></span><span class="fl">${c[0]}</span><b>${L(c[1], c[2])}</b><small>${c[3] ? "🛡 Veto" : "&nbsp;"}</small><span class="mood"></span><em></em></button>`).join("");
  unPaint();
}
function unNew() {
  const m = UNR[unRes]; let y, tries = 0;
  do { unSt = UN.map(() => clampN(Math.round(m.mean + Math.random() * 4 - 2), -3, 3)); y = unSt.filter((s) => s >= 1).length; } while ((y < 3 || y > 7) && ++tries < 80);
  unWant = UN.map(() => WANTS[Math.random() * 4 | 0]); unKnown = UN.map(() => false);
  unAp = m.ap; unSel = -1; unBusy = false; unDone = false; unResult(null); $("#unLog").textContent = "";
  unBuild();
  logAdd(L("Misión: conseguí 9 votos a favor y evitá el veto de los 🛡.", "Mission: get 9 votes in favor and avoid a veto from the 🛡 members."));
}
function unEvent() {
  const i = Math.random() * UN.length | 0, r = Math.random(), nm = unName(i);
  if (r < .4) { unSt[i] = clampN(unSt[i] - 1, -3, 3); unFx(i, "📰"); logAdd(L(`📰 Filtración en la prensa: ${nm} se pone más duro.`, `📰 Press leak: ${nm} hardens its stance.`)); }
  else if (r < .8) { unSt[i] = clampN(unSt[i] + 1, -3, 3); unFx(i, "🌍"); logAdd(L(`🌍 La opinión pública presiona: ${nm} se ablanda.`, `🌍 Public opinion pushes: ${nm} softens.`)); }
  else { unSt[i] = 0; unFx(i, "🗳️"); logAdd(L(`🗳️ Cambio de gobierno en ${nm}: vuelve a la neutralidad.`, `🗳️ Government change in ${nm}: back to neutral.`)); }
}
unGrid.addEventListener("click", (e) => { const c = e.target.closest(".un-c"); if (!c || unBusy || unDone) return; unSel = Number(c.dataset.i); unPaint(); });
$("#unRes").addEventListener("click", (e) => { const b = e.target.closest("[data-r]"); if (!b || unBusy) return; unRes = Number(b.dataset.r); unNew(); });
$("#unReset").addEventListener("click", () => { if (!unBusy) unNew(); });
$("#unActs").addEventListener("click", (e) => {
  const b = e.target.closest("[data-a]"); if (!b || b.disabled) return;
  const k = b.dataset.a, a = ACTS[k], i = unSel, nm = unName(i);
  unAp -= a.cost;
  if (k === "espiar") { unKnown[i] = true; unFx(i, "🔍"); logAdd(L(`🔍 ${nm} valora: ${ACTS[unWant[i]].icon} ${ACTS[unWant[i]].es}.`, `🔍 ${nm} values: ${ACTS[unWant[i]].icon} ${ACTS[unWant[i]].en}.`)); }
  else {
    const good = unWant[i] === k, d = good ? 2 : k === "presion" ? (Math.random() < .5 ? -1 : 1) : (Math.random() < .5 ? 1 : 0);
    unSt[i] = clampN(unSt[i] + d, -3, 3); if (good) unKnown[i] = true;
    unFx(i, d > 0 ? "+" + d : d < 0 ? "💢" : "…");
    logAdd(good ? L(`✨ ¡${nm} se entusiasma con ${a.icon}!`, `✨ ${nm} loves ${a.icon}!`) : d > 0 ? L(`👍 ${nm} se ablanda un poco.`, `👍 ${nm} softens a bit.`) : d < 0 ? L(`💢 ${nm} se ofendió con tu presión.`, `💢 ${nm} resented your pressure.`) : L(`😐 ${nm} no se inmuta.`, `😐 ${nm} isn't moved.`));
  }
  if (Math.random() < .3) unEvent();
  if (unAp <= 0) logAdd(L("⏰ Se acabaron los puntos: ¡a votar!", "⏰ Out of points: time to vote!"));
  unPaint();
});
$("#unVote").addEventListener("click", async () => {
  if (unBusy || unDone) return;
  unBusy = true; unSel = -1; unResult(null);
  $$(".un-c", unGrid).forEach((el) => el.classList.remove("pop", "veto")); unPaint(0);
  for (let i = 0; i < UN.length; i++) {
    await sleep(reduceMotion ? 0 : 380); unPaint(i + 1);
    const el = $$(".un-c", unGrid)[i]; el.classList.add("pop");
    if (UN[i][3] && stV(unSt[i]) === "n") el.classList.add("veto");
  }
  await sleep(reduceMotion ? 0 : 500);
  const y = unSt.filter((s) => s >= 1).length, vet = UN.filter((c, i) => c[3] && unSt[i] <= -1).map((c) => L(c[1], c[2]));
  if (y >= 9 && !vet.length) {
    const stars = unAp >= 4 ? 3 : unAp >= 2 ? 2 : 1;
    unResult(L(`✅ ¡Resolución aprobada! ${y} votos y ningún veto. ${"⭐".repeat(stars)}`, `✅ Resolution adopted! ${y} votes and no veto. ${"⭐".repeat(stars)}`), "ok");
    setRecord("onu", stars); gameWin();
  } else if (y >= 9) unResult(L(`🛑 ¡Vetada! Llegó a ${y} votos, pero hubo veto de: ${vet.join(", ")}.`, `🛑 Vetoed! It reached ${y} votes, but it was vetoed by: ${vet.join(", ")}.`), "bad");
  else unResult(L(`❌ No alcanzó los 9 votos necesarios (tuvo ${y}). ¡Probá otra estrategia!`, `❌ It didn't reach the 9 votes needed (it got ${y}). Try another strategy!`), "bad");
  unBusy = false; unDone = true; unPaint();
});
unNew();

applyLang();
