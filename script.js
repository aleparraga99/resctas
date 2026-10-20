const $ = id => document.getElementById(id);

/* =========================================================
   Conceptos
   ========================================================= */
const conceptData = {
  parallel: {
    symbol: "∥",
    eyebrow: "DOS RECTAS QUE NO SE CRUZAN",
    title: "Rectas paralelas",
    text: "Aunque las prolonguemos en ambos sentidos, nunca se encuentran. La distancia entre ellas se mantiene constante.",
    example: "los renglones de un cuaderno.",
    notation: "a ∥ b (se lee: «a es paralela a b»)",
    analytic: "Tienen la misma pendiente (m₁ = m₂) y distinta ordenada al origen (b₁ ≠ b₂). Ej.: y = 2x + 1 e y = 2x − 3."
  },
  secant: {
    symbol: "×",
    eyebrow: "DOS RECTAS QUE SE ENCUENTRAN",
    title: "Rectas secantes",
    text: "Se cortan en un único punto. Al cruzarse forman ángulos; no todos los cruces son iguales.",
    example: "las hojas de una tijera abierta.",
    notation: "a y b se cortan en un punto P",
    analytic: "Tienen distinta pendiente (m₁ ≠ m₂). La ordenada al origen puede ser igual o distinta. Ej.: y = x + 1 e y = 3x − 2."
  },
  perpendicular: {
    symbol: "⊥",
    eyebrow: "UN CASO ESPECIAL DE SECANTES",
    title: "Rectas perpendiculares",
    text: "Son rectas secantes que se cruzan formando cuatro ángulos rectos, cada uno de 90°.",
    example: "los bordes de una hoja de papel.",
    notation: "a ⊥ b (se lee: «a es perpendicular a b»)",
    analytic: "El producto de las pendientes es −1 (m₁ · m₂ = −1): una es la opuesta de la inversa de la otra. Ej.: y = 2x + 1 e y = −½x + 4. Caso especial: una recta horizontal y una vertical (que no tiene pendiente)."
  }
};

document.querySelectorAll(".concept-card").forEach(card => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".concept-card").forEach(c => {
      c.classList.remove("selected");
      c.setAttribute("aria-pressed", "false");
    });
    card.classList.add("selected");
    card.setAttribute("aria-pressed", "true");
    const data = conceptData[card.dataset.concept];
    $("detailSymbol").textContent = data.symbol;
    $("detailEyebrow").textContent = data.eyebrow;
    $("detailTitle").textContent = data.title;
    $("detailText").textContent = data.text;
    document.querySelector(".example-line").innerHTML = `<strong>Ejemplo:</strong> ${data.example}`;
    $("detailNotation").textContent = data.notation;
    $("detailAnalytic").textContent = data.analytic;
  });
});

/* =========================================================
   Laboratorio: recta fija a (y = 2x − 1) y recta b (y = m₂x + b₂)
   ========================================================= */
const S = 36, OX = 300, OY = 150;     // escala: 36 px por unidad; origen en el centro
const A = { m: 2, b: -1 };
const MINUS = "−";
const sx = x => OX + S * x;
const sy = y => OY - S * y;

function num(v) {
  const r = Number(v.toFixed(2));
  return String(r).replace("-", MINUS).replace(".", ",");
}
function deg(v) {
  const r = Math.round(v * 10) / 10;
  return String(r).replace(".", ",") + "°";
}
function eqText(m, b) {
  if (m === 0) return "y = " + num(b);
  const am = Math.abs(m);
  let s = "y = " + (m < 0 ? MINUS : "") + (am === 1 ? "" : num(am)) + "x";
  if (b > 0) s += " + " + num(b);
  else if (b < 0) s += " " + MINUS + " " + num(-b);
  return s;
}

