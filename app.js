// State
let currentBookIndex = 0;
let currentChapterIndex = 0;
let isPlaying = false;
let speechUtterance = null;
let currentSpeed = 1.0;

// DOM Elements
const contentDisplayEl = document.getElementById('content-display');
const chapterTitleDisplayEl = document.getElementById('chapter-title-display');
const chapterSubtitleEl = document.getElementById('chapter-subtitle');
const chapterSelectEl = document.getElementById('chapter-select');
const prevChapterBtn = document.getElementById('prev-chapter-btn');
const nextChapterBtn = document.getElementById('next-chapter-btn');

// Header & Navigation
const headerBookSelectBtn = document.getElementById('header-book-select');
const currentBookNameBtnText = document.getElementById('current-book-name-btn');
const openSidebarBtn = document.getElementById('open-sidebar-btn');
const closeSidebarBtn = document.getElementById('close-sidebar');
const mobileSidebar = document.getElementById('mobile-sidebar');
const sidebarBackdrop = document.getElementById('sidebar-backdrop');
const mobileBookListEl = document.getElementById('mobile-book-list');

// Search
const searchBtn = document.getElementById('search-btn');
const searchBarContainer = document.getElementById('search-bar-container');
const searchInput = document.getElementById('search-input');
const searchResultsList = document.getElementById('search-results-list');

// Theme
const themeToggleBtn = document.getElementById('theme-toggle');

// Audio
const playPauseBtn = document.getElementById('play-pause-btn');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const playerTitle = document.getElementById('player-title');
const playerStatus = document.getElementById('player-status');
const audioProgress = document.getElementById('audio-progress');
const speedBtn = document.getElementById('speed-btn');
const speedDisplay = document.getElementById('speed-display');

// Font Size
const fontSizeBtn = document.getElementById('font-size-btn');
let currentFontSize = 18; // px

// Initialization
function init() {
    renderBookList();
    
    // Load saved state if any (optional, skip for now)
    loadChapter(currentBookIndex, currentChapterIndex);
    
    setupEventListeners();
    
    // Theme init
    if (localStorage.getItem('theme') === 'light') {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
    }
}

// Sidebar Logic
function toggleSidebar() {
    mobileSidebar.classList.toggle('open');
    sidebarBackdrop.classList.toggle('open');
}

// Render Book List in Sidebar
function renderBookList() {
    mobileBookListEl.innerHTML = '';
    
    const testaments = { 'Antiguo': [], 'Nuevo': [] };
    
    bibleData.forEach((book, index) => {
        if (testaments[book.testament]) {
            testaments[book.testament].push({ ...book, index });
        }
    });

    for (const [testament, books] of Object.entries(testaments)) {
        if (books.length === 0) continue;

        const header = document.createElement('div');
        header.className = 'px-4 py-2 bg-gray-100 dark:bg-surface-dark text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider sticky top-0';
        header.textContent = `${testament} Testamento`;
        mobileBookListEl.appendChild(header);

        books.forEach(book => {
            const item = document.createElement('div');
            item.className = 'book-item';
            if (book.index === currentBookIndex) item.classList.add('active');
            
            item.innerHTML = `
                <span class="font-medium text-sm">${book.name}</span>
                <span class="text-xs text-slate-500 dark:text-gray-400 bg-gray-100 dark:bg-white-10 px-2 py-0.5 rounded-full">${book.chapters.length}</span>
            `;
            
            item.onclick = () => {
                loadChapter(book.index, 0);
                toggleSidebar();
                updateActiveBookInList();
            };
            item.dataset.index = book.index;
            mobileBookListEl.appendChild(item);
        });
    }
}

