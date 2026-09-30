import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // 'loading' until the initial /auth/me check settles, so ProtectedRoute
  // does not bounce a signed-in user to the login page on refresh.
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const controller = new AbortController();
    api
      .me(controller.signal)
      .then((data) => {
        setUser(data.user);
        setStatus('ready');
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setUser(null);
        setStatus('ready');
      });
    return () => controller.abort();
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await api.login(credentials);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await api.register(payload);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    await api.logout().catch(() => {});
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, status, login, register, logout, isAdmin: user?.role === 'admin' }),
    [user, status, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
