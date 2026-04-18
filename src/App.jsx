import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ScheduleProvider } from './contexts/ScheduleContext';
import { TodoProvider } from './contexts/TodoContext';
import { CalendarProvider } from './contexts/CalendarContext';
import { SettingsProvider } from './contexts/SettingsContext';
import Sidebar from './components/layout/Sidebar';
import SchedulePage from './pages/SchedulePage';
import TodoPage from './pages/TodoPage';
import CalendarPage from './pages/CalendarPage';
import LoginPage from './pages/LoginPage';
import SettingsModal from './components/common/SettingsModal';
import NotificationManager from './components/common/NotificationManager';
import StatsWidget from './components/common/StatsWidget';
import { Leaf, LogOut, Settings as SettingsIcon } from 'lucide-react';

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

function MainLayout() {
  const { currentUser, logout } = useAuth();
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  
  return (
    <div className="app-container">
      <NotificationManager />
      {/* Mobile Top Header (Hidden on Desktop) */}
      <div className="show-on-mobile" style={{
        display: 'none', // Overridden to flex by .show-on-mobile
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border-light)',
        zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: 'var(--radius-sm)',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Leaf size={14} color="white" />
          </div>
          <span style={{ fontWeight: 700, color: 'var(--color-primary-dark)', fontSize: '1rem' }}>FlowSpace</span>
        </div>
        {currentUser && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {currentUser.photoURL ? (
              <img src={currentUser.photoURL} alt="Profile" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
            ) : (
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                {currentUser.displayName ? currentUser.displayName.charAt(0) : '?'}
              </div>
            )}
            <div style={{ display: 'flex', gap: '4px' }}>
              <button onClick={() => setSettingsOpen(true)} style={{ color: 'var(--color-text-muted)', padding: '6px' }}>
                <SettingsIcon size={16} />
              </button>
              <button onClick={logout} style={{ color: 'var(--color-text-muted)', padding: '6px' }}>
                <LogOut size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Stats Card (Shows only on Mobile) */}
      <div className="show-on-mobile">
        {currentUser && <StatsWidget variant="mobile" />}
      </div>

      <Sidebar />
      <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<SchedulePage />} />
          <Route path="/todo" element={<TodoPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
        </Routes>
      </main>

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Router>
          <ScheduleProvider>
            <TodoProvider>
              <CalendarProvider>
                <Routes>
                  <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                  <Route path="/*" element={<ProtectedRoute><MainLayout /></ProtectedRoute>} />
                </Routes>
              </CalendarProvider>
            </TodoProvider>
          </ScheduleProvider>
        </Router>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
