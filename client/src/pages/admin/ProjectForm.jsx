import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, slugify } from '../../lib/api.js';
import { ErrorNote, OkNote } from '../../components/Feedback.jsx';

const BLANK = {
  slug: '',
  title: '',
  category: 'web',
  year: new Date().getFullYear(),
  tags: '',
  image: '',
  statement: '',
  gallery: '',
  challenge: '',
  approach: '',
  results: '',
  published: true,
  sortOrder: 0,
};

const CATEGORIES = ['web', 'branding', 'mobile', 'other'];

/** "React, Node.js" <-> ['React', 'Node.js'] */
const toList = (value) =>
  String(value).split(',').map((s) => s.trim()).filter(Boolean);
const toText = (list) => (list ?? []).join(', ');

export default function ProjectForm() {
  const { slug } = useParams();
  const isEdit = Boolean(slug);
  const navigate = useNavigate();

  const [form, setForm] = useState(BLANK);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    let active = true;
    api
      .getProject(slug)
      .then(({ project: p }) => {
        if (!active) return;
        setForm({
          slug: p.slug,
          title: p.title,
          category: p.category,
          year: p.year ?? '',
          tags: toText(p.tags),
          image: p.image ?? '',
          statement: p.statement ?? '',
          gallery: toText(p.gallery),
          challenge: p.challenge ?? '',
          approach: p.approach ?? '',
          results: toText(p.results),
          published: p.published,
          sortOrder: p.sort_order,
        });
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [slug, isEdit]);

  // Keep the slug in sync with the title until the owner edits it by hand.
  const [slugTouched, setSlugTouched] = useState(false);
  useEffect(() => {
    if (!isEdit && !slugTouched) setForm((f) => ({ ...f, slug: slugify(f.title) }));
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
      const payload = {
        ...form,
        year: form.year === '' ? null : Number(form.year),
        sortOrder: Number(form.sortOrder) || 0,
        tags: toList(form.tags),
        gallery: toList(form.gallery),
        results: toList(form.results),
      };
      const res = isEdit
        ? await api.updateProject(slug, payload)
        : await api.createProject(payload);
      setNotice('Saved.');
      if (!isEdit) navigate(`/admin/projects/${res.project.slug}`, { replace: true });
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
          <h1>{isEdit ? 'Edit project' : 'New project'}</h1>
          <p>{isEdit ? `Editing /${slug}` : 'Add a case study to the public work page.'}</p>
        </div>
        <Link to="/admin/projects" className="btn btn-ghost btn-sm">Back to list</Link>
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
              <div className="field-hint">Lowercase, dashes only.</div>
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
              <label htmlFor="year">Year</label>
              <input id="year" type="number" min="1990" max="2100" value={form.year} onChange={update('year')} />
            </div>
          </div>

          <div className="field">
            <label htmlFor="statement">One-line statement</label>
            <input id="statement" value={form.statement} onChange={update('statement')} maxLength={500} />
            <div className="field-hint">Shown on the card. Keep it under 120 characters.</div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="image">Cover image URL</label>
              <input id="image" type="url" value={form.image} onChange={update('image')} placeholder="https://…" />
            </div>
            <div className="field">
              <label htmlFor="tags">Tags</label>
              <input id="tags" value={form.tags} onChange={update('tags')} placeholder="React, Node.js" />
              <div className="field-hint">Comma separated.</div>
            </div>
          </div>

          <div className="field">
            <label htmlFor="gallery">Gallery image URLs</label>
            <input id="gallery" value={form.gallery} onChange={update('gallery')} placeholder="https://… , https://…" />
            <div className="field-hint">One per line is easier to read; commas work too.</div>
          </div>

          <div className="field">
            <label htmlFor="challenge">Challenge</label>
            <textarea id="challenge" rows={3} value={form.challenge} onChange={update('challenge')} />
          </div>

          <div className="field">
            <label htmlFor="approach">Approach</label>
            <textarea id="approach" rows={3} value={form.approach} onChange={update('approach')} />
          </div>

          <div className="field">
            <label htmlFor="results">Results</label>
            <textarea id="results" rows={3} value={form.results} onChange={update('results')} placeholder="Conversion up 40%, churn down 12%" />
            <div className="field-hint">Comma separated — each becomes a checked item.</div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="sortOrder">Sort order</label>
              <input id="sortOrder" type="number" value={form.sortOrder} onChange={update('sortOrder')} />
              <div className="field-hint">Lower shows first on the work page.</div>
            </div>
            <div className="field">
              <span className="label" style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Visibility</span>
              <label className="checkbox" style={{ marginTop: 10 }}>
                <input type="checkbox" checked={form.published} onChange={update('published')} />
                Published (visible to everyone)
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button className="btn btn-primary" disabled={busy}>
              {busy ? 'Saving…' : isEdit ? 'Save changes' : 'Create project'}
            </button>
            <Link to="/admin/projects" className="btn btn-ghost">Cancel</Link>
          </div>
        </form>
      </div>
    </>
  );
}
