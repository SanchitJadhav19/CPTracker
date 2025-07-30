import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import AddGoalForm from './components/Dashboard/AddGoalForm';
import GoalsSection from './components/Dashboard/GoalsSection';
import Footer from './components/Footer';
import Header from './components/Header';
import ProblemsTableClient from './components/problems/ProblemsTableClient';
import AddProblemForm from './components/problems/AddProblemForm';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const [problems, setProblems] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Replace with your actual backend URL and port
    fetch('http://localhost:5000/api/problems')
      .then((res) => res.json())
      .then((data) => setProblems(data))
      .catch((error) => console.error('Error fetching problems:', error));
    
    // Check if user is logged in on app load
    const token = localStorage.getItem('token');
    if (token) {
      // Fetch user data if token exists
      fetch('/api/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error('Invalid token');
          }
          return res.json();
        })
        .then(userData => {
          setUser(userData);
        })
        .catch(err => {
          console.error('Error fetching user data:', err);
          localStorage.removeItem('token'); // Clear invalid token
        });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} onAuth={setUser} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<GoalsSection />} />
          <Route path="/problems" element={<ProblemsTableClient problems={problems} />} />
          <Route path="/problems/add" element={<AddProblemForm />} />
          <Route path="/auth/login" element={<LoginPage onAuth={setUser} />} />
          <Route path="/auth/signup" element={<SignupPage onAuth={setUser} />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
