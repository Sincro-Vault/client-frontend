import { create } from 'zustand';

const SESSION_DURATION = 10 * 60; // 10 minutes in seconds

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  sessionTimeLeft: SESSION_DURATION,
  sessionInterval: null,

  login: (userData, token) => {
    // Store token in memory only (not localStorage for security)
    const interval = setInterval(() => {
      const { sessionTimeLeft } = get();
      if (sessionTimeLeft <= 1) {
        get().autoLogout();
      } else {
        set({ sessionTimeLeft: sessionTimeLeft - 1 });
      }
    }, 1000);

    set({
      user: userData,
      token,
      isAuthenticated: true,
      sessionTimeLeft: SESSION_DURATION,
      sessionInterval: interval,
    });
  },

  logout: () => {
    const { sessionInterval } = get();
    if (sessionInterval) clearInterval(sessionInterval);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      sessionTimeLeft: SESSION_DURATION,
      sessionInterval: null,
    });
  },

  autoLogout: () => {
    const { sessionInterval } = get();
    if (sessionInterval) clearInterval(sessionInterval);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      sessionTimeLeft: SESSION_DURATION,
      sessionInterval: null,
    });
  },

  resetTimer: () => {
    set({ sessionTimeLeft: SESSION_DURATION });
  },

  getToken: () => get().token,
}));
