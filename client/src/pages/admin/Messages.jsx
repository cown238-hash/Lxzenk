import { useState } from 'react';
import { api, formatDate } from '../../lib/api.js';
import { useAsync } from '../../hooks/useAsync.js';
import { Spinner, ErrorNote, Empty, OkNote } from '../../components/Feedback.jsx';

export default function Messages() {
  const { data, error, loading, reload } = useAsync(() => api.listMessages().then((d) => d.messages), []);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState('');

  async function toggleRead(message) {
    setBusy(message.id);
    try {
      await api.setMessageRead(message.id, !message.read);
      reload();
    } catch (err) {
      setNotice(err.message);
    } finally {
      setBusy('');
    }
  }

  async function onDelete(message) {
    if (!window.confirm(`Delete the message from ${message.name}?`)) return;
    setBusy(message.id);
    try {
      await api.deleteMessage(message.id);
      setNotice('Message deleted.');
      reload();
    } catch (err) {
      setNotice(err.message);
    } finally {
      setBusy('');
    }
  }

  const messages = data ?? [];

  return (
    <>
      <header className="admin-head">
        <div>
          <h1>Inbox</h1>
          <p>
            {messages.length} total · {messages.filter((m) => !m.read).length} unread
          </p>
        </div>
      </header>

      {notice && <OkNote>{notice}</OkNote>}
      <ErrorNote>{error}</ErrorNote>

      {loading ? (
        <Spinner />
      ) : messages.length === 0 ? (
        <Empty>No messages yet. Submissions from the contact form land here.</Empty>
      ) : (
        <div style={{ display: 'grid', gap: 14 }}>
          {messages.map((m) => (
            <article
              key={m.id}
              className="card card-pad"
              style={{ borderLeft: `3px solid ${m.read ? 'var(--border)' : 'var(--accent)'}` }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', marginBottom: 4 }}>
                    {m.subject || 'No subject'}{' '}
                    {!m.read && <span className="chip chip-accent">New</span>}
                  </h3>
                  <p style={{ fontSize: '0.85rem' }}>
                    <strong style={{ color: 'var(--text)' }}>{m.name}</strong> ·{' '}
                    <a href={`mailto:${m.email}`}>{m.email}</a> · {formatDate(m.created_at)}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => toggleRead(m)}
                    disabled={busy === m.id}
                  >
                    Mark {m.read ? 'unread' : 'read'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(m)}
                    disabled={busy === m.id}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p style={{ marginTop: 14, whiteSpace: 'pre-wrap', fontSize: '0.93rem' }}>{m.body}</p>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
