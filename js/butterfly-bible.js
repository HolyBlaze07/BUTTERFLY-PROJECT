const API_BASE = "https://bible.helloao.org/api";
const DEFAULT_TRANSLATION = "BSB";

// Theme Toggle Functionality
function initializeTheme() {
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const themeText = document.getElementById("themeText");

  // Check for saved theme preference or default to light mode
  const savedTheme = localStorage.getItem("butterflyBibleTheme") || "light";

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeIcon.textContent = "☀️";
    themeText.textContent = "Light Mode";
  }

  // Theme toggle click handler
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");

    // Update button
    if (isDark) {
      themeIcon.textContent = "☀️";
      themeText.textContent = "Light Mode";
      localStorage.setItem("butterflyBibleTheme", "dark");
    } else {
      themeIcon.textContent = "🌙";
      themeText.textContent = "Dark Mode";
      localStorage.setItem("butterflyBibleTheme", "light");
    }
  });

  // Keyboard accessibility
  themeToggle.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      themeToggle.click();
    }
  });
}

// Toggle bookmarks dropdown
function toggleBookmarks() {
  const bookmarkList = document.getElementById("bookmark-list");
  const toggle = document.getElementById("bookmark-toggle");
  const header = document.querySelector(".bookmark-header");

  if (bookmarkList.style.display === "none") {
    bookmarkList.style.display = "flex";
    toggle.classList.add("open");
    header.setAttribute("aria-expanded", "true");
  } else {
    bookmarkList.style.display = "none";
    toggle.classList.remove("open");
    header.setAttribute("aria-expanded", "false");
  }
}

// Toggle history dropdown
function toggleHistory() {
  const historyList = document.getElementById("history-list");
  const toggle = document.getElementById("history-toggle");
  const header = document.querySelector(".history-header");

  if (historyList.style.display === "none") {
    historyList.style.display = "flex";
    toggle.classList.add("open");
    header.setAttribute("aria-expanded", "true");
  } else {
    historyList.style.display = "none";
    toggle.classList.remove("open");
    header.setAttribute("aria-expanded", "false");
  }
}

// Toggle progress dropdown
function toggleProgress() {
  const progressContent = document.getElementById("progress-content");
  const toggle = document.getElementById("progress-toggle");
  const header = document.querySelector(".progress-header");

  if (progressContent.style.display === "none") {
    progressContent.style.display = "flex";
    toggle.classList.add("open");
    header.setAttribute("aria-expanded", "true");
  } else {
    progressContent.style.display = "none";
    toggle.classList.remove("open");
    header.setAttribute("aria-expanded", "false");
  }
}

// Journal functionality
let journalEntries = [];

function initializeJournal() {
  // Load saved journal entries
  const savedEntries = localStorage.getItem("butterflyBibleJournalEntries");
  if (savedEntries) {
    journalEntries = JSON.parse(savedEntries);
    renderJournalEntries();
  }
  updateEntryCount();
}

function saveJournalEntry() {
  const titleInput = document.getElementById("entry-title");
  const descriptionInput = document.getElementById("entry-description");
  const tagsInput = document.getElementById("entry-tags");

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const tags = tagsInput.value.trim();

  if (!title) {
    alert("Please enter a title for your journal entry.");
    titleInput.focus();
    return;
  }

  if (!description) {
    alert("Please write your reflection in the description.");
    descriptionInput.focus();
    return;
  }

  // Create new entry
  const entry = {
    id: Date.now(),
    title: title,
    description: description,
    tags: tags
      ? tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag)
      : [],
    date: new Date().toISOString(),
  };

  // Add to beginning of array (newest first)
  journalEntries.unshift(entry);

  // Save to localStorage
  localStorage.setItem(
    "butterflyBibleJournalEntries",
    JSON.stringify(journalEntries)
  );

  // Clear form
  titleInput.value = "";
  descriptionInput.value = "";
  tagsInput.value = "";

  // Re-render entries
  renderJournalEntries();
  updateEntryCount();

  // Scroll to entries
  document
    .querySelector(".journal-entries-container")
    .scrollIntoView({ behavior: "smooth" });
}

