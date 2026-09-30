import { useState } from 'react';
import { api } from '../lib/api.js';
import { ErrorNote, OkNote } from '../components/Feedback.jsx';

const EMPTY = { name: '', email: '', subject: '', body: '' };

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [state, setState] = useState({ status: '', message: '' });

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function onSubmit(event) {
    event.preventDefault();
    setState({ status: 'busy', message: '' });
    try {
      const res = await api.sendMessage(form);
      setState({ status: 'ok', message: res.message });
      setForm(EMPTY);
    } catch (err) {
      setState({ status: 'error', message: err.message });
    }
  }

  return (
    <div className="section">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">Get in touch</div>
          <h1 style={{ marginTop: 10 }}>Contact</h1>
          <p>Tell me about the project. Messages land straight in the dashboard inbox.</p>
        </div>

        <div className="grid-2" style={{ alignItems: 'start' }}>
          <div className="card card-pad">
            <h2 style={{ fontSize: '1.3rem', marginBottom: 20 }}>Send a message</h2>

            {state.status === 'ok' && <OkNote>{state.message}</OkNote>}
            {state.status === 'error' && <ErrorNote>{state.message}</ErrorNote>}

            <form onSubmit={onSubmit} noValidate>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="name">Name</label>
                  <input id="name" value={form.name} onChange={update('name')} required autoComplete="name" />
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input id="email" type="email" value={form.email} onChange={update('email')} required autoComplete="email" />
                </div>
              </div>

              <div className="field">
                <label htmlFor="subject">Subject <span style={{ color: 'var(--faint)' }}>(optional)</span></label>
                <input id="subject" value={form.subject} onChange={update('subject')} />
              </div>

              <div className="field">
                <label htmlFor="body">Message</label>
                <textarea id="body" rows={6} value={form.body} onChange={update('body')} required />
              </div>

              <button className="btn btn-primary btn-block" disabled={state.status === 'busy'}>
                {state.status === 'busy' ? 'Sending…' : 'Send message'}
              </button>
            </form>
          </div>

          <div>
            <div className="card card-pad" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: '1.05rem', marginBottom: 14 }}>Direct</h3>
              <p style={{ fontSize: '0.9rem' }}>Email</p>
              <a href="mailto:hello@lxzenk.com">hello@lxzenk.com</a>

              <p style={{ fontSize: '0.9rem', marginTop: 18 }}>Based in</p>
              <span style={{ color: 'var(--muted)' }}>Bangkok, Thailand · GMT+7</span>
            </div>

            <div className="card card-pad">
              <h3 style={{ fontSize: '1.05rem', marginBottom: 10 }}>What happens next</h3>
              <ol style={{ marginLeft: 18, color: 'var(--muted)', fontSize: '0.92rem', display: 'grid', gap: 8 }}>
                <li>You get a reply within one working day.</li>
                <li>We agree on scope, timeline and budget.</li>
                <li>Kickoff, usually within two weeks.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
