// Daily Challenge System

// Daily Challenge variables
let dailyChallenges = [];
let completedChallenges = [];
let dailyStreak = 0;
let lastChallengeDate = null;
let challengeButterfliesCaught = 0;
let challengeCombos = 0;
let challengeSpecialCaught = 0;
let challengeStartTime = null;
let challengeMisses = 0;
let challengeAttempts = 0;

// Daily Challenge Data Structure
const challengeTypes = [
  {
    id: "speed_catcher",
    name: "Speed Catcher",
    description: "Catch 15 butterflies as fast as possible",
    target: 15,
    reward: 100,
    type: "count",
    icon: "⚡",
  },
  {
    id: "combo_master",
    name: "Combo Master",
    description: "Achieve a 5x combo multiplier",
    target: 5,
    reward: 150,
    type: "combo",
    icon: "🔥",
  },
  {
    id: "special_hunter",
    name: "Special Hunter",
    description: "Catch 3 special red butterflies",
    target: 3,
    reward: 200,
    type: "special",
    icon: "💎",
  },
  {
    id: "precision_pro",
    name: "Precision Pro",
    description: "Catch 20 butterflies with 90% accuracy",
    target: 90,
    reward: 120,
    type: "accuracy",
    icon: "🎯",
  },
  {
    id: "level_rush",
    name: "Level Rush",
    description: "Reach level 3 in a single game",
    target: 3,
    reward: 180,
    type: "level",
    icon: "🚀",
  },
  {
    id: "score_master",
    name: "Score Master",
    description: "Score 300 points in a single game",
    target: 300,
    reward: 250,
    type: "score",
    icon: "👑",
  },
  {
    id: "speed_catcher",
    name: "Speed Catcher",
    description: "Catch 10 butterflies in under 30 seconds",
    target: 10,
    reward: 80,
    type: "speed",
    icon: "💨",
  },
  {
    id: "butterfly_collector",
    name: "Butterfly Collector",
    description: "Catch 25 butterflies in one game",
    target: 25,
    reward: 150,
    type: "total",
    icon: "✨",
  },
];

// Initialize daily challenges
function initDailyChallenges() {
  const today = new Date().toDateString();
  const savedDate = localStorage.getItem("dailyChallengeDate");
  const savedChallenges = localStorage.getItem("dailyChallenges");
  const savedStreak = localStorage.getItem("dailyStreak");
  const savedLastDate = localStorage.getItem("lastChallengeDate");

  // Check if it's a new day
  if (savedDate !== today) {
    // Generate new challenges for today
    generateDailyChallenges();
    localStorage.setItem("dailyChallengeDate", today);
    localStorage.setItem("dailyChallengesCompleted", "[]");
    completedChallenges = [];

    // Update streak
    updateStreak();
  } else {
    // Load existing challenges
    dailyChallenges = JSON.parse(savedChallenges || "[]");
    completedChallenges = JSON.parse(
      localStorage.getItem("dailyChallengesCompleted") || "[]"
    );
    dailyStreak = parseInt(savedStreak || "0");
    lastChallengeDate = savedLastDate;

    // If no challenges exist, generate them
    if (dailyChallenges.length === 0) {
      generateDailyChallenges();
    }
  }

  displayDailyChallenges();
  updateStreakDisplay();
  updateChallengeTimer();
  updateWeeklyProgress();
}

function generateDailyChallenges() {
  // Select 3 random challenges for today
  const shuffled = [...challengeTypes].sort(() => 0.5 - Math.random());
  dailyChallenges = shuffled.slice(0, 3);
  localStorage.setItem("dailyChallenges", JSON.stringify(dailyChallenges));
}

function displayDailyChallenges() {
  const container = document.getElementById("dailyChallenges");
  if (!container) return;

  container.innerHTML = "";

  dailyChallenges.forEach((challenge) => {
    const isCompleted = completedChallenges.includes(challenge.id);
    const progress = getChallengeProgress(challenge);

    const challengeElement = document.createElement("div");
    challengeElement.className =
      "challenge-item" + (isCompleted ? " completed" : "");
    challengeElement.innerHTML = `
                    <div class="challenge-header">
                        <span class="challenge-name">${challenge.icon} ${
      challenge.name
    }</span>
                        <span class="challenge-reward">+${
                          challenge.reward
                        }</span>
                    </div>
                    <div class="challenge-description">${
                      challenge.description
                    }</div>
                    <div class="challenge-progress">
                        <div class="challenge-progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="challenge-status">
                        <span>${getChallengeStatusText(challenge)}</span>
                        <span class="challenge-check">✓</span>
                    </div>
                `;

    container.appendChild(challengeElement);
  });
}

