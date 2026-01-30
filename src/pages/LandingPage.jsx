import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../lib/store';
import { Lock, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (login(password)) {
      navigate('/gallery');
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-navy-950">
      {/* Premium Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,_rgba(197,160,89,0.1),_rgba(2,6,23,0)_50%)]" />
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Animated Particles (CSS implementation for performance) */}
      <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="z-10 text-center space-y-10 p-6 max-w-lg w-full"
      >
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="flex justify-center mb-4">
              <div className="w-12 h-1 bg-gold-500 rounded-full" />
            </div>
            <h2 className="text-gold-400 tracking-[0.5em] text-xs font-bold uppercase mb-4">Changwon UniCity</h2>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
              <span className="text-gold-500 font-sans">여여부동산</span>
              <span className="block text-xl md:text-2xl mt-4 font-light text-gray-300 tracking-[0.2em]">PREMIUM GALLERY</span>
            </h1>
          </motion.div>
        </div>

        {/* Login Form */}
        <motion.form
          onSubmit={handleLogin}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="relative max-w-xs mx-auto"
        >
          <div className="relative">
            <div className={`absolute inset-0 rounded-full blur transition-opacity duration-300 ${error ? 'bg-red-500/20 opacity-100' : 'bg-gold-500/10 opacity-0 group-focus-within:opacity-100'}`} />

            <motion.input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="방문 코드를 입력하세요"
              className="relative w-full bg-navy-900/80 backdrop-blur-xl border border-white/10 group-focus-within:border-gold-500/50 rounded-full py-4 px-8 text-center text-white placeholder:text-gray-500 focus:outline-none transition-all shadow-xl"
              animate={error ? { x: [-5, 5, -5, 5, 0] } : {}}
              maxLength={4}
            />

            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center text-navy-950 shadow-lg hover:shadow-[0_0_15px_rgba(197,160,89,0.4)] hover:scale-105 transition-all"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-xs mt-4 tracking-widest uppercase font-medium"
            >
              비밀번호가 올바르지 않습니다
            </motion.p>
          )}
        </motion.form>
      </motion.div>

      {/* Footer & Admin Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 w-full px-8 flex justify-between items-end"
      >
        <span className="text-[10px] text-gray-700 tracking-widest uppercase">YeoYeo Real Estate</span>

        {/* Subtle Admin Button */}
        <button
          onClick={() => navigate('/admin')}
          className="text-[10px] text-gray-800 hover:text-gold-500 transition-colors uppercase tracking-widest font-bold"
        >
          Manage
        </button>
        <button
          onClick={() => navigate('/preview/chatbot')}
          className="text-[10px] text-red-500 hover:text-red-700 transition-colors uppercase tracking-widest font-bold ml-4"
        >
          [Debug] Chatbot
        </button>
      </motion.div>
    </div>
  );
};

export default LandingPage;
