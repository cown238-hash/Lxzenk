import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/work', label: 'Work' },
  { to: '/journal', label: 'Journal' },
  { to: '/contact', label: 'Contact' },
];

export default function PublicLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  // Close the mobile menu whenever the route changes.
  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <>
      <nav className="nav">
        <div className="container nav-inner">
          <Link to="/" className="brand">
            <span className="brand-mark">L</span>
            LXZENK
          </Link>

          <button
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-label="Toggle navigation"
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>

          <ul className={`nav-links${open ? ' open' : ''}`}>
            {LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) => (isActive ? 'active' : undefined)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li>
              {user ? (
                <>
                  <NavLink to="/admin">Dashboard</NavLink>
                  <button type="button" className="filter" onClick={logout} style={{ marginLeft: 8 }}>
                    Sign out
                  </button>
                </>
              ) : (
                <NavLink to="/login">Sign in</NavLink>
              )}
            </li>
          </ul>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <Link to="/" className="brand">
              <span className="brand-mark">L</span>
              LXZENK
            </Link>
            <div className="footer-links">
              <Link to="/work">Work</Link>
              <Link to="/journal">Journal</Link>
              <Link to="/contact">Contact</Link>
              {user && <Link to="/admin">Dashboard</Link>}
            </div>
          </div>
          <p className="footer-bottom">© {new Date().getFullYear()} LXZENK — open source, built in public.</p>
        </div>
      </footer>
    </>
  );
}