function drawGrid() {
  let g = "";
  for (let i = -8; i <= 8; i++) g += `<line class="grid-line" x1="${sx(i)}" y1="0" x2="${sx(i)}" y2="300"/>`;
  for (let j = -4; j <= 4; j++) g += `<line class="grid-line" x1="0" y1="${sy(j)}" x2="600" y2="${sy(j)}"/>`;
  g += `<line class="axis-line" x1="0" y1="${OY}" x2="600" y2="${OY}"/><line class="axis-line" x1="${OX}" y1="0" x2="${OX}" y2="300"/>`;
  for (let i = -8; i <= 8; i++) if (i !== 0) g += `<text class="tick" x="${sx(i)}" y="${OY + 16}" text-anchor="middle">${i < 0 ? MINUS + -i : i}</text>`;
  for (let j = -4; j <= 4; j++) if (j !== 0) g += `<text class="tick" x="${OX - 7}" y="${sy(j) + 4}" text-anchor="end">${j < 0 ? MINUS + -j : j}</text>`;
  $("labGrid").innerHTML = g;
}

function setLine(el, m, b) {
  el.setAttribute("x1", sx(-10)); el.setAttribute("y1", sy(m * -10 + b));
  el.setAttribute("x2", sx(10));  el.setAttribute("y2", sy(m * 10 + b));
}

// ubica la etiqueta de la recta dentro del dibujo
function placeName(el, m, b) {
  let x = 7, y = m * x + b;
  if (Math.abs(y) > 3.4) {
    y = Math.sign(y) * 3.4;
    x = m === 0 ? 7 : (y - b) / m;
  }
  if (m === 0) y = b;
  el.setAttribute("x", sx(x) + 8);
  el.setAttribute("y", sy(y) + (y >= 3.4 ? 24 : -10));
}

function updateLab(m, b) {
  setLine($("labB"), m, b);
  placeName($("labNameB"), m, b);
  $("eqB").textContent = eqText(m, b);
  $("eqBvals").textContent = `m₂ = ${num(m)} · b₂ = ${num(b)}`;
  $("labMVal").textContent = num(m);
  $("labBVal").textContent = num(b);
  $("labM").setAttribute("aria-valuetext", `pendiente ${num(m)}`);
  $("labBInt").setAttribute("aria-valuetext", `ordenada al origen ${num(b)}`);

  const angle = Math.abs(Math.atan(m) - Math.atan(A.m)) * 180 / Math.PI;
  $("labAngle").textContent = deg(angle > 90 ? 180 - angle : angle);

  const point = $("labPoint"), ptxt = $("labPointText"), right = $("labRight");
  point.style.display = "none";
  ptxt.textContent = "";
  right.setAttribute("d", "");

  let state, title, text, cond, note = "";
  const sameSlope = m === A.m;
  const perp = Math.abs(A.m * m + 1) < 1e-9;

  if (sameSlope && b === A.b) {
    state = "parallel";
    title = "Coincidentes (la misma recta)";
    text = "Misma pendiente y misma ordenada al origen: las dos ecuaciones describen la misma recta.";
    cond = `m₁ = m₂ y b₁ = b₂`;
    note = "Se superponen: tienen infinitos puntos en común. Cambiá b₂ para separarlas.";
  } else if (sameSlope) {
    state = "parallel";
    title = "Paralelas";
    text = "Misma pendiente y distinta ordenada al origen: avanzan igual y nunca se cortan.";
    cond = `m₁ = m₂  (${num(A.m)} = ${num(m)})`;
    note = `Lo único distinto es b: ${num(A.b)} y ${num(b)}. Cambiar b desplaza la recta sin girarla.`;
  } else {
    const x = (b - A.b) / (A.m - m);
    const y = A.m * x + A.b;
    if (perp) {
      state = "perpendicular";
      title = "Perpendiculares";
      text = "Las pendientes son opuestas e inversas: se cortan formando cuatro ángulos de 90°.";
      cond = `m₁ · m₂ = ${num(A.m)} · (${num(m)}) = ${MINUS}1`;
    } else {
      state = "secant";
      title = "Secantes";
      text = "Distinta pendiente: se cortan en un único punto.";
      cond = `m₁ ≠ m₂  (${num(A.m)} ≠ ${num(m)})`;
    }
    const inView = Math.abs(x) < 8 && Math.abs(y) < 4;
    note = `Punto de corte: P(${num(x)}; ${num(y)})` + (inView ? "." : ", fuera del dibujo: hay que prolongar las rectas.");
    if (inView) {
      point.setAttribute("cx", sx(x)); point.setAttribute("cy", sy(y));
      point.style.display = "";
      ptxt.setAttribute("x", sx(x) + 10); ptxt.setAttribute("y", sy(y) + 24);
      ptxt.textContent = `P(${num(x)}; ${num(y)})`;
      if (perp) {
        let ux = 1, uy = -A.m, vx = 1, vy = -m;
        const nu = Math.hypot(ux, uy), nv = Math.hypot(vx, vy);
        ux /= nu; uy /= nu; vx /= nv; vy /= nv;
        if (vy > 0) { vx = -vx; vy = -vy; }
        const r = 22, px = sx(x), py = sy(y);
        right.setAttribute("d", `M${px + r * ux} ${py + r * uy} L${px + r * (ux + vx)} ${py + r * (uy + vy)} L${px + r * vx} ${py + r * vy}`);
      }
    }
  }

  $("labTitle").textContent = title;
  $("labText").textContent = text;
  $("labCond").textContent = cond;
  $("labNote").textContent = note;
  $("labState").dataset.state = state;
}

