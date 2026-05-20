import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token,    setToken]    = useState(() => localStorage.getItem('wc_token') || null);
  const [username, setUsername] = useState(() => localStorage.getItem('wc_user')  || null);

  const login = (tok, user) => {
    localStorage.setItem('wc_token', tok);
    localStorage.setItem('wc_user', user);
    setToken(tok); setUsername(user);
  };

  const logout = () => {
    localStorage.removeItem('wc_token');
    localStorage.removeItem('wc_user');
    setToken(null); setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ token, username, login, logout, isAuth: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
