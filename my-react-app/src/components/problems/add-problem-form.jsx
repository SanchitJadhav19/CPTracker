import React from 'react';

export default function AddProblemForm() {
  const platforms = ["Codeforces", "LeetCode", "AtCoder", "CodeChef", "Other"];
  const statuses = ["To Do", "Solved", "Wrong", "Revisit"];

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const problemData = {
      title: formData.get("title"),
      platform: formData.get("platform"),
      link: formData.get("link"),
      difficulty: formData.get("difficulty"),
      status: formData.get("status"),
      tags: formData.get("tags"),
      notes: formData.get("notes"),
    };

    console.log("Submitted Problem:", problemData);
    // TODO: Replace with actual submission logic, like API call
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-8 py-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">+</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Add a New Problem
            </h1>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-2">
                Problem Title
              </label>
              <input 
                id="title" 
                name="title" 
                type="text" 
                required 
                className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white placeholder-slate-400"
                placeholder="Enter problem title"
              />
            </div>

            <div>
              <label htmlFor="platform" className="block text-sm font-semibold text-slate-700 mb-2">
                Platform
              </label>
              <select 
                id="platform" 
                name="platform" 
                required 
                className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-gray-400"
              >
                {platforms.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="link" className="block text-sm font-semibold text-slate-700 mb-2">
              Problem Link
            </label>
            <input 
              id="link" 
              name="link" 
              type="url" 
              className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white placeholder-slate-400"
              placeholder="https://example.com/problem"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="difficulty" className="block text-sm font-semibold text-slate-700 mb-2">
                Difficulty
              </label>
              <input 
                id="difficulty" 
                name="difficulty" 
                type="text" 
                placeholder="e.g., 1600, Medium, Div2 C" 
                className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white placeholder-slate-400"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-slate-700 mb-2">
                Status
              </label>
              <select 
                id="status" 
                name="status" 
                defaultValue="To Do" 
                required 
                className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white text-slate-400"
              >
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-semibold text-slate-700 mb-2">
              Tags
            </label>
            <input 
              id="tags" 
              name="tags" 
              type="text" 
              placeholder="e.g., DP, Graphs, Two Pointers" 
              className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white text-slate-400"
            />
            <p className="text-xs text-slate-500 mt-1">Separate multiple tags with commas</p>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-semibold text-slate-700 mb-2">
              Notes
            </label>
            <textarea 
              id="notes" 
              name="notes" 
              rows={4} 
              className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white placeholder-slate-400 resize-none"
              placeholder="Add any additional notes or observations..."
            />
          </div>

          <div className="pt-4">
            <button
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              type="submit"
            >
              Add Problem
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