function readSliders() { updateLab(Number($("labM").value), Number($("labBInt").value)); }
$("labM").addEventListener("input", readSliders);
$("labBInt").addEventListener("input", readSliders);
document.querySelectorAll(".presets button").forEach(btn => {
  btn.addEventListener("click", () => {
    $("labM").value = btn.dataset.m;
    $("labBInt").value = btn.dataset.b;
    readSliders();
  });
});
drawGrid();
setLine($("labA"), A.m, A.b);
placeName($("labNameA"), A.m, A.b);
readSliders();

/* =========================================================
   Actividad: detectives de rectas
   ========================================================= */
const TYPES = [
  { id: "parallel", label: "Paralelas" },
  { id: "secant", label: "Secantes" },
  { id: "perpendicular", label: "Perpendiculares" }
];

const questions = [
  {
    text: "Los rieles de una vía recta, vistos desde arriba, ¿qué relación representan?",
    options: TYPES, answer: "parallel", draw: "parallel",
    explanation: "Los rieles mantienen la misma distancia y no se cruzan."
  },
  {
    text: "Dos calles se cruzan formando una esquina de 90°. ¿Cómo son sus rectas?",
    options: TYPES, answer: "perpendicular", draw: "perpendicular",
    explanation: "Un ángulo de 90° es un ángulo recto: son perpendiculares."
  },
  {
    text: "Dos lápices se cruzan formando una X, pero no forman ángulos rectos. ¿Qué tipo de rectas representan?",
    options: TYPES, answer: "secant", draw: "secant",
    explanation: "Se cruzan en un punto, pero no forman 90°: son secantes no perpendiculares."
  },
  {
    text: "Mirá las ecuaciones y = 3x + 2 e y = 3x − 5. ¿Qué relación hay entre sus rectas?",
    options: TYPES, answer: "parallel", draw: "eq",
    explanation: "Tienen la misma pendiente (m = 3) y distinta ordenada al origen (2 y −5): son paralelas."
  },
  {
    text: "Mirá las ecuaciones y = 2x + 1 e y = −½x + 4. ¿Cómo son sus rectas?",
    options: TYPES, answer: "perpendicular", draw: "eq",
    explanation: "Las pendientes se multiplican y dan −1: 2 · (−½) = −1. Eso pasa solo con rectas perpendiculares."
  },
  {
    text: "Mirá las ecuaciones y = x + 1 e y = 2x + 1. ¿Qué relación tienen sus rectas?",
    options: TYPES, answer: "secant", draw: "eq",
    explanation: "Las pendientes son distintas (1 y 2), así que se cortan. Como comparten la ordenada al origen, se cortan justo en (0; 1). No son perpendiculares: 1 · 2 = 2, no −1."
  },
  {
    text: "Las rectas perpendiculares, ¿también son secantes?",
    options: [
      { id: "yes", label: "Sí: se cortan, y además forman 90°" },
      { id: "no1", label: "No: las perpendiculares nunca se cortan" },
      { id: "no2", label: "No: solo son secantes si forman 45°" }
    ],
    answer: "yes", draw: "perpendicular",
    explanation: "Toda pareja de perpendiculares se corta en un punto, así que es un caso especial de secantes."
  },
  {
    text: "Una recta tiene pendiente m = 4. ¿Qué pendiente debe tener una recta perpendicular a ella?",
    options: [
      { id: "inv", label: "m = −¼" },
      { id: "opp", label: "m = −4" },
      { id: "rec", label: "m = ¼" }
    ],
    answer: "inv", draw: "eq",
    explanation: "El producto de las pendientes tiene que ser −1: 4 · (−¼) = −1. No alcanza con cambiar el signo ni con invertir el número: hay que hacer las dos cosas."
  }
];

