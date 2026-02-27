import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../services/api';
import { Save, User, Palette } from 'lucide-react';

export default function Profile() {
    const { user, updateUser } = useAuth();
    const [form, setForm] = useState({
        full_name: user?.full_name || '',
        bio: user?.bio || '',
        mobile_number: user?.mobile_number || '',
        is_artisan: user?.is_artisan || false,
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        try {
            const res = await usersAPI.updateProfile(form);
            updateUser(res.data.data);
            setMessage('Profile updated successfully');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Update failed');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 bg-cream-50 page-enter">
            <div className="max-w-2xl mx-auto px-6 py-10">
                <h1 className="text-3xl font-medium text-charcoal-800 mb-2">Your Profile</h1>
                <p className="text-charcoal-700/60 text-sm mb-10">Manage your account settings</p>

                {/* Avatar */}
                <div className="flex items-center gap-6 mb-10 p-6 bg-white border border-cream-200">
                    <div className="w-20 h-20 rounded-full bg-charcoal-800 text-cream-50 flex items-center justify-center text-2xl font-medium">
                        {user?.full_name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-xl font-medium text-charcoal-800">{user?.full_name}</h2>
                        <p className="text-sm text-charcoal-700/50">{user?.email}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-charcoal-700/40">
                            <span>{user?.followers_count || 0} followers</span>
                            <span>{user?.following_count || 0} following</span>
                        </div>
                    </div>
                </div>

                {message && (
                    <div className={`text-sm px-4 py-3 mb-6 border ${message.includes('success') ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                        }`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-xs tracking-wider text-charcoal-700/60 uppercase block mb-2">Full Name</label>
                        <input
                            type="text"
                            className="input-field"
                            value={form.full_name}
                            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-xs tracking-wider text-charcoal-700/60 uppercase block mb-2">Bio</label>
                        <textarea
                            className="input-field resize-none h-28"
                            placeholder="Tell the world about your craft..."
                            value={form.bio}
                            onChange={(e) => setForm({ ...form, bio: e.target.value })}
                            maxLength={500}
                        />
                        <p className="text-xs text-charcoal-700/40 mt-1 text-right">{form.bio.length}/500</p>
                    </div>

                    <div>
                        <label className="text-xs tracking-wider text-charcoal-700/60 uppercase block mb-2">Mobile</label>
                        <input
                            type="tel"
                            className="input-field"
                            placeholder="+1 (555) 000-0000"
                            value={form.mobile_number}
                            onChange={(e) => setForm({ ...form, mobile_number: e.target.value })}
                        />
                    </div>

                    {/* Artisan Mode Toggle */}
                    <div className="p-5 bg-white border border-cream-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Palette size={20} className="text-gold-500" />
                                <div>
                                    <p className="text-sm font-medium text-charcoal-800">Artisan Mode</p>
                                    <p className="text-xs text-charcoal-700/50">Enable to sell crafts and manage your gallery</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setForm({ ...form, is_artisan: !form.is_artisan })}
                                className={`w-12 h-6 rounded-full transition-colors duration-300 relative ${form.is_artisan ? 'bg-gold-500' : 'bg-cream-300'
                                    }`}
                            >
                                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${form.is_artisan ? 'translate-x-6' : 'translate-x-0.5'
                                    }`} />
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <Save size={16} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
}