function getChallengeProgress(challenge) {
  if (completedChallenges.includes(challenge.id)) return 100;

  switch (challenge.type) {
    case "count":
    case "total":
      return Math.min(
        (challengeButterfliesCaught / challenge.target) * 100,
        100
      );
    case "combo":
      return Math.min((challengeCombos / challenge.target) * 100, 100);
    case "special":
      return Math.min((challengeSpecialCaught / challenge.target) * 100, 100);
    case "score":
      return Math.min((score / challenge.target) * 100, 100);
    case "level":
      return Math.min((level / challenge.target) * 100, 100);
    case "accuracy":
      const accuracy =
        challengeAttempts > 0
          ? (challengeButterfliesCaught / challengeAttempts) * 100
          : 0;
      return Math.min((accuracy / challenge.target) * 100, 100);
    case "speed":
      if (!challengeStartTime) return 0;
      const elapsed = (Date.now() - challengeStartTime) / 1000;
      return elapsed <= 30 && challengeButterfliesCaught >= challenge.target
        ? 100
        : Math.min((challengeButterfliesCaught / challenge.target) * 100, 100);
    default:
      return 0;
  }
}

function getChallengeStatusText(challenge) {
  if (completedChallenges.includes(challenge.id)) {
    return "✅ Completed";
  }

  switch (challenge.type) {
    case "count":
    case "total":
      return `${challengeButterfliesCaught}/${challenge.target}`;
    case "combo":
      return `${challengeCombos}/${challenge.target}`;
    case "special":
      return `${challengeSpecialCaught}/${challenge.target}`;
    case "score":
      return `${score}/${challenge.target}`;
    case "level":
      return `${level}/${challenge.target}`;
    case "accuracy":
      const accuracy =
        challengeAttempts > 0
          ? Math.round((challengeButterfliesCaught / challengeAttempts) * 100)
          : 0;
      return `${accuracy}%/${challenge.target}%`;
    case "speed":
      if (!challengeStartTime) return `0/${challenge.target}`;
      const elapsed = (Date.now() - challengeStartTime) / 1000;
      return `${challengeButterfliesCaught}/${challenge.target} (${Math.round(
        elapsed
      )}s)`;
    default:
      return "0%";
  }
}

function checkChallengeCompletion() {
  dailyChallenges.forEach((challenge) => {
    if (!completedChallenges.includes(challenge.id)) {
      let isComplete = false;

      switch (challenge.type) {
        case "count":
        case "total":
          isComplete = challengeButterfliesCaught >= challenge.target;
          break;
        case "combo":
          isComplete = challengeCombos >= challenge.target;
          break;
        case "special":
          isComplete = challengeSpecialCaught >= challenge.target;
          break;
        case "score":
          isComplete = score >= challenge.target;
          break;
        case "level":
          isComplete = level >= challenge.target;
          break;
        case "accuracy":
          const accuracy =
            challengeAttempts > 0
              ? (challengeButterfliesCaught / challengeAttempts) * 100
              : 0;
          isComplete = challengeAttempts >= 20 && accuracy >= challenge.target;
          break;
        case "speed":
          if (challengeStartTime) {
            const elapsed = (Date.now() - challengeStartTime) / 1000;
            isComplete =
              challengeButterfliesCaught >= challenge.target && elapsed <= 30;
          }
          break;
      }

      if (isComplete) {
        completeChallenge(challenge);
      }
    }
  });

  displayDailyChallenges();
}

function completeChallenge(challenge) {
  completedChallenges.push(challenge.id);
  localStorage.setItem(
    "dailyChallengesCompleted",
    JSON.stringify(completedChallenges)
  );

  // Add bonus points
  score += challenge.reward;

  // Show completion animation
  showChallengeCompleteAnimation(challenge);

  // Update UI
  if (typeof updateUI === "function") {
    updateUI();
  }

  // Update weekly progress
  const today = new Date().toDateString();
  const weekData = JSON.parse(
    localStorage.getItem("weeklyChallengeData") || "{}"
  );
  weekData[today] = completedChallenges.length;
  localStorage.setItem("weeklyChallengeData", JSON.stringify(weekData));
  updateWeeklyProgress();
}

function showChallengeCompleteAnimation(challenge) {
  const animation = document.createElement("div");
  animation.className = "challenge-complete-animation";
  animation.innerHTML = `
                <div style="text-align: center;">
                    <div style="font-size: 48px;">${challenge.icon}</div>
                    <div style="font-size: 24px; margin-top: 10px;">Challenge Complete!</div>
                    <div style="font-size: 18px; margin-top: 5px;">+${challenge.reward} points</div>
                </div>
            `;

  document.body.appendChild(animation);

  setTimeout(() => {
    animation.remove();
  }, 2000);
}

function updateStreak() {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (lastChallengeDate === yesterday) {
    // Consecutive day
    dailyStreak++;
  } else if (lastChallengeDate !== today) {
    // First day or missed day - reset streak
    dailyStreak = 1;
  }

  lastChallengeDate = today;
  localStorage.setItem("dailyStreak", dailyStreak.toString());
  localStorage.setItem("lastChallengeDate", lastChallengeDate);
}

function updateStreakDisplay() {
  const streakElement = document.getElementById("streakNumber");
  if (streakElement) {
    streakElement.textContent = dailyStreak;
  }
}

function updateChallengeTimer() {
  function updateTimer() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const timeUntilTomorrow = tomorrow - now;
    const hours = Math.floor(timeUntilTomorrow / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeUntilTomorrow % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeUntilTomorrow % (1000 * 60)) / 1000);

    const timerElement = document.getElementById("timerCountdown");
    if (timerElement) {
      timerElement.textContent = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

function updateWeeklyProgress() {
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
  const container = document.getElementById("weekDays");
  if (!container) return;

  container.innerHTML = "";

  const today = new Date().getDay();
  const weekData = JSON.parse(
    localStorage.getItem("weeklyChallengeData") || "{}"
  );

  weekDays.forEach((day, index) => {
    const dayElement = document.createElement("div");
    dayElement.className = "day-indicator";
    dayElement.textContent = day;

    const dateStr = new Date(
      Date.now() - (today - index) * 86400000
    ).toDateString();
    if (weekData[dateStr] && weekData[dateStr] > 0) {
      dayElement.classList.add("completed");
    }

    if (index === today) {
      dayElement.classList.add("today");
    }

    container.appendChild(dayElement);
  });
}

// Called when a butterfly is caught
function onButterflyCaught(isSpecial) {
  challengeButterfliesCaught++;
  challengeAttempts++;

  if (isSpecial) {
    challengeSpecialCaught++;
  }

  if (!challengeStartTime && challengeButterfliesCaught === 1) {
    challengeStartTime = Date.now();
  }

  checkChallengeCompletion();
}

// Called when combo is updated
function onComboUpdate(currentCombo) {
  if (currentCombo > challengeCombos) {
    challengeCombos = currentCombo;
    checkChallengeCompletion();
  }
}

// Called when a butterfly is missed
function onButterflyMiss() {
  challengeMisses++;
  challengeAttempts++;
}

// Reset challenge counters for new game
function resetChallengeCounters() {
  challengeButterfliesCaught = 0;
  challengeCombos = 0;
  challengeSpecialCaught = 0;
  challengeStartTime = null;
  challengeMisses = 0;
  challengeAttempts = 0;
}

// Initialize on page load
setTimeout(() => {
  initDailyChallenges();
}, 100);

// Toggle panel minimize/expand
function togglePanel(panelType) {
  if (panelType === "records") {
    const panel = document.querySelector(".records-panel");
    const btn = panel.querySelector(".panel-toggle-btn");
    panel.classList.toggle("minimized");
    btn.textContent = panel.classList.contains("minimized") ? "+" : "−";
    btn.title = panel.classList.contains("minimized") ? "Expand" : "Minimize";
  } else if (panelType === "challenges") {
    const panel = document.querySelector(".daily-challenges-panel");
    const btn = panel.querySelector(".panel-toggle-btn");
    panel.classList.toggle("minimized");
    btn.textContent = panel.classList.contains("minimized") ? "+" : "−";
    btn.title = panel.classList.contains("minimized") ? "Expand" : "Minimize";
  }
}
