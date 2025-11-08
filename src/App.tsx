import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import SeniorDashboard from './components/Dashboard/SeniorDashboard';
import JuniorDashboard from './components/Dashboard/JuniorDashboard';
import TaskManager from './components/Tasks/TaskManager';
import FeedbackForm from './components/Feedback/FeedbackForm';
import AttendanceTracker from './components/Attendance/AttendanceTracker';
import AcademicsSection from './components/Academics/AcademicsSection';
import UserAnalyticsDashboard from './components/Analytics/UserAnalyticsDashboard';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

const AppContent: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Login />;
  }

  const isUserSenior = ['EB', 'EC', 'Core'].includes(currentUser.role);

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-900 dark:bg-gray-900 bg-gray-50 transition-colors duration-300">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  {isUserSenior ? <SeniorDashboard /> : <JuniorDashboard />}
                </ProtectedRoute>
              } />
              <Route path="/tasks" element={
                <ProtectedRoute>
                  <TaskManager />
                </ProtectedRoute>
              } />
              <Route path="/academics" element={
                <ProtectedRoute>
                  <AcademicsSection />
                </ProtectedRoute>
              } />
              <Route path="/feedback" element={
                <ProtectedRoute>
                  <FeedbackForm />
                </ProtectedRoute>
              } />
              <Route path="/attendance" element={
                <ProtectedRoute>
                  <AttendanceTracker />
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <UserAnalyticsDashboard />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;