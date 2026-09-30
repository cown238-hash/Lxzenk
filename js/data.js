// ============================================
// CMS Data — Edit this file to add/update content
// ============================================

const projects = [
    {
        id: 'project-1',
        title: 'E-Commerce Platform',
        category: 'web',
        year: '2026',
        tags: ['React', 'Node.js', 'Stripe'],
        image: 'https://picsum.photos/seed/proj1/800/600',
        statement: 'A modern e-commerce platform that increased conversion by 40%.',
        gallery: [
            'https://picsum.photos/seed/proj1a/1200/800',
            'https://picsum.photos/seed/proj1b/1200/800',
            'https://picsum.photos/seed/proj1c/1200/800'
        ],
        challenge: 'The existing platform had a 2.3% conversion rate with a clunky checkout process. Cart abandonment was at 78%.',
        approach: 'Redesigned the entire checkout flow into a single-page experience. Implemented progressive disclosure and smart defaults.',
        results: [
            'Conversion rate increased from 2.3% to 3.2%',
            'Cart abandonment reduced by 35%',
            'Average order value up 22%'
        ]
    },
    {
        id: 'project-2',
        title: 'Fintech Mobile App',
        category: 'mobile',
        year: '2025',
        tags: ['React Native', 'TypeScript'],
        image: 'https://picsum.photos/seed/proj2/800/600',
        statement: 'Mobile banking app serving 100K+ users with 4.8 star rating.',
        gallery: [
            'https://picsum.photos/seed/proj2a/1200/800',
            'https://picsum.photos/seed/proj2b/1200/800'
        ],
        challenge: 'Legacy banking app with poor UX, low engagement, and frequent crashes on older devices.',
        approach: 'Complete redesign with focus on accessibility and performance. Implemented offline-first architecture.',
        results: [
            'App store rating improved from 3.1 to 4.8',
            'Daily active users increased 150%',
            'Crash rate reduced to under 0.1%'
        ]
    },
    {
        id: 'project-3',
        title: 'Brand Identity — Nova',
        category: 'branding',
        year: '2025',
        tags: ['Logo', 'Guidelines', 'Design System'],
        image: 'https://picsum.photos/seed/proj3/800/600',
        statement: 'Complete brand identity for a tech startup from concept to launch.',
        gallery: [
            'https://picsum.photos/seed/proj3a/1200/800',
            'https://picsum.photos/seed/proj3b/1200/800'
        ],
        challenge: 'New startup needed a brand that communicated innovation and trust in a crowded market.',
        approach: 'Developed brand strategy, visual identity, and comprehensive design guidelines.',
        results: [
            'Successful Series A raise of $5M',
            'Brand recognition increased 60% in target market',
            'Design system adopted across 3 product teams'
        ]
    },
    {
        id: 'project-4',
        title: 'SaaS Dashboard',
        category: 'web',
        year: '2024',
        tags: ['Vue.js', 'D3.js', 'Firebase'],
        image: 'https://picsum.photos/seed/proj4/800/600',
        statement: 'Analytics dashboard processing 1M+ data points in real-time.',
        gallery: [
            'https://picsum.photos/seed/proj4a/1200/800',
            'https://picsum.photos/seed/proj4b/1200/800'
        ],
        challenge: 'Data visualization was slow and confusing. Users couldn\'t find insights in complex datasets.',
        approach: 'Built custom D3.js visualizations with progressive loading and intuitive filtering.',
        results: [
            'Data processing time reduced by 80%',
            'User engagement increased 200%',
            'Featured on Product Hunt — #2 of the day'
        ]
    },
    {
        id: 'project-5',
        title: 'Health & Fitness App',
        category: 'mobile',
        year: '2024',
        tags: ['Flutter', 'HealthKit'],
        image: 'https://picsum.photos/seed/proj5/800/600',
        statement: 'Cross-platform fitness app with 500K downloads in first quarter.',
        gallery: [
            'https://picsum.photos/seed/proj5a/1200/800',
            'https://picsum.photos/seed/proj5b/1200/800'
        ],
        challenge: 'Fragmented health data across devices with no unified view of fitness progress.',
        approach: 'Unified HealthKit and Google Fit data into a single, beautiful interface with AI-powered insights.',
        results: [
            '500K downloads in Q1',
            'Featured in App Store "Apps We Love"',
            'User retention rate of 45% at 30 days'
        ]
    },
    {
        id: 'project-6',
        title: 'Restaurant Chain Rebrand',
        category: 'branding',
        year: '2023',
        tags: ['Identity', 'Packaging', 'Signage'],
        image: 'https://picsum.photos/seed/proj6/800/600',
        statement: 'Rebrand for a 12-location restaurant chain, increasing foot traffic 25%.',
        gallery: [
            'https://picsum.photos/seed/proj6a/1200/800',
            'https://picsum.photos/seed/proj6b/1200/800'
        ],
        challenge: 'Outdated brand image losing relevance with younger demographics.',
        approach: 'Modernized visual identity while retaining heritage elements. Applied across all touchpoints.',
        results: [
            'Foot traffic increased 25%',
            'Social media engagement up 180%',
            'Customer satisfaction score improved 15%'
        ]
    }
];

