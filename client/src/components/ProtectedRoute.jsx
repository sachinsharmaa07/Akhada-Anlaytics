import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { getProfile } from '../api/api';

const ProtectedRoute = ({ children, requireOnboarded = true }) => {
  const { user, token, loading, setUser, setLoading, setToken } = useAuthStore();

  useEffect(() => {
    const fetchUser = async () => {
      if (token && !user) {
        try {
          const data = await getProfile();
          setUser({ ...data, id: data._id });
        } catch {
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token, user, setUser, setLoading, setToken]);

  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!user || !token) return <Navigate to="/login" />;

  // Redirect users who haven't completed onboarding
  if (requireOnboarded && user.onboardingStatus === 'INCOMPLETE') {
    return <Navigate to="/onboarding" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
