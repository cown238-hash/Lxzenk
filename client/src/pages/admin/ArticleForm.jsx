import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, slugify } from '../../lib/api.js';
import { ErrorNote, OkNote } from '../../components/Feedback.jsx';

const BLANK = {
  slug: '',
  title: '',
  category: 'thoughts',
  excerpt: '',
  image: '',
  content: '',
  date: new Date().toISOString().slice(0, 10),
  readTime: '5 min',
  published: true,
};

const CATEGORIES = ['design', 'dev', 'thoughts'];

/** Turns plain text into paragraphs and `## Heading` lines into h2s. */
const textToHtml = (text) =>
  String(text)
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      if (block.startsWith('## ')) return `<h2>${escapeHtml(block.slice(3))}</h2>`;
      return `<p>${escapeHtml(block).replace(/\n/g, '<br>')}</p>`;
    })
    .join('\n');

const escapeHtml = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const htmlToText = (html) =>
  String(html)
    .replace(/<\/(p|h2|h3|blockquote|li)>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

export default function ArticleForm() {
  const { slug } = useParams();
  const isEdit = Boolean(slug);
  const navigate = useNavigate();

  const [form, setForm] = useState(BLANK);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    let active = true;
    api
      .getArticle(slug)
      .then(({ article: a }) => {
        if (!active) return;
        setForm({
          slug: a.slug,
          title: a.title,
          category: a.category,
          excerpt: a.excerpt ?? '',
          image: a.image ?? '',
          content: htmlToText(a.content || ''),
          date: (a.date || '').slice(0, 10),
          readTime: a.read_time ?? '5 min',
          published: a.published,
        });
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [slug, isEdit]);

  useEffect(() => {
    if (!isEdit && !slugTouched) setForm((f) => ({ ...f, slug: slugify(form.title) }));
  }, [form.title, isEdit, slugTouched]);

  const update = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    setNotice('');
  };

  async function onSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const payload = { ...form, content: textToHtml(form.content) };
      const res = isEdit
        ? await api.updateArticle(slug, payload)
        : await api.createArticle(payload);
      setNotice('Saved.');
      if (!isEdit) navigate(`/admin/articles/${res.article.slug}`, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p style={{ color: 'var(--faint)' }}>Loading…</p>;

  return (
    <>
      <header className="admin-head">
        <div>
          <h1>{isEdit ? 'Edit article' : 'New article'}</h1>
          <p>{isEdit ? `Editing /${slug}` : 'Write a post for the journal.'}</p>
        </div>
        <Link to="/admin/articles" className="btn btn-ghost btn-sm">Back to list</Link>
      </header>

      <div className="card card-pad">
        {error && <ErrorNote>{error}</ErrorNote>}
        {notice && <OkNote>{notice}</OkNote>}

        <form onSubmit={onSubmit} noValidate>
          <div className="field-row">
            <div className="field">
              <label htmlFor="title">Title</label>
              <input id="title" value={form.title} onChange={update('title')} required />
            </div>
            <div className="field">
              <label htmlFor="slug">Slug</label>
              <input
                id="slug"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  update('slug')(e);
                }}
                required
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
              />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="category">Category</label>
              <select id="category" value={form.category} onChange={update('category')}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="date">Date</label>
              <input id="date" type="date" value={form.date} onChange={update('date')} required />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="readTime">Read time</label>
              <input id="readTime" value={form.readTime} onChange={update('readTime')} placeholder="8 min" />
            </div>
            <div className="field">
              <label htmlFor="image">Cover image URL</label>
              <input id="image" type="url" value={form.image} onChange={update('image')} placeholder="https://…" />
            </div>
          </div>

          <div className="field">
            <label htmlFor="excerpt">Excerpt</label>
            <textarea id="excerpt" rows={2} value={form.excerpt} onChange={update('excerpt')} maxLength={400} />
            <div className="field-hint">Appears on cards and under the title.</div>
          </div>

          <div className="field">
            <label htmlFor="content">Body</label>
            <textarea id="content" rows={14} value={form.content} onChange={update('content')} required />
            <div className="field-hint">
              Plain text. Leave a blank line between paragraphs and start a line with{' '}
              <code>## </code> for a heading.
            </div>
          </div>

          <div className="field">
            <label className="checkbox">
              <input type="checkbox" checked={form.published} onChange={update('published')} />
              Published (visible to everyone)
            </label>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-primary" disabled={busy}>
              {busy ? 'Saving…' : isEdit ? 'Save changes' : 'Create article'}
            </button>
            <Link to="/admin/articles" className="btn btn-ghost">Cancel</Link>
          </div>
        </form>
      </div>
    </>
  );
}
