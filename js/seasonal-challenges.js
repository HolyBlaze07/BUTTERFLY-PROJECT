// Seasonal Challenges System
const SEASONS = {
  spring: {
    name: "Spring Bloom",
    dates: { start: { month: 3, day: 1 }, end: { month: 5, day: 31 } },
    butterflies: [
      {
        name: "Cherry Blossom",
        colors: ["#ffb7d5", "#ffd4e5", "#ff69b4"],
        rarity: "common",
      },
      {
        name: "Tulip Flutter",
        colors: ["#ff6b9d", "#c71585", "#ff1493"],
        rarity: "uncommon",
      },
      {
        name: "Sakura Spirit",
        colors: ["#ffaec9", "#ff77a9", "#ff4d8d"],
        rarity: "rare",
      },
      {
        name: "Spring Monarch",
        colors: ["#ffe4e1", "#ffb6c1", "#ff69b4"],
        rarity: "legendary",
      },
    ],
    challenges: [
      { type: "catch", target: 50, reward: 500, name: "Spring Gathering" },
      { type: "rare", target: 10, reward: 1000, name: "Rare Blooms" },
      { type: "combo", target: 15, reward: 800, name: "Petal Dance" },
    ],
    background: "spring-theme",
  },
  summer: {
    name: "Summer Paradise",
    dates: { start: { month: 6, day: 1 }, end: { month: 8, day: 31 } },
    butterflies: [
      {
        name: "Sunset Wing",
        colors: ["#ff6347", "#ff7f50", "#ffa500"],
        rarity: "common",
      },
      {
        name: "Ocean Breeze",
        colors: ["#00ced1", "#1e90ff", "#4169e1"],
        rarity: "uncommon",
      },
      {
        name: "Golden Hour",
        colors: ["#ffd700", "#ffed4e", "#ffff00"],
        rarity: "rare",
      },
      {
        name: "Summer Empress",
        colors: ["#ff4500", "#ff6347", "#ffd700"],
        rarity: "legendary",
      },
    ],
    challenges: [
      { type: "catch", target: 60, reward: 600, name: "Beach Collection" },
      { type: "speed", target: 30, reward: 900, name: "Swift Summer" },
      { type: "combo", target: 20, reward: 1000, name: "Heat Wave" },
    ],
    background: "summer-theme",
  },
  autumn: {
    name: "Autumn Harvest",
    dates: { start: { month: 9, day: 1 }, end: { month: 11, day: 30 } },
    butterflies: [
      {
        name: "Maple Leaf",
        colors: ["#d2691e", "#cd853f", "#daa520"],
        rarity: "common",
      },
      {
        name: "Harvest Moon",
        colors: ["#ff8c00", "#ffa500", "#ffb347"],
        rarity: "uncommon",
      },
      {
        name: "Amber Wing",
        colors: ["#b8860b", "#daa520", "#ff8c00"],
        rarity: "rare",
      },
      {
        name: "Autumn Phoenix",
        colors: ["#8b4513", "#a0522d", "#cd853f"],
        rarity: "legendary",
      },
    ],
    challenges: [
      { type: "catch", target: 55, reward: 550, name: "Fall Harvest" },
      { type: "rare", target: 12, reward: 1100, name: "Golden Collection" },
      { type: "perfect", target: 8, reward: 900, name: "Autumn Precision" },
    ],
    background: "autumn-theme",
  },
  winter: {
    name: "Winter Wonderland",
    dates: { start: { month: 12, day: 1 }, end: { month: 2, day: 28 } },
    butterflies: [
      {
        name: "Snowflake",
        colors: ["#e0ffff", "#b0e0e6", "#add8e6"],
        rarity: "common",
      },
      {
        name: "Frost Crystal",
        colors: ["#87ceeb", "#4682b4", "#1e90ff"],
        rarity: "uncommon",
      },
      {
        name: "Ice Diamond",
        colors: ["#b0e0e6", "#87cefa", "#00bfff"],
        rarity: "rare",
      },
      {
        name: "Aurora",
        colors: ["#e0ffff", "#afeeee", "#87ceeb"],
        rarity: "legendary",
      },
    ],
    challenges: [
      { type: "catch", target: 45, reward: 500, name: "Crystal Collection" },
      { type: "combo", target: 18, reward: 950, name: "Frost Combo" },
      { type: "speed", target: 25, reward: 850, name: "Ice Rush" },
    ],
    background: "winter-theme",
    music: [
      {
        src: "assets/audio/winter-wonderland-178325.mp3",
        credit: '"Winter Wonderland" (Pixabay)',
      },
      {
        src: "assets/audio/winter-bells-440372.mp3",
        credit: '"Winter Bells" (Pixabay)',
      },
      {
        src: "assets/audio/child-of-winter-light-440370.mp3",
        credit: '"Child of Winter Light" (Pixabay)',
      },
    ],
  },
  christmas: {
    name: "Christmas Magic",
    dates: { start: { month: 12, day: 15 }, end: { month: 12, day: 26 } },
    butterflies: [
      {
        name: "Jesus Light",
        colors: ["#ffffff", "#ffd700", "#fffacd"],
        rarity: "legendary",
      },
      {
        name: "Holy Spirit",
        colors: ["#e6e6fa", "#ffffff", "#add8e6"],
        rarity: "rare",
      },
      {
        name: "Christmas Star",
        colors: ["#ffd700", "#ffff00", "#ff4500"],
        rarity: "uncommon",
      },
      {
        name: "Holly Berry",
        colors: ["#dc143c", "#228b22", "#ffd700"],
        rarity: "common",
      },
    ],
    challenges: [
      { type: "catch", target: 70, reward: 1500, name: "Gift Collection" },
      { type: "rare", target: 15, reward: 2000, name: "Blessing Hunt" },
      { type: "combo", target: 25, reward: 1800, name: "Joyful Combo" },
    ],
    background: "christmas-theme",
  },
  valentine: {
    name: "Valentine's Day",
    dates: { start: { month: 2, day: 10 }, end: { month: 2, day: 15 } },
    butterflies: [
      {
        name: "Love Letter",
        colors: ["#ff1493", "#ff69b4", "#ffb6c1"],
        rarity: "common",
      },
      {
        name: "Cupid's Arrow",
        colors: ["#dc143c", "#ff0000", "#ff4500"],
        rarity: "uncommon",
      },
      {
        name: "Heart Throb",
        colors: ["#ff69b4", "#ff1493", "#c71585"],
        rarity: "rare",
      },
      {
        name: "True Love",
        colors: ["#ff0000", "#ff1493", "#ffd700"],
        rarity: "legendary",
      },
    ],
    challenges: [
      { type: "catch", target: 50, reward: 1200, name: "Love Collection" },
      { type: "rare", target: 14, reward: 1400, name: "Sweetheart Special" },
      { type: "perfect", target: 10, reward: 1300, name: "Perfect Match" },
    ],
    background: "valentine-theme",
  },
  newyear: {
    name: "New Year Celebration",
    dates: { start: { month: 12, day: 30 }, end: { month: 1, day: 2 } },
    butterflies: [
      {
        name: "Firework",
        colors: ["#ff0000", "#ffd700", "#00ff00"],
        rarity: "common",
      },
      {
        name: "Champagne Bubble",
        colors: ["#ffff00", "#ffd700", "#fffacd"],
        rarity: "uncommon",
      },
      {
        name: "Midnight Spark",
        colors: ["#0000ff", "#4169e1", "#87ceeb"],
        rarity: "rare",
      },
      {
        name: "New Beginning",
        colors: ["#ffd700", "#ff4500", "#9400d3"],
        rarity: "legendary",
      },
    ],
    challenges: [
      { type: "catch", target: 75, reward: 2000, name: "New Year Bash" },
      { type: "combo", target: 30, reward: 2500, name: "Countdown Combo" },
      { type: "speed", target: 40, reward: 2200, name: "Midnight Sprint" },
    ],
    background: "newyear-theme",
  },
};

