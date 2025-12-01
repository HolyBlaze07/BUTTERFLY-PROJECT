let score = 0;
let level = 1;
let timeLeft = 60;
let butterflies = [];
let gameActive = false;
let combo = 0;
let comboTimer = null;
let butterflySpeed = 3000;
let butterflyCount = 0;
let caughtButterflies = 0;
let perfectCatchStreak = 0;

// Export gameActive for seasonal system
window.gameActive = false;

// Initialize game
function initGame() {
  gameActive = true;
  window.gameActive = true;
  createButterflies();
  startTimer();
  updateUI();

  // Reset perfect catch streak on background click (miss)
  const container = document.getElementById("butterflyContainer");
  if (container && !container.hasAttribute("data-miss-listener")) {
    container.setAttribute("data-miss-listener", "true");
    container.addEventListener("click", function (e) {
      if (e.target.id === "butterflyContainer" && gameActive) {
        perfectCatchStreak = 0;
      }
    });
  }
} // Create butterflies
function createButterflies() {
  const container = document.getElementById("butterflyContainer");
  const butterflyCount = Math.min(3 + level, 8);

  for (let i = 0; i < butterflyCount; i++) {
    createButterfly(container);
  }
}

function createButterfly(container) {
  const butterfly = document.createElement("div");
  butterfly.className = "butterfly-game";
  butterfly.id = "butterfly-" + butterflyCount++;

  // Check for seasonal butterfly first
  let seasonalData = null;
  let isSpecial = false;

  if (
    window.seasonalSystem &&
    typeof window.seasonalSystem.spawnButterfly === "function"
  ) {
    seasonalData = window.seasonalSystem.spawnButterfly();
    if (seasonalData) {
      isSpecial = seasonalData.isSpecial;
      butterfly.classList.add("seasonal-special-butterfly");
      // Store seasonal data on the butterfly element
      butterfly.seasonalData = seasonalData;
    }
  }

  // If no seasonal butterfly, check for regular special butterfly
  if (!seasonalData) {
    isSpecial = Math.random() < 0.2;
    if (isSpecial) {
      butterfly.classList.add("special-butterfly");
    }
  }

  // Random position
  butterfly.style.left = Math.random() * (window.innerWidth - 100) + "px";
  butterfly.style.top = Math.random() * (window.innerHeight - 100) + "px";

  // Create butterfly parts
  const butterflyBody = document.createElement("div");
  butterflyBody.className = "butterfly-body-game";

  const wings = [
    "wing-left-upper-game",
    "wing-left-lower-game",
    "wing-right-upper-game",
    "wing-right-lower-game",
  ];
  wings.forEach((wingClass) => {
    const wing = document.createElement("div");
    wing.className = "butterfly-wing-game " + wingClass;

    // Apply seasonal colors if seasonal butterfly
    if (seasonalData && seasonalData.colors) {
      wing.style.background = `linear-gradient(45deg, ${seasonalData.colors.join(
        ", "
      )})`;
      wing.style.boxShadow = `0 0 20px ${seasonalData.colors[0]}, 0 0 40px ${seasonalData.colors[1]}`;
    } else if (isSpecial) {
      wing.style.background =
        "linear-gradient(45deg, #ff6b6b, #ff8e53, #ff6b9d)";
      wing.style.boxShadow =
        "0 0 20px rgba(255, 107, 107, 0.9), 0 0 40px rgba(255, 107, 107, 0.7)";
    }
    butterfly.appendChild(wing);
  });

  butterfly.appendChild(butterflyBody);

  // Add click event
  butterfly.addEventListener("click", (e) =>
    catchButterfly(e, butterfly, isSpecial)
  );

  // Add movement
  moveButterfly(butterfly);

  container.appendChild(butterfly);
  butterflies.push(butterfly);
}

