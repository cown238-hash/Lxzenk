import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useAsync } from '../hooks/useAsync.js';
import { Spinner, ErrorNote, Empty } from '../components/Feedback.jsx';

export default function CaseStudy() {
  const { slug } = useParams();
  const { data, error, loading } = useAsync(() => api.getProjects().then((d) => d.projects), [slug]);

  const index = (data ?? []).findIndex((p) => p.slug === slug);
  const project = index >= 0 ? data[index] : null;
  const next = (data ?? [])[(index + 1) % (data?.length || 1)];

  if (loading) return <Spinner label="Loading case study…" />;
  if (error) return <div className="container section"><ErrorNote>{error}</ErrorNote></div>;
  if (!project) {
    return (
      <div className="container section">
        <Empty>
          That case study does not exist. <Link to="/work">Back to work</Link>
        </Empty>
      </div>
    );
  }

  return (
    <article className="section">
      <div className="container narrow">
        <Link to="/work" className="btn btn-ghost btn-sm">← All work</Link>

        <header style={{ margin: '28px 0 36px' }}>
          <div className="chips" style={{ marginBottom: 14 }}>
            <span className="chip chip-accent">{project.category}</span>
            {project.year && <span className="chip">{project.year}</span>}
            {project.tags?.map((t) => <span key={t} className="chip">{t}</span>)}
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: 14 }}>{project.title}</h1>
          <p className="lede">{project.statement}</p>
        </header>

        {project.gallery?.length > 0 && (
          <div className="case-gallery">
            {project.gallery.map((src) => (
              <img key={src} src={src} alt="" loading="lazy" />
            ))}
          </div>
        )}

        {project.challenge && (
          <section className="case-block">
            <h2>Challenge</h2>
            <p>{project.challenge}</p>
          </section>
        )}

        {project.approach && (
          <section className="case-block">
            <h2>Approach</h2>
            <p>{project.approach}</p>
          </section>
        )}

        {project.results?.length > 0 && (
          <section className="case-block">
            <h2>Results</h2>
            <ul className="checklist">
              {project.results.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </section>
        )}

        {next && next.slug !== project.slug && (
          <Link to={`/work/${next.slug}`} className="card card-pad" style={{ display: 'block', marginTop: 48 }}>
            <div className="eyebrow">Next project</div>
            <h3 style={{ marginTop: 8, fontSize: '1.3rem' }}>{next.title}</h3>
            <p style={{ fontSize: '0.92rem' }}>{next.statement}</p>
          </Link>
        )}
      </div>
    </article>
  );
}
