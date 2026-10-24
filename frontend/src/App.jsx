import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import LoginPage from './components/auth/LoginPage';
import Navbar from './components/Navbar';
import TodoApp from './components/todos/TodoApp';
import ProfilePage from './components/profile/ProfilePage';
import AdminDashboard from './components/admin/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-layout">
          <Navbar />

          <main className="main-content">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/todos"
                element={
                  <ProtectedRoute>
                    <TodoApp />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route path="/" element={<Navigate to="/todos" replace />} />
              <Route path="*" element={<Navigate to="/todos" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
