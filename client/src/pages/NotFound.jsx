import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container notfound">
      <div>
        <div className="notfound-code">404</div>
        <h1 style={{ fontSize: '1.6rem', margin: '18px 0 10px' }}>Page not found</h1>
        <p style={{ marginBottom: 26 }}>That URL does not lead anywhere. Try the work or the journal.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">Back home</Link>
          <Link to="/work" className="btn btn-ghost">View work</Link>
        </div>
      </div>
    </div>
  );
}
