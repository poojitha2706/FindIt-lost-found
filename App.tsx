
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AddItem from './pages/AddItem';
import ItemDetail from './pages/ItemDetail';
import Templates from './pages/Templates';
import Notifications from './pages/Notifications';
import FinderPage from './pages/FinderPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { db } from './services/mockDatabase';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(db.auth.getCurrentUser());

  useEffect(() => {
    // Check every 100ms for user if initial check fails (waiting for Firebase)
    let attempts = 0;
    const interval = setInterval(() => {
      const u = db.auth.getCurrentUser();
      if (u) {
        setUser(u);
        setLoading(false);
        clearInterval(interval);
      } else if (attempts > 5) {
        setLoading(false);
        clearInterval(interval);
      }
      attempts++;
    }, 200);

    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light">
      <i className="fas fa-spinner fa-spin text-4xl text-brand-blue"></i>
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/found/:itemId" element={<FinderPage />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add-item" 
            element={
              <ProtectedRoute>
                <AddItem />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/item/:id" 
            element={
              <ProtectedRoute>
                <ItemDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/templates/:itemId" 
            element={
              <ProtectedRoute>
                <Templates />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notifications" 
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } 
          />

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
