import type { PropsWithChildren } from 'react';

export interface AuthContextValue {
  token: string | null;
  role: string | null;
  user: any;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; message?: string; role?: string | null }>;
  register: (formData: FormData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

export const AuthProvider: React.FC<PropsWithChildren>;
export function useAuth(): AuthContextValue;
