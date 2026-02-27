import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Plus, User, Home } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-cream-50/90 backdrop-blur-md border-b border-cream-200">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link to="/dashboard" className="text-2xl font-semibold tracking-tight text-charcoal-800 hover:text-gold-500 transition-colors">
                    Craftelier
                </Link>

                <div className="flex items-center gap-6">
                    <Link to="/dashboard" className="text-charcoal-700 hover:text-gold-500 transition-colors" title="Home">
                        <Home size={20} />
                    </Link>

                    {user?.is_artisan && (
                        <Link to="/create" className="text-charcoal-700 hover:text-gold-500 transition-colors flex items-center gap-1" title="Create Craft">
                            <Plus size={20} />
                            <span className="hidden md:inline text-sm tracking-wide">New Craft</span>
                        </Link>
                    )}

                    <Link to="/profile" className="text-charcoal-700 hover:text-gold-500 transition-colors flex items-center gap-2" title="Profile">
                        {user?.profile_image ? (
                            <img src={user.profile_image} alt="" className="w-7 h-7 rounded-full object-cover border border-cream-200" />
                        ) : (
                            <div className="w-7 h-7 rounded-full bg-charcoal-800 text-cream-50 flex items-center justify-center text-xs font-medium">
                                {user?.full_name?.charAt(0)?.toUpperCase()}
                            </div>
                        )}
                        <span className="hidden md:inline text-sm tracking-wide">{user?.full_name?.split(' ')[0]}</span>
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="text-charcoal-700 hover:text-red-500 transition-colors"
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </nav>
    );
}
