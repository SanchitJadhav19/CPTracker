import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onAuth }) => {
  const [form, setForm] = useState({
    emailOrUsername: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateLogin = () => {
    if (!form.emailOrUsername) {
      setError('Email or username is required.');
      return false;
    }
    if (!form.password || form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    return true;
  };



  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError(null);
    if (!validateLogin()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername: form.emailOrUsername, password: form.password })
      });
      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error('Server error. Please try again later.');
      }
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('token', data.token);
      if (onAuth) onAuth(data.user);
      toast.success(`Welcome back, ${data.user.username}!`);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };



  const handleLogout = () => {
    localStorage.removeItem('token');
    if (onAuth) onAuth(null);
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col w-full max-w-sm mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
        <p className="text-gray-600 text-sm">Sign in to your account</p>
      </div>
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      <div className="mb-4">
        <label htmlFor="emailOrUsername" className="block text-sm font-medium text-gray-700 mb-2">
          Email or Username
        </label>
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none text-gray-700"
          name="emailOrUsername"
          id="emailOrUsername"
          type="text"
          value={form.emailOrUsername}
          onChange={handleChange}
          placeholder="Enter your email or username"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 transition-colors outline-none"
          type="password"
          name="password"
          id="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 mb-3 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none"
      >
        {loading ? 'Logging in...' : 'Log in'}
      </button>
      
      <div className="text-center mt-4">
        <p className="text-gray-600 text-sm">
          Don't have an account?{' '}
          <a href="/auth/signup" className="text-green-600 hover:text-green-800 font-medium">
            Sign up
          </a>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
