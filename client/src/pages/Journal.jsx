import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatDate } from '../lib/api.js';
import { useAsync } from '../hooks/useAsync.js';
import { Spinner, ErrorNote, Empty } from '../components/Feedback.jsx';

const FILTERS = ['all', 'design', 'dev', 'thoughts'];

export default function Journal() {
  const { data, error, loading } = useAsync(() => api.getArticles().then((d) => d.articles), []);
  const [filter, setFilter] = useState('all');
  const [email, setEmail] = useState('');
  const [subState, setSubState] = useState({ status: '', message: '' });

  const articles = data ?? [];
  const featured = articles[0];

  const visible = useMemo(
    () => (filter === 'all' ? articles.slice(1) : articles.filter((a) => a.category === filter)),
    [articles, filter]
  );

  async function onSubscribe(event) {
    event.preventDefault();
    setSubState({ status: 'busy', message: '' });
    try {
      const res = await api.subscribe(email);
      setSubState({ status: 'ok', message: res.message });
      setEmail('');
    } catch (err) {
      setSubState({ status: 'error', message: err.message });
    }
  }

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Writing</div>
            <h1 style={{ marginTop: 10 }}>Journal</h1>
            <p>Notes on design, code and the trade-offs in between.</p>
          </div>

          <ErrorNote>{error}</ErrorNote>
          {loading ? (
            <Spinner />
          ) : articles.length === 0 ? (
            <Empty>No articles published yet.</Empty>
          ) : (
            <>
              {featured && filter === 'all' && (
                <Link to={`/journal/${featured.slug}`} className="card tile" style={{ marginBottom: 44 }}>
                  <div className="tile-media" style={{ aspectRatio: '21 / 9' }}>
                    {featured.image && <img src={featured.image} alt="" />}
                  </div>
                  <div className="tile-body">
                    <div className="chips" style={{ marginBottom: 12 }}>
                      <span className="chip chip-amber">Featured</span>
                      <span className="chip chip-accent">{featured.category}</span>
                    </div>
                    <h3 style={{ fontSize: '1.4rem' }}>{featured.title}</h3>
                    <p>{featured.excerpt}</p>
                    <div className="tile-meta">
                      <span>{formatDate(featured.date)}</span>
                      <span>{featured.read_time} read</span>
                    </div>
                  </div>
                </Link>
              )}

              <div className="filters">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    className="filter"
                    aria-pressed={filter === f}
                    onClick={() => setFilter(f)}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>

              {visible.length === 0 ? (
                <Empty>Nothing in this category yet.</Empty>
              ) : (
                <div className="grid-3">
                  {visible.map((a) => (
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
              )}
            </>
          )}
        </div>
      </div>

      <div className="section section-tight">
        <div className="container narrow">
          <div className="card card-pad" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: 8 }}>Get new posts by email</h2>
            <p style={{ fontSize: '0.92rem', marginBottom: 20 }}>
              One short email when something new is published. Unsubscribe anytime.
            </p>
            {subState.message && (
              <div className={`alert ${subState.status === 'ok' ? 'alert-ok' : 'alert-error'}`}>
                {subState.message}
              </div>
            )}
            <form className="inline-form" onSubmit={onSubscribe}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                aria-label="Email address"
              />
              <button className="btn btn-primary" disabled={subState.status === 'busy'}>
                {subState.status === 'busy' ? 'Subscribing…' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
