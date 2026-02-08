import { create } from 'zustand';

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('akhada_token'),
  loading: true,

  setUser: (user) => set({ user }),

  setToken: (token) => {
    if (token) localStorage.setItem('akhada_token', token);
    else localStorage.removeItem('akhada_token');
    set({ token });
  },

  setLoading: (loading) => set({ loading }),

  /** Whether the user has completed onboarding */
  isOnboarded: () => {
    const user = get().user;
    return user?.onboardingStatus === 'COMPLETE';
  },

  /** Whether the user is authenticated at all */
  isAuthenticated: () => {
    const { user, token } = get();
    return !!(user && token);
  },

  logout: () => {
    localStorage.removeItem('akhada_token');
    set({ user: null, token: null });
  },
}));

export default useAuthStore;
