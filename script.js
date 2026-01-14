const root = document.documentElement;
const themeBtn = document.getElementById("themeBtn");

function setTheme(mode) {
  if (mode === "light") root.classList.add("light");
  else root.classList.remove("light");
  localStorage.setItem("theme", mode);
}

const saved = localStorage.getItem("theme");
setTheme(saved || "dark");

themeBtn.addEventListener("click", () => {
  const isLight = root.classList.contains("light");
  setTheme(isLight ? "dark" : "light");
});

document.getElementById("year").textContent = new Date().getFullYear();

const status = document.getElementById("statusLine");
if (status) {
  status.textContent = "Last updated: " + new Date().toLocaleDateString();
}

// Subtle parallax for the background (desktop only)
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
    // smooth follow
    x += (targetX - x) * 0.06;
    y += (targetY - y) * 0.06;

    document.documentElement.style.setProperty("--mx", x.toFixed(3));
    document.documentElement.style.setProperty("--my", y.toFixed(3));

    requestAnimationFrame(tick);
  }

  tick();
}
