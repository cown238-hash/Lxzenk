import bcrypt from 'bcryptjs';
import { getSetting, query, setSetting } from './db.js';

/**
 * Creates the admin user and a starter set of content the first time the
 * database is created. Safe to call on every boot — it exits early when the
 * users table already has rows.
 */
export function ensureSeed() {
  const count = query.get('SELECT COUNT(*) AS n FROM users').n;
  if (count > 0) return;

  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@lxzenk.com').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!';

  query.run(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    'LXZENK',
    adminEmail,
    bcrypt.hashSync(adminPassword, 12),
    'admin'
  );

  const insertProject = (
    slug,
    title,
    category,
    year,
    tags,
    image,
    statement,
    gallery,
    challenge,
    approach,
    results,
    sortOrder
  ) =>
    query.run(
      `INSERT INTO projects
        (slug, title, category, year, tags, image, statement, gallery, challenge, approach, results, published, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
      slug,
      title,
      category,
      year,
      tags,
      image,
      statement,
      gallery,
      challenge,
      approach,
      results,
      sortOrder
    );
  const insertArticle = (slug, title, category, excerpt, image, content, date, readTime) =>
    query.run(
      `INSERT INTO articles (slug, title, category, excerpt, image, content, date, read_time, published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      slug,
      title,
      category,
      excerpt,
      image,
      content,
      date,
      readTime
    );

  const projects = [
    {
      slug: 'ecommerce-platform',
      title: 'E-Commerce Platform',
      category: 'web',
      year: 2026,
      tags: ['React', 'Node.js', 'Stripe'],
      image: 'https://picsum.photos/seed/proj1/800/600',
      statement: 'A modern storefront that lifted conversion by 40% in one quarter.',
      gallery: [
        'https://picsum.photos/seed/proj1a/1200/800',
        'https://picsum.photos/seed/proj1b/1200/800',
      ],
      challenge: 'Checkout took six steps and 78% of carts were abandoned before payment.',
      approach:
        'Collapsed checkout into a single page with progressive disclosure, smart defaults and saved payment methods.',
      results: [
        'Conversion rate rose from 2.3% to 3.2%',
        'Cart abandonment dropped 35%',
        'Average order value up 22%',
      ],
    },
    {
      slug: 'fintech-mobile-app',
      title: 'Fintech Mobile App',
      category: 'mobile',
      year: 2025,
      tags: ['React Native', 'TypeScript'],
      image: 'https://picsum.photos/seed/proj2/800/600',
      statement: 'Banking app for 100K+ users, rebuilt around speed and accessibility.',
      gallery: ['https://picsum.photos/seed/proj2a/1200/800'],
      challenge: 'Legacy app crashed on older devices and scored 3.1 in both app stores.',
      approach: 'Offline-first architecture with a full accessibility pass and simplified navigation.',
      results: ['Store rating 3.1 → 4.8', 'Daily active users up 150%', 'Crash rate under 0.1%'],
    },
    {
      slug: 'nova-brand-identity',
      title: 'Brand Identity — Nova',
      category: 'branding',
      year: 2025,
      tags: ['Logo', 'Guidelines', 'Design System'],
      image: 'https://picsum.photos/seed/proj3/800/600',
      statement: 'Complete identity for a tech startup, from strategy to launch.',
      gallery: ['https://picsum.photos/seed/proj3a/1200/800'],
      challenge: 'A crowded market and an unclear story: the brand needed to signal trust and novelty.',
      approach: 'Brand strategy, visual identity and a design system adopted by three product teams.',
      results: ['Closed a $5M Series A', 'Brand recognition up 60%', 'System adopted company-wide'],
    },
  ];

  projects.forEach((p, i) => {
    insertProject(
      p.slug,
      p.title,
      p.category,
      p.year,
      JSON.stringify(p.tags),
      p.image,
      p.statement,
      JSON.stringify(p.gallery),
      p.challenge,
      p.approach,
      JSON.stringify(p.results),
      i
    );
  });

  const articles = [
    {
      slug: 'designing-for-trust-fintech',
      title: 'Designing for Trust: Lessons from Fintech',
      category: 'design',
      excerpt: 'How to build interfaces that users instinctively trust with their money.',
      image: 'https://picsum.photos/seed/art1/800/500',
      content: `<p>Trust is the currency of fintech. Unlike other domains where users might forgive a confusing interface, financial apps demand immediate confidence.</p><h2>Show, don't tell</h2><p>Instead of claiming "your money is safe", show it. Display security states plainly and never hide important information behind ambiguous icons.</p><h2>Progressive disclosure</h2><p>Layer information so the most critical data is immediately visible, with deeper detail available on demand.</p><h2>Consistency builds confidence</h2><p>If a swipe works one way in one part of the app it should work the same way everywhere.</p>`,
      date: '2026-01-15',
      read_time: '8 min',
    },
    {
      slug: 'meaningful-animation',
      title: 'The Art of Meaningful Animation',
      category: 'design',
      excerpt: 'Animation should serve a purpose, not just decorate.',
      image: 'https://picsum.photos/seed/art2/800/500',
      content: `<p>Animation is powerful when used with intention. It guides attention, provides feedback and creates connection. Used carelessly it distracts.</p><h2>Function first</h2><p>Every animation should answer one question: what does this communicate? If the answer is "nothing", remove it.</p><h2>Timing matters</h2><p>200–500ms is the sweet spot for most UI motion. Fast enough to feel responsive, slow enough to be perceived.</p>`,
      date: '2025-12-03',
      read_time: '6 min',
    },
    {
      slug: 'design-systems-that-scale',
      title: 'Building a Design System That Scales',
      category: 'dev',
      excerpt: 'Lessons from systems used by multiple teams across different products.',
      image: 'https://picsum.photos/seed/art3/800/500',
      content: `<p>A design system is not just a component library. It is a shared language that lets teams build consistent experiences at scale.</p><h2>Start with tokens</h2><p>Colour, type and spacing cascade through everything. Get the atomic decisions right first.</p><h2>Document decisions, not just components</h2><p>Why does a button look like this? When should you reach for a drawer instead of a modal? Context matters as much as the component.</p>`,
      date: '2025-11-18',
      read_time: '10 min',
    },
    {
      slug: 'why-i-stopped-using-frameworks',
      title: 'Why I Stopped Using Frameworks for Simple Sites',
      category: 'dev',
      excerpt: 'Sometimes the best tool is no tool at all.',
      image: 'https://picsum.photos/seed/art4/800/500',
      content: `<p>After years of React and Vue I came full circle. For many projects vanilla JavaScript is not just sufficient, it is superior.</p><h2>Performance</h2><p>No framework overhead, no virtual DOM diffing — just the browser doing what it does best.</p><h2>Longevity</h2><p>HTML, CSS and JS have decades of backward compatibility. Frameworks come and go.</p>`,
      date: '2025-10-05',
      read_time: '5 min',
    },
  ];

  articles.forEach((a) => {
    insertArticle(a.slug, a.title, a.category, a.excerpt, a.image, a.content, a.date, a.read_time);
  });

  setSetting('site.title', 'LXZENK');
  setSetting('site.tagline', 'Open source portfolio — design and development.');

  console.log(`  Seeded ${projects.length} projects, ${articles.length} articles and the admin account.`);
}

/** Standalone seeding: `npm run seed`. */
if (process.argv[1]?.endsWith('seed.js')) {
  ensureSeed();
  const admin = query.get('SELECT email FROM users ORDER BY id LIMIT 1');
  console.log('Seed complete. Admin:', admin?.email);
  process.exit(0);
}

export { getSetting };
