// State
let currentBookIndex = 0;
let currentChapterIndex = 0;
let isPlaying = false;
let speechUtterance = null;
let currentSpeed = 1.0;

// DOM Elements
const contentDisplayEl = document.getElementById('content-display');
const chapterTitleDisplayEl = document.getElementById('chapter-title-display');
const prevChapterBtn = document.getElementById('prev-chapter-btn');
const nextChapterBtn = document.getElementById('next-chapter-btn');
const chapterIndicatorEl = document.getElementById('chapter-indicator');

// Sidebar
const sidebarOverlay = document.getElementById('sidebar-overlay');
const sidebar = document.getElementById('sidebar');
const openSidebarBtn = document.getElementById('open-sidebar-btn');
const closeSidebarBtn = document.getElementById('close-sidebar-btn');
const mobileBookListEl = document.getElementById('mobile-book-list');
const bookSearchInput = document.getElementById('book-search');

// Theme
const themeToggleBtn = document.getElementById('theme-toggle');
const iconSun = document.getElementById('icon-sun');
const iconMoon = document.getElementById('icon-moon');

// Audio
const audioContainer = document.getElementById('audio-player-container');
const audioToggleBtn = document.getElementById('audio-toggle-btn');
const iconPlay = document.getElementById('icon-play');
const iconPause = document.getElementById('icon-pause');
const audioStatus = document.getElementById('audio-status');
const audioProgress = document.getElementById('audio-progress');
const speedBtn = document.getElementById('speed-btn');
const audioSpeedDisplay = document.getElementById('audio-speed-display');

// Loading
const loadingOverlay = document.getElementById('loading-overlay');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Check if bibleData is loaded
    if (typeof bibleData === 'undefined') {
        alert('Error: No se pudieron cargar los datos de la Biblia. Por favor recarga la página.');
        if(loadingOverlay) loadingOverlay.innerHTML = '<p class="text-center text-red-500">Error de carga de datos.</p>';
        return;
    }

    // Hide loading screen
    setTimeout(() => {
        if(loadingOverlay) loadingOverlay.classList.add('hidden');
    }, 500);

    // Initialize Theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark');
        updateThemeIcon(true);
    } else {
        document.body.classList.remove('dark');
        updateThemeIcon(false);
    }

    // Initialize Data
    renderBookList();
    
    // Load last position or default (Genesis 1)
    loadChapter(0, 0);

    // Setup Listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Navigation
    prevChapterBtn.addEventListener('click', () => navigateChapter(-1));
    nextChapterBtn.addEventListener('click', () => navigateChapter(1));

    // Sidebar
    openSidebarBtn.addEventListener('click', toggleSidebar);
    closeSidebarBtn.addEventListener('click', toggleSidebar);
    sidebarOverlay.addEventListener('click', toggleSidebar);

    // Book Search
    bookSearchInput.addEventListener('input', (e) => filterBooks(e.target.value));

    // Theme
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeIcon(isDark);
    });

    // Audio
    audioToggleBtn.addEventListener('click', toggleAudio);
    speedBtn.addEventListener('click', cycleSpeed);
}

// Logic functions
function toggleSidebar() {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('open');
}

function updateThemeIcon(isDark) {
    if (isDark) {
        iconMoon.classList.add('hidden');
        iconSun.classList.remove('hidden');
    } else {
        iconMoon.classList.remove('hidden');
        iconSun.classList.add('hidden');
    }
}

function renderBookList() {
    mobileBookListEl.innerHTML = '';
    
    // We can group by Testament if we had that metadata in a flat way easily accessible, 
    // but bibleData is array.
    // bibleData struct: { name, testament, chapters: [] }
    
    let currentTestament = '';

    bibleData.forEach((book, index) => {
        if (book.testament !== currentTestament) {
            currentTestament = book.testament;
            const header = document.createElement('div');
            header.className = 'text-xs font-bold text-muted uppercase tracking-wider px-4 py-2 mt-2 sticky top-0 bg-surface';
            header.style.backgroundColor = 'var(--bg-surface)'; // ensure sticky works visually
            header.textContent = `${currentTestament} Testamento`;
            mobileBookListEl.appendChild(header);
        }

        const item = document.createElement('div');
        item.className = 'book-item flex justify-between items-center';
        item.dataset.index = index;
        item.dataset.name = book.name.toLowerCase();
        
        item.innerHTML = `
            <span class="font-medium text-main">${book.name}</span>
            <span class="text-xs text-muted bg-surface-alt px-2 py-1 rounded-full">${book.chapters.length} cap</span>
        `;
        
        item.onclick = () => {
            loadChapter(index, 0);
            toggleSidebar();
        };
        
        mobileBookListEl.appendChild(item);
    });
}