function renderJournalEntries() {
  const container = document.getElementById("journal-entries-list");
  const template = document.getElementById("journal-entry-template");

  if (journalEntries.length === 0) {
    container.innerHTML =
      '<p class="no-entries">No entries yet. Start writing your first reflection!</p>';
    return;
  }

  container.innerHTML = "";

  journalEntries.forEach((entry) => {
    const clone = template.content.cloneNode(true);

    clone.querySelector('[data-field="title"]').textContent = entry.title;
    clone.querySelector('[data-field="description"]').textContent =
      entry.description;

    const date = new Date(entry.date);
    const dateStr = date.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    clone.querySelector('[data-field="date"]').textContent = dateStr;

    const tagsContainer = clone.querySelector('[data-field="tags"]');
    if (entry.tags && entry.tags.length > 0) {
      tagsContainer.innerHTML = entry.tags
        .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
        .join("");
    } else {
      tagsContainer.remove();
    }

    const entryDiv = clone.querySelector(".journal-entry");
    entryDiv.dataset.id = entry.id;

    container.appendChild(clone);
  });
}

let entryToDelete = null;

function deleteJournalEntry(button) {
  entryToDelete = button.closest(".journal-entry");
  const modal = document.getElementById("deleteModal");
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
}

function closeDeleteModal(event) {
  if (event) {
    event.stopPropagation();
  }
  const modal = document.getElementById("deleteModal");
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  entryToDelete = null;
}

function confirmDelete() {
  if (!entryToDelete) return;

  const entryId = parseInt(entryToDelete.dataset.id);

  // Remove from array
  journalEntries = journalEntries.filter((entry) => entry.id !== entryId);

  // Save to localStorage
  localStorage.setItem(
    "butterflyBibleJournalEntries",
    JSON.stringify(journalEntries)
  );

  // Re-render
  renderJournalEntries();
  updateEntryCount();

  // Close modal
  closeDeleteModal();
}

function updateEntryCount() {
  const count = journalEntries.length;
  document.getElementById("entry-count").textContent = `${count} ${
    count === 1 ? "entry" : "entries"
  }`;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

const STORAGE_KEYS = {
  bookmarks: "butterflyBibleBookmarks",
  history: "butterflyBibleHistory",
  settings: "butterflyBibleSettings",
};

const state = {
  translations: [],
  books: [],
  translationId: DEFAULT_TRANSLATION,
  currentBook: null,
  currentChapter: null,
  nextChapterLink: null,
  prevChapterLink: null,
  bookmarks: [],
  history: [],
  user: null,
};

const selectors = {
  translationSelect: document.getElementById("translation-select"),
  bookSearch: document.getElementById("book-search"),
  bookGrid: document.getElementById("book-grid"),
  chapterContent: document.getElementById("chapter-content"),
  chapterLabel: document.getElementById("chapter-label"),
  chapterHeading: document.getElementById("chapter-heading"),
  prevBtn: document.getElementById("prev-chapter"),
  nextBtn: document.getElementById("next-chapter"),
  prevBtnBottom: document.getElementById("prev-chapter-bottom"),
  nextBtnBottom: document.getElementById("next-chapter-bottom"),
  statusPill: document.getElementById("status-pill"),
  bookmarkList: document.getElementById("bookmark-list"),
  historyList: document.getElementById("history-list"),
  progressMeter: document.getElementById("progress-meter"),
  progressCopy: document.getElementById("progress-copy"),
  bookmarkTemplate: document.getElementById("bookmark-template"),
  butterflyField: document.querySelector(".butterfly-field"),
};

document.addEventListener("DOMContentLoaded", () => {
  enforceAuth();
  hydrateButterflies();
  loadLocalData();
  initializeJournal();
  initializeTheme();
  bootstrapEvents();
  hydrateTranslations();
});

function enforceAuth() {
  const hubProfile = localStorage.getItem("butterflyHubCurrentUser");
  const legacyProfile = localStorage.getItem("butterflyUser");
  const rawProfile = hubProfile || legacyProfile;
  if (!rawProfile) {
    window.location.href = "butterfly-auth.html";
    return;
  }
  try {
    state.user = JSON.parse(rawProfile);
  } catch (error) {
    console.warn("Unable to parse stored profile", error);
    window.location.href = "butterfly-auth.html";
  }
}

function hydrateButterflies() {
  const sprites = [
    "Butterfly4.png",
    "Butterfly6.png",
    "Butterfly8.png",
    "Butterfly12.png",
  ];
  for (let i = 0; i < 9; i++) {
    const span = document.createElement("span");
    const asset = sprites[i % sprites.length];
    span.style.left = Math.random() * 100 + "%";
    span.style.bottom = Math.random() * 20 - 10 + "vh";
    span.style.animationDelay = `${Math.random() * 12}s`;
    span.style.backgroundImage = `url(../assets/${asset})`;
    selectors.butterflyField.appendChild(span);
  }
}

function loadLocalData() {
  state.bookmarks = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.bookmarks) || "[]"
  );
  state.history = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.history) || "[]"
  );
  const savedSettings = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.settings) || "{}"
  );
  if (savedSettings.translationId) {
    state.translationId = savedSettings.translationId;
  }
  renderBookmarks();
  renderHistory();
  updateProgress();
}

