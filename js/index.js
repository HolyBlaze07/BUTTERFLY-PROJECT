// Create twinkling stars
function createStars() {
  const starsContainer = document.getElementById("stars");
  const numberOfStars = 100;

  for (let i = 0; i < numberOfStars; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.animationDelay = Math.random() * 4 + "s";
    star.style.animationDuration = Math.random() * 3 + 2 + "s";
    starsContainer.appendChild(star);
  }
}

// Mouse interaction - only in display mode
document.addEventListener("mousemove", (e) => {
  const displayMode = document.getElementById("displayMode");
  if (!displayMode || !displayMode.classList.contains("active")) return;

  const butterfly = document.querySelector(".butterfly-container");
  if (!butterfly) return;

  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;

  butterfly.style.transform = `translate(${x}px, ${y}px)`;
});

// Initialize
createStars();

// Add some interactive glow on click - only in display mode
document.addEventListener("click", (e) => {
  const displayMode = document.getElementById("displayMode");
  if (!displayMode.classList.contains("active")) return;

  const butterfly = document.querySelector(".butterfly");
  if (!butterfly) return;

  butterfly.style.animation = "flutter 0.5s ease-in-out, glow 0.5s ease-in-out";

  setTimeout(() => {
    butterfly.style.animation = "flutter 4s ease-in-out infinite";
  }, 500);
});