function filterBooks(query) {
    query = query.toLowerCase();
    const items = mobileBookListEl.querySelectorAll('.book-item');
    items.forEach(item => {
        const name = item.dataset.name;
        if (name.includes(query)) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
}

function loadChapter(bookIndex, chapterIndex) {
    // Bounds check
    if (bookIndex < 0 || bookIndex >= bibleData.length) return;
    const book = bibleData[bookIndex];
    
    if (chapterIndex < 0) chapterIndex = 0;
    if (chapterIndex >= book.chapters.length) chapterIndex = book.chapters.length - 1;

    currentBookIndex = bookIndex;
    currentChapterIndex = chapterIndex;

    // Update State & UI
    chapterTitleDisplayEl.textContent = book.name;
    chapterIndicatorEl.textContent = `Cap ${chapterIndex + 1}`;
    
    // Render Verses
    contentDisplayEl.innerHTML = '';
    const verses = book.chapters[chapterIndex];
    
    if (verses) {
        verses.forEach((text, i) => {
            const p = document.createElement('p');
            p.className = 'verse';
            
            const num = document.createElement('span');
            num.className = 'verse-num';
            num.textContent = i + 1;
            
            p.appendChild(num);
            p.appendChild(document.createTextNode(text));
            contentDisplayEl.appendChild(p);
        });
    }

    // Update Sidebar Active State
    document.querySelectorAll('.book-item').forEach(el => {
        if (parseInt(el.dataset.index) === bookIndex) el.classList.add('active');
        else el.classList.remove('active');
    });

    // Reset Audio if playing a different chapter
    if (isPlaying) stopAudio();
    updateAudioUI();

    // Scroll top
    window.scrollTo(0, 0);
    
    // Update button states
    prevChapterBtn.disabled = (bookIndex === 0 && chapterIndex === 0);
    nextChapterBtn.disabled = (bookIndex === bibleData.length - 1 && chapterIndex === book.chapters.length - 1);
}

function navigateChapter(direction) {
    let newBook = currentBookIndex;
    let newChapter = currentChapterIndex + direction;

    const currentBookData = bibleData[currentBookIndex];

    if (newChapter < 0) {
        // Go to previous book
        if (newBook > 0) {
            newBook--;
            newChapter = bibleData[newBook].chapters.length - 1;
        } else {
            return; // Start of bible
        }
    } else if (newChapter >= currentBookData.chapters.length) {
        // Go to next book
        if (newBook < bibleData.length - 1) {
            newBook++;
            newChapter = 0;
        } else {
            return; // End of bible
        }
    }

    loadChapter(newBook, newChapter);
}

// Audio System
function toggleAudio() {
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
        updateAudioUI();
        return;
    }
    
    // Start fresh
    window.speechSynthesis.cancel();
    
    const book = bibleData[currentBookIndex];
    const verses = book.chapters[currentChapterIndex];
    const text = `${book.name} Capítulo ${currentChapterIndex + 1}. ` + verses.join('. ');
    
    speechUtterance = new SpeechSynthesisUtterance(text);
    speechUtterance.lang = 'es-ES';
    speechUtterance.rate = currentSpeed;
    
    // Progress
    const totalLen = text.length;
    speechUtterance.onboundary = (e) => {
        if (e.name === 'word') {
            const pct = (e.charIndex / totalLen) * 100;
            audioProgress.style.width = `${pct}%`;
        }
    };
    
    speechUtterance.onend = () => {
        isPlaying = false;
        updateAudioUI();
        audioProgress.style.width = '100%';
    };
    
    window.speechSynthesis.speak(speechUtterance);
    isPlaying = true;
    audioContainer.classList.remove('hidden');
    updateAudioUI();
}

function pauseAudio() {
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        isPlaying = false;
        updateAudioUI();
    }
}

function stopAudio() {
    window.speechSynthesis.cancel();
    isPlaying = false;
    speechUtterance = null;
    audioProgress.style.width = '0%';
    updateAudioUI();
}

function updateAudioUI() {
    if (isPlaying) {
        iconPlay.classList.add('hidden');
        iconPause.classList.remove('hidden');
        audioStatus.textContent = 'Reproduciendo...';
        audioStatus.classList.add('text-primary');
    } else {
        iconPlay.classList.remove('hidden');
        iconPause.classList.add('hidden');
        audioStatus.textContent = 'Audio Pausado';
        audioStatus.classList.remove('text-primary');
    }
}

function cycleSpeed() {
    const speeds = [1.0, 1.25, 1.5, 2.0, 0.8];
    let idx = speeds.indexOf(currentSpeed);
    currentSpeed = speeds[(idx + 1) % speeds.length];
    audioSpeedDisplay.textContent = `${currentSpeed}x`;
    
    if (isPlaying) {
        // Restart to apply speed (Chrome quirk)
        const progress = audioProgress.style.width; // rough save
        window.speechSynthesis.cancel();
        playAudio(); 
    }
}
