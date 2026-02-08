import { create } from 'zustand';

let toastId = 0;

const useToastStore = create((set) => ({
  toasts: [],
  addToast: (message, type = 'info', duration = 3000) => {
    const id = ++toastId;
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
      }, duration);
    }
    return id;
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

// Convenience helpers
export const toast = {
  success: (msg) => useToastStore.getState().addToast(msg, 'success'),
  error: (msg) => useToastStore.getState().addToast(msg, 'error'),
  info: (msg) => useToastStore.getState().addToast(msg, 'info'),
};

export default useToastStore;
