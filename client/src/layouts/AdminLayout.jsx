import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const LINKS = [
  { to: '/admin', label: 'Overview', icon: '◈', end: true },
  { to: '/admin/projects', label: 'Projects', icon: '▤' },
  { to: '/admin/articles', label: 'Articles', icon: '✎' },
  { to: '/admin/messages', label: 'Messages', icon: '✉' },
  { to: '/admin/subscribers', label: 'Subscribers', icon: '◎' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <Link to="/" className="brand" style={{ padding: '0 12px' }}>
          <span className="brand-mark">L</span>
          LXZENK
        </Link>

        <nav className="sidebar-nav">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              <span aria-hidden="true">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-foot">
          <div className="sidebar-user">
            Signed in as
            <strong>{user?.name}</strong>
            {user?.role}
          </div>
          <Link to="/" className="filter" style={{ textAlign: 'center' }}>
            View site
          </Link>
          <button type="button" className="filter" onClick={logout}>
            Sign out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
