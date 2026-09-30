import { Link } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { useAsync } from '../../hooks/useAsync.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Spinner, ErrorNote } from '../../components/Feedback.jsx';

const CARDS = [
  { key: 'publishedProjects', label: 'Live projects', totalKey: 'projects', to: '/admin/projects' },
  { key: 'publishedArticles', label: 'Live articles', totalKey: 'articles', to: '/admin/articles' },
  { key: 'unreadMessages', label: 'Unread messages', totalKey: 'messages', to: '/admin/messages' },
  { key: 'subscribers', label: 'Subscribers', totalKey: 'subscribers', to: '/admin/subscribers' },
];

const QUICK = [
  { to: '/admin/projects/new', label: 'New project' },
  { to: '/admin/articles/new', label: 'New article' },
  { to: '/admin/messages', label: 'Open inbox' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { data, error, loading } = useAsync(() => api.stats(), []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <>
      <header className="admin-head">
        <div>
          <h1>{greeting}, {user?.name}</h1>
          <p>Here is what is live and what needs attention.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {QUICK.map((q) => (
            <Link key={q.to} to={q.to} className="btn btn-ghost btn-sm">{q.label}</Link>
          ))}
        </div>
      </header>

      <ErrorNote>{error}</ErrorNote>
      {loading ? <Spinner /> : (
        <>
          <div className="metric-grid">
            {CARDS.map((c) => (
              <Link key={c.key} to={c.to} className="card metric" style={{ display: 'block' }}>
                <div className="metric-value">{data?.[c.key] ?? 0}</div>
                <div className="metric-label">{c.label}</div>
                <div className="metric-note">{data?.[c.totalKey] ?? 0} total</div>
              </Link>
            ))}
          </div>

          <div className="card card-pad">
            <h2 style={{ fontSize: '1.15rem', marginBottom: 12 }}>How this site works</h2>
            <p style={{ fontSize: '0.93rem' }}>
              Content lives in SQLite, not in files. Everything you publish here is served by the
              Express API and rendered by the React client — so the grid, filters and pages update the
              moment you hit save.
            </p>
          </div>
        </>
      )}
    </>
  );
}
