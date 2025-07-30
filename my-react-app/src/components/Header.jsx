import { useState, useEffect } from 'react';

const Header = ({ user, onAuth }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);

  // Update isLoggedIn when user prop changes
  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);
  
  // Check authentication status on mount and when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    
    // Initial check
    checkAuth();
    
    // Listen for storage events (login/logout)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.dispatchEvent(new Event('storage'));
    window.location.href = '/';
  };

  return (
    <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg border-b border-slate-700">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <a href="/" className="flex items-center space-x-3 group">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <span className="text-sm font-bold text-white">CP</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            CP Tracker
          </span>
        </a>
        {/* Navigation */}
        <nav>
          <ul className="flex items-center space-x-8">
            <li className="flex items-center">
              <a 
                href="/" 
                className="text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md transition-all duration-200 font-medium"
              >
                Dashboard
              </a>
            </li>
            <li className="flex items-center">
              <a 
                href="/problems" 
                className="text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md transition-all duration-200 font-medium"
              >
                Problems
              </a>
            </li>
            <li className="flex items-center">
              <a 
                href="/profile" 
                className="text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md transition-all duration-200 font-medium"
              >
                Profile
              </a>
            </li>
            {!isLoggedIn ? (
              <>
                <li className="flex items-center">
                  <a 
                    href="/auth/login" 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-4 py-2 rounded-md font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Login
                  </a>
                </li>
                <li className="flex items-center">
                  <a 
                    href="/auth/signup" 
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 px-4 py-2 rounded-md font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Signup
                  </a>
                </li>
              </>
            ) : (
              <li className="flex items-center">
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    if (onAuth) onAuth(null);
                    toast.success('Logged out successfully!');
                  }}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 px-4 py-2 rounded-md font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;