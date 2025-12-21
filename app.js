// State
let currentBookIndex = 0;
let currentChapterIndex = 0;

// DOM Elements
const bookListEl = document.getElementById('book-list');
const mobileBookListEl = document.getElementById('mobile-book-list');
const contentDisplayEl = document.getElementById('content-display');
const currentBookNameEl = document.getElementById('current-book-name');
const currentChapterDisplayEl = document.getElementById('current-chapter-display');
const chapterSelectEl = document.getElementById('chapter-select');
const searchInputEl = document.getElementById('search-input');
const searchInputMobileEl = document.getElementById('search-input-mobile');
const searchResultsEl = document.getElementById('search-results');
const searchResultsListEl = document.getElementById('search-results-list');
const closeSearchBtn = document.getElementById('close-search');
const prevChapterBtn = document.getElementById('prev-chapter');
const nextChapterBtn = document.getElementById('next-chapter');
const mobileSearchBtn = document.getElementById('mobile-search-btn');
const mobileSearchBar = document.getElementById('mobile-search-bar');

// Sidebar logic
const openSidebarBtn = document.getElementById('open-sidebar');
const closeSidebarBtn = document.getElementById('close-sidebar');
const mobileSidebar = document.getElementById('mobile-sidebar');
const sidebarBackdrop = document.getElementById('sidebar-backdrop');

function toggleSidebar() {
    mobileSidebar.classList.toggle('-translate-x-full');
    sidebarBackdrop.classList.toggle('hidden');
}

openSidebarBtn.addEventListener('click', toggleSidebar);
closeSidebarBtn.addEventListener('click', toggleSidebar);
sidebarBackdrop.addEventListener('click', toggleSidebar);

// Mobile Search Toggle
mobileSearchBtn.addEventListener('click', () => {
    mobileSearchBar.classList.toggle('hidden');
    if (!mobileSearchBar.classList.contains('hidden')) {
        searchInputMobileEl.focus();
    }
});


// Initialization
function init() {
    renderBookList(bookListEl);
    renderBookList(mobileBookListEl);
    loadChapter(currentBookIndex, currentChapterIndex);
    setupEventListeners();
}

// Render Book List
function renderBookList(container) {
    container.innerHTML = '';
    
    // Group by Testament
    const testaments = {
        'Antiguo': [],
        'Nuevo': []
    };
    
    bibleData.forEach((book, index) => {
        if (testaments[book.testament]) {
            testaments[book.testament].push({ ...book, index });
        }
    });

    for (const [testament, books] of Object.entries(testaments)) {
        if (books.length === 0) continue;

        const testamentHeader = document.createElement('div');
        testamentHeader.className = 'px-4 py-2 bg-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider sticky top-0';
        testamentHeader.textContent = `${testament} Testamento`;
        container.appendChild(testamentHeader);

        books.forEach(book => {
            const bookBtn = document.createElement('button');
            bookBtn.className = 'w-full text-left px-4 py-3 hover:bg-gray-50 text-sm border-b border-gray-100 transition-colors flex justify-between items-center group';
            if (book.index === currentBookIndex) {
                bookBtn.classList.add('active-book');
            }
            
            bookBtn.innerHTML = `
                <span class="font-medium ${book.index === currentBookIndex ? 'text-blue-700' : 'text-gray-700 group-hover:text-blue-600'}">${book.name}</span>
                <span class="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">${book.chapters.length} cap.</span>
            `;
            
            bookBtn.onclick = () => {
                currentBookIndex = book.index;
                currentChapterIndex = 0;
                loadChapter(currentBookIndex, currentChapterIndex);
                // Update active state in both lists
                updateActiveBook();
                // Close mobile sidebar if open
                if (!mobileSidebar.classList.contains('-translate-x-full')) {
                    toggleSidebar();
                }
            };
            bookBtn.dataset.index = book.index; // For easy updating
            container.appendChild(bookBtn);
        });
    }
}

function updateActiveBook() {
    [bookListEl, mobileBookListEl].forEach(container => {
        const buttons = container.querySelectorAll('button');
        buttons.forEach(btn => {
            if (parseInt(btn.dataset.index) === currentBookIndex) {
                btn.classList.add('active-book');
                const span = btn.querySelector('span.font-medium');
                if(span) span.className = 'font-medium text-blue-700';
            } else {
                btn.classList.remove('active-book');
                const span = btn.querySelector('span.font-medium');
                if(span) span.className = 'font-medium text-gray-700 group-hover:text-blue-600';
            }
        });
    });
}

// Load Chapter Content
function loadChapter(bookIndex, chapterIndex) {
    const book = bibleData[bookIndex];
    if (!book) return;
    
    // Ensure chapter index is valid
    if (chapterIndex < 0) chapterIndex = 0;
    if (chapterIndex >= book.chapters.length) chapterIndex = book.chapters.length - 1;
    
    currentBookIndex = bookIndex;
    currentChapterIndex = chapterIndex;
    
    // Update Header
    currentBookNameEl.textContent = book.name;
    currentChapterDisplayEl.textContent = `Capítulo ${currentChapterIndex + 1}`;
    
    // Update Select
    populateChapterSelect(book);
    chapterSelectEl.value = currentChapterIndex;
    
    // Render Verses
    const verses = book.chapters[chapterIndex];
    contentDisplayEl.innerHTML = '';
    
    if (!verses || verses.length === 0) {
        contentDisplayEl.innerHTML = '<div class="text-center text-gray-500 italic py-10">Texto no disponible para este capítulo en la versión demo.</div>';
    } else {
        verses.forEach((text, i) => {
            const verseContainer = document.createElement('div');
            verseContainer.className = 'verse-container mb-3 px-2 py-1 rounded transition-colors cursor-text';
            
            const verseNum = document.createElement('span');
            verseNum.className = 'verse-number';
            verseNum.textContent = i + 1;
            
            const verseText = document.createElement('span');
            verseText.className = 'verse-text text-gray-800';
            verseText.textContent = text;
            
            verseContainer.appendChild(verseNum);
            verseContainer.appendChild(verseText);
            contentDisplayEl.appendChild(verseContainer);
        });
    }
    
    // Update Navigation Buttons
    updateNavButtons();
    
    // Scroll to top
    document.getElementById('reading-area').scrollTop = 0;
}

function populateChapterSelect(book) {
    chapterSelectEl.innerHTML = '';
    book.chapters.forEach((_, i) => {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Capítulo ${i + 1}`;
        chapterSelectEl.appendChild(option);
    });
}

function updateNavButtons() {
    const book = bibleData[currentBookIndex];
    
    // Prev Logic
    if (currentChapterIndex === 0 && currentBookIndex === 0) {
        prevChapterBtn.disabled = true;
    } else {
        prevChapterBtn.disabled = false;
    }
    
    // Next Logic
    if (currentBookIndex === bibleData.length - 1 && currentChapterIndex === book.chapters.length - 1) {
        nextChapterBtn.disabled = true;
    } else {
        nextChapterBtn.disabled = false;
    }
}

// Navigation Events
function setupEventListeners() {
    chapterSelectEl.addEventListener('change', (e) => {
        loadChapter(currentBookIndex, parseInt(e.target.value));
    });
    
    prevChapterBtn.addEventListener('click', () => {
        if (currentChapterIndex > 0) {
            loadChapter(currentBookIndex, currentChapterIndex - 1);
        } else if (currentBookIndex > 0) {
            const prevBook = bibleData[currentBookIndex - 1];
            loadChapter(currentBookIndex - 1, prevBook.chapters.length - 1);
            updateActiveBook();
        }
    });
    
    nextChapterBtn.addEventListener('click', () => {
        const currentBook = bibleData[currentBookIndex];
        if (currentChapterIndex < currentBook.chapters.length - 1) {
            loadChapter(currentBookIndex, currentChapterIndex + 1);
        } else if (currentBookIndex < bibleData.length - 1) {
            loadChapter(currentBookIndex + 1, 0);
            updateActiveBook();
        }
    });

    // Search
    const performSearch = (query) => {
        if (!query || query.trim().length < 2) return;
        query = query.toLowerCase();
        
        searchResultsListEl.innerHTML = '';
        let count = 0;
        
        bibleData.forEach((book, bIndex) => {
            book.chapters.forEach((chapter, cIndex) => {
                chapter.forEach((verse, vIndex) => {
                    if (verse.toLowerCase().includes(query)) {
                        count++;
                        const resultItem = document.createElement('div');
                        resultItem.className = 'p-4 border rounded-lg hover:shadow-md cursor-pointer transition-shadow bg-gray-50 hover:bg-white';
                        resultItem.onclick = () => {
                            loadChapter(bIndex, cIndex);
                            updateActiveBook();
                            searchResultsEl.classList.add('hidden');
                            // Optional: Highlight logic could go here
                        };
                        
                        const ref = document.createElement('div');
                        ref.className = 'text-sm font-bold text-blue-600 mb-1';
                        ref.textContent = `${book.name} ${cIndex + 1}:${vIndex + 1}`;
                        
                        const text = document.createElement('div');
                        text.className = 'text-gray-700 text-sm';
                        // Simple highlight
                        const regex = new RegExp(`(${query})`, 'gi');
                        text.innerHTML = verse.replace(regex, '<mark class="bg-yellow-200 text-gray-900 rounded px-0.5">$1</mark>');
                        
                        resultItem.appendChild(ref);
                        resultItem.appendChild(text);
                        searchResultsListEl.appendChild(resultItem);
                    }
                });
            });
        });
        
        if (count === 0) {
            searchResultsListEl.innerHTML = '<div class="text-center text-gray-500 py-8">No se encontraron resultados.</div>';
        }
        
        searchResultsEl.classList.remove('hidden');
    };

    searchInputEl.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            performSearch(e.target.value);
        }
    });
    
    searchInputMobileEl.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            performSearch(e.target.value);
        }
    });
    
    closeSearchBtn.addEventListener('click', () => {
        searchResultsEl.classList.add('hidden');
    });
}

// Start
init();
