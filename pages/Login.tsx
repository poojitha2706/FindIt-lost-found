
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../services/mockDatabase';
import Logo from '../components/Logo';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await db.auth.login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12">
        <div className="text-center mb-10">
          <div className="bg-brand-yellow w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-brand-yellow/30 transform rotate-3 hover:rotate-0 transition-transform duration-500">
             <Logo className="w-20 h-20" />
          </div>
          <h1 className="text-4xl font-black text-brand-blue italic uppercase tracking-tighter">FindIt</h1>
          <p className="text-gray-500 mt-2 font-medium">Protect what you love.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest text-[10px]">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-brand-blue focus:bg-white outline-none transition"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest text-[10px]">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-brand-blue focus:bg-white outline-none transition"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-500 text-xs text-center font-bold bg-red-50 p-2 rounded-lg">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-blue text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 hover:shadow-2xl transition active:scale-95 disabled:opacity-50"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 text-sm">
          Don't have an account? <Link to="/signup" className="text-brand-blue font-black hover:underline">Register now</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
