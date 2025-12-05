// Mode toggle functionality
const modeToggle = document.getElementById("modeToggle");
const displayMode = document.getElementById("displayMode");
const gameMode = document.getElementById("gameMode");
let currentMode = "display";

modeToggle.addEventListener("click", () => {
  if (currentMode === "display") {
    // Switch to game mode
    displayMode.classList.remove("active");
    gameMode.classList.add("active");
    modeToggle.textContent = "View Display";
    currentMode = "game";

    // Initialize seasonal system if not already done
    if (window.seasonalSystem && !window.seasonalInitialized) {
      window.seasonalSystem.init();
      window.seasonalInitialized = true;
    }

    // Minimize all panels when starting game
    const panels = ["records", "challenges", "seasonal"];
    panels.forEach((panelName) => {
      let panelClass;
      if (panelName === "records") {
        panelClass = "records-panel";
      } else if (panelName === "challenges") {
        panelClass = "daily-challenges-panel";
      } else if (panelName === "seasonal") {
        panelClass = "seasonal-challenges-panel";
      }

      const panel = document.querySelector(`.${panelClass}`);
      if (panel && !panel.classList.contains("minimized")) {
        panel.classList.add("minimized");
        const toggleBtn = panel.querySelector(".panel-toggle-btn");
        if (toggleBtn) {
          toggleBtn.textContent = "+";
        }
      }
    });

    // Start game if not already active
    if (!gameActive) {
      restartGame();
    }
  } else {
    // Switch to display mode
    gameMode.classList.remove("active");
    displayMode.classList.add("active");
    modeToggle.textContent = "Play Game";
    currentMode = "display";

    // Pause game
    gameActive = false;
  }
});

// Function to switch to display mode from game over screen
function viewDisplayFromGameOver() {
  // Hide game over modal
  document.getElementById("gameOver").style.display = "none";

  // Switch to display mode
  gameMode.classList.remove("active");
  displayMode.classList.add("active");
  modeToggle.textContent = "Play Game";
  currentMode = "display";

  // Stop game
  gameActive = false;
}

// Function to close game over modal without exiting game
function closeGameOverModal(event) {
  // Prevent the click from bubbling to the modal div (which restarts)
  event.stopPropagation();

  // Just hide the modal
  document.getElementById("gameOver").style.display = "none";
}

// Add click listener to game-over modal to restart on click
document.addEventListener("DOMContentLoaded", () => {
  const gameOverModal = document.getElementById("gameOver");
  if (gameOverModal) {
    gameOverModal.addEventListener("click", (event) => {
      // Only restart if clicking the modal background, not buttons
      if (
        event.target === gameOverModal ||
        event.target.closest(".game-over-butterfly") ||
        event.target.tagName === "H2" ||
        event.target.tagName === "P" ||
        event.target.tagName === "SPAN"
      ) {
        restartGame();
      }
    });
  }
}); // Toggle panel minimize/expand
function togglePanel(panelName) {
  let panelClass;
  let contentId;

  // Map panel names to their CSS class names
  if (panelName === "records") {
    panelClass = "records-panel";
  } else if (panelName === "challenges") {
    panelClass = "daily-challenges-panel";
  } else if (panelName === "seasonal") {
    panelClass = "seasonal-challenges-panel";
  } else if (panelName === "challenges-preview") {
    contentId = "challenges-preview-content";
  } else if (panelName === "seasonal-preview") {
    contentId = "seasonal-preview-content";
  } else {
    panelClass = `${panelName}-panel`;
  }

  let panel;
  if (contentId) {
    const content = document.getElementById(contentId);
    if (content) {
      panel = content.closest(
        ".daily-challenges-panel, .seasonal-challenges-panel"
      );
    }
  } else {
    panel = document.querySelector(`.${panelClass}`);
  }

  if (!panel) return;

  const isMinimized = panel.classList.toggle("minimized");
  const toggleBtn = panel.querySelector(".panel-toggle-btn");
  if (toggleBtn) {
    toggleBtn.textContent = isMinimized ? "+" : "−";
  }
}

// Daily challenges modal functions
function openDailyChallengesModal() {
  const modal = document.getElementById("dailyChallengesModal");
  if (modal) {
    modal.classList.add("active");
  }
}

function closeDailyChallengesModal(event) {
  if (event) {
    event.stopPropagation();
  }
  const modal = document.getElementById("dailyChallengesModal");
  if (modal) {
    modal.classList.remove("active");
  }
}

// Seasonal event modal functions
function openSeasonalModal() {
  const modal = document.getElementById("seasonalModal");
  if (modal) {
    modal.classList.add("active");
  }
}

function closeSeasonalModal(event) {
  if (event) {
    event.stopPropagation();
  }
  const modal = document.getElementById("seasonalModal");
  if (modal) {
    modal.classList.remove("active");
  }
}

// Options modal functions
function openOptionsModal() {
  const modal = document.getElementById("optionsModal");
  if (modal) {
    modal.classList.add("active");
  }
}

function closeOptionsModal(event) {
  if (event) {
    event.stopPropagation();
  }
  const modal = document.getElementById("optionsModal");
  if (modal) {
    modal.classList.remove("active");
  }
}
