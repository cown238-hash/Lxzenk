import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { useAsync } from '../../hooks/useAsync.js';
import { Spinner, ErrorNote, Empty, OkNote } from '../../components/Feedback.jsx';

export default function ProjectsAdmin() {
  const { data, error, loading, reload } = useAsync(() => api.listProjects().then((d) => d.projects), []);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState('');

  async function onDelete(project) {
    const confirmed = window.confirm(
      `Delete “${project.title}”? This removes it from the public site and cannot be undone.`
    );
    if (!confirmed) return;

    setBusy(project.slug);
    try {
      await api.deleteProject(project.slug);
      setNotice(`Deleted “${project.title}”.`);
      reload();
    } catch (err) {
      setNotice(err.message);
    } finally {
      setBusy('');
    }
  }

  const projects = data ?? [];

  return (
    <>
      <header className="admin-head">
        <div>
          <h1>Projects</h1>
          <p>{projects.length} total · {projects.filter((p) => p.published).length} live</p>
        </div>
        <Link to="/admin/projects/new" className="btn btn-primary btn-sm">New project</Link>
      </header>

      {notice && <OkNote>{notice}</OkNote>}
      <ErrorNote>{error}</ErrorNote>

      {loading ? (
        <Spinner />
      ) : projects.length === 0 ? (
        <Empty>
          No projects yet. <Link to="/admin/projects/new">Create the first one</Link>.
        </Empty>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Year</th>
                <th>Status</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.slug}>
                  <td>
                    <strong style={{ display: 'block' }}>{p.title}</strong>
                    <span style={{ color: 'var(--faint)', fontSize: '0.8rem' }}>/{p.slug}</span>
                  </td>
                  <td>{p.category}</td>
                  <td>{p.year ?? '—'}</td>
                  <td>
                    <span className={`chip ${p.published ? 'chip-green' : 'chip-amber'}`}>
                      {p.published ? 'Live' : 'Draft'}
                    </span>
                  </td>
                  <td>{p.sort_order}</td>
                  <td>
                    <div className="actions">
                      <Link to={`/admin/projects/${p.slug}`} className="btn btn-ghost btn-sm">Edit</Link>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => onDelete(p)}
                        disabled={busy === p.slug}
                      >
                        {busy === p.slug ? '…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
