// Leaderboard and achievements system

// Records and achievements
let playerRecords = JSON.parse(localStorage.getItem("butterflyRecords")) || [];
let worldRecords =
  JSON.parse(localStorage.getItem("worldButterflyRecords")) || [];
let playerStats = JSON.parse(localStorage.getItem("butterflyStats")) || {
  gamesPlayed: 0,
  totalScore: 0,
  bestCombo: 0,
  totalCaught: 0,
  achievements: [],
};

function getStoredUser() {
  try {
    const value = localStorage.getItem("butterflyUser");
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.warn("Unable to parse butterflyUser", error);
    return null;
  }
}

function getActivePlayerName() {
  const storedUser = getStoredUser();
  if (storedUser && !storedUser.isGuest) {
    return {
      name:
        storedUser.username ||
        storedUser.email ||
        `Keeper-${storedUser.id || "0000"}`,
      fromStored: true,
    };
  }

  const nameInput = document.getElementById("playerName");
  return {
    name: nameInput ? nameInput.value.trim() : "",
    fromStored: false,
  };
}

function syncPlayerNameUI() {
  const nameInput = document.getElementById("playerName");
  const nameDisplay = document.getElementById("playerNameDisplay");
  const storedUser = getStoredUser();

  if (!nameInput || !nameDisplay) return;

  if (storedUser && !storedUser.isGuest) {
    const displayName =
      storedUser.username || storedUser.email || "Butterfly Keeper";
    nameInput.style.display = "none";
    nameDisplay.innerHTML = `Logged in as <span>${displayName}</span>`;
    nameDisplay.removeAttribute("hidden");
  } else {
    nameInput.style.display = "block";
    nameDisplay.setAttribute("hidden", "hidden");
    nameDisplay.textContent = "";
  }
}

// Initialize worldwide records if empty
if (worldRecords.length === 0) {
  worldRecords = [
    {
      name: "ButterflyMaster",
      score: 850,
      level: 8,
      date: new Date().toISOString(),
    },
    {
      name: "FlutterQueen",
      score: 720,
      level: 7,
      date: new Date().toISOString(),
    },
    { name: "CatchKing", score: 680, level: 6, date: new Date().toISOString() },
    {
      name: "WingWizard",
      score: 590,
      level: 5,
      date: new Date().toISOString(),
    },
    {
      name: "GlowCatcher",
      score: 480,
      level: 4,
      date: new Date().toISOString(),
    },
  ];
  localStorage.setItem("worldButterflyRecords", JSON.stringify(worldRecords));
}

function submitScore() {
  const { name: playerName, fromStored } = getActivePlayerName();
  if (!playerName) {
    alert(
      "Please enter your name or sign in to Butterfly Hub before submitting a score."
    );
    return;
  }

  const newRecord = {
    name: playerName,
    score: score,
    level: level,
    date: new Date().toISOString(),
  };

  // Add to personal records
  playerRecords.unshift(newRecord);
  playerRecords.sort((a, b) => b.score - a.score);
  playerRecords = playerRecords.slice(0, 10); // Keep top 10
  localStorage.setItem("butterflyRecords", JSON.stringify(playerRecords));

  // Add to world records
  worldRecords.unshift(newRecord);
  worldRecords.sort((a, b) => b.score - a.score);
  worldRecords = worldRecords.slice(0, 50); // Keep top 50
  localStorage.setItem("worldButterflyRecords", JSON.stringify(worldRecords));

  alert("Score submitted successfully! 🎉");
  displayWorldwideRecords();
  if (!fromStored) {
    const nameInput = document.getElementById("playerName");
    if (nameInput) nameInput.value = "";
  }
}

function displayWorldwideRecords() {
  const recordsContainer = document.getElementById("worldwideRecords");
  if (!recordsContainer) return;

  recordsContainer.innerHTML = "";

  // Display top 5 worldwide records
  const topRecords = worldRecords.slice(0, 5);

  topRecords.forEach((record, index) => {
    const recordItem = document.createElement("div");
    recordItem.className = "record-item";
    recordItem.innerHTML = `
            <span class="record-rank">${index + 1}</span>
            <span class="record-name">${record.name}</span>
            <span class="record-score">${record.score}</span>
        `;
    recordsContainer.appendChild(recordItem);
  });

  // Show player's best record
  if (playerRecords.length > 0) {
    const yourBest = playerRecords[0];
    const yourRank =
      worldRecords.findIndex(
        (r) =>
          r.name === yourBest.name &&
          r.score === yourBest.score &&
          r.date === yourBest.date
      ) + 1;

    const yourRecordEl = document.getElementById("yourRecord");
    if (yourRecordEl) {
      yourRecordEl.style.display = "block";
      document.getElementById("yourRank").textContent =
        yourRank > 0 ? yourRank : "-";
      document.getElementById("yourName").textContent = yourBest.name;
      document.getElementById("yourScore").textContent = yourBest.score;
    }
  }
}

