import { useEffect, useState } from 'react';

/**
 * Small reusable data hook: runs `loader` on mount, tracks loading and error
 * state, and exposes a `reload` function.
 */
export function useAsync(loader, deps = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const run = () => {
    let active = true;
    setLoading(true);
    setError('');
    loader()
      .then((result) => {
        if (!active) return;
        setData(result);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'Something went wrong');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  };

  useEffect(run, deps);
  return { data, error, loading, reload: run, setData };
}
