const nameEl = document.getElementById("name");
const playground = document.getElementById("playground");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const hintEl = document.getElementById("hint");
const success = document.getElementById("success");

const confetti = document.getElementById("confetti");
const sparkles = document.getElementById("sparkles");

const toggleVibe = document.getElementById("toggleVibe");
const replayBtn = document.getElementById("replayBtn");
const copyBtn = document.getElementById("copyBtn");

let dodges = 0;
let vibeOn = true;

// OPTIONAL: change the name here
// nameEl.textContent = "YourName";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function trailPuff(x, y) {
  if (!vibeOn) return;

  const puff = document.createElement("div");
  puff.style.position = "fixed";
  puff.style.left = `${x}px`;
  puff.style.top = `${y}px`;
  puff.style.width = "10px";
  puff.style.height = "10px";
  puff.style.borderRadius = "50%";
  puff.style.pointerEvents = "none";
  puff.style.background = `radial-gradient(circle, rgba(255,60,134,.6), transparent 60%)`;
  puff.style.transform = "translate(-50%, -50%)";
  puff.style.zIndex = 9999;
  document.body.appendChild(puff);

  const dx = -20 + Math.random() * 40;
  const dy = -20 + Math.random() * 40;

  puff.animate(
    [
      { opacity: 0.9, transform: "translate(-50%, -50%) scale(1)" },
      {
        opacity: 0.0,
        transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(2.6)`,
      },
    ],
    { duration: 480, easing: "ease-out" }
  ).onfinish = () => puff.remove();
}

function moveNoButton(pointerX, pointerY) {
  const area = playground.getBoundingClientRect();
  const btn = noBtn.getBoundingClientRect();

  const padding = 10;
  const maxX = area.width - btn.width - padding;
  const maxY = area.height - btn.height - padding;

  // Jump away from pointer
  const px = pointerX ?? area.left + area.width / 2;
  const py = pointerY ?? area.top + area.height / 2;

  let x = Math.random() * maxX + padding;
  let y = Math.random() * maxY + padding;

  const currentCenterX = btn.left + btn.width / 2;
  const currentCenterY = btn.top + btn.height / 2;

  const awayX = (currentCenterX - px) * 0.6;
  const awayY = (currentCenterY - py) * 0.6;

  x = clamp(x + awayX, padding, maxX);
  y = clamp(y + awayY, padding, maxY);

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
  noBtn.style.transform = "translate(0, 0)";

  dodges++;

  // Yes grows each dodge
  const scale = 1 + Math.min(dodges * 0.08, 0.55);
  yesBtn.style.transform = `scale(${scale})`;

  // Text gets funnier each dodge
  const lines = [
    "“No” seems a bit shy 😈",
    "HEY 😭 stop running",
    "Be serious… click Yes 😌",
    "I will literally cry 🥺",
    "Okay now you’re just being mean 💀",
    "Last chance before I explode with confetti 😤",
    "Yes is looking REAL good right now 💖",
  ];
  hintEl.textContent = lines[Math.min(dodges, lines.length - 1)];

  // No changes too
  const noTexts = [
    "No",
    "nope",
    "pls stop",
    "💨",
    "AAAA",
    "not today",
    "fine…",
  ];
  noBtn.textContent = noTexts[Math.min(dodges, noTexts.length - 1)];

  noBtn.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(0.92)" },
      { transform: "scale(1)" },
    ],
    { duration: 140 }
  );
}

function onNoAttempt(e) {
  const x = e?.clientX ?? 0;
  const y = e?.clientY ?? 0;
  trailPuff(x, y);
  moveNoButton(x, y);
}

// Desktop dodges
noBtn.addEventListener("mouseover", onNoAttempt);
noBtn.addEventListener("mouseenter", onNoAttempt);

// Mobile: touch dodge
noBtn.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    const t = e.touches?.[0];
    trailPuff(t?.clientX ?? 0, t?.clientY ?? 0);
    moveNoButton(t?.clientX, t?.clientY);
  },
  { passive: false }
);

// In case they click it somehow
noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  onNoAttempt(e);
});

/* ====== FX helpers ====== */
function resizeCanvasToCard(canvas) {
  const card = document.getElementById("card");
  canvas.width = card.clientWidth;
  canvas.height = card.clientHeight;
}

function startConfetti() {
  if (!vibeOn) return;

  confetti.classList.remove("hidden");
  resizeCanvasToCard(confetti);

  const ctx = confetti.getContext("2d");
  const pieces = [];
  const count = 180;

  for (let i = 0; i < count; i++) {
    pieces.push({
      x: Math.random() * confetti.width,
      y: -20 - Math.random() * confetti.height,
      w: 4 + Math.random() * 6,
      h: 4 + Math.random() * 10,
      vx: -2 + Math.random() * 4,
      vy: 3 + Math.random() * 6,
      rot: Math.random() * Math.PI,
      vrot: -0.12 + Math.random() * 0.24,
      hue: Math.floor(Math.random() * 360),
    });
  }

  let frames = 0;
  function draw() {
    frames++;
    ctx.clearRect(0, 0, confetti.width, confetti.height);

    for (const p of pieces) {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vrot;

      if (p.y > confetti.height + 30) p.y = -30;
      if (p.x < -30) p.x = confetti.width + 30;
      if (p.x > confetti.width + 30) p.x = -30;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = `hsl(${p.hue}, 90%, 65%)`;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    if (frames < 220) requestAnimationFrame(draw);
    else confetti.classList.add("hidden");
  }
  draw();
}

function startSparkles() {
  if (!vibeOn) return;

  sparkles.classList.remove("hidden");
  resizeCanvasToCard(sparkles);

  const ctx = sparkles.getContext("2d");
  const stars = [];
  const count = 70;

  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * sparkles.width,
      y: Math.random() * sparkles.height,
      r: 0.8 + Math.random() * 2.4,
      a: Math.random(),
      va: 0.01 + Math.random() * 0.03,
    });
  }

  let frames = 0;
  function draw() {
    frames++;
    ctx.clearRect(0, 0, sparkles.width, sparkles.height);

    for (const s of stars) {
      s.a += s.va;
      const alpha = 0.25 + Math.abs(Math.sin(s.a)) * 0.55;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
    }

    if (frames < 220) requestAnimationFrame(draw);
    else sparkles.classList.add("hidden");
  }
  draw();
}

function typewriter(el, text) {
  el.textContent = "";
  let i = 0;
  const tick = () => {
    el.textContent += text[i];
    i++;
    if (i < text.length) setTimeout(tick, 18);
  };
  tick();
}

/* YES click */
yesBtn.addEventListener("click", () => {
  noBtn.style.display = "none";
  yesBtn.style.display = "none";

  hintEl.textContent = "Correct answer 💅";

  success.classList.remove("hidden");

  const cuteLines = [
    "You just made my whole week. Officially obsessed with you.",
    "Okay… now you’re stuck with me. Forever. 😌💖",
    "Mission complete: Valentine acquired. I’m so happy it’s you.",
  ];
  const pick = cuteLines[Math.floor(Math.random() * cuteLines.length)];
  typewriter(document.getElementById("loveLine"), pick);

  startConfetti();
  startSparkles();
});

replayBtn?.addEventListener("click", () => {
  startConfetti();
  startSparkles();
});

copyBtn?.addEventListener("click", async () => {
  const msg = `I said YES 💖 Now you owe me a date 😌`;
  try {
    await navigator.clipboard.writeText(msg);
    copyBtn.textContent = "Copied ✅";
    setTimeout(() => (copyBtn.textContent = "Copy a Cute Message"), 1200);
  } catch {
    copyBtn.textContent = "Couldn’t copy 😭";
    setTimeout(() => (copyBtn.textContent = "Copy a Cute Message"), 1200);
  }
});

toggleVibe.addEventListener("click", () => {
  vibeOn = !vibeOn;
  toggleVibe.setAttribute("aria-pressed", String(vibeOn));
  toggleVibe.textContent = vibeOn ? "✨ Vibes: ON" : "🧊 Vibes: OFF";
});

window.addEventListener("resize", () => {
  if (!confetti.classList.contains("hidden")) resizeCanvasToCard(confetti);
  if (!sparkles.classList.contains("hidden")) resizeCanvasToCard(sparkles);
});
