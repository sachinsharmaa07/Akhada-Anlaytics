import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Onboarding from './pages/Onboarding.jsx';
import Nutrition from './pages/Nutrition.jsx';
import Workout from './pages/Workout.jsx';
import WorkoutLog from './pages/WorkoutLog.jsx';
import Analytics from './pages/Analytics.jsx';
import Profile from './pages/Profile.jsx';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ToastContainer from './components/Toast.jsx';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <div className="app-wrapper">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/onboarding" element={
            <ProtectedRoute requireOnboarded={false}>
              <Onboarding />
            </ProtectedRoute>
          } />
          <Route path="/*" element={
            <ProtectedRoute>
              <div className="app-layout">
                <div className="app-content">
                  <main className="main-content">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/nutrition" element={<Nutrition />} />
                      <Route path="/workout" element={<Workout />} />
                      <Route path="/workout/log" element={<WorkoutLog />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/profile" element={<Profile />} />
                    </Routes>
                  </main>
                  <Navbar />
                </div>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
