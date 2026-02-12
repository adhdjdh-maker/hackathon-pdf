import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from '../utils/axios'; // Твой настроенный axios

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchUserProfile = useCallback(async (currentToken) => {
    if (!currentToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get('/auth/me');
      setUser(res.data);
    } catch (err) {
      console.error("Auth_Core: Не удалось синхронизировать профиль", err);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile(token);
  }, [token, fetchUserProfile]);

  function login(newToken) {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }

  function updateUserData(newData) {
    setUser(prev => ({ ...prev, ...newData }));
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUserData, loading }}>
      {!loading && children} 
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
