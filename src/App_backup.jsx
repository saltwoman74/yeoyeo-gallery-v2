import React, { useState, useEffect } from 'react';
import RealEstateChatbot from './components/RealEstateChatbot';
import AdminDashboard from './components/AdminDashboard';
import ImageComparisonApp from './components/ImageComparisonApp';
import { Settings } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('idle'); // 'idle', 'admin', 'gallery'

  useEffect(() => {
    // Expose function to window to allow index.html to switch views
    window.showImageGallery = () => {
      const layout = document.getElementById('mainLayout');
      if (layout) layout.style.display = 'none';
      setCurrentView('gallery');
    };
    window.showChatbot = () => {
      const layout = document.getElementById('mainLayout');
      if (layout) layout.style.display = 'flex';
      setCurrentView('idle');
    };
    window.showAdmin = () => {
      const layout = document.getElementById('mainLayout');
      if (layout) layout.style.display = 'none';
      setCurrentView('admin');
    };
  }, []);

  if (currentView === 'gallery') {
    return <ImageComparisonApp onBack={() => window.showChatbot()} onAdmin={() => setCurrentView('admin')} />;
  }


  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <AdminDashboard onLogout={() => window.showChatbot()} />
        </div>
      </div>
    );
  }

  // Default state: render nothing, original HTML chatbot is visible
  return null;
}


export default App;

