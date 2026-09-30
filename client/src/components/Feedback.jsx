export function Spinner({ label = 'Loading…' }) {
  return <div className="empty">{label}</div>;
}

export function ErrorNote({ children }) {
  if (!children) return null;
  return <div className="alert alert-error">{children}</div>;
}

export function OkNote({ children }) {
  if (!children) return null;
  return <div className="alert alert-ok">{children}</div>;
}

export function Empty({ children }) {
  return <div className="empty">{children}</div>;
}