let currentSeason = null;
let seasonalChallenges = [];
let seasonalCollection = {};
let seasonalStats = {
  totalSeasonalCaught: 0,
  seasonalStreaks: {},
  completedSeasons: [],
};

// Seasonal music state
let allowSeasonMusic = true; // Enable seasonal music by default
let seasonMusicPlayer = null;
let currentMusicSeason = null;
let seasonPlaylist = [];
let seasonPlaylistIndex = 0;
let seasonAudioUnlockPending = false;
let pendingMusicSeason = null;
let seasonAudioUnlockHandler = null;

// Make seasonMusicPlayer globally accessible
window.seasonMusicPlayer = null;

// Initialize seasonal system
function initSeasonalChallenges() {
  loadSeasonalData();
  detectCurrentSeason();
  setupSeasonalPanel();
  updateSeasonalChallenges();
  updateSeasonalCollection();
  startSeasonalTimer();
}

// Make init function globally accessible
window.initSeasonalChallenges = initSeasonalChallenges;

// Detect current season based on date
function detectCurrentSeason() {
  const now = new Date();
  const month = now.getMonth() + 1; // 0-indexed, so add 1
  const day = now.getDate();

  // Check special events first (they override regular seasons)
  const specialEvents = ["christmas", "valentine", "newyear"];
  for (const eventKey of specialEvents) {
    const event = SEASONS[eventKey];
    if (isDateInRange(month, day, event.dates)) {
      currentSeason = eventKey;
      applySeasonalTheme(eventKey);
      return;
    }
  }

  // Check regular seasons
  const regularSeasons = ["spring", "summer", "autumn", "winter"];
  for (const seasonKey of regularSeasons) {
    const season = SEASONS[seasonKey];
    if (isDateInRange(month, day, season.dates)) {
      currentSeason = seasonKey;
      applySeasonalTheme(seasonKey);
      return;
    }
  }

  // Default to spring if no match
  currentSeason = "spring";
  applySeasonalTheme("spring");
}

