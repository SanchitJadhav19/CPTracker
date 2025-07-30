import { useState, useEffect, useCallback } from 'react';
import AddGoalForm from './AddGoalForm';
import GoalsSectionClient from './GoalsSectionClient';

const GoalsSection = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const checkAuthStatus = useCallback(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
        return !!token;
    }, []);

    const fetchGoals = useCallback(() => {
        setLoading(true);
        setError(null);
        
        // Check if user is logged in
        const isAuthenticated = checkAuthStatus();
        if (!isAuthenticated) {
            setGoals([]);
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('token');
        fetch('/api/goals', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(async res => {
                if (!res.ok) {
                    if (res.status === 401 || res.status === 403) {
                        // Token is invalid or expired
                        localStorage.removeItem('token');
                        setIsLoggedIn(false);
                        setError('Your session has expired. Please log in again.');
                        setGoals([]);
                        setLoading(false);
                        return [];
                    }
                    throw new Error('Failed to fetch goals');
                }
                const data = await res.json();
                if (!Array.isArray(data)) {
                    setError('Unexpected response from server.');
                    setGoals([]);
                    setLoading(false);
                    return [];
                }
                setGoals(data);
                setLoading(false);
                return data;
            })
            .catch((err) => {
                console.error('Error fetching goals:', err);
                setError('Could not connect to backend. Please make sure the server is running.');
                setGoals([]);
                setLoading(false);
            });
    }, [checkAuthStatus]);

    useEffect(() => {
        fetchGoals();
        
        // Listen for login/logout changes in localStorage
        const onStorage = () => {
            checkAuthStatus();
            fetchGoals();
        };
        
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, [fetchGoals, checkAuthStatus]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-8">
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-700 font-medium">{error}</p>
                    {(error.includes('session') || error.includes('logged in')) && (
                        <a href="/auth/login" className="mt-2 inline-block text-blue-600 hover:text-blue-800 font-medium">Log in here</a>
                    )}
                </div>
            )}
            
            <GoalsSectionClient goals={goals} />
            <div className="pt-6 border-t border-slate-200">
                {isLoggedIn ? (
                    <AddGoalForm onGoalAdded={fetchGoals} />
                ) : (
                    <div className="text-center text-slate-500 py-8">
                        <div className="mb-2">Log in to add and track your goals.</div>
                        <a href="/auth/login" className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Log in</a>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GoalsSection;