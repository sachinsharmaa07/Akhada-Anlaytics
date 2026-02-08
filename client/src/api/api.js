import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // send httpOnly cookies
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('akhada_token');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

/** Flag to prevent concurrent refresh attempts */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(p => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't retried — try refreshing
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${API_BASE}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        if (data.token) {
          localStorage.setItem('akhada_token', data.token);
        }
        processQueue(null, data.token);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('akhada_token');
        if (
          window.location.pathname !== '/login' &&
          window.location.pathname !== '/register'
        ) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Onboarding required
    if (error.response?.status === 403 && error.response?.data?.code === 'ONBOARDING_REQUIRED') {
      if (window.location.pathname !== '/onboarding') {
        window.location.href = '/onboarding';
      }
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('akhada_token');
      if (
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/register'
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth ──
export const register = (data) => api.post('/auth/register', data).then(r => r.data);
export const login = (data) => api.post('/auth/login', data).then(r => r.data);
export const googleAuth = (credential) => api.post('/auth/google', { credential }).then(r => r.data);
export const completeOnboarding = (data) => api.post('/auth/onboarding', data).then(r => r.data);
export const checkUsername = (username) => api.get(`/auth/check-username/${username}`).then(r => r.data);
export const refreshSession = () => api.post('/auth/refresh').then(r => r.data);
export const logout = () => api.post('/auth/logout').then(r => r.data);

// ── User ──
export const getProfile = () => api.get('/user/profile').then(r => r.data);
export const updateProfile = (data) => api.put('/user/profile', data).then(r => r.data);
export const updateGoals = (data) => api.put('/user/goals', data).then(r => r.data);
export const getStats = () => api.get('/user/stats').then(r => r.data);

// ── Workouts ──
export const getWorkouts = (page = 1, limit = 10) => api.get('/workout', { params: { page, limit } }).then(r => r.data);
export const createWorkout = (data) => api.post('/workout', data).then(r => r.data);
export const getWorkout = (id) => api.get(`/workout/${id}`).then(r => r.data);
export const deleteWorkout = (id) => api.delete(`/workout/${id}`).then(r => r.data);
export const getMusclesLast7Days = () => api.get('/workout/muscles/last7days').then(r => r.data);
export const getPersonalRecords = () => api.get('/workout/pr').then(r => r.data);
export const searchExercises = (q) => api.get('/workout/exercises/search', { params: { q } }).then(r => r.data);
export const getLastWeights = (exerciseName) => api.get('/workout/last-weights', { params: { exerciseName } }).then(r => r.data);

// ── Nutrition ──
export const getNutritionToday = () => api.get('/nutrition/today').then(r => r.data);
export const logFood = (data) => api.post('/nutrition/log', data).then(r => r.data);
export const deleteNutritionItem = (mealType, itemIndex) => api.delete(`/nutrition/log/${mealType}/${itemIndex}`).then(r => r.data);
export const getNutritionHistory = (days = 7) => api.get('/nutrition/history', { params: { days } }).then(r => r.data);
export const getVitaminsToday = () => api.get('/nutrition/vitamins/today').then(r => r.data);

// ── Food Search ──
export const searchFood = (q) => api.get('/food/search', { params: { q } }).then(r => r.data);
export const searchIndianFood = (q) => api.get('/food/search/indian', { params: { q } }).then(r => r.data);
export const searchMexicanFood = (q) => api.get('/food/search/mexican', { params: { q } }).then(r => r.data);

export default api;
