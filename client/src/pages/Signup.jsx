import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function Signup() {
    const [form, setForm] = useState({ full_name: '', email: '', password: '', mobile_number: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            await signup(form);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cream-50 flex">
            {/* Left — Image */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <img
                    src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=1200&fit=crop"
                    alt="Handcrafted art"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-charcoal-900/30" />
                <div className="absolute bottom-12 left-12 right-12">
                    <h2 className="text-4xl text-white font-medium leading-snug">
                        Start your journey<br />as a creator
                    </h2>
                </div>
            </div>

            {/* Right — Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md animate-fade-in">
                    <Link to="/" className="text-2xl font-semibold tracking-tight text-charcoal-800 mb-2 block">
                        Craftelier
                    </Link>
                    <p className="text-charcoal-700/60 text-sm mb-10">Create your account to begin</p>

                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 mb-6 border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="text-xs tracking-wider text-charcoal-700/60 uppercase block mb-2">Full Name</label>
                            <input
                                id="signup-name"
                                type="text"
                                className="input-field"
                                placeholder="Your full name"
                                value={form.full_name}
                                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs tracking-wider text-charcoal-700/60 uppercase block mb-2">Email</label>
                            <input
                                id="signup-email"
                                type="email"
                                className="input-field"
                                placeholder="your@email.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs tracking-wider text-charcoal-700/60 uppercase block mb-2">Mobile (Optional)</label>
                            <input
                                id="signup-mobile"
                                type="tel"
                                className="input-field"
                                placeholder="+1 (555) 000-0000"
                                value={form.mobile_number}
                                onChange={(e) => setForm({ ...form, mobile_number: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs tracking-wider text-charcoal-700/60 uppercase block mb-2">Password</label>
                            <div className="relative">
                                <input
                                    id="signup-password"
                                    type={showPassword ? 'text' : 'password'}
                                    className="input-field pr-12"
                                    placeholder="Minimum 6 characters"
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
                            id="signup-submit"
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-charcoal-700/60 mt-8">
                        Already have an account?{' '}
                        <Link to="/login" className="text-gold-500 hover:text-gold-600 transition-colors font-medium">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