function updateActiveBookInList() {
    const items = mobileBookListEl.querySelectorAll('.book-item');
    items.forEach(item => {
        if (parseInt(item.dataset.index) === currentBookIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Core: Load Chapter
function loadChapter(bookIndex, chapterIndex) {
    const book = bibleData[bookIndex];
    if (!book) return;

    // Validate
    if (chapterIndex < 0) chapterIndex = 0;
    if (chapterIndex >= book.chapters.length) chapterIndex = book.chapters.length - 1;

    currentBookIndex = bookIndex;
    currentChapterIndex = chapterIndex;

    // Stop audio if playing
    stopAudio();

    // Update UI Texts
    chapterTitleDisplayEl.textContent = book.name;
    chapterSubtitleEl.textContent = `Capítulo ${currentChapterIndex + 1}`;
    currentBookNameBtnText.textContent = `${book.name} ${currentChapterIndex + 1}`;
    playerTitle.textContent = `${book.name} ${currentChapterIndex + 1}`;
    playerStatus.textContent = 'Audio';

    // Populate Select
    populateChapterSelect(book);
    chapterSelectEl.value = currentChapterIndex;

    // Render Text
    const verses = book.chapters[chapterIndex];
    contentDisplayEl.innerHTML = '';
    
    // Scroll to top
    window.scrollTo(0, 0);

    if (!verses || verses.length === 0) {
        contentDisplayEl.innerHTML = '<p class="text-center italic opacity-50">Texto no disponible.</p>';
        return;
    }

    verses.forEach((text, i) => {
        const p = document.createElement('p');
        // Check for "Jesus words" logic if we had metadata, but we don't.
        // Just standard rendering.
        
        // Verse Number
        const vNum = document.createElement('span');
        vNum.className = 'verse-num';
        vNum.textContent = i + 1;
        
        p.appendChild(vNum);
        p.appendChild(document.createTextNode(text));
        contentDisplayEl.appendChild(p);
    });
    
    // Nav Buttons
    updateNavButtons();
}

function populateChapterSelect(book) {
    chapterSelectEl.innerHTML = '';
    book.chapters.forEach((_, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `Cap. ${i + 1}`;
        chapterSelectEl.appendChild(opt);
    });
}

function updateNavButtons() {
    const book = bibleData[currentBookIndex];
    prevChapterBtn.disabled = (currentBookIndex === 0 && currentChapterIndex === 0);
    prevChapterBtn.style.opacity = prevChapterBtn.disabled ? '0.5' : '1';
    
    const isLast = (currentBookIndex === bibleData.length - 1 && currentChapterIndex === book.chapters.length - 1);
    nextChapterBtn.disabled = isLast;
    nextChapterBtn.style.opacity = isLast ? '0.5' : '1';
}

// Audio Logic (TTS)
function togglePlay() {
    if (isPlaying) {
        pauseAudio();
    } else {
        playAudio();
    }
}

function playAudio() {
    if (window.speechSynthesis.paused && speechUtterance) {
        window.speechSynthesis.resume();
        isPlaying = true;
        updatePlayerUI();
        return;
    }

    if (window.speechSynthesis.speaking) {
        // Already speaking something else? Stop it.
        window.speechSynthesis.cancel();
    }

    const book = bibleData[currentBookIndex];
    const verses = book.chapters[currentChapterIndex];
    // Construct text
    const fullText = `${book.name}, Capítulo ${currentChapterIndex + 1}. ` + verses.join('. ');

    speechUtterance = new SpeechSynthesisUtterance(fullText);
    speechUtterance.lang = 'es-ES'; // Spanish
    speechUtterance.rate = currentSpeed;
    
    // Progress estimation
    const totalLength = fullText.length;
    
    speechUtterance.onboundary = (event) => {
        if (event.name === 'word' || event.name === 'sentence') {
            const percentage = (event.charIndex / totalLength) * 100;
            audioProgress.style.width = `${percentage}%`;
        }
    };
    
    speechUtterance.onend = () => {
        stopAudio();
    };
    
    speechUtterance.onerror = (e) => {
        console.error('Speech error:', e);
        stopAudio();
    };

    window.speechSynthesis.speak(speechUtterance);
    isPlaying = true;
    updatePlayerUI();
}

function pauseAudio() {
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        isPlaying = false;
        updatePlayerUI();
    }
}

function stopAudio() {
    window.speechSynthesis.cancel();
    isPlaying = false;
    speechUtterance = null;
    audioProgress.style.width = '0%';
    updatePlayerUI();
}

function updatePlayerUI() {
    if (isPlaying) {
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
        playerStatus.textContent = 'Reproduciendo...';
        playerStatus.className = 'text-xs text-primary font-mono';
    } else {
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
        playerStatus.textContent = 'Pausado / Audio';
        playerStatus.className = 'text-xs text-gray-400 font-mono';
    }
}

// Event Listeners Setup
function setupEventListeners() {
    // Nav
    prevChapterBtn.addEventListener('click', () => {
        if (currentChapterIndex > 0) {
            loadChapter(currentBookIndex, currentChapterIndex - 1);
        } else if (currentBookIndex > 0) {
            const prevBook = bibleData[currentBookIndex - 1];
            loadChapter(currentBookIndex - 1, prevBook.chapters.length - 1);
        }
    });
    
    nextChapterBtn.addEventListener('click', () => {
        const book = bibleData[currentBookIndex];
        if (currentChapterIndex < book.chapters.length - 1) {
            loadChapter(currentBookIndex, currentChapterIndex + 1);
        } else if (currentBookIndex < bibleData.length - 1) {
            loadChapter(currentBookIndex + 1, 0);
        }
    });
    
    // Selects
    chapterSelectEl.addEventListener('change', (e) => {
        loadChapter(currentBookIndex, parseInt(e.target.value));
    });
    
    // Sidebar
    openSidebarBtn.addEventListener('click', toggleSidebar);
    headerBookSelectBtn.addEventListener('click', toggleSidebar);
    closeSidebarBtn.addEventListener('click', toggleSidebar);
    sidebarBackdrop.addEventListener('click', toggleSidebar);
    
    // Search
    searchBtn.addEventListener('click', () => {
        searchBarContainer.classList.toggle('hidden');
        if (!searchBarContainer.classList.contains('hidden')) {
            searchInput.focus();
        }
    });
    
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') performSearch(e.target.value);
    });
    
    // Theme
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        document.documentElement.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
    
    // Font Size
    fontSizeBtn.addEventListener('click', () => {
        currentFontSize += 2;
        if (currentFontSize > 24) currentFontSize = 14;
        contentDisplayEl.style.fontSize = `${currentFontSize}px`;
    });
    
    // Audio
    playPauseBtn.addEventListener('click', togglePlay);
    
    speedBtn.addEventListener('click', () => {
        const speeds = [1.0, 1.25, 1.5, 2.0, 0.75];
        let idx = speeds.indexOf(currentSpeed);
        idx = (idx + 1) % speeds.length;
        currentSpeed = speeds[idx];
        speedDisplay.textContent = `${currentSpeed}x`;
        
        // If playing, restart with new speed
        if (isPlaying) {
            window.speechSynthesis.cancel();
            playAudio();
        }
    });
}

function performSearch(query) {
    if (!query || query.length < 2) return;
    query = query.toLowerCase();
    
    searchResultsList.innerHTML = '';
    searchResultsList.classList.remove('hidden');
    
    let count = 0;
    const maxResults = 50;
    
    for (let b = 0; b < bibleData.length; b++) {
        const book = bibleData[b];
        for (let c = 0; c < book.chapters.length; c++) {
            const chapter = book.chapters[c];
            for (let v = 0; v < chapter.length; v++) {
                const verse = chapter[v];
                if (verse.toLowerCase().includes(query)) {
                    count++;
                    if (count > maxResults) break;
                    
                    const div = document.createElement('div');
                    div.className = 'p-3 border-b border-gray-200 dark:border-white-10 cursor-pointer hover-bg-gray-200 dark:hover-bg-white-10 text-sm';
                    div.innerHTML = `
                        <div class="font-bold text-primary">${book.name} ${c+1}:${v+1}</div>
                        <div class="text-slate-600 dark:text-gray-400 truncate">${verse}</div>
                    `;
                    div.onclick = () => {
                        loadChapter(b, c);
                        searchBarContainer.classList.add('hidden');
                        searchResultsList.classList.add('hidden');
                    };
                    searchResultsList.appendChild(div);
                }
            }
            if (count > maxResults) break;
        }
        if (count > maxResults) break;
    }
    
    if (count === 0) {
        searchResultsList.innerHTML = '<div class="p-4 text-center text-slate-500">Sin resultados.</div>';
    }
}

// Init
init();
