import { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/api.js';

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('aerotrack_user');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (!user) return;
    api.get('/auth/me').then((r) => setUser(r.data.user)).catch(() => logout());
    // eslint-disable-next-line
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('aerotrack_token', data.token);
    localStorage.setItem('aerotrack_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('aerotrack_token');
    localStorage.removeItem('aerotrack_user');
    setUser(null);
  };

  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