let current = 0, score = 0, answered = false, missed = [];
let order = []; // orden de preguntas de la ronda actual

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function drawFigure(type) {
  const paths = {
    parallel: '<path d="M30 35 H270 M30 85 H270"/>',
    secant: '<path d="M40 100 L260 20 M40 20 L260 100"/>',
    perpendicular: '<path d="M30 60 H270 M150 10 V110"/><path class="right-angle" d="M150 60 H175 V35 H150"/>'
  };
  if (type === "eq") {
    $("quizIllustration").innerHTML = '<div class="eq-hint">y = mx + b<small>m: pendiente · b: ordenada al origen</small></div>';
    return;
  }
  $("quizIllustration").innerHTML = `<svg viewBox="0 0 300 120" aria-hidden="true">${paths[type]}</svg>`;
}

function renderQuestion() {
  answered = false;
  const q = questions[order[current]];
  $("questionCount").textContent = `PREGUNTA ${current + 1} DE ${questions.length}`;
  $("score").textContent = `Aciertos: ${score}`;
  const pct = (current / questions.length) * 100;
  $("progressBar").style.width = `${pct}%`;
  $("progressBar").parentElement.setAttribute("aria-valuenow", Math.round(pct));
  $("questionText").textContent = q.text;
  drawFigure(q.draw);
  $("feedback").textContent = "Elegí una respuesta para comprobar tu idea.";
  $("feedback").className = "feedback";
  $("nextBtn").disabled = true;
  $("nextBtn").innerHTML = current === questions.length - 1
    ? 'Ver resultado <span aria-hidden="true">→</span>'
    : 'Siguiente <span aria-hidden="true">→</span>';
  const box = $("answers");
  box.innerHTML = "";
  box.style.display = "grid";
  shuffle(q.options).forEach(opt => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.answer = opt.id;
    btn.textContent = opt.label;
    box.appendChild(btn);
  });
}

$("answers").addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (!btn || answered) return;
  answered = true;
  const q = questions[order[current]];
  const correct = btn.dataset.answer === q.answer;
  if (correct) score++; else missed.push(current + 1);
  document.querySelectorAll("#answers button").forEach(b => {
    b.disabled = true;
    if (b.dataset.answer === q.answer) b.classList.add("correct");
  });
  if (!correct) btn.classList.add("incorrect");
  $("score").textContent = `Aciertos: ${score}`;
  $("feedback").textContent = correct ? `¡Correcto! ${q.explanation}` : `Casi. ${q.explanation}`;
  $("feedback").className = `feedback ${correct ? "good" : "bad"}`;
  $("nextBtn").disabled = false;
  $("nextBtn").focus({ preventScroll: true });
});

