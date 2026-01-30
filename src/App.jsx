import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import GalleryPage from './pages/GalleryPage';
import AdminPage from './pages/AdminPage';
import { useAuthStore } from './lib/store';

import RealEstateChatbot from './components/RealEstateChatbot';

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
        <Route path="/preview/chatbot" element={<RealEstateChatbot />} />
        {/* Mobile App View (No Global Buttons) */}
        <Route path="/mobile" element={<div className="h-screen w-full bg-white"><RealEstateChatbot /></div>} />
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
  // Hide buttons on mobile app view
  if (window.location.pathname === '/mobile') return null;

  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
      {/* Home Button */}
      <a
        href="/"
        className="flex items-center gap-2 px-4 py-2 bg-black/20 backdrop-blur-md border border-white/10 rounded-full text-white/50 hover:text-white hover:bg-black/50 hover:border-white/30 transition-all text-[10px] font-bold tracking-widest uppercase group"
      >
        <span>HOME</span>
        <span className="text-[9px] opacity-70 group-hover:opacity-100 font-normal ml-1 hidden md:inline">처음으로</span>
      </a>

      {/* Admin Button */}
      <a
        href="/admin"
        className="flex items-center gap-2 px-4 py-2 bg-black/20 backdrop-blur-md border border-white/10 rounded-full text-white/50 hover:text-gold-500 hover:bg-black/50 hover:border-gold-500/50 transition-all text-[10px] font-bold tracking-widest uppercase group"
      >
        <span className="hidden md:inline">Admin</span>
        <span className="text-[9px] opacity-70 group-hover:opacity-100 group-hover:text-gold-400 font-normal ml-1">관리자</span>
      </a>
    </div>
  );
};

export default App;