function moveButterfly(butterfly) {
  if (!gameActive) return;

  const newX = Math.random() * (window.innerWidth - 100);
  const newY = Math.random() * (window.innerHeight - 100);

  butterfly.style.transition = `all ${butterflySpeed}ms cubic-bezier(0.4, 0, 0.2, 1)`;
  butterfly.style.left = newX + "px";
  butterfly.style.top = newY + "px";

  // Random rotation during movement
  const rotation = Math.random() * 360;
  butterfly.style.transform = `rotate(${rotation}deg)`;

  // Schedule next movement
  setTimeout(() => {
    if (gameActive && butterfly.parentNode) {
      moveButterfly(butterfly);
    }
  }, butterflySpeed + Math.random() * 1000);
}

function catchButterfly(event, butterfly, isSpecial) {
  if (!gameActive) return;

  event.stopPropagation();

  // Calculate points
  let points = isSpecial ? 50 : 10;

  // Combo system
  combo++;
  if (combo > 1) {
    points *= combo;
    showCombo();
  }

  // Track challenge combo progress
  if (typeof onComboUpdate === "function") {
    onComboUpdate(combo);
  }

  // Track seasonal combo challenge
  if (
    window.seasonalSystem &&
    typeof window.seasonalSystem.updateProgress === "function"
  ) {
    window.seasonalSystem.updateProgress("combo", combo);
  }

  // Reset combo timer
  clearTimeout(comboTimer);
  comboTimer = setTimeout(() => {
    combo = 0;
    updateUI();
  }, 2000);

  // Update score
  score += points;
  caughtButterflies++;
  perfectCatchStreak++;

  // Track perfect catch challenge
  if (
    window.seasonalSystem &&
    typeof window.seasonalSystem.updateProgress === "function"
  ) {
    window.seasonalSystem.updateProgress("perfect", 1);
  }

  // Update player stats
  if (typeof playerStats !== "undefined") {
    playerStats.totalCaught++;
    if (combo > playerStats.bestCombo) {
      playerStats.bestCombo = combo;
    }
  }

  // Check achievements
  if (typeof checkAchievements === "function") {
    checkAchievements();
  }

  // Track daily challenge progress
  if (typeof onButterflyCaught === "function") {
    onButterflyCaught(isSpecial);
  }

  // Track seasonal butterfly catch
  if (
    butterfly.seasonalData &&
    window.seasonalSystem &&
    typeof window.seasonalSystem.onCatch === "function"
  ) {
    window.seasonalSystem.onCatch(butterfly.seasonalData);
  }

  // Show score popup
  showScorePopup(event.pageX, event.pageY, points);

  // Create catch effect
  createCatchEffect(event.pageX, event.pageY);

  // Remove butterfly
  const index = butterflies.indexOf(butterfly);
  if (index > -1) {
    butterflies.splice(index, 1);
  }
  butterfly.remove();

  // Create new butterfly
  setTimeout(() => {
    if (gameActive) {
      createButterfly(document.getElementById("butterflyContainer"));
    }
  }, 500);

  // Check for level up
  if (score >= level * 100) {
    levelUp();
  }

  updateUI();
}

function showScorePopup(x, y, points) {
  const popup = document.createElement("div");
  popup.className = "score-popup";
  popup.textContent = "+" + points;
  popup.style.left = x + "px";
  popup.style.top = y + "px";

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 1000);
}

function showCombo() {
  const comboDisplay = document.getElementById("comboDisplay");
  comboDisplay.textContent = combo + "x COMBO!";
  comboDisplay.style.display = "block";

  setTimeout(() => {
    comboDisplay.style.display = "none";
  }, 1000);
}

function createCatchEffect(x, y) {
  const effect = document.createElement("div");
  effect.className = "catch-effect";
  effect.style.left = x - 15 + "px";
  effect.style.top = y - 15 + "px";

  const sparkle = document.createElement("div");
  sparkle.className = "catch-sparkle";
  effect.appendChild(sparkle);

  document.body.appendChild(effect);

  setTimeout(() => {
    effect.remove();
  }, 600);
}

function levelUp() {
  level++;
  butterflySpeed = Math.max(1000, butterflySpeed - 300);

  // Show level up message
  const levelDisplay = document.createElement("div");
  levelDisplay.style.position = "fixed";
  levelDisplay.style.top = "50%";
  levelDisplay.style.left = "50%";
  levelDisplay.style.transform = "translate(-50%, -50%)";
  levelDisplay.style.fontSize = "36px";
  levelDisplay.style.color = "#88d8c3";
  levelDisplay.style.fontWeight = "bold";
  levelDisplay.style.textShadow = "0 0 20px rgba(136, 216, 195, 0.8)";
  levelDisplay.style.zIndex = "2000";
  levelDisplay.textContent = "LEVEL " + level + "!";
  document.body.appendChild(levelDisplay);

  setTimeout(() => {
    levelDisplay.remove();
  }, 2000);
}

function startTimer() {
  const timer = setInterval(() => {
    if (!gameActive) {
      clearInterval(timer);
      return;
    }

    timeLeft--;

    if (timeLeft <= 0) {
      endGame();
      clearInterval(timer);
    }

    updateUI();
  }, 1000);
}

function endGame() {
  gameActive = false;
  window.gameActive = false;

  // Update player stats
  if (typeof playerStats !== "undefined") {
    playerStats.gamesPlayed++;
    playerStats.totalScore += score;
    if (combo > playerStats.bestCombo) {
      playerStats.bestCombo = combo;
    }
    localStorage.setItem("butterflyStats", JSON.stringify(playerStats));
  }

  // Show game over screen
  document.getElementById("finalScore").textContent = score;
  document.getElementById("finalLevel").textContent = level;
  document.getElementById("caughtCount").textContent = caughtButterflies;

  const finalComboEl = document.getElementById("finalCombo");
  if (finalComboEl && typeof playerStats !== "undefined") {
    finalComboEl.textContent = playerStats.bestCombo;
  }

  document.getElementById("gameOver").style.display = "block";

  // Check achievements
  if (typeof checkAchievements === "function") {
    checkAchievements();
  }

  // Update stats display
  if (typeof updateStats === "function") {
    updateStats();
  }

  // Update daily challenges display
  if (typeof displayDailyChallenges === "function") {
    displayDailyChallenges();
  }

  // Remove all butterflies
  butterflies.forEach((butterfly) => butterfly.remove());
  butterflies = [];

  // Check if this is a new personal record
  if (
    typeof playerRecords !== "undefined" &&
    score > (playerRecords[0]?.score || 0)
  ) {
    setTimeout(() => {
      alert(
        "🎉 NEW PERSONAL RECORD! 🎉\n\nSubmit your score to the worldwide leaderboard!"
      );
    }, 1000);
  }
}

function restartGame() {
  score = 0;
  level = 1;
  timeLeft = 60;
  combo = 0;
  butterflySpeed = 3000;
  butterflyCount = 0;
  caughtButterflies = 0;
  perfectCatchStreak = 0;
  gameActive = true;

  // Reset daily challenge counters
  if (typeof resetChallengeCounters === "function") {
    resetChallengeCounters();
  }

  document.getElementById("gameOver").style.display = "none";

  initGame();
}

function updateUI() {
  document.getElementById("score").textContent = score;
  document.getElementById("level").textContent = level;
  document.getElementById("time").textContent = timeLeft;
  document.getElementById("combo").textContent = combo;
  document.getElementById("butterflyCount").textContent = butterflies.length;

  // Update progress bar
  const progress = ((score % 100) / 100) * 100;
  document.getElementById("progressFill").style.width = progress + "%";
}

// Export updateScore for seasonal system
window.updateScore = function (points) {
  score += points;
  updateUI();
};

// Start the game
initGame();

// Add some ambient effects
function createAmbientEffects() {
  setInterval(() => {
    if (!gameActive) return;

    const sparkle = document.createElement("div");
    sparkle.style.position = "absolute";
    sparkle.style.width = "2px";
    sparkle.style.height = "2px";
    sparkle.style.background = "#00d4ff";
    sparkle.style.borderRadius = "50%";
    sparkle.style.left = Math.random() * window.innerWidth + "px";
    sparkle.style.top = Math.random() * window.innerHeight + "px";
    sparkle.style.animation = "twinkle 3s ease-out forwards";
    sparkle.style.pointerEvents = "none";
    sparkle.style.zIndex = "1";

    document.body.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 3000);
  }, 2000);
}

createAmbientEffects();