// Check if date is in range (handles year wrap)
function isDateInRange(month, day, dates) {
  const start = dates.start;
  const end = dates.end;

  // Handle year wrap (e.g., Dec 30 - Jan 2)
  if (start.month > end.month) {
    return (
      month > start.month ||
      month < end.month ||
      (month === start.month && day >= start.day) ||
      (month === end.month && day <= end.day)
    );
  }

  // Normal range - check if date falls within start and end dates
  if (month < start.month || month > end.month) {
    return false;
  }
  if (month === start.month && day < start.day) {
    return false;
  }
  if (month === end.month && day > end.day) {
    return false;
  }
  return true;
}

// Apply seasonal theme to page
function applySeasonalTheme(seasonKey) {
  const body = document.body;

  // Remove all seasonal theme classes
  Object.keys(SEASONS).forEach((key) => {
    body.classList.remove(SEASONS[key].background);
  });

  // Add current seasonal theme
  if (SEASONS[seasonKey]?.background) {
    body.classList.add(SEASONS[seasonKey].background);
  }

  if (allowSeasonMusic) {
    playSeasonMusic(seasonKey);
  } else {
    pendingMusicSeason = seasonKey;
  }
}

// Setup seasonal panel
function setupSeasonalPanel() {
  const panel = document.querySelector(".seasonal-challenges-panel");
  if (!panel) return;

  updateSeasonalChallenges();
  updateSeasonalCollection();
}

