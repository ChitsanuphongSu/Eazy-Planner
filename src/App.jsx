import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ScheduleProvider } from './contexts/ScheduleContext';
import { TodoProvider } from './contexts/TodoContext';
import { CalendarProvider } from './contexts/CalendarContext';
import Sidebar from './components/layout/Sidebar';
import SchedulePage from './pages/SchedulePage';
import TodoPage from './pages/TodoPage';
import CalendarPage from './pages/CalendarPage';
import LoginPage from './pages/LoginPage';

// Protect routes that require login
function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  if (currentUser === undefined) return null; // Or a loading spinner if you want
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
}

// Redirect auth'd users away from login
function PublicRoute({ children }) {
  const { currentUser } = useAuth();
  if (currentUser) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScheduleProvider>
          <TodoProvider>
            <CalendarProvider>
              <Routes>
                <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                <Route path="/*" element={
                  <ProtectedRoute>
                    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
                      <Sidebar />
                      <main style={{ flex: 1, overflow: 'hidden' }}>
                        <Routes>
                          <Route path="/" element={<SchedulePage />} />
                          <Route path="/todo" element={<TodoPage />} />
                          <Route path="/calendar" element={<CalendarPage />} />
                        </Routes>
                      </main>
                    </div>
                  </ProtectedRoute>
                } />
              </Routes>
            </CalendarProvider>
          </TodoProvider>
        </ScheduleProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
