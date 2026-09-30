// ============================================
// Main JavaScript — All interactive features
// ============================================

// --------------------------------------------
// CONFIG — Paste your form endpoints here
// --------------------------------------------
const FORMSPRREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
const NEWSLETTER_ENDPOINT = 'https://formspree.io/f/YOUR_NEWSLETTER_ID';

// --------------------------------------------
// Settings State
// --------------------------------------------
const settings = {
    curtain: true,
    smooth: true,
    reveals: true,
    cursor: true,
    magnetic: true
};

// Load settings from localStorage
const savedSettings = localStorage.getItem('portfolioSettings');
if (savedSettings) Object.assign(settings, JSON.parse(savedSettings));

function saveSettings() {
    localStorage.setItem('portfolioSettings', JSON.stringify(settings));
}

// --------------------------------------------
// Page Curtain
// --------------------------------------------
function playCurtain() {
    if (!settings.curtain) return;
    const curtain = document.getElementById('curtain');
    if (!curtain) return;
    curtain.classList.add('active');
    setTimeout(() => curtain.classList.remove('active'), 1200);
}

// --------------------------------------------
// Custom Cursor
// --------------------------------------------
function initCursor() {
    const cursor = document.getElementById('cursor');
    const dot = document.getElementById('cursorDot');
    if (!cursor || !dot) return;

    if (!settings.cursor) {
        cursor.style.display = 'none';
        dot.style.display = 'none';
        return;
    }

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    function animate() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(animate);
    }
    animate();

    // Hover effects
    document.querySelectorAll('a, button, .work-card, .filter-btn').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

// --------------------------------------------
// Magnetic Buttons
// --------------------------------------------
function initMagnetic() {
    if (!settings.magnetic) return;
    document.querySelectorAll('.magnetic').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
        });
    });
}

// --------------------------------------------
// Text Reveals
// --------------------------------------------
function initReveals() {
    if (!settings.reveals) {
        document.querySelectorAll('.reveal').forEach(el => {
            el.classList.add('visible');
        });
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// --------------------------------------------
// Smooth Scroll
// --------------------------------------------
function initSmoothScroll() {
    if (!settings.smooth) return;
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') { e.preventDefault(); return; }
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// --------------------------------------------
// Settings Panel
// --------------------------------------------
function initSettings() {
    const toggle = document.getElementById('settingsToggle');
    const panel = document.getElementById('settingsPanel');
    if (!toggle || !panel) return;

    toggle.addEventListener('click', () => panel.classList.toggle('open'));

    const toggles = ['Curtain', 'Smooth', 'Reveals', 'Cursor', 'Magnetic'];
    toggles.forEach(name => {
        const input = document.getElementById('toggle' + name);
        if (input) {
            input.checked = settings[name.toLowerCase()];
            input.addEventListener('change', () => {
                settings[name.toLowerCase()] = input.checked;
                saveSettings();
                if (name === 'Cursor') initCursor();
                if (name === 'Magnetic') initMagnetic();
            });
        }
    });
}

// --------------------------------------------
// Navbar Scroll Effect
// --------------------------------------------
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// --------------------------------------------
// Mobile Menu
// --------------------------------------------
function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const nav = document.querySelector('.nav-links');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', () => {
        nav.classList.toggle('open');
        toggle.classList.toggle('active');
    });
}

// --------------------------------------------
// Render Work Grid
// --------------------------------------------
function renderWorkGrid(containerId, items, isLarge = false) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = items.map(item => `
        <a href="case-study.html?id=${item.id}" class="work-card ${isLarge ? 'large' : ''}">
            <div class="work-image">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <div class="work-overlay">
                    <span>View Case Study</span>
                </div>
            </div>
            <div class="work-info">
                <div class="work-meta">
                    <span class="work-category">${item.category}</span>
                    <span class="work-year">${item.year}</span>
                </div>
                <h3>${item.title}</h3>
                <p>${item.statement}</p>
            </div>
        </a>
    `).join('');
}

// --------------------------------------------
// Render Featured Work (Home)
// --------------------------------------------
function renderFeaturedWork() {
    const featured = projects.slice(0, 3);
    renderWorkGrid('featuredGrid', featured);
}