$("nextBtn").addEventListener("click", () => {
  if (!answered) return;
  if (current < questions.length - 1) {
    current++;
    renderQuestion();
  } else {
    $("questionCount").textContent = "ACTIVIDAD COMPLETADA";
    $("questionText").textContent = `¡Terminaste! Tu resultado: ${score} de ${questions.length} aciertos.`;
    $("quizIllustration").innerHTML = '<div style="font-size:52px;color:#8e79e8">✦</div>';
    $("answers").style.display = "none";
    $("feedback").textContent = missed.length === 0
      ? "¡Excelente! Reconocés muy bien las relaciones entre rectas."
      : "Repasá las tarjetas de conceptos y probá de nuevo las que te costaron. Podés reiniciar la actividad.";
    $("feedback").className = "feedback good";
    $("nextBtn").disabled = true;
    $("nextBtn").textContent = "Actividad terminada";
    $("progressBar").style.width = "100%";
    $("progressBar").parentElement.setAttribute("aria-valuenow", 100);
  }
});

function startQuiz() {
  current = 0; score = 0; missed = [];
  // las dos primeras quedan fijas (más simples); el resto se mezcla
  order = [0, 1, ...shuffle(questions.map((_, i) => i).slice(2))];
  renderQuestion();
}
$("restartBtn").addEventListener("click", startQuiz);
startQuiz();

/* =========================================================
   Tema
   ========================================================= */
$("themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  $("themeBtn").textContent = document.body.classList.contains("dark") ? "☀" : "☾";
});

/* =========================================================
   Cronómetro de la clase (60 min)
   ========================================================= */
const TOTAL = 60 * 60;
let remaining = TOTAL, timerId = null, endAt = 0;

function renderTimer() {
  const m = Math.floor(Math.max(remaining, 0) / 60);
  const s = Math.max(remaining, 0) % 60;
  $("timerText").textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  $("timerBtn").classList.toggle("running", timerId !== null);
  $("timerBtn").classList.toggle("warn", remaining <= 300 && remaining > 0);
}
function tick() {
  remaining = Math.max(0, Math.round((endAt - Date.now()) / 1000));
  if (remaining === 0) stopTimer();
  renderTimer();
}
function stopTimer() {
  clearInterval(timerId);
  timerId = null;
}
$("timerBtn").addEventListener("click", () => {
  if (timerId !== null) { stopTimer(); renderTimer(); return; }
  if (remaining === 0) remaining = TOTAL;
  endAt = Date.now() + remaining * 1000;
  timerId = setInterval(tick, 1000);
  renderTimer();
});
$("timerReset").addEventListener("click", () => {
  stopTimer();
  remaining = TOTAL;
  renderTimer();
});
renderTimer();

/* =========================================================
   Navegación entre pantallas
   ========================================================= */
const sections = [...document.querySelectorAll("main > section")];
const navLinks = [...document.querySelectorAll("#mainNav a")];
let activeIndex = 0;

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    activeIndex = sections.indexOf(entry.target);
    navLinks.forEach(a => {
      if (a.getAttribute("href") === `#${entry.target.id}`) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  });
}, { threshold: 0.45 });
sections.forEach(s => observer.observe(s));

$("backToTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

document.addEventListener("keydown", e => {
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  if (e.target.closest("input, textarea, select")) return; // no pisar el control deslizante
  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
  const next = e.key === "ArrowRight" ? activeIndex + 1 : activeIndex - 1;
  if (next >= 0 && next < sections.length) {
    e.preventDefault();
    sections[next].scrollIntoView({ behavior: "smooth" });
  }
});
