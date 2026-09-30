import { Link } from 'react-router-dom';
import { api, formatDate } from '../lib/api.js';
import { useAsync } from '../hooks/useAsync.js';
import { Spinner, ErrorNote, Empty } from '../components/Feedback.jsx';

const SERVICES = [
  { icon: '◑', title: 'Design', body: 'UI/UX work that balances aesthetics with usability — from first wireframe to a polished, accessible interface.' },
  { icon: '◈', title: 'Development', body: 'Clean, fast, maintainable code. React and Node with sensible architecture and real tests where they earn their keep.' },
  { icon: '◎', title: 'Open Source', body: 'Active contributor to open source. This site is one of them — content lives in SQLite behind an API you can extend.' },
];

const TESTIMONIALS = [
  { quote: 'Attention to detail that runs through the whole product, not just the pretty screens. The numbers moved within a month.', name: 'Sarah Chen', role: 'CEO, TechStart' },
  { quote: 'Rare combination of design taste and engineering rigour. Delivered early, explained everything clearly.', name: 'Mike Johnson', role: 'Product Lead, InnovateCo' },
  { quote: 'Handed over documentation so good our team kept building on it a year later.', name: 'Pat Smith', role: 'Founder, DesignLab' },
];

export default function Home() {
  const projects = useAsync(() => api.getProjects().then((d) => d.projects), []);
  const articles = useAsync(() => api.getArticles().then((d) => d.articles), []);

  const featured = projects.data?.slice(0, 3) ?? [];
  const latest = articles.data?.[0];

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-badge">
            <span className="dot" />
            Open source · Available for work
          </div>

          <h1>
            Building digital products
            <br />
            that <span className="grad">people love</span>
          </h1>

          <p className="lede" style={{ margin: '0 auto 32px' }}>
            Designer and developer working across interface design and full-stack engineering. This
            portfolio runs on its own API — sign in to edit any of it.
          </p>

          <div className="terminal">
            <span className="prompt">$</span> <span className="cmd">npm run dev</span>
          </div>

          <div className="hero-actions">
            <Link to="/work" className="btn btn-primary">View work</Link>
            <Link to="/contact" className="btn btn-ghost">Start a project</Link>
          </div>

          <div className="stats">
            <div>
              <div className="stat-value">{projects.data?.length ?? '—'}</div>
              <div className="stat-label">Projects</div>
            </div>
            <div>
              <div className="stat-value">{(articles.data?.length ?? 0) + 2}</div>
              <div className="stat-label">Articles</div>
            </div>
            <div>
              <div className="stat-value">30+</div>
              <div className="stat-label">Clients</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="section-head">
            <h2>What I do</h2>
            <p>End-to-end product work, from the first sketch to the deploy.</p>
          </div>
          <div className="grid-3">
            {SERVICES.map((s) => (
              <article key={s.title} className="card feature">
                <div className="feature-icon" aria-hidden="true">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head-split">
            <div>
              <div className="eyebrow">Portfolio</div>
              <h2 style={{ marginTop: 8 }}>Featured work</h2>
            </div>
            <Link to="/work" className="btn btn-ghost btn-sm">All projects</Link>
          </div>

          <ErrorNote>{projects.error}</ErrorNote>
          {projects.loading ? <Spinner /> : featured.length === 0 ? (
            <Empty>No projects published yet. Sign in to add the first one.</Empty>
          ) : (
            <div className="grid-3">
              {featured.map((p) => (
                <Link key={p.slug} to={`/work/${p.slug}`} className="card tile">
                  <div className="tile-media">
                    {p.image && <img src={p.image} alt="" loading="lazy" />}
                  </div>
                  <div className="tile-body">
                    <h3>{p.title}</h3>
                    <p>{p.statement}</p>
                    <div className="chips">
                      <span className="chip chip-accent">{p.category}</span>
                      {p.tags?.slice(0, 2).map((t) => <span key={t} className="chip">{t}</span>)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {latest && (
        <section className="section section-tight">
          <div className="container narrow">
            <div className="section-head">
              <div className="eyebrow">Latest</div>
              <h2 style={{ marginTop: 8 }}>From the journal</h2>
            </div>
            <Link to={`/journal/${latest.slug}`} className="card tile">
              <div className="tile-media">
                {latest.image && <img src={latest.image} alt="" loading="lazy" />}
              </div>
              <div className="tile-body">
                <h3>{latest.title}</h3>
                <p>{latest.excerpt}</p>
                <div className="tile-meta">
                  <span>{formatDate(latest.date)}</span>
                  <span>{latest.read_time} read</span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      <section className="section section-tight">
        <div className="container">
          <div className="section-head">
            <h2>What people say</h2>
            <p>Feedback from clients and collaborators.</p>
          </div>
          <div className="grid-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="card testimonial">
                <blockquote>“{t.quote}”</blockquote>
                <figcaption className="testimonial-author">
                  <span className="avatar" aria-hidden="true">{t.name.charAt(0)}</span>
                  <span>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
