import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginApi, register as registerApi } from '../api/authService';

const AuthContext = createContext(null);

const STORAGE_KEY = 'token';
const ROLE_KEY = 'role';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY));
  const [role, setRole] = useState(() => localStorage.getItem(ROLE_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (token) localStorage.setItem(STORAGE_KEY, token);
    else localStorage.removeItem(STORAGE_KEY);
  }, [token]);

  useEffect(() => {
    if (role) localStorage.setItem(ROLE_KEY, role);
    else localStorage.removeItem(ROLE_KEY);
  }, [role]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const { data } = await loginApi(credentials);
      const accessToken = data.accessToken || data.AccessToken || data.token || data.Token;
      setToken(accessToken ?? null);
      const isHardcodedAdmin =
        credentials?.email?.trim()?.toLowerCase() === 'admin@admin.admin' &&
        credentials?.password === 'AdminAdmin';
      const resolvedRole =
        data.role || data.Role || data.user?.role || data.User?.Role;
      const finalRole = resolvedRole ?? (isHardcodedAdmin ? 'Admin' : null);
      setRole(finalRole);

      const resolvedUserId =
        data.userId ||
        data.UserId ||
        data.user?.id ||
        data.user?.userId ||
        data.user?.Id ||
        data.User?.Id ||
        null;
      setUserId(resolvedUserId ?? null);

      setUser(data.user || null);
      return { success: true, role: finalRole, userId: resolvedUserId ?? null };
    } catch (error) {
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          error?.response?.data?.Message ||
          'Nuk u krye hyrja.',
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const { data } = await registerApi(formData);
      return { success: data?.success ?? true, data };
    } catch (error) {
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          error?.response?.data?.Message ||
          'Nuk u krye regjistrimi.',
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);
    setUserId(null);
  };

  useEffect(() => {
    if (!token) {
      setUserId(null);
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const id =
        payload.sub ||
        payload.nameid ||
        payload.nameId ||
        payload.uid ||
        payload.userId ||
        payload.UserId ||
        payload.id ||
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
        null;
      setUserId(id);
    } catch {
      setUserId(null);
    }
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      role,
      userId,
      user,
      loading,
      isAuthenticated: Boolean(token),
      isAdmin: role === 'Admin' || role === 'Moderator',
      login,
      register,
      logout,
    }),
    [token, role, userId, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
