import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import TodoApp from './components/todos/TodoApp';
import ProfilePage from './components/profile/ProfilePage';

export default function App() {
  const [profile, setProfile] = useState({
    name: '',
    username: '',
    email: '',
    role: '',
  });

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar username={profile.username} />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/todos" replace />} />
            <Route path="/todos" element={<TodoApp username={profile.username} />} />
            <Route
              path="/profile"
              element={<ProfilePage profile={profile} onSave={setProfile} />}
            />
            <Route path="*" element={<Navigate to="/todos" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