function updateStats() {
  const elements = {
    gamesPlayed: document.getElementById("gamesPlayed"),
    totalScore: document.getElementById("totalScore"),
    bestCombo: document.getElementById("bestCombo"),
    totalCaught: document.getElementById("totalCaught"),
  };

  if (elements.gamesPlayed)
    elements.gamesPlayed.textContent = playerStats.gamesPlayed;
  if (elements.totalScore)
    elements.totalScore.textContent = playerStats.totalScore;
  if (elements.bestCombo)
    elements.bestCombo.textContent = playerStats.bestCombo;
  if (elements.totalCaught)
    elements.totalCaught.textContent = playerStats.totalCaught;
}

function checkAchievements() {
  const achievements = [
    { id: "ach-first-catch", condition: caughtButterflies > 0, icon: "🦋" },
    { id: "ach-combo-5", condition: combo >= 5, icon: "⚡" },
    { id: "ach-level-5", condition: level >= 5, icon: "🌟" },
    { id: "ach-score-500", condition: score >= 500, icon: "💎" },
  ];

  achievements.forEach((achievement) => {
    const element = document.getElementById(achievement.id);
    if (!element) return;

    if (achievement.condition && !element.classList.contains("unlocked")) {
      element.classList.add("unlocked");
      element.querySelector(".achievement-icon").textContent = achievement.icon;

      // Save achievement
      if (!playerStats.achievements.includes(achievement.id)) {
        playerStats.achievements.push(achievement.id);
        localStorage.setItem("butterflyStats", JSON.stringify(playerStats));
      }
    }
  });
}

function showLeaderboard() {
  const leaderboardHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 3000; display: flex; justify-content: center; align-items: center;">
            <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 30px; border-radius: 20px; color: white; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto; border: 2px solid rgba(0, 212, 255, 0.5);">
                <h2 style="color: #00d4ff; text-align: center; margin-bottom: 20px; text-shadow: 0 0 20px rgba(0, 212, 255, 0.8);">🏆 Global Leaderboard 🏆</h2>
                <div style="margin-bottom: 20px;">
                    ${worldRecords
                      .slice(0, 20)
                      .map((record, index) => {
                        const isYou =
                          playerRecords.length > 0 &&
                          record.name === playerRecords[0].name &&
                          record.score === playerRecords[0].score;
                        return `
                            <div style="margin-bottom: 10px; padding: 10px; background: ${
                              isYou
                                ? "rgba(0, 212, 255, 0.2)"
                                : "rgba(255, 255, 255, 0.05)"
                            }; border-radius: 5px; display: flex; justify-content: space-between;">
                                <div>
                                    <span style="color: #ffe66d; font-weight: bold;">#${
                                      index + 1
                                    }</span>
                                    <span style="color: #88d8c3; margin-left: 10px;">${
                                      record.name
                                    }</span>
                                </div>
                                <div>
                                    <span style="color: #00d4ff; font-weight: bold;">${
                                      record.score
                                    } pts</span>
                                    <div style="font-size: 12px; color: rgba(255, 255, 255, 0.6); text-align: right;">Level ${
                                      record.level
                                    }</div>
                                </div>
                            </div>
                        `;
                      })
                      .join("")}
                </div>
                <button class="restart-btn" onclick="this.parentElement.parentElement.remove()" style="width: 100%;">Close</button>
            </div>
        </div>
    `;

  document.body.insertAdjacentHTML("beforeend", leaderboardHTML);
}

// Initialize on page load
setTimeout(() => {
  displayWorldwideRecords();
  updateStats();
  syncPlayerNameUI();
}, 100);

window.addEventListener("storage", (event) => {
  if (event.key === "butterflyUser") {
    syncPlayerNameUI();
  }
});
