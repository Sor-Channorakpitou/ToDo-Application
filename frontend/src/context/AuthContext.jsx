import { useState, useEffect } from 'react';
import {
  loginApi,
  signupApi,
  logoutApi,
  getMeApi,
  refreshApi,
} from '../api/auth';
import { tokenStorage } from '../api/client';
import { AuthContext } from './useAuth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function initAuth() {
      try {
        const token = tokenStorage.get();
        if (token) {
          const userData = await getMeApi();
          if (active) setUser(userData);
        } else {
          const refreshedToken = await refreshApi();
          if (refreshedToken) {
            const userData = await getMeApi();
            if (active) setUser(userData);
          }
        }
      } catch {
        tokenStorage.clear();
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    initAuth();

    return () => {
      active = false;
    };
  }, []);

  const login = async (email, password) => {
    const { user: userData } = await loginApi({ email, password });
    setUser(userData);
    return userData;
  };

  const signup = async (email, password) => {
    const result = await signupApi({ email, password });
    const { user: userData } = await loginApi({ email, password });
    setUser(userData);
    return result;
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const userData = await getMeApi();
      setUser(userData);
      return userData;
    } catch {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    signup,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