function playSeasonMusic(seasonKey) {
  if (!seasonKey) {
    stopSeasonMusic();
    return;
  }

  const config = SEASONS[seasonKey];
  if (!config || !Array.isArray(config.music) || !config.music.length) {
    stopSeasonMusic();
    return;
  }

  if (!seasonMusicPlayer) {
    seasonMusicPlayer = new Audio();
    seasonMusicPlayer.loop = false;
    seasonMusicPlayer.volume = 0.45;
    seasonMusicPlayer.addEventListener("ended", handleSeasonTrackEnded);
    window.seasonMusicPlayer = seasonMusicPlayer; // Make globally accessible
  }

  if (seasonKey !== currentMusicSeason) {
    seasonPlaylist = config.music.slice();
    seasonPlaylistIndex = 0;
    currentMusicSeason = seasonKey;
  }

  startSeasonTrack();
}

function stopSeasonMusic() {
  if (seasonMusicPlayer) {
    seasonMusicPlayer.pause();
    seasonMusicPlayer.currentTime = 0;
  }
  currentMusicSeason = null;
  seasonPlaylist = [];
  seasonPlaylistIndex = 0;
  updateSeasonalMusicCredit(null);
}

function startSeasonTrack() {
  if (!seasonMusicPlayer || !seasonPlaylist.length) return;

  const trackEntry =
    seasonPlaylist[seasonPlaylistIndex % seasonPlaylist.length];
  const trackSrc =
    typeof trackEntry === "string" ? trackEntry : trackEntry?.src;
  if (!trackSrc) return;

  const currentTrack = seasonMusicPlayer.getAttribute("data-track");

  // Only restart if it's a different track or if the player is not playing
  if (currentTrack !== trackSrc || seasonMusicPlayer.paused) {
    if (currentTrack !== trackSrc) {
      seasonMusicPlayer.setAttribute("data-track", trackSrc);
      seasonMusicPlayer.src = trackSrc;
    }
    seasonMusicPlayer.currentTime = 0;

    updateSeasonalMusicCredit(trackEntry);

    const playPromise = seasonMusicPlayer.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => scheduleSeasonAudioUnlock());
    }
  }
}

function handleSeasonTrackEnded() {
  if (!seasonPlaylist.length) return;
  seasonPlaylistIndex = (seasonPlaylistIndex + 1) % seasonPlaylist.length;
  startSeasonTrack();
}

function scheduleSeasonAudioUnlock() {
  if (seasonAudioUnlockPending) return;
  seasonAudioUnlockPending = true;

  seasonAudioUnlockHandler = () => {
    document.removeEventListener("pointerdown", seasonAudioUnlockHandler);
    seasonAudioUnlockPending = false;
    seasonAudioUnlockHandler = null;
    startSeasonTrack();
  };

  document.addEventListener("pointerdown", seasonAudioUnlockHandler, {
    once: true,
  });
}

function updateSeasonalMusicCredit(trackEntry) {
  const creditText =
    typeof trackEntry === "object" && trackEntry?.credit
      ? trackEntry.credit
      : "";
  const creditBadge = document.getElementById("seasonalMusicCredit");
  if (creditBadge) {
    creditBadge.textContent = creditText;
    creditBadge.style.display = creditText ? "block" : "none";
  }

  if (creditText) {
    console.info(`[Seasonal Music] ${creditText}`);
  }
}

