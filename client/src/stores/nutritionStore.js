import { create } from 'zustand';

const useNutritionStore = create((set) => ({
  todayLog: null,
  summary: null,
  goalProgress: null,
  history: [],
  vitamins: null,
  loading: false,
  setTodayLog: (todayLog) => set({ todayLog }),
  setSummary: (summary) => set({ summary }),
  setGoalProgress: (goalProgress) => set({ goalProgress }),
  setHistory: (history) => set({ history }),
  setVitamins: (vitamins) => set({ vitamins }),
  setLoading: (loading) => set({ loading }),
}));

export default useNutritionStore;
