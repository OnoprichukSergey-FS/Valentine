const playground = document.getElementById("playground");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const hint = document.getElementById("hint");

const askPanel = document.getElementById("askPanel");
const successPanel = document.getElementById("successPanel");

const confetti = document.getElementById("confetti");
const sparkles = document.getElementById("sparkles");

const replayBtn = document.getElementById("replayBtn");
const copyBtn = document.getElementById("copyBtn");

let dodges = 0;

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function moveNoButton() {
  const area = playground.getBoundingClientRect();
  const btn = noBtn.getBoundingClientRect();

  const padding = 10;
  const maxX = area.width - btn.width - padding;
  const maxY = area.height - btn.height - padding;

  let x = Math.random() * maxX + padding;
  let y = Math.random() * maxY + padding;

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
  noBtn.style.transform = "translate(0,0)";

  dodges++;

  const scale = 1 + Math.min(dodges * 0.08, 0.55);
  yesBtn.style.transform = `scale(${scale})`;

  const lines = [
    "Be gentle… I’m sensitive 🥺",
    "Wait— come back 😭",
    "Okay… that’s enough 😌",
    "You’re making this hard 💀",
    "I’m literally blushing. Stop.",
    "Just click yes 😤💖",
  ];
  hint.textContent = lines[Math.min(dodges, lines.length - 1)];

  const noTexts = ["No", "nope", "pls", "stop", "fine…", "help"];
  noBtn.textContent = noTexts[Math.min(dodges, noTexts.length - 1)];
}

// Desktop + mobile dodge
noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("mouseover", moveNoButton);
noBtn.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    moveNoButton();
  },
  { passive: false }
);

yesBtn.addEventListener("click", () => {
  // Smoothly hide ask panel
  askPanel.style.transition = "opacity .25s ease, transform .25s ease";
  askPanel.style.opacity = "0";
  askPanel.style.transform = "translateY(8px)";

  setTimeout(() => {
    askPanel.classList.add("hidden");
    successPanel.classList.remove("hidden");
    startConfetti();
    startSparkles();
  }, 260);
});

/* Copy message */
copyBtn?.addEventListener("click", async () => {
  const msg = `You’re my valentine 💖 I can’t wait to celebrate with you.`;
  try {
    await navigator.clipboard.writeText(msg);
    copyBtn.textContent = "Copied ✅";
    setTimeout(() => (copyBtn.textContent = "Copy a message"), 1200);
  } catch {
    copyBtn.textContent = "Couldn’t copy 😭";
    setTimeout(() => (copyBtn.textContent = "Copy a message"), 1200);
  }
});

replayBtn?.addEventListener("click", () => {
  startConfetti();
  startSparkles();
});

/* ===== FX ===== */
function resizeCanvas(c) {
  const card = document.getElementById("card");
  c.width = card.clientWidth;
  c.height = card.clientHeight;
}

function startConfetti() {
  confetti.classList.remove("hidden");
  resizeCanvas(confetti);

  const ctx = confetti.getContext("2d");
  const pieces = [];
  const count = 170;

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

    if (frames < 210) requestAnimationFrame(draw);
    else confetti.classList.add("hidden");
  }
  draw();
}

function startSparkles() {
  sparkles.classList.remove("hidden");
  resizeCanvas(sparkles);

  const ctx = sparkles.getContext("2d");
  const stars = [];
  const count = 70;

  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * sparkles.width,
      y: Math.random() * sparkles.height,
      r: 0.8 + Math.random() * 2.2,
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

    if (frames < 210) requestAnimationFrame(draw);
    else sparkles.classList.add("hidden");
  }
  draw();
}

window.addEventListener("resize", () => {
  if (!confetti.classList.contains("hidden")) resizeCanvas(confetti);
  if (!sparkles.classList.contains("hidden")) resizeCanvas(sparkles);
});
