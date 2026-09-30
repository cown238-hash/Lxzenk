import { useState } from 'react';
import { api, formatDate } from '../../lib/api.js';
import { useAsync } from '../../hooks/useAsync.js';
import { Spinner, ErrorNote, Empty, OkNote } from '../../components/Feedback.jsx';

export default function Subscribers() {
  const { data, error, loading, reload } = useAsync(() => api.listSubscribers().then((d) => d.subscribers), []);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState('');

  async function onDelete(subscriber) {
    if (!window.confirm(`Remove ${subscriber.email} from the list?`)) return;
    setBusy(subscriber.id);
    try {
      await api.deleteSubscriber(subscriber.id);
      setNotice('Subscriber removed.');
      reload();
    } catch (err) {
      setNotice(err.message);
    } finally {
      setBusy('');
    }
  }

  const subscribers = data ?? [];

  return (
    <>
      <header className="admin-head">
        <div>
          <h1>Subscribers</h1>
          <p>{subscribers.length} people on the journal mailing list</p>
        </div>
      </header>

      {notice && <OkNote>{notice}</OkNote>}
      <ErrorNote>{error}</ErrorNote>

      {loading ? (
        <Spinner />
      ) : subscribers.length === 0 ? (
        <Empty>No subscribers yet. Sign-ups from the journal page appear here.</Empty>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Subscribed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.id}>
                  <td>
                    <a href={`mailto:${s.email}`}>{s.email}</a>
                  </td>
                  <td>{formatDate(s.created_at)}</td>
                  <td>
                    <div className="actions">
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => onDelete(s)}
                        disabled={busy === s.id}
                      >
                        Remove
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
