
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../services/mockDatabase';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await db.auth.signup(email, password, name, phone);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-brand-blue uppercase">Get Started</h1>
          <p className="text-gray-500 mt-2">Create your owner account</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Full Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none"
              placeholder="Priya Kapoor"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none"
              placeholder="priya@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Phone Number</label>
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none"
              placeholder="+91 98XXX-XX45"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-500 text-xs text-center font-bold bg-red-50 p-2 rounded-lg">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-yellow text-brand-blue py-5 rounded-2xl font-black text-lg shadow-xl shadow-brand-yellow/20 hover:shadow-2xl transition mt-4 disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 text-sm font-medium">
          Already have an account? <Link to="/login" className="text-brand-blue font-black hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