// Update seasonal challenges
function updateSeasonalChallenges() {
  if (!currentSeason) return;

  const season = SEASONS[currentSeason];
  const challengesList = document.getElementById("seasonalChallengesList");
  const challengesListPreview = document.getElementById(
    "seasonalChallengesListPreview"
  );

  // Load or create challenges for current season
  const storageKey = `seasonal_${currentSeason}_challenges`;
  let challenges = JSON.parse(localStorage.getItem(storageKey) || "null");

  if (!challenges || !isSameSeasonPeriod(challenges.date)) {
    // Create new challenges for this season
    challenges = {
      date: new Date().toISOString(),
      items: season.challenges.map((c) => ({
        ...c,
        progress: 0,
        completed: false,
      })),
    };
    localStorage.setItem(storageKey, JSON.stringify(challenges));
  }

  seasonalChallenges = challenges.items;

  // Render challenges
  const challengesHTML = seasonalChallenges
    .map(
      (challenge, index) => `
    <div class="seasonal-challenge-item ${
      challenge.completed ? "completed" : ""
    }">
      <div class="challenge-header">
        <span class="challenge-name">${challenge.name}</span>
        <span class="challenge-reward">+${challenge.reward}</span>
      </div>
      <div class="challenge-description">${getChallengeDescription(
        challenge
      )}</div>
      <div class="challenge-progress">
        <div class="challenge-progress-fill" style="width: ${
          (challenge.progress / challenge.target) * 100
        }%"></div>
      </div>
      <div class="challenge-status">
        <span>${challenge.progress}/${challenge.target}</span>
        <span class="challenge-check">✓</span>
      </div>
    </div>
  `
    )
    .join("");

  if (challengesList) {
    challengesList.innerHTML = challengesHTML;
  }

  if (challengesListPreview) {
    challengesListPreview.innerHTML = challengesHTML;
  }

  // Update season info
  const seasonInfo = document.querySelector(".season-info");
  const seasonNamePreview = document.getElementById("seasonNamePreview");
  const seasonEndPreview = document.getElementById("seasonEndPreview");

  if (seasonInfo) {
    seasonInfo.innerHTML = `
      <div class="season-name">${season.name}</div>
      <div class="season-end">Ends: ${getSeasonEndDate()}</div>
    `;
  }

  if (seasonNamePreview) {
    seasonNamePreview.textContent = season.name;
  }

  if (seasonEndPreview) {
    seasonEndPreview.textContent = `Ends: ${getSeasonEndDate()}`;
  }

  // Update event banner
  const eventBanner = document.querySelector(".seasonal-event-banner");
  const eventBannerPreview = document.getElementById(
    "seasonalEventBannerPreview"
  );

  if (eventBanner) {
    eventBanner.textContent = `🦋 ${season.name} Event Active! 🦋`;
  }

  if (eventBannerPreview) {
    eventBannerPreview.textContent = `🦋 ${season.name} Event Active! 🦋`;
  }
}

// Get challenge description
function getChallengeDescription(challenge) {
  const descriptions = {
    catch: `Catch ${challenge.target} seasonal butterflies`,
    rare: `Catch ${challenge.target} rare seasonal butterflies`,
    combo: `Achieve a ${challenge.target}x combo`,
    speed: `Catch ${challenge.target} butterflies in 30 seconds`,
    perfect: `Catch ${challenge.target} butterflies without missing`,
  };
  return descriptions[challenge.type] || "Complete the challenge";
}

// Check if it's the same season period
function isSameSeasonPeriod(dateString) {
  if (!dateString) return false;

  const savedDate = new Date(dateString);
  const now = new Date();

  if (!currentSeason) return false;

  const season = SEASONS[currentSeason];
  const savedMonth = savedDate.getMonth() + 1;
  const savedDay = savedDate.getDate();

  return isDateInRange(savedMonth, savedDay, season.dates);
}

