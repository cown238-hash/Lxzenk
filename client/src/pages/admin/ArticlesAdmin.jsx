import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatDate } from '../../lib/api.js';
import { useAsync } from '../../hooks/useAsync.js';
import { Spinner, ErrorNote, Empty, OkNote } from '../../components/Feedback.jsx';

export default function ArticlesAdmin() {
  const { data, error, loading, reload } = useAsync(() => api.listArticles().then((d) => d.articles), []);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState('');

  async function onDelete(article) {
    if (!window.confirm(`Delete “${article.title}”? This cannot be undone.`)) return;
    setBusy(article.slug);
    try {
      await api.deleteArticle(article.slug);
      setNotice(`Deleted “${article.title}”.`);
      reload();
    } catch (err) {
      setNotice(err.message);
    } finally {
      setBusy('');
    }
  }

  const articles = data ?? [];

  return (
    <>
      <header className="admin-head">
        <div>
          <h1>Articles</h1>
          <p>{articles.length} total · {articles.filter((a) => a.published).length} live</p>
        </div>
        <Link to="/admin/articles/new" className="btn btn-primary btn-sm">New article</Link>
      </header>

      {notice && <OkNote>{notice}</OkNote>}
      <ErrorNote>{error}</ErrorNote>

      {loading ? (
        <Spinner />
      ) : articles.length === 0 ? (
        <Empty>
          Nothing written yet. <Link to="/admin/articles/new">Write the first post</Link>.
        </Empty>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.slug}>
                  <td>
                    <strong style={{ display: 'block' }}>{a.title}</strong>
                    <span style={{ color: 'var(--faint)', fontSize: '0.8rem' }}>/{a.slug}</span>
                  </td>
                  <td>{a.category}</td>
                  <td>{formatDate(a.date)}</td>
                  <td>
                    <span className={`chip ${a.published ? 'chip-green' : 'chip-amber'}`}>
                      {a.published ? 'Live' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <Link to={`/admin/articles/${a.slug}`} className="btn btn-ghost btn-sm">Edit</Link>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => onDelete(a)}
                        disabled={busy === a.slug}
                      >
                        {busy === a.slug ? '…' : 'Delete'}
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
