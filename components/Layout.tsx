import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { db } from '../services/mockDatabase';
import Logo from './Logo';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = db.auth.getCurrentUser();

  const handleLogout = () => {
    db.auth.logout();
    navigate('/login');
  };

  // In HashRouter, routes are in the hash. 
  // We check the actual URL hash to see if we're on the public finder page.
  const isPublic = window.location.hash.includes('/found/');

  if (isPublic) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-light">
      {/* Navbar for Owners */}
      <nav className="bg-brand-blue text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="bg-brand-yellow p-1 rounded-xl">
                <Logo className="w-10 h-10" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase italic">FindIt</span>
            </Link>

            {user && (
              <div className="flex items-center space-x-4">
                <Link to="/notifications" className="relative p-2 hover:bg-white/10 rounded-full transition">
                  <i className="fas fa-bell"></i>
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </Link>
                <div className="hidden md:block">
                  <span className="text-sm font-bold">Hi, {user.name.split(' ')[0]}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-sm font-bold transition flex items-center"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-6">
        {children}
      </main>

      {/* Mobile Nav */}
      {user && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-4 z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
          <Link to="/dashboard" className={`flex flex-col items-center ${location.pathname === '/dashboard' ? 'text-brand-blue' : 'text-gray-400'}`}>
            <i className="fas fa-th-large text-xl"></i>
            <span className="text-[10px] mt-1 font-bold uppercase">Home</span>
          </Link>
          <Link to="/add-item" className="flex flex-col items-center -mt-10">
            <div className="bg-brand-yellow text-brand-blue w-14 h-14 rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
              <i className="fas fa-plus text-2xl"></i>
            </div>
          </Link>
          <Link to="/notifications" className={`flex flex-col items-center ${location.pathname === '/notifications' ? 'text-brand-blue' : 'text-gray-400'}`}>
            <i className="fas fa-bell text-xl"></i>
            <span className="text-[10px] mt-1 font-bold uppercase">Feed</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Layout;