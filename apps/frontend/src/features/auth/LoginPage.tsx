import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../hooks/useAuth';

export const LoginPage = () => {
    const navigate = useNavigate();
    const login = useAuthStore((s) => s.login);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/editor');
        } catch (err: any) {
            setError(err?.response?.data?.error || 'Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <Link to="/" className="font-serif font-bold text-2xl text-gray-800 hover:text-gray-600 transition-colors">
                        The Writing App.
                    </Link>
                    <p className="text-gray-400 mt-3 text-sm font-light">Welcome back. Pick up where you left off.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.06)] border border-gray-100">
                    {error && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 text-center">
                            {error}
                        </div>
                    )}

                    <div className="mb-5">
                        <label htmlFor="email" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoFocus
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="mb-8">
                        <label htmlFor="password" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Signing in...
                            </span>
                        ) : 'Sign In'}
                    </button>
                </form>

                <p className="text-center mt-8 text-sm text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-gray-900 font-medium hover:underline underline-offset-2 decoration-gray-300">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
};
