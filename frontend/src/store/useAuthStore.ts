import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  _hasHydrated: boolean;
  setAuth: (token: string, refreshToken: string, user: User, organization: Organization) => void;
  clearAuth: () => void;
  toggleTheme: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      user: null,
      organization: null,
      theme: 'dark', // default premium theme
      _hasHydrated: false,

      setAuth: (token, refreshToken, user, organization) => set({ token, refreshToken, user, organization }),
      clearAuth: () => set({ token: null, refreshToken: null, user: null, organization: null }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setHasHydrated: (state) => set({ _hasHydrated: state })
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);