function bootstrapEvents() {
  selectors.translationSelect.addEventListener("change", (e) => {
    state.translationId = e.target.value;
    persistSettings();
    loadBooks();
  });

  selectors.bookSearch.addEventListener("input", (e) => {
    renderBooks(e.target.value.trim().toLowerCase());
  });

  selectors.prevBtn.addEventListener("click", () =>
    navigateChapter(state.prevChapterLink)
  );
  selectors.nextBtn.addEventListener("click", () =>
    navigateChapter(state.nextChapterLink)
  );
  selectors.prevBtnBottom.addEventListener("click", () =>
    navigateChapter(state.prevChapterLink)
  );
  selectors.nextBtnBottom.addEventListener("click", () =>
    navigateChapter(state.nextChapterLink)
  );
}

async function hydrateTranslations() {
  selectors.statusPill.textContent = "Fetching translations…";
  try {
    const res = await fetch(`${API_BASE}/available_translations.json`);
    const payload = await res.json();
    state.translations = payload.translations || [];
    populateTranslationSelect();
    await loadBooks();
  } catch (err) {
    console.error(err);
    selectors.statusPill.textContent = "API unavailable";
  }
}

function populateTranslationSelect() {
  selectors.translationSelect.innerHTML = "";
  state.translations.forEach((translation) => {
    const option = document.createElement("option");
    option.value = translation.id;
    option.textContent = `${translation.shortName || translation.id} · ${
      translation.englishName
    }`;
    if (translation.id === state.translationId) {
      option.selected = true;
    }
    selectors.translationSelect.append(option);
  });
}

async function loadBooks() {
  selectors.statusPill.textContent = "Loading books…";
  try {
    const res = await fetch(`${API_BASE}/${state.translationId}/books.json`);
    const payload = await res.json();
    state.books = payload.books || [];
    selectors.statusPill.textContent = `${
      payload.translation?.englishName || state.translationId
    } ready`;
    renderBooks();
  } catch (err) {
    console.error(err);
    selectors.statusPill.textContent = "Book list failed";
  }
}

function renderBooks(filter = "") {
  selectors.bookGrid.innerHTML = "";
  const filtered = state.books.filter((book) =>
    book.commonName.toLowerCase().includes(filter)
  );
  filtered.forEach((book) => {
    const btn = document.createElement("button");
    btn.className = "book-tile";
    btn.type = "button";
    btn.dataset.id = book.id;
    btn.innerHTML = `<strong>${book.commonName}</strong><span>${book.numberOfChapters} chapters</span>`;
    if (state.currentBook?.id === book.id) {
      btn.classList.add("active");
    }
    btn.addEventListener("click", () => openChapterSelector(book));
    selectors.bookGrid.append(btn);
  });
}

