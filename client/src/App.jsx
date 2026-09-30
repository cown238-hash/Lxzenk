import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

import PublicLayout from './layouts/PublicLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

import Home from './pages/Home.jsx';
import Work from './pages/Work.jsx';
import CaseStudy from './pages/CaseStudy.jsx';
import Journal from './pages/Journal.jsx';
import Article from './pages/Article.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';

import Login from './pages/admin/Login.jsx';
import Register from './pages/admin/Register.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import ProjectsAdmin from './pages/admin/ProjectsAdmin.jsx';
import ProjectForm from './pages/admin/ProjectForm.jsx';
import ArticlesAdmin from './pages/admin/ArticlesAdmin.jsx';
import ArticleForm from './pages/admin/ArticleForm.jsx';
import Messages from './pages/admin/Messages.jsx';
import Subscribers from './pages/admin/Subscribers.jsx';

/** Sends signed-out visitors to /login, keeping the intended destination. */
function RequireAuth({ children }) {
  const { user, status } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return <div className="page-loading">Checking your session…</div>;
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}

/** Signed-in users have no reason to see the login form. */
function GuestOnly({ children }) {
  const { user, status } = useAuth();
  if (status === 'loading') return <div className="page-loading">Checking your session…</div>;
  if (user) return <Navigate to="/admin" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Work />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/journal/:slug" element={<Article />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Auth */}
      <Route
        path="/login"
        element={
          <GuestOnly>
            <Login />
          </GuestOnly>
        }
      />
      <Route
        path="/register"
        element={
          <GuestOnly>
            <Register />
          </GuestOnly>
        }
      />

      {/* CMS */}
      <Route
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/projects" element={<ProjectsAdmin />} />
        <Route path="/admin/projects/new" element={<ProjectForm />} />
        <Route path="/admin/projects/:slug" element={<ProjectForm />} />
        <Route path="/admin/articles" element={<ArticlesAdmin />} />
        <Route path="/admin/articles/new" element={<ArticleForm />} />
        <Route path="/admin/articles/:slug" element={<ArticleForm />} />
        <Route path="/admin/messages" element={<Messages />} />
        <Route path="/admin/subscribers" element={<Subscribers />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
