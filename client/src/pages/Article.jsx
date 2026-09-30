import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, formatDate } from '../lib/api.js';
import { useAsync } from '../hooks/useAsync.js';
import { Spinner, ErrorNote, Empty } from '../components/Feedback.jsx';

export default function Article() {
  const { slug } = useParams();
  const { data, error, loading } = useAsync(() => api.getArticles().then((d) => d.articles), [slug]);
  const [progress, setProgress] = useState(0);

  // Reading progress bar, driven by how far down the document we are.
  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const index = (data ?? []).findIndex((a) => a.slug === slug);
  const article = index >= 0 ? data[index] : null;

  const related = useMemo(() => {
    if (!article) return [];
    return (data ?? []).filter((a) => a.slug !== article.slug && a.category === article.category).slice(0, 3);
  }, [data, article]);

  if (loading) return <Spinner label="Loading article…" />;
  if (error) return <div className="container section"><ErrorNote>{error}</ErrorNote></div>;
  if (!article) {
    return (
      <div className="container section">
        <Empty>That article does not exist. <Link to="/journal">Back to the journal</Link></Empty>
      </div>
    );
  }

  return (
    <>
      <div className="reading-progress" style={{ width: `${progress}%` }} aria-hidden="true" />

      <article className="section">
        <div className="container narrow">
          <Link to="/journal" className="btn btn-ghost btn-sm">← Journal</Link>

          <header style={{ margin: '28px 0 32px' }}>
            <div className="chips" style={{ marginBottom: 16 }}>
              <span className="chip chip-accent">{article.category}</span>
              <span className="chip">{formatDate(article.date)}</span>
              <span className="chip">{article.read_time} read</span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.9rem, 4.5vw, 2.8rem)', marginBottom: 14 }}>
              {article.title}
            </h1>
            <p className="lede">{article.excerpt}</p>
          </header>

          {article.image && (
            <img
              src={article.image}
              alt=""
              style={{ width: '100%', borderRadius: 16, border: '1px solid var(--border)', marginBottom: 36 }}
            />
          )}

          {/* Trusted editorial HTML stored by the owner via the CMS. */}
          <div className="prose" dangerouslySetInnerHTML={{ __html: article.content || '' }} />

          <div className="card author">
            <span className="avatar" aria-hidden="true">L</span>
            <div>
              <strong>LXZENK</strong>
              <p style={{ fontSize: '0.9rem' }}>Designer and developer. Writes about the parts of the job that do not fit in a case study.</p>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="section section-tight">
          <div className="container">
            <div className="section-head">
              <h2>Related reading</h2>
            </div>
            <div className="grid-3">
              {related.map((a) => (
                <Link key={a.slug} to={`/journal/${a.slug}`} className="card tile">
                  <div className="tile-media">
                    {a.image && <img src={a.image} alt="" loading="lazy" />}
                  </div>
                  <div className="tile-body">
                    <h3>{a.title}</h3>
                    <p>{a.excerpt}</p>
                    <div className="tile-meta">
                      <span>{formatDate(a.date)}</span>
                      <span>{a.read_time} read</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