function openChapterSelector(book) {
  const modal = document.getElementById("chapterModal");
  const title = document.getElementById("chapterModalTitle");
  const grid = document.getElementById("chapterGrid");

  title.textContent = `📖 ${book.commonName} - Select Chapter`;
  grid.innerHTML = "";

  // Create chapter buttons
  const firstChapter = book.firstChapterNumber || 1;
  for (let i = firstChapter; i < firstChapter + book.numberOfChapters; i++) {
    const btn = document.createElement("button");
    btn.className = "chapter-btn";
    btn.textContent = i;
    btn.setAttribute("aria-label", `Load chapter ${i} of ${book.commonName}`);
    btn.onclick = () => {
      loadChapter(book.id, i);
      closeChapterModal();
    };
    grid.appendChild(btn);
  }

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
}

function closeChapterModal(event) {
  if (event) {
    event.stopPropagation();
  }
  const modal = document.getElementById("chapterModal");
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
}

async function loadChapter(bookId, chapterNumber) {
  selectors.chapterContent.innerHTML = "<p>Downloading chapter…</p>";
  try {
    const res = await fetch(
      `${API_BASE}/${state.translationId}/${bookId}/${chapterNumber}.json`
    );
    const payload = await res.json();
    state.currentBook = payload.book;
    state.currentChapter = payload.chapter.number;
    state.nextChapterLink = payload.nextChapterApiLink;
    state.prevChapterLink = payload.previousChapterApiLink;
    selectors.chapterLabel.textContent = payload.translation.englishName;
    selectors.chapterHeading.textContent = `${payload.book.commonName} ${payload.chapter.number}`;
    renderChapter(payload.chapter);
    renderBooks(selectors.bookSearch.value.trim().toLowerCase());
    updateNavButtons();
    pushHistory(payload);
  } catch (err) {
    console.error(err);
    selectors.chapterContent.innerHTML =
      "<p>Unable to stream chapter. Please retry.</p>";
  }
}

function renderChapter(chapter) {
  const fragment = document.createDocumentFragment();
  chapter.content.forEach((entry) => {
    switch (entry.type) {
      case "heading":
        fragment.append(createHeading(entry.content));
        break;
      case "line_break":
        fragment.append(document.createElement("br"));
        break;
      case "hebrew_subtitle":
        fragment.append(createSubtitle(entry.content));
        break;
      case "verse":
        fragment.append(createVerse(entry));
        break;
      default:
        break;
    }
  });

  const wrapper = document.createElement("div");
  wrapper.append(fragment);

  if (chapter.footnotes?.length) {
    const footWrap = document.createElement("div");
    footWrap.className = "footnotes";
    footWrap.innerHTML = "<strong>Footnotes</strong>";
    chapter.footnotes.forEach((note) => {
      const p = document.createElement("p");
      const caller =
        note.caller && note.caller !== "+" ? note.caller : note.noteId + 1;
      p.textContent = `${caller}) ${note.text}`;
      footWrap.append(p);
    });
    wrapper.append(footWrap);
  }

  selectors.chapterContent.innerHTML = "";
  selectors.chapterContent.append(wrapper);
}

function createHeading(lines) {
  const el = document.createElement("h4");
  el.textContent = lines.join(" ");
  return el;
}

function createSubtitle(content) {
  const el = document.createElement("p");
  el.className = "subtitle";
  el.style.fontStyle = "italic";
  el.style.color = "var(--muted)";
  el.textContent = content.map(toText).join(" ");
  return el;
}

function createVerse(entry) {
  const el = document.createElement("div");
  el.className = "verse";
  el.dataset.verse = entry.number;
  const number = document.createElement("span");
  number.className = "verse-number";
  number.textContent = entry.number;
  el.append(number);

  const textSpan = document.createElement("span");
  textSpan.innerHTML = entry.content.map(renderContentPiece).join("");
  el.append(textSpan);

  const action = document.createElement("button");
  action.type = "button";
  action.textContent = "★";
  action.title = "Save bookmark";
  action.addEventListener("click", () =>
    saveBookmark(entry.number, textSpan.textContent.trim())
  );
  el.append(action);

  return el;
}

