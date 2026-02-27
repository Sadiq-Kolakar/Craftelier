import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(form.email, form.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cream-50 flex">
            {/* Left — Image */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <img
                    src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=1200&fit=crop"
                    alt="Artisan at work"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-charcoal-900/30" />
                <div className="absolute bottom-12 left-12 right-12">
                    <h2 className="text-4xl text-white font-medium leading-snug">
                        Welcome back to<br />your creative space
                    </h2>
                </div>
            </div>

            {/* Right — Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md animate-fade-in">
                    <Link to="/" className="text-2xl font-semibold tracking-tight text-charcoal-800 mb-2 block">
                        Craftelier
                    </Link>
                    <p className="text-charcoal-700/60 text-sm mb-10">Sign in to continue your journey</p>

                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 mb-6 border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="text-xs tracking-wider text-charcoal-700/60 uppercase block mb-2">Email</label>
                            <input
                                id="login-email"
                                type="email"
                                className="input-field"
                                placeholder="your@email.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs tracking-wider text-charcoal-700/60 uppercase block mb-2">Password</label>
                            <div className="relative">
                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    className="input-field pr-12"
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-700/40 hover:text-charcoal-700 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <button
                            id="login-submit"
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-charcoal-700/60 mt-8">
                        New to Craftelier?{' '}
                        <Link to="/signup" className="text-gold-500 hover:text-gold-600 transition-colors font-medium">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
