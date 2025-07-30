import { useState, useEffect, useRef } from 'react';

const personalFields = [
  { key: 'name', label: 'Name', type: 'text', placeholder: 'Enter your name' },
  { key: 'username', label: 'Username', type: 'text', placeholder: 'Enter your username' },
];
const platformFields = [
  { key: 'codeforces', label: 'Codeforces Profile Link', type: 'url', placeholder: 'https://codeforces.com/profile/yourhandle' },
  { key: 'codechef', label: 'Codechef Profile Link', type: 'url', placeholder: 'https://www.codechef.com/users/yourhandle' },
  { key: 'leetcode', label: 'LeetCode Profile Link', type: 'url', placeholder: 'https://leetcode.com/yourhandle' },
];

const ProfilePage = () => {
  const [form, setForm] = useState({
    name: '',
    username: '',
    codeforces: '',
    codechef: '',
    leetcode: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null); // key of the field being edited
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef(null);

  // Fetch user profile on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setLoading(true);
    fetch('/api/profile', {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(async res => {
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setForm({
          name: data.name || '',
          username: data.username || '',
          codeforces: data.codeforces || '',
          codechef: data.codechef || '',
          leetcode: data.leetcode || '',
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const handleEdit = (key) => {
    setEditing(key);
    setEditValue(form[key] || '');
    setSuccess(false);
    setError(null);
  };

  const handleSave = async (key) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in.');
      setLoading(false);
      setEditing(null);
      return;
    }
    try {
      const update = { ...form, [key]: editValue };
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ [key]: editValue })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to update profile');
      }
      setForm(f => ({ ...f, [key]: editValue }));
      setSuccess(true);
      setEditing(null);
      setEditValue('');
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setEditing(null);
    }
  };

  const handleBlur = (key) => {
    if (editing === key) {
      handleSave(key);
    }
  };

  // Auto-dismiss alerts after 1 second
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div className="w-full min-h-screen bg-slate-50 py-12 px-4">
      <h2 className="text-3xl font-bold mb-10 text-center text-slate-900">Profile</h2>
      {/* Toast notifications just below navbar */}
      <div className="fixed left-1/2 z-50 flex flex-col items-center space-y-2" style={{ top: '4.5rem', transform: 'translateX(-50%)' }}>
        {error && <div className="p-3 bg-red-100 text-red-700 rounded shadow-lg min-w-[250px] text-center">{error}</div>}
        {success && <div className="p-3 bg-green-100 text-green-700 rounded shadow-lg min-w-[250px] text-center">Profile updated successfully!</div>}
      </div>
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-6 text-blue-700">Personal Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {personalFields.map(field => (
              <div key={field.key} className="flex flex-col">
                <label className="block text-base font-medium text-gray-700 mb-1">{field.label}</label>
                <div className="flex items-center gap-2">
                  {editing === field.key ? (
                    <input
                      ref={inputRef}
                      type={field.type}
                      name={field.key}
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onBlur={() => handleBlur(field.key)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSave(field.key)}
                      className="w-full px-4 py-2 outline-none bg-white text-gray-700 focus:ring-0 focus:border-transparent shadow-none"
                      placeholder={field.placeholder}
                    />
                  ) : (
                    <span
                      className="flex-1 text-gray-800 truncate cursor-pointer"
                      onClick={() => handleEdit(field.key)}
                    >
                      {form[field.key] || <span className="text-gray-400">Not set</span>}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-6 text-purple-700">Platform Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {platformFields.map(field => (
              <div key={field.key} className="flex flex-col">
                <label className="block text-base font-medium text-gray-700 mb-1">{field.label}</label>
                <div className="flex items-center gap-2">
                  {editing === field.key ? (
                    <input
                      ref={inputRef}
                      type={field.type}
                      name={field.key}
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onBlur={() => handleBlur(field.key)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSave(field.key)}
                      className="w-full px-4 py-2 outline-none bg-white text-gray-700 focus:ring-0 focus:border-transparent shadow-none"
                      placeholder={field.placeholder}
                    />
                  ) : (
                    <span
                      className="flex-1 text-gray-800 truncate cursor-pointer"
                      onClick={() => handleEdit(field.key)}
                    >
                      {form[field.key] ? (
                        <a href={form[field.key]} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                          {form[field.key]}
                        </a>
                      ) : (
                        <span className="text-gray-400">Not set</span>
                      )}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;