import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  fullName: string;
}

interface Organization {
  id: string;
  name: string;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  organization: Organization | null;
  theme: 'light' | 'dark';
  setAuth: (token: string, refreshToken: string, user: User, organization: Organization) => void;
  clearAuth: () => void;
  toggleTheme: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  refreshToken: null,
  user: null,
  organization: null,
  theme: 'dark', // default premium theme

  setAuth: (token, refreshToken, user, organization) => set({ token, refreshToken, user, organization }),
  clearAuth: () => set({ token: null, refreshToken: null, user: null, organization: null }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' }))
}));