// Get season end date
function getSeasonEndDate() {
  if (!currentSeason) return "";

  const season = SEASONS[currentSeason];
  const end = season.dates.end;
  const year = new Date().getFullYear();

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${monthNames[end.month - 1]} ${end.day}`;
}

// Update seasonal collection
function updateSeasonalCollection() {
  if (!currentSeason) return;

  const season = SEASONS[currentSeason];
  const collectionGrid = document.getElementById("seasonalCollectionGrid");
  const collectionGridPreview = document.getElementById(
    "seasonalCollectionGridPreview"
  );

  // Load collection progress
  const storageKey = `seasonal_${currentSeason}_collection`;
  const collection = JSON.parse(localStorage.getItem(storageKey) || "{}");

  const collectionHTML = season.butterflies
    .map((butterfly, index) => {
      const caught = collection[butterfly.name] || 0;
      const unlocked = caught > 0;

      return `
      <div class="collection-item ${unlocked ? "unlocked" : ""}" title="${
        butterfly.name
      } (${caught})">
        <div class="collection-butterfly" style="background: linear-gradient(45deg, ${butterfly.colors.join(
          ", "
        )})"></div>
        <div class="collection-count">${caught}</div>
        <div class="collection-name">${butterfly.name}</div>
      </div>
    `;
    })
    .join("");

  if (collectionGrid) {
    collectionGrid.innerHTML = collectionHTML;
  }

  if (collectionGridPreview) {
    collectionGridPreview.innerHTML = collectionHTML;
  }
}

// Spawn seasonal butterfly in game
function spawnSeasonalButterfly() {
  if (!currentSeason || !window.gameActive) return null;

  const season = SEASONS[currentSeason];

  // 30% chance to spawn seasonal butterfly
  if (Math.random() > 0.3) return null;

  // Weighted random selection based on rarity
  const weights = { common: 50, uncommon: 30, rare: 15, legendary: 5 };
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;

  let selectedButterfly = null;
  for (const butterfly of season.butterflies) {
    random -= weights[butterfly.rarity];
    if (random <= 0) {
      selectedButterfly = butterfly;
      break;
    }
  }

  if (!selectedButterfly) return null;

  return {
    ...selectedButterfly,
    isSeasonal: true,
    isSpecial:
      selectedButterfly.rarity === "rare" ||
      selectedButterfly.rarity === "legendary",
  };
}

// Handle seasonal butterfly caught
function onSeasonalButterflyCaught(butterfly) {
  if (!butterfly.isSeasonal || !currentSeason) return;

  const season = SEASONS[currentSeason];

  // Update collection
  const storageKey = `seasonal_${currentSeason}_collection`;
  const collection = JSON.parse(localStorage.getItem(storageKey) || "{}");
  collection[butterfly.name] = (collection[butterfly.name] || 0) + 1;
  localStorage.setItem(storageKey, JSON.stringify(collection));

  // Update stats
  seasonalStats.totalSeasonalCaught++;
  saveSeasonalStats();

  // Update challenges
  updateSeasonalChallengeProgress("catch", 1);

  if (butterfly.isSpecial) {
    updateSeasonalChallengeProgress("rare", 1);
  }

  // Update UI
  updateSeasonalCollection();
  updateSeasonalChallenges();

  // Show seasonal catch effect
  showSeasonalCatchEffect(butterfly);
}

// Update seasonal challenge progress
function updateSeasonalChallengeProgress(type, amount) {
  if (!currentSeason) return;

  const storageKey = `seasonal_${currentSeason}_challenges`;
  let challenges = JSON.parse(localStorage.getItem(storageKey));
  if (!challenges) return;

  let anyCompleted = false;
  let anyUpdated = false;

  challenges.items.forEach((challenge) => {
    if (challenge.type === type && !challenge.completed) {
      const oldProgress = challenge.progress;
      challenge.progress = Math.min(
        challenge.progress + amount,
        challenge.target
      );

      if (challenge.progress !== oldProgress) {
        anyUpdated = true;
      }

      if (challenge.progress >= challenge.target && !challenge.completed) {
        challenge.completed = true;
        anyCompleted = true;

        // Award points
        if (window.updateScore) {
          window.updateScore(challenge.reward);
        }

        showSeasonalCompleteAnimation(challenge.name);
      }
    }
  });

  if (anyUpdated || anyCompleted) {
    localStorage.setItem(storageKey, JSON.stringify(challenges));
    updateSeasonalChallenges();
  }
}

// Show seasonal catch effect
function showSeasonalCatchEffect(butterfly) {
  const effect = document.createElement("div");
  effect.className = "seasonal-catch-effect";
  effect.textContent = `✨ ${butterfly.name}! ✨`;
  effect.style.position = "fixed";
  effect.style.top = "50%";
  effect.style.left = "50%";
  effect.style.transform = "translate(-50%, -50%)";
  effect.style.fontSize = "32px";
  effect.style.color = butterfly.colors[0];
  effect.style.fontWeight = "bold";
  effect.style.textShadow = `0 0 20px ${butterfly.colors[1]}`;
  effect.style.zIndex = "3000";
  effect.style.animation = "seasonalCatchEffect 2s ease-out forwards";
  effect.style.pointerEvents = "none";

  document.body.appendChild(effect);
  setTimeout(() => effect.remove(), 2000);
}

// Show seasonal challenge complete animation
function showSeasonalCompleteAnimation(challengeName) {
  const animation = document.createElement("div");
  animation.className = "seasonal-complete-animation";
  animation.textContent = `${challengeName} Complete! 🎉`;

  document.body.appendChild(animation);
  setTimeout(() => animation.remove(), 2000);
}

// Seasonal timer
function startSeasonalTimer() {
  updateSeasonalTimer();
  setInterval(updateSeasonalTimer, 1000);
}

function updateSeasonalTimer() {
  const timerElement = document.getElementById("seasonalTimer");
  const timerElementPreview = document.getElementById("seasonalTimerPreview");
  if (!currentSeason) return;

  const season = SEASONS[currentSeason];
  const now = new Date();
  const year = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  let endDate;

  // Handle year wrap (e.g., winter goes from Dec to Feb)
  if (season.dates.start.month > season.dates.end.month) {
    // Season spans across new year
    if (currentMonth >= season.dates.start.month) {
      // We're in the start year (e.g., December), end date is next year
      endDate = new Date(
        year + 1,
        season.dates.end.month - 1,
        season.dates.end.day,
        23,
        59,
        59
      );
    } else {
      // We're in the end year (e.g., January/February), end date is this year
      endDate = new Date(
        year,
        season.dates.end.month - 1,
        season.dates.end.day,
        23,
        59,
        59
      );
    }
  } else {
    // Normal season within same year
    endDate = new Date(
      year,
      season.dates.end.month - 1,
      season.dates.end.day,
      23,
      59,
      59
    );
  }

  const diff = endDate - now;

  if (diff <= 0) {
    if (timerElement) timerElement.textContent = "Season Ended";
    if (timerElementPreview) timerElementPreview.textContent = "Season Ended";
    detectCurrentSeason(); // Check for new season
    updateSeasonalChallenges();
    updateSeasonalCollection();
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  const timeText = `${days}d ${hours}h ${minutes}m`;
  if (timerElement) timerElement.textContent = timeText;
  if (timerElementPreview) timerElementPreview.textContent = timeText;
}

// Load/save seasonal data
function loadSeasonalData() {
  const saved = localStorage.getItem("seasonalStats");
  if (saved) {
    seasonalStats = JSON.parse(saved);
  }
}

function saveSeasonalStats() {
  localStorage.setItem("seasonalStats", JSON.stringify(seasonalStats));
}

// Export functions for game integration
window.seasonalSystem = {
  init: initSeasonalChallenges,
  spawnButterfly: spawnSeasonalButterfly,
  onCatch: onSeasonalButterflyCaught,
  updateProgress: updateSeasonalChallengeProgress,
  getCurrentSeason: () => currentSeason,
  getSeasonData: () => (currentSeason ? SEASONS[currentSeason] : null),
};

// Initialize immediately on page load to set the theme
document.addEventListener("DOMContentLoaded", () => {
  // Detect and apply theme immediately
  loadSeasonalData();
  detectCurrentSeason();

  // Wait for game mode to initialize full system
  const gameMode = document.getElementById("gameMode");
  if (gameMode) {
    // Check if game mode is already active
    if (gameMode.classList.contains("active") && !window.seasonalInitialized) {
      initSeasonalChallenges();
      window.seasonalInitialized = true;
    }

    // Also watch for future changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.attributeName === "style" ||
          mutation.attributeName === "class"
        ) {
          const isVisible = gameMode.classList.contains("active");
          if (isVisible && !window.seasonalInitialized) {
            initSeasonalChallenges();
            window.seasonalInitialized = true;
          }
        }
      });
    });

    observer.observe(gameMode, { attributes: true });
  }
});
