// ===== Theme toggle =====
const root = document.documentElement;
const themeBtn = document.getElementById("themeBtn");

function setTheme(mode) {
  if (mode === "light") root.classList.add("light");
  else root.classList.remove("light");
  localStorage.setItem("theme", mode);
}

const savedTheme = localStorage.getItem("theme");
setTheme(savedTheme || "dark");

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const isLight = root.classList.contains("light");
    setTheme(isLight ? "dark" : "light");
  });
}

// ===== Footer year + status line =====
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const status = document.getElementById("statusLine");
if (status) status.textContent = "Last updated: " + new Date().toLocaleDateString();

// ===== Parallax for background + thumbs (subtle) =====
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReduced) {
  let targetX = 0, targetY = 0;
  let x = 0, y = 0;

  window.addEventListener("mousemove", (e) => {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;  // -1..1
    const ny = (e.clientY / window.innerHeight) * 2 - 1; // -1..1
    targetX = nx;
    targetY = ny;
  });

  function tick() {
    x += (targetX - x) * 0.06;
    y += (targetY - y) * 0.06;

    root.style.setProperty("--mx", x.toFixed(3));
    root.style.setProperty("--my", y.toFixed(3));

    requestAnimationFrame(tick);
  }
  tick();
}

// ===== 1) Typewriter effect (hero line) =====
const typedEl = document.getElementById("typed");

const phrases = [
  "I build clean, reliable software.",
  "I like systems, debugging, and performance.",
  "I turn ideas into polished projects.",
  "I’m always learning and open to advice and criticism."
];

function typewriter(el, lines) {
  if (!el) return;

  if (prefersReduced) {
    el.textContent = lines[0];
    return;
  }

  let lineIdx = 0;
  let charIdx = 0;
  let deleting = false;

  const typeSpeed = 26;
  const deleteSpeed = 18;
  const pauseAfterType = 900;
  const pauseAfterDelete = 250;

  function step() {
    const current = lines[lineIdx];

    if (!deleting) {
      charIdx++;
      el.textContent = current.slice(0, charIdx);

      if (charIdx >= current.length) {
        deleting = true;
        setTimeout(step, pauseAfterType);
        return;
      }

      setTimeout(step, typeSpeed);
    } else {
      charIdx--;
      el.textContent = current.slice(0, Math.max(0, charIdx));

      if (charIdx <= 0) {
        deleting = false;
        lineIdx = (lineIdx + 1) % lines.length;
        setTimeout(step, pauseAfterDelete);
        return;
      }

      setTimeout(step, deleteSpeed);
    }
  }

  step();
}

typewriter(typedEl, phrases);

// ===== 2) Project cards: tap-to-expand support on mobile =====
// On touch devices, :hover can be awkward. This toggles a "tapped" state.
(function enableTapExpand() {
  const cards = document.querySelectorAll(".project-card");
  if (!cards.length) return;

  let lastTapped = null;

  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      // If user clicked a link, don't toggle the card.
      const isLink = e.target.closest("a");
      if (isLink) return;

      // Toggle tapped state
      if (lastTapped && lastTapped !== card) lastTapped.classList.remove("tapped");
      card.classList.toggle("tapped");
      lastTapped = card.classList.contains("tapped") ? card : null;
    });
  });

  // Clicking outside closes any tapped card
  document.addEventListener("click", (e) => {
    const inside = e.target.closest(".project-card");
    if (!inside && lastTapped) {
      lastTapped.classList.remove("tapped");
      lastTapped = null;
    }
  });
})();

// Add CSS behavior for tapped cards (without editing CSS again)
(function injectTappedCSS() {
  const style = document.createElement("style");
  style.textContent = `
    .project-card.tapped {
      transform: translateY(-6px) scale(1.01);
      box-shadow: 0 18px 46px rgba(0,0,0,0.28);
    }
    .project-card.tapped .card-more {
      max-height: 160px;
      opacity: 1;
    }
    .project-card.tapped::after { opacity: 1; }
  `;
  document.head.appendChild(style);
})();

// ===== 3) Scroll reveal animations =====
(function setupScrollReveal() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  if (prefersReduced) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  revealEls.forEach((el) => obs.observe(el));
})();
