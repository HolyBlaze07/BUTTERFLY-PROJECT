// Butterfly Mood Tracker JavaScript

// Application State
let currentUser = JSON.parse(
  localStorage.getItem("butterflyHubCurrentUser") || "{}"
);
let userPlan = currentUser.plan || "free";
let moodEntries = JSON.parse(localStorage.getItem("moodEntries") || "[]");
let selectedMood = null;
let moodChart = null;

// Debug: Log what we're reading
console.log("🔍 Mood Tracker Debug:");
console.log("Current User:", currentUser);
console.log("User Plan:", userPlan);
console.log("Is Premium:", userPlan && userPlan !== "free");

// Emoji mappings
const moodEmojis = {
  happy: "😄",
  sad: "😢",
  anxious: "😰",
  peaceful: "😌",
  stressed: "😣",
  grateful: "🙏",
  tired: "😴",
  excited: "🤩",
};

// Mood labels
const moodLabels = {
  happy: "Happy",
  sad: "Sad",
  anxious: "Anxious",
  peaceful: "Peaceful",
  stressed: "Stressed",
  grateful: "Grateful",
  tired: "Tired",
  excited: "Excited",
};

// Initialize Application
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
  setupEventListeners();
  renderMoodHistory();
  createButterflyField();

  // Check if user has premium (monthly or lifetime)
  if (userPlan && userPlan !== "free") {
    unlockPremiumFeatures();
  }

  // Listen for storage changes (when user upgrades on another page/tab)
  window.addEventListener("storage", function (e) {
    if (e.key === "butterflyHubCurrentUser") {
      refreshUserData();
    }
  });

  // Also check for changes when window regains focus
  window.addEventListener("focus", function () {
    refreshUserData();
  });
});

function refreshUserData() {
  // Reload user data from localStorage
  currentUser = JSON.parse(
    localStorage.getItem("butterflyHubCurrentUser") || "{}"
  );
  const newPlan = currentUser.plan || "free";

  // Check if plan changed
  if (newPlan !== userPlan) {
    userPlan = newPlan;
    updateUserDisplay();

    // If user upgraded to premium (monthly or lifetime)
    if (userPlan && userPlan !== "free") {
      unlockPremiumFeatures();
      // Re-enable mood tracking if it was disabled
      document.querySelectorAll(".mood-btn").forEach((btn) => {
        btn.style.opacity = "1";
        btn.style.cursor = "pointer";
        btn.onclick = function () {
          selectMood(this.dataset.mood);
        };
      });
      document.getElementById("submitMood").disabled = false;
      document.getElementById("freeLimitation").classList.add("hidden");
    }

    renderMoodHistory();
  }
}

function initializeApp() {
  updateUserDisplay();
  checkDailyLimit();

  // Initialize Chart.js if premium (monthly or lifetime)
  if (userPlan && userPlan !== "free") {
    initializeChart();
    updateAnalytics();
  }
}

function updateUserDisplay() {
  const userGreeting = document.getElementById("userGreeting");
  const planBadge = document.getElementById("planBadge");

  userGreeting.textContent = currentUser.username
    ? `Hello, ${currentUser.username}!`
    : "Welcome!";
  planBadge.textContent = userPlan === "free" ? "Free" : "Butterfly+";
  planBadge.className = `plan-badge ${
    userPlan === "free" ? "" : "plan-premium"
  }`;
}

function setupEventListeners() {
  // Mood selection buttons
  const moodButtons = document.querySelectorAll(".mood-btn");
  moodButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      selectMood(this.dataset.mood);
    });
  });

  // Submit button
  document.getElementById("submitMood").addEventListener("click", submitMood);

  // Close modals on outside click
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        modal.classList.remove("active");
      }
    });
  });
}

function selectMood(mood) {
  // Remove previous selection
  document.querySelectorAll(".mood-btn").forEach((btn) => {
    btn.classList.remove("selected");
  });

  // Add selection to clicked button
  const selectedBtn = document.querySelector(`[data-mood="${mood}"]`);
  selectedBtn.classList.add("selected");
  selectedMood = mood;
}

function checkDailyLimit() {
  // Only check daily limit for free users (not monthly or lifetime)
  if (userPlan === "free" || !userPlan) {
    const today = new Date().toISOString().split("T")[0];
    const todayEntries = moodEntries.filter((entry) => entry.date === today);

    if (todayEntries.length >= 1) {
      // Disable mood selection and show limitation
      document.getElementById("freeLimitation").classList.remove("hidden");
      document.getElementById("submitMood").disabled = true;

      // Disable mood buttons
      document.querySelectorAll(".mood-btn").forEach((btn) => {
        btn.style.opacity = "0.5";
        btn.style.cursor = "not-allowed";
        btn.onclick = null;
      });

      return true;
    }
  }
  return false;
}

