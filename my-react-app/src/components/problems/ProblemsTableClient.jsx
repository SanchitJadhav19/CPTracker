import React, { useState } from 'react';

const ProblemsTableClient = ({ problems }) => {
  const [expandedId, setExpandedId] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Solved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Wrong': return 'bg-red-100 text-red-800 border-red-200';
      case 'Revisit': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
          <tr>
            <th className="py-4 px-6 text-left font-semibold">Problem Title</th>
            <th className="py-4 px-6 text-left font-semibold">Platform</th>
            <th className="py-4 px-6 text-left font-semibold">Status</th>
            <th className="py-4 px-6 text-left font-semibold">Difficulty</th>
            <th className="py-4 px-6 text-left font-semibold">Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {problems.map((problem, index) => (
            <React.Fragment key={problem.id}>
              <tr className={`hover:bg-slate-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                <td className="py-4 px-6">
                  {problem.link ? (
                    <a
                      href={problem.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors duration-200"
                    >
                      {problem.title}
                    </a>
                  ) : (
                    <span className="text-slate-800 font-medium">{problem.title}</span>
                  )}
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    {problem.platform}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(problem.status)}`}>
                    {problem.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-slate-700 font-medium">
                    {problem.difficulty || 'Not specified'}
                  </span>
                </td>
                <td className="py-4 px-6">
                  {problem.notes ? (
                    <button
                      className="px-3 py-1 bg-orange-100 text-orange-800 rounded hover:bg-orange-200 transition-colors duration-150 shadow-sm border border-orange-200"
                      onClick={() => setExpandedId(expandedId === problem.id ? null : problem.id)}
                    >
                      {expandedId === problem.id ? 'Hide Notes' : 'Show Notes'}
                    </button>
                  ) : (
                    <span className="text-slate-400 italic">No notes</span>
                  )}
                </td>
              </tr>
              {expandedId === problem.id && (
                <tr>
                  <td colSpan={5} className="bg-orange-50 border-t border-orange-200">
                    <div className="p-6 my-2 rounded-xl shadow-inner border border-orange-200">
                      <div className="mb-2 text-sm text-orange-700 font-semibold">Notes:</div>
                      <div className="text-slate-800 whitespace-pre-line mb-2">{problem.notes}</div>
                      {problem.tags && problem.tags.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs font-semibold text-orange-600 mr-2">Topics:</span>
                          {problem.tags.map((tag, i) => (
                            <span key={i} className="inline-block bg-orange-200 text-orange-800 px-2 py-1 rounded-full text-xs mr-2 mb-1">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProblemsTableClient;
