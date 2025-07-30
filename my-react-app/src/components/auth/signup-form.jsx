import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupForm = ({ onAuth }) => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    username: ''
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

  const validateSignup = () => {
    if (!form.username || form.username.length < 3) {
      setError('Username must be at least 3 characters.');
      return false;
    }
    if (!form.email || !emailRegex.test(form.email)) {
      setError('A valid email is required.');
      return false;
    }
    if (!form.password || form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validateSignup()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: form.username, 
          email: form.email, 
          password: form.password
        })
      });
      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error('Server error. Please try again later.');
      }
      if (!res.ok) throw new Error(data.message || 'Signup failed');
      
      // Auto-login after successful signup
      localStorage.setItem('token', data.token);
      if (onAuth) onAuth(data.user);
      toast.success(`Welcome ${data.user.username}! Account created successfully`);
      
      // Redirect to home page after successful signup and auto-login
      navigate('/');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    } finally {
      if (!error) setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="flex flex-col w-full max-w-sm mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h2>
        <p className="text-gray-600 text-sm">Sign up to track your competitive programming progress</p>
      </div>
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      
      <div className="mb-4">
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
          Username
        </label>
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none text-gray-700"
          name="username"
          id="username"
          type="text"
          value={form.username}
          onChange={handleChange}
          placeholder="Enter your username"
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none text-gray-700"
          name="email"
          id="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
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
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 mb-3 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 outline-none"
      >
        {loading ? 'Signing up...' : 'Sign up'}
      </button>
      
      <div className="text-center mt-4">
        <p className="text-gray-600 text-sm">
          Already have an account?{' '}
          <a href="/auth/login" className="text-blue-600 hover:text-blue-800 font-medium">
            Log in
          </a>
        </p>
      </div>
    </form>
  );
};

export default SignupForm;