import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white mt-auto border-t border-slate-700">
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
              <span className="text-xs font-bold text-white">CP</span>
            </div>
            <span className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              CP Tracker
            </span>
          </div>
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} CP Tracker. All rights reserved.
          </p>
          <div className="mt-4 pt-4 border-t border-slate-700">
            <p className="text-xs text-gray-500">
              Built for competitive programmers, by competitive programmers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;