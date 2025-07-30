import { useRef, useState, useEffect } from 'react'

export default function AddGoalForm({ onGoalAdded }) {
    const formRef = useRef(null)
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const [success, setSuccess] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    // Check authentication status on mount and when localStorage changes
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            setIsLoggedIn(!!token);
        };
        
        checkAuth();
        
        // Listen for storage events (login/logout)
        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        
        const title = formData.get('title')?.trim();
        const target_count = parseInt(formData.get('target_count'));
        const target_date = formData.get('target_date');

        // Client-side validation
        if (!title) {
            setError('Goal title is required.');
            return;
        }
        if (!target_count || isNaN(target_count) || target_count < 1) {
            setError('Target count must be a positive number.');
            return;
        }
        if (!target_date) {
            setError('Target date is required.');
            return;
        }

        const goalData = { title, target_count, target_date };
        setIsPending(true)
        setError(null)
        setSuccess(false)
        
        const token = localStorage.getItem('token');
        if (!token) {
            setError('You must be logged in to add a goal.');
            setIsPending(false);
            setIsLoggedIn(false);
            return;
        }
        try {
            const response = await fetch('/api/goals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(goalData)
            })

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    // Token is invalid or expired
                    localStorage.removeItem('token');
                    setIsLoggedIn(false);
                    throw new Error('Your session has expired. Please log in again.');
                }
                
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
            }

            const result = await response.json()
            console.log('Goal added successfully:', result)
            
            setSuccess(true)
            formRef.current?.reset()
            if (onGoalAdded) onGoalAdded();
            toast.success('Goal added successfully!');
            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000)
            
        } catch (err) {
            console.error('Error adding goal:', err)
            setError(err.message || 'Failed to add goal. Please try again.')
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-6 bg-blue-500 rounded"></div>
                <h3 className="text-xl font-bold text-gray-800">Add a New Goal</h3>
            </div>
            
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-700 font-medium">{error}</p>
                </div>
            )}
            
            {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-green-700 font-medium">Goal added successfully!</p>
                </div>
            )}
            
            {!isLoggedIn && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <p className="text-yellow-700 font-medium">You need to be logged in to add goals.</p>
                    <a href="/auth/login" className="mt-2 inline-block text-blue-600 hover:text-blue-800 font-medium">Log in here</a>
                </div>
            )}
            
            <form ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Goal Title</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="e.g., Solve 5 graph problems"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder-gray-400 text-gray-700 bg-white"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Count</label>
                    <input
                        type="number"
                        name="target_count"
                        placeholder="5"
                        required
                        min="1"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder-gray-400 text-gray-700 bg-white"
                    />
                </div>
                <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Date</label>
                    <input
                        type="date"
                        name="target_date"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-700 bg-white"
                    />
                </div>
                <div className="md:col-span-2">
                    <button 
                        type="submit" 
                        disabled={isPending || !isLoggedIn}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                    >
                        {isPending ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Adding...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                                </svg>
                                Add Goal
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}