function submitMood() {
  if (!selectedMood) {
    showNotification("Please select a mood first! 💫");
    return;
  }

  // Check daily limit for free users
  if (userPlan === "free" || !userPlan) {
    const today = new Date().toISOString().split("T")[0];
    const todayEntries = moodEntries.filter((entry) => entry.date === today);

    if (todayEntries.length >= 1) {
      showDailyLimitModal();
      return;
    }
  }

  // Create mood entry
  const moodEntry = {
    id: Date.now().toString(),
    date: new Date().toISOString().split("T")[0],
    emotion: selectedMood,
    note: document.getElementById("moodNote").value.trim(),
    timestamp: new Date().toISOString(),
  };

  // Add to entries
  moodEntries.unshift(moodEntry);
  localStorage.setItem("moodEntries", JSON.stringify(moodEntries));

  // Reset form
  selectedMood = null;
  document.getElementById("moodNote").value = "";
  document.querySelectorAll(".mood-btn").forEach((btn) => {
    btn.classList.remove("selected");
  });

  // Check daily limit again
  checkDailyLimit();

  // Refresh display
  renderMoodHistory();
  if (userPlan !== "free") {
    updateAnalytics();
  }

  // Show success message
  showNotification("Mood saved successfully! 💫");
}

function renderMoodHistory() {
  const historyContainer = document.getElementById("moodHistory");

  // Filter entries based on user plan
  let displayEntries = moodEntries;
  if (userPlan === "free" || !userPlan) {
    displayEntries = moodEntries.slice(0, 3); // Show only last 3 entries
  }

  if (displayEntries.length === 0) {
    historyContainer.innerHTML = `
      <div class="no-entries">
        <div style="font-size: 3rem; margin-bottom: 1rem;">💜</div>
        <p>No mood entries yet. Start tracking your emotions!</p>
      </div>
    `;
    return;
  }

  let html = "";
  displayEntries.forEach((entry) => {
    const entryDate = new Date(entry.date);
    const formattedDate = entryDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    html += `
      <div class="mood-entry">
        <div class="entry-header">
          <div class="entry-date">${formattedDate}</div>
          <div class="entry-mood">${moodEmojis[entry.emotion]}</div>
        </div>
        <div class="entry-mood-label">${moodLabels[entry.emotion]}</div>
        ${entry.note ? `<div class="entry-note">${entry.note}</div>` : ""}
      </div>
    `;
  });

  // Add limitation notice for free users
  if ((userPlan === "free" || !userPlan) && moodEntries.length > 3) {
    html += `
      <div class="free-limitation">
        🔒 Showing last 3 entries. <a href="#" onclick="showUpgradeModal(); return false;">Upgrade to Butterfly+</a> to see your full history.
      </div>
    `;
  }

  historyContainer.innerHTML = html;
}

function unlockPremiumFeatures() {
  // Remove premium lock
  const premiumLock = document.getElementById("premiumLock");
  if (premiumLock) {
    premiumLock.style.display = "none";
  }

  // Show premium features
  document.getElementById("streakSection").classList.remove("hidden");

  // Initialize chart if not already initialized
  if (!moodChart) {
    initializeChart();
  }

  // Update analytics
  updateAnalytics();
}

function initializeChart() {
  const ctx = document.getElementById("moodChart");
  if (!ctx) return;

  moodChart = new Chart(ctx.getContext("2d"), {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        {
          label: "Mood Frequency",
          data: [],
          backgroundColor: [
            "rgba(255, 124, 248, 0.8)",
            "rgba(82, 171, 244, 0.8)",
            "rgba(167, 139, 250, 0.8)",
            "rgba(0, 245, 255, 0.8)",
            "rgba(255, 247, 0, 0.8)",
            "rgba(0, 255, 136, 0.8)",
            "rgba(255, 149, 0, 0.8)",
            "rgba(255, 100, 200, 0.8)",
          ],
          borderColor: [
            "rgba(255, 124, 248, 1)",
            "rgba(82, 171, 244, 1)",
            "rgba(167, 139, 250, 1)",
            "rgba(0, 245, 255, 1)",
            "rgba(255, 247, 0, 1)",
            "rgba(0, 255, 136, 1)",
            "rgba(255, 149, 0, 1)",
            "rgba(255, 100, 200, 1)",
          ],
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: "#9b8bff",
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
        },
        x: {
          ticks: {
            color: "#9b8bff",
          },
          grid: {
            display: false,
          },
        },
      },
    },
  });
}

function updateAnalytics() {
  if (userPlan === "free" || !userPlan || moodEntries.length === 0) return;

  // Calculate mood frequency for the last 7 days
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  const recentEntries = moodEntries.filter(
    (entry) => new Date(entry.date) >= last7Days
  );

  const moodFrequency = {};
  Object.keys(moodEmojis).forEach((mood) => {
    moodFrequency[mood] = 0;
  });

  recentEntries.forEach((entry) => {
    moodFrequency[entry.emotion]++;
  });

  // Update chart
  if (moodChart) {
    moodChart.data.labels = Object.keys(moodFrequency).map(
      (mood) => moodLabels[mood]
    );
    moodChart.data.datasets[0].data = Object.values(moodFrequency);
    moodChart.update();
  }

  // Update insights
  updateInsights(moodFrequency, recentEntries);

  // Update streak counter
  updateStreakCounter();
}

function updateInsights(moodFrequency, recentEntries) {
  // Most common mood
  const mostCommonMood = Object.entries(moodFrequency).sort(
    ([, a], [, b]) => b - a
  )[0];

  document.getElementById("mostCommonMood").textContent =
    mostCommonMood && mostCommonMood[1] > 0
      ? moodLabels[mostCommonMood[0]]
      : "-";

  // Best day (most positive mood)
  const positiveMoods = ["happy", "peaceful", "grateful", "excited"];
  let bestDay = "-";
  let bestDayScore = 0;

  const dailyMoods = {};
  recentEntries.forEach((entry) => {
    if (!dailyMoods[entry.date]) {
      dailyMoods[entry.date] = 0;
    }
    if (positiveMoods.includes(entry.emotion)) {
      dailyMoods[entry.date]++;
    }
  });

  Object.entries(dailyMoods).forEach(([date, score]) => {
    if (score > bestDayScore) {
      bestDayScore = score;
      bestDay = new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
      });
    }
  });

  document.getElementById("bestDay").textContent = bestDay;

  // Mood trend
  let trend = "Stable";
  if (recentEntries.length >= 2) {
    const recentMood = recentEntries[0].emotion;
    const previousMood = recentEntries[1].emotion;

    if (
      positiveMoods.includes(recentMood) &&
      !positiveMoods.includes(previousMood)
    ) {
      trend = "Improving 📈";
    } else if (
      !positiveMoods.includes(recentMood) &&
      positiveMoods.includes(previousMood)
    ) {
      trend = "Declining 📉";
    }
  }

  document.getElementById("moodTrend").textContent = trend;

  // Total entries
  document.getElementById("totalEntries").textContent = moodEntries.length;
}

function updateStreakCounter() {
  if (moodEntries.length === 0) return;

  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateString = checkDate.toISOString().split("T")[0];

    const hasEntry = moodEntries.some((entry) => entry.date === dateString);

    if (hasEntry) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  document.getElementById("streakNumber").textContent = streak;
}

function showDailyLimitModal() {
  document.getElementById("dailyLimitModal").classList.add("active");
}

function closeDailyLimitModal() {
  document.getElementById("dailyLimitModal").classList.remove("active");
}

function showUpgradeModal() {
  closeDailyLimitModal();
  document.getElementById("upgradeModal").classList.add("active");
}

function closeUpgradeModal() {
  document.getElementById("upgradeModal").classList.remove("active");
}

function upgradeToPremium() {
  closeUpgradeModal();

  // Redirect to Butterfly+ page
  window.location.href = "../html/butterfly-plus.html";
}

function clearHistory() {
  if (
    confirm(
      "Are you sure you want to clear all your mood history? This action cannot be undone."
    )
  ) {
    moodEntries = [];
    localStorage.setItem("moodEntries", JSON.stringify(moodEntries));
    renderMoodHistory();

    if (userPlan !== "free") {
      updateAnalytics();
      updateStreakCounter();
    }

    showNotification("Mood history cleared successfully");
  }
}

function showNotification(message) {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(45deg, var(--accent), var(--accent-2));
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 15px;
    box-shadow: 0 0 20px rgba(255, 0, 255, 0.5);
    z-index: 10000;
    animation: slideIn 0.3s ease;
    font-weight: 500;
    max-width: 300px;
    text-align: center;
  `;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "fadeOut 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Butterfly Field Animation
function createButterflyField() {
  const field = document.querySelector(".butterfly-field");
  if (!field) return;

  const butterflyCount = 8;
  const butterflies = [
    "../assets/Butterfly1.png",
    "../assets/Butterfly2.png",
    "../assets/Butterfly3.png",
    "../assets/Butterfly4.png",
    "../assets/Butterfly5.png",
    "../assets/Butterfly6.png",
  ];

  for (let i = 0; i < butterflyCount; i++) {
    const butterfly = document.createElement("span");
    const randomButterfly =
      butterflies[Math.floor(Math.random() * butterflies.length)];

    butterfly.style.backgroundImage = `url('${randomButterfly}')`;
    butterfly.style.left = `${Math.random() * 100}%`;
    butterfly.style.top = `${100 + Math.random() * 20}%`;
    butterfly.style.animationDelay = `${Math.random() * 5}s`;
    butterfly.style.animationDuration = `${15 + Math.random() * 10}s`;

    field.appendChild(butterfly);
  }
}

// CSS Animations
const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;
document.head.appendChild(style);
