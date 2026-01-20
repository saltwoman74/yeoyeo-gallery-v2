import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import GalleryPage from './pages/GalleryPage';
import AdminPage from './pages/AdminPage';
import { useAuthStore } from './lib/store';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      <GlobalAdminButton />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/gallery/*"
          element={
            <ProtectedRoute>
              <GalleryPage />
            </ProtectedRoute>
          }
        />
        {/* Admin Route */}
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

const GlobalAdminButton = () => {
  // We can use a hook from react-router to check path if we want to hide it on /admin
  // but user asked for "every page".
  // Let's hide it if we are already ON the admin page to avoid redundancy, 
  // or keep it to allow "Re-login"? 
  // Let's keep it simple: A discreet lock icon.

  return (
    <a
      href="/admin"
      className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-black/20 backdrop-blur-md border border-white/10 rounded-full text-white/50 hover:text-gold-500 hover:bg-black/50 hover:border-gold-500/50 transition-all text-[10px] font-bold tracking-widest uppercase group"
    >
      <span className="hidden md:inline">Admin</span>
      <span className="text-[9px] opacity-70 group-hover:opacity-100 group-hover:text-gold-400 font-normal ml-1">관리자</span>
    </a>
  );
};

export default App;