// --------------------------------------------
// Render All Work (Work Page)
// --------------------------------------------
function renderAllWork(filter = 'all') {
    const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);
    renderWorkGrid('workGrid', filtered, true);
}

// --------------------------------------------
// Work Filters
// --------------------------------------------
function initWorkFilters() {
    const filterContainer = document.getElementById('filters');
    if (!filterContainer) return;

    filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderAllWork(btn.dataset.filter);
        });
    });
}

// --------------------------------------------
// Render Case Study
// --------------------------------------------
function renderCaseStudy() {
    const container = document.getElementById('caseStudyContent');
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const project = projects.find(p => p.id === id);

    if (!project) {
        container.innerHTML = '<p>Project not found. <a href="work.html">Back to Work</a></p>';
        return;
    }

    document.title = `${project.title} | Portfolio`;

    container.innerHTML = `
        <header class="case-header">
            <div class="case-meta">
                <span class="case-category">${project.category}</span>
                <span class="case-year">${project.year}</span>
            </div>
            <h1>${project.title}</h1>
            <p class="case-statement">${project.statement}</p>
            <div class="case-tags">
                ${project.tags.map(t => `<span class="tag">${t}</span>`).join('')}
            </div>
        </header>

        <div class="case-gallery">
            ${project.gallery.map((img, i) => `
                <div class="case-image ${i === 0 ? 'full' : ''}">
                    <img src="${img}" alt="${project.title} - ${i + 1}" loading="lazy">
                </div>
            `).join('')}
        </div>

        <div class="case-body">
            <div class="case-section">
                <h2>Challenge</h2>
                <p>${project.challenge}</p>
            </div>
            <div class="case-section">
                <h2>Approach</h2>
                <p>${project.approach}</p>
            </div>
            <div class="case-section">
                <h2>Results</h2>
                <ul class="results-list">
                    ${project.results.map(r => `<li>${r}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;

    // Next project
    const currentIndex = projects.findIndex(p => p.id === id);
    const nextProject = projects[(currentIndex + 1) % projects.length];
    const nextLink = document.getElementById('nextProjectLink');
    const nextName = document.getElementById('nextProjectName');
    if (nextLink && nextName) {
        nextLink.href = `case-study.html?id=${nextProject.id}`;
        nextName.textContent = nextProject.title;
    }
}

// --------------------------------------------
// Render Journal
// --------------------------------------------
function renderJournal(filter = 'all') {
    const grid = document.getElementById('journalGrid');
    if (!grid) return;

    const filtered = filter === 'all' ? articles : articles.filter(a => a.category === filter);

    grid.innerHTML = filtered.map(article => `
        <a href="article.html?id=${article.id}" class="journal-card">
            <div class="journal-image">
                <img src="${article.image}" alt="${article.title}" loading="lazy">
            </div>
            <div class="journal-info">
                <div class="journal-meta">
                    <span class="journal-category">${article.category}</span>
                    <span class="journal-date">${formatDate(article.date)}</span>
                </div>
                <h3>${article.title}</h3>
                <p>${article.excerpt}</p>
                <span class="read-time">${article.readTime} read</span>
            </div>
        </a>
    `).join('');
}

// --------------------------------------------
// Render Featured Post
// --------------------------------------------
function renderFeaturedPost() {
    const container = document.getElementById('featuredPost');
    if (!container) return;

    const featured = articles[0];
    container.innerHTML = `
        <a href="article.html?id=${featured.id}" class="featured-post-card">
            <div class="featured-image">
                <img src="${featured.image}" alt="${featured.title}">
            </div>
            <div class="featured-info">
                <span class="featured-label">Featured</span>
                <h3>${featured.title}</h3>
                <p>${featured.excerpt}</p>
                <div class="journal-meta">
                    <span>${formatDate(featured.date)}</span>
                    <span>${featured.readTime} read</span>
                </div>
            </div>
        </a>
    `;
}

// --------------------------------------------
// Journal Filters
// --------------------------------------------
function initJournalFilters() {
    const filterContainer = document.getElementById('journalFilters');
    if (!filterContainer) return;

    filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderJournal(btn.dataset.filter);
        });
    });
}

// --------------------------------------------
// Render Article
// --------------------------------------------
function renderArticle() {
    const container = document.getElementById('articleContent');
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const article = articles.find(a => a.id === id);

    if (!article) {
        container.innerHTML = '<p>Article not found. <a href="journal.html">Back to Journal</a></p>';
        return;
    }

    document.title = `${article.title} | Portfolio`;

    container.innerHTML = `
        <header class="article-header">
            <div class="journal-meta">
                <span class="journal-category">${article.category}</span>
                <span class="journal-date">${formatDate(article.date)}</span>
                <span class="read-time">${article.readTime} read</span>
            </div>
            <h1>${article.title}</h1>
            <p class="article-excerpt">${article.excerpt}</p>
        </header>
        <div class="article-hero-image">
            <img src="${article.image}" alt="${article.title}">
        </div>
        <div class="article-body">
            ${article.content}
        </div>
    `;

    // Related articles
    const related = articles.filter(a => a.id !== id && a.category === article.category);
    const relatedContainer = document.getElementById('relatedGrid');
    if (relatedContainer && related.length > 0) {
        relatedContainer.innerHTML = related.slice(0, 3).map(a => `
            <a href="article.html?id=${a.id}" class="journal-card">
                <div class="journal-image">
                    <img src="${a.image}" alt="${a.title}" loading="lazy">
                </div>
                <div class="journal-info">
                    <div class="journal-meta">
                        <span class="journal-category">${a.category}</span>
                        <span class="journal-date">${formatDate(a.date)}</span>
                    </div>
                    <h3>${a.title}</h3>
                    <p>${a.excerpt}</p>
                </div>
            </a>
        `).join('');
    }
}

// --------------------------------------------
// Reading Progress Bar
// --------------------------------------------
function initReadingProgress() {
    const bar = document.getElementById('readingProgress');
    if (!bar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        bar.style.width = progress + '%';
    });
}

// --------------------------------------------
// Contact Form
// --------------------------------------------
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        btn.textContent = 'Sending...';
        btn.disabled = true;

        const formData = new FormData(form);

        try {
            const res = await fetch(FORMSPRREE_ENDPOINT, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (res.ok) {
                btn.textContent = 'Message Sent!';
                form.reset();
                setTimeout(() => btn.textContent = 'Send Message', 3000);
            } else {
                throw new Error('Failed');
            }
        } catch {
            btn.textContent = 'Error — Try Again';
            setTimeout(() => btn.textContent = 'Send Message', 3000);
        }
    });
}

// --------------------------------------------
// Newsletter Form
// --------------------------------------------
function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const input = form.querySelector('input[type="email"]');
        btn.textContent = 'Subscribing...';
        btn.disabled = true;

        try {
            const res = await fetch(NEWSLETTER_ENDPOINT, {
                method: 'POST',
                body: JSON.stringify({ email: input.value }),
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
            });

            if (res.ok) {
                btn.textContent = 'Subscribed!';
                input.value = '';
                setTimeout(() => btn.textContent = 'Subscribe', 3000);
            } else {
                throw new Error('Failed');
            }
        } catch {
            btn.textContent = 'Error — Try Again';
            setTimeout(() => btn.textContent = 'Subscribe', 3000);
        }
    });
}

// --------------------------------------------
// Lazy Video Loading
// --------------------------------------------
function initLazyVideos() {
    const videos = document.querySelectorAll('video[data-src]');
    if (videos.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                video.src = video.dataset.src;
                video.load();
                observer.unobserve(video);
            }
        });
    }, { rootMargin: '200px' });

    videos.forEach(v => observer.observe(v));

    // Pause off-screen videos
    const pauseObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting && !entry.target.paused) {
                entry.target.pause();
            }
        });
    });

    videos.forEach(v => pauseObserver.observe(v));
}

// --------------------------------------------
// Utility: Format Date
// --------------------------------------------
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// --------------------------------------------
// Initialize Everything
// --------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    playCurtain();
    initCursor();
    initMagnetic();
    initReveals();
    initSmoothScroll();
    initSettings();
    initNavbar();
    initMobileMenu();
    initReadingProgress();
    initContactForm();
    initNewsletterForm();
    initLazyVideos();

    // Page-specific renders
    renderFeaturedWork();
    renderAllWork();
    initWorkFilters();
    renderJournal();
    renderFeaturedPost();
    initJournalFilters();
    renderCaseStudy();
    renderArticle();
});
