// ============================================
// LXZENK — Main JavaScript (Simplified)
// ============================================

// --------------------------------------------
// CONFIG — Paste your form endpoints here
// --------------------------------------------
const FORMSPRREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
const NEWSLETTER_ENDPOINT = 'https://formspree.io/f/YOUR_NEWSLETTER_ID';

// --------------------------------------------
// Render Work Grid
// --------------------------------------------
function renderWorkGrid(containerId, items, isLarge = false) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = items.map(item => `
        <a href="case-study.html?id=${item.id}" class="work-card">
            <div class="work-image">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
            </div>
            <div class="work-info">
                <h3>${item.title}</h3>
                <p>${item.statement}</p>
                <div class="work-meta">
                    <span class="work-tag language">${item.category}</span>
                    ${item.tags.map(t => `<span class="work-tag">${t}</span>`).join('')}
                </div>
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

    document.title = `${project.title} — LXZENK`;

    container.innerHTML = `
        <div style="margin-bottom: 32px;">
            <div style="display: flex; gap: 8px; margin-bottom: 16px;">
                <span class="badge blue">${project.category}</span>
                <span class="badge">${project.year}</span>
            </div>
            <h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 12px;">${project.title}</h1>
            <p style="color: var(--text-secondary); font-size: 1.1rem;">${project.statement}</p>
            <div class="badges" style="margin-top: 16px;">
                ${project.tags.map(t => `<span class="badge purple">${t}</span>`).join('')}
            </div>
        </div>

        <div style="margin-bottom: 32px;">
            ${project.gallery.map(img => `
                <img src="${img}" alt="${project.title}" style="width: 100%; border-radius: var(--radius); margin-bottom: 16px; border: 1px solid var(--border);">
            `).join('')}
        </div>

        <div style="display: flex; flex-direction: column; gap: 32px;">
            <div>
                <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 12px; color: var(--accent);">Challenge</h3>
                <p style="color: var(--text-secondary); line-height: 1.8;">${project.challenge}</p>
            </div>
            <div>
                <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 12px; color: var(--accent);">Approach</h3>
                <p style="color: var(--text-secondary); line-height: 1.8;">${project.approach}</p>
            </div>
            <div>
                <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 12px; color: var(--accent);">Results</h3>
                <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
                    ${project.results.map(r => `
                        <li style="display: flex; align-items: center; gap: 12px; color: var(--text-secondary);">
                            <span style="color: var(--green);">✓</span> ${r}
                        </li>
                    `).join('')}
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
                <h3>${article.title}</h3>
                <p>${article.excerpt}</p>
                <div class="journal-meta">
                    <span>${formatDate(article.date)}</span>
                    <span>${article.readTime} read</span>
                </div>
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
        <a href="article.html?id=${featured.id}" class="work-card" style="display: grid; grid-template-columns: 1fr 1fr;">
            <div class="work-image" style="aspect-ratio: auto;">
                <img src="${featured.image}" alt="${featured.title}">
            </div>
            <div class="work-info" style="display: flex; flex-direction: column; justify-content: center;">
                <span class="badge blue" style="align-self: flex-start; margin-bottom: 12px;">Featured</span>
                <h3 style="font-size: 1.25rem; color: var(--text); margin-bottom: 8px;">${featured.title}</h3>
                <p style="margin-bottom: 12px;">${featured.excerpt}</p>
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

    document.title = `${article.title} — LXZENK`;

    container.innerHTML = `
        <div style="margin-bottom: 32px;">
            <div style="display: flex; gap: 12px; margin-bottom: 16px; font-size: 0.85rem; color: var(--text-muted);">
                <span class="badge blue">${article.category}</span>
                <span>${formatDate(article.date)}</span>
                <span>${article.readTime} read</span>
            </div>
            <h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 12px; line-height: 1.3;">${article.title}</h1>
            <p style="color: var(--text-secondary); font-size: 1.1rem;">${article.excerpt}</p>
        </div>
        <img src="${article.image}" alt="${article.title}" style="width: 100%; border-radius: var(--radius); margin-bottom: 32px; border: 1px solid var(--border);">
        <div style="color: var(--text-secondary); line-height: 1.9; font-size: 1.05rem;">
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
                    <h3>${a.title}</h3>
                    <p>${a.excerpt}</p>
                </div>
            </a>
        `).join('');
    }
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
    renderFeaturedWork();
    renderAllWork();
    initWorkFilters();
    renderJournal();
    renderFeaturedPost();
    initJournalFilters();
    renderCaseStudy();
    renderArticle();
    initContactForm();
    initNewsletterForm();
});
