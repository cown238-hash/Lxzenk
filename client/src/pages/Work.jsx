import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useAsync } from '../hooks/useAsync.js';
import { Spinner, ErrorNote, Empty } from '../components/Feedback.jsx';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'web', label: 'Web' },
  { value: 'branding', label: 'Branding' },
  { value: 'mobile', label: 'Mobile' },
];

export default function Work() {
  const { data, error, loading } = useAsync(() => api.getProjects().then((d) => d.projects), []);
  const [filter, setFilter] = useState('all');

  const projects = useMemo(() => {
    const list = data ?? [];
    return filter === 'all' ? list : list.filter((p) => p.category === filter);
  }, [data, filter]);

  // Only offer filters that actually have content behind them.
  const available = useMemo(() => {
    const list = data ?? [];
    return FILTERS.filter((f) => f.value === 'all' || list.some((p) => p.category === f.value));
  }, [data]);

  return (
    <div className="section">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">Portfolio</div>
          <h1 style={{ marginTop: 10 }}>Work</h1>
          <p>Case studies, each with the problem, the approach and what actually changed.</p>
        </div>

        <div className="filters">
          {available.map((f) => (
            <button
              key={f.value}
              type="button"
              className="filter"
              aria-pressed={filter === f.value}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <ErrorNote>{error}</ErrorNote>
        {loading ? (
          <Spinner />
        ) : projects.length === 0 ? (
          <Empty>Nothing in this category yet.</Empty>
        ) : (
          <div className="grid-3">
            {projects.map((p) => (
              <Link key={p.slug} to={`/work/${p.slug}`} className="card tile">
                <div className="tile-media">
                  {p.image && <img src={p.image} alt="" loading="lazy" />}
                </div>
                <div className="tile-body">
                  <h3>{p.title}</h3>
                  <p>{p.statement}</p>
                  <div className="chips">
                    <span className="chip chip-accent">{p.category}</span>
                    {p.year && <span className="chip">{p.year}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
