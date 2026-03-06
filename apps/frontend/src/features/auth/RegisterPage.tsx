import { useState, FormEvent, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../hooks/useAuth';

interface PasswordCheck {
    label: string;
    met: boolean;
}

const usePasswordStrength = (password: string): { checks: PasswordCheck[]; allMet: boolean } => {
    return useMemo(() => {
        const checks: PasswordCheck[] = [
            { label: '8+ characters', met: password.length >= 8 },
            { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
            { label: 'Number', met: /\d/.test(password) },
            { label: 'Special character (!@#$...)', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
        ];
        return { checks, allMet: checks.every((c) => c.met) };
    }, [password]);
};

export const RegisterPage = () => {
    const navigate = useNavigate();
    const register = useAuthStore((s) => s.register);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { checks, allMet } = usePasswordStrength(password);

    const usernameValid = /^[a-zA-Z0-9_]{3,}$/.test(username);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        if (!allMet) {
            setError('Please meet all password requirements.');
            return;
        }
        if (!usernameValid) {
            setError('Username must be 3+ characters (letters, numbers, underscores).');
            return;
        }
        setLoading(true);
        try {
            await register(username, email, password);
            navigate('/profile/me');
        } catch (err: any) {
            const msg = err?.response?.data?.error;
            if (Array.isArray(msg)) {
                setError(msg.map((e: any) => e.message).join('. '));
            } else {
                setError(msg || 'Registration failed. Please try again.');
            }
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
                    <p className="text-gray-400 mt-3 text-sm font-light">Create your writing sanctuary.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.06)] border border-gray-100">
                    {error && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 text-center">
                            {error}
                        </div>
                    )}

                    <div className="mb-5">
                        <label htmlFor="username" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoFocus
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all"
                            placeholder="your_username"
                        />
                        {username.length > 0 && !usernameValid && (
                            <p className="mt-1.5 text-xs text-amber-500">3+ chars, letters/numbers/underscores only</p>
                        )}
                    </div>

                    <div className="mb-5">
                        <label htmlFor="reg-email" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                            Email
                        </label>
                        <input
                            id="reg-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="mb-5">
                        <label htmlFor="reg-password" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                            Password
                        </label>
                        <input
                            id="reg-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Password strength hints */}
                    {password.length > 0 && (
                        <div className="mb-8 grid grid-cols-2 gap-x-4 gap-y-1.5">
                            {checks.map((check) => (
                                <div key={check.label} className="flex items-center gap-2 text-xs">
                                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${check.met ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                                    <span className={check.met ? 'text-emerald-600' : 'text-gray-400'}>{check.label}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !allMet || !usernameValid}
                        className="w-full py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Creating account...
                            </span>
                        ) : 'Create Account'}
                    </button>
                </form>

                <p className="text-center mt-8 text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-gray-900 font-medium hover:underline underline-offset-2 decoration-gray-300">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};