const articles = [
    {
        id: 'article-1',
        title: 'Designing for Trust: Lessons from Fintech',
        category: 'design',
        date: '2026-01-15',
        readTime: '8 min',
        excerpt: 'How to build interfaces that users instinctively trust with their money.',
        image: 'https://picsum.photos/seed/art1/800/500',
        content: `
            <p>Trust is the currency of fintech. Unlike other domains where users might forgive a confusing interface, financial apps demand immediate confidence. Here's what I've learned designing for this space.</p>
            <h2>Show, Don't Tell</h2>
            <p>Instead of saying "your money is safe," show it. Display security badges prominently, use familiar patterns, and never hide important information behind ambiguous icons.</p>
            <h2>Progressive Disclosure</h2>
            <p>Don't overwhelm users with every detail upfront. Layer information so that the most critical data is immediately visible, with deeper insights available on demand.</p>
            <h2>Consistency Builds Confidence</h2>
            <p>Every interaction should feel predictable. If a swipe works one way in one part of the app, it should work the same way everywhere.</p>
            <h2>Transparency in Actions</h2>
            <p>When something goes wrong, explain why in plain language. Users forgive mistakes; they don't forgive feeling deceived.</p>
        `
    },
    {
        id: 'article-2',
        title: 'The Art of Meaningful Animation',
        category: 'design',
        date: '2025-12-03',
        readTime: '6 min',
        excerpt: 'Animation should serve a purpose, not just decorate. Here\'s how to make every frame count.',
        image: 'https://picsum.photos/seed/art2/800/500',
        content: `
            <p>Animation is powerful when used with intention. It can guide attention, provide feedback, and create emotional connection. But it can also distract and annoy.</p>
            <h2>Function First</h2>
            <p>Every animation should answer: what does this communicate? If the answer is "nothing," remove it.</p>
            <h2>Timing Matters</h2>
            <p>200-500ms is the sweet spot for most UI animations. Fast enough to feel responsive, slow enough to be perceived.</p>
            <h2>Easing Curves</h2>
            <p>Linear motion feels robotic. Use ease-out for elements entering, ease-in for elements leaving, and ease-in-out for elements moving within the viewport.</p>
        `
    },
    {
        id: 'article-3',
        title: 'Building a Design System That Scales',
        category: 'dev',
        date: '2025-11-18',
        readTime: '10 min',
        excerpt: 'Lessons from building design systems used by multiple teams across different products.',
        image: 'https://picsum.photos/seed/art3/800/500',
        content: `
            <p>A design system is not just a component library. It's a shared language that enables teams to build consistent experiences at scale.</p>
            <h2>Start with Tokens</h2>
            <p>Colors, typography, spacing — these atomic decisions cascade through everything. Get them right first.</p>
            <h2>Document Decisions, Not Just Components</h2>
            <p>Why does a button look this way? When should you use a modal vs a drawer? Context is as important as the component itself.</p>
            <h2>Version Everything</h2>
            <p>Breaking changes will happen. Semantic versioning and clear changelogs make them manageable.</p>
        `
    },
    {
        id: 'article-4',
        title: 'Why I Stopped Using Frameworks for Simple Sites',
        category: 'dev',
        date: '2025-10-05',
        readTime: '5 min',
        excerpt: 'Sometimes the best tool is no tool at all. The case for vanilla JS in 2025.',
        image: 'https://picsum.photos/seed/art4/800/500',
        content: `
            <p>After years of React, Vue, and Svelte, I've come full circle. For many projects, vanilla JavaScript is not just sufficient — it's superior.</p>
            <h2>Performance</h2>
            <p>No framework overhead. No virtual DOM diffing. Just the browser doing what it does best.</p>
            <h2>Longevity</h2>
            <p>HTML, CSS, and JS have decades of backward compatibility. Frameworks come and go.</p>
            <h2>When to Use What</h2>
            <p>Complex SPAs? Use a framework. Marketing site, portfolio, or simple web app? Vanilla is perfect.</p>
        `
    },
    {
        id: 'article-5',
        title: 'On Creativity and Constraints',
        category: 'thoughts',
        date: '2025-09-12',
        readTime: '4 min',
        excerpt: 'Constraints don\'t kill creativity — they fuel it. Reflections on working within limits.',
        image: 'https://picsum.photos/seed/art5/800/500',
        content: `
            <p>We often think of constraints as enemies of creativity. Deadlines, budgets, technical limitations — they all seem to restrict our vision.</p>
            <h2>The Paradox</h2>
            <p>In practice, the opposite is true. Unlimited options lead to decision paralysis. Constraints force focus.</p>
            <h2>Embrace the Box</h2>
            <p>Some of my best work came from projects with tight budgets and impossible deadlines. The limitations demanded creative solutions.</p>
        `
    },
    {
        id: 'article-6',
        title: 'The Future of Web Design is AI-Assisted',
        category: 'thoughts',
        date: '2025-08-20',
        readTime: '7 min',
        excerpt: 'AI won\'t replace designers, but designers who use AI will replace those who don\'t.',
        image: 'https://picsum.photos/seed/art6/800/500',
        content: `
            <p>The rise of AI in design tools is not a threat — it's an amplifier. Here's how I'm integrating AI into my workflow.</p>
            <h2>Ideation</h2>
            <p>AI excels at generating variations. Use it to explore directions you wouldn't have considered.</p>
            <h2>Execution</h2>
            <p>Let AI handle the repetitive. Focus your energy on the decisions that matter.</p>
            <h2>The Human Element</h2>
            <p>Taste, empathy, and cultural understanding remain uniquely human. AI is a tool, not a replacement.</p>
        `
    }
];
