import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

/**
 * Decodes the mock JWT payload (base64 middle segment).
 * Replace with a real JWT library (e.g. jwt-decode) for production.
 */
function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('at_access_token'));
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem('at_access_token');
    return t ? decodeToken(t) : null;
  });

  const login = useCallback((accessToken) => {
    localStorage.setItem('at_access_token', accessToken);
    const decoded = decodeToken(accessToken);
    setToken(accessToken);
    setUser(decoded);
    return decoded;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('at_access_token');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