function renderContentPiece(piece) {
  if (typeof piece === "string") return escapeHtml(piece);
  if (piece.lineBreak) return "<br />";
  if (piece.heading) return `<strong>${escapeHtml(piece.heading)}</strong>`;
  if (piece.text) {
    const cls = piece.poem ? ` class="poem indent-${piece.poem}"` : "";
    return `<span${cls}>${escapeHtml(piece.text)}</span>`;
  }
  if (piece.noteId || piece.noteId === 0) {
    return `<sup title="See footnote ${piece.noteId + 1}">†</sup>`;
  }
  return "";
}

function updateNavButtons() {
  selectors.prevBtn.disabled = !state.prevChapterLink;
  selectors.nextBtn.disabled = !state.nextChapterLink;
  selectors.prevBtnBottom.disabled = !state.prevChapterLink;
  selectors.nextBtnBottom.disabled = !state.nextChapterLink;
}

function navigateChapter(link) {
  if (!link) return;
  const parts = link.replace("/api/", "").replace(".json", "").split("/");
  const [, book, chapter] = parts;
  loadChapter(book, chapter);
}

function saveBookmark(verseNumber, excerpt) {
  if (!state.currentBook) return;
  const id = `${state.translationId}-${state.currentBook.id}-${state.currentChapter}-${verseNumber}`;
  if (state.bookmarks.some((b) => b.id === id)) return;
  const payload = {
    id,
    translation: state.translationId,
    book: state.currentBook.commonName,
    bookId: state.currentBook.id,
    chapter: state.currentChapter,
    verse: verseNumber,
    excerpt: excerpt.slice(0, 140),
    savedAt: Date.now(),
  };
  state.bookmarks.unshift(payload);
  persist(STORAGE_KEYS.bookmarks, state.bookmarks);
  renderBookmarks();
}

function renderBookmarks() {
  selectors.bookmarkList.innerHTML = state.bookmarks.length
    ? ""
    : '<p style="color: var(--muted);">No verses saved yet.</p>';
  state.bookmarks.forEach((bookmark) => {
    const node = selectors.bookmarkTemplate.content.cloneNode(true);
    node.querySelector(
      '[data-field="title"]'
    ).textContent = `${bookmark.book} ${bookmark.chapter}:${bookmark.verse}`;
    node.querySelector('[data-field="excerpt"]').textContent = bookmark.excerpt;
    node
      .querySelector("button")
      .addEventListener("click", () => removeBookmark(bookmark.id));
    node
      .querySelector(".bookmark-item")
      .addEventListener("click", () =>
        loadChapter(bookmark.bookId, bookmark.chapter)
      );
    selectors.bookmarkList.append(node);
  });
}

function removeBookmark(id) {
  state.bookmarks = state.bookmarks.filter((b) => b.id !== id);
  persist(STORAGE_KEYS.bookmarks, state.bookmarks);
  renderBookmarks();
}

function pushHistory(payload) {
  const record = {
    translation: payload.translation.id,
    book: payload.book.commonName,
    bookId: payload.book.id,
    chapter: payload.chapter.number,
    visitedAt: Date.now(),
  };
  state.history = [record, ...state.history].slice(0, 25);
  persist(STORAGE_KEYS.history, state.history);
  renderHistory();
  updateProgress();
}

function renderHistory() {
  selectors.historyList.innerHTML = state.history.length
    ? ""
    : '<p style="color: var(--muted);">No reading activity yet.</p>';
  state.history.forEach((item) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ghost-btn";
    btn.style.justifyContent = "space-between";
    btn.innerHTML = `<span>${item.book} ${item.chapter}</span><small>${new Date(
      item.visitedAt
    ).toLocaleDateString()}</small>`;
    btn.addEventListener("click", () => loadChapter(item.bookId, item.chapter));
    selectors.historyList.append(btn);
  });
}

function updateProgress() {
  const uniqueChapters = new Set(
    state.history.map((item) => `${item.bookId}-${item.chapter}`)
  );
  const completed = uniqueChapters.size;
  const percent = Math.min((completed / 1189) * 100, 100);
  selectors.progressMeter.style.width = `${percent.toFixed(1)}%`;
  selectors.progressCopy.textContent = `${completed} of 1,189 chapters logged`;
}

function persist(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function persistSettings() {
  const settings = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.settings) || "{}"
  );
  settings.translationId = state.translationId;
  persist(STORAGE_KEYS.settings, settings);
}
