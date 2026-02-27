import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { recommendationsAPI, usersAPI } from '../services/api';
import { Heart, Eye, ArrowRight } from 'lucide-react';

export default function Dashboard() {
    const { user } = useAuth();
    const [crafts, setCrafts] = useState([]);
    const [artisans, setArtisans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [craftsRes, artisansRes] = await Promise.all([
                    recommendationsAPI.getCrafts({ limit: 20 }),
                    recommendationsAPI.getArtisans({ limit: 8 }),
                ]);
                setCrafts(craftsRes.data.data || []);
                setArtisans(artisansRes.data.data || []);
            } catch (err) {
                console.error('Failed to load dashboard:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen pt-24 bg-cream-50 flex items-center justify-center">
                <div className="animate-pulse text-charcoal-700 tracking-wider">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 bg-cream-50 page-enter">
            <div className="max-w-7xl mx-auto px-6 py-10">
                {/* Welcome */}
                <div className="mb-12">
                    <h1 className="text-3xl md:text-4xl font-medium text-charcoal-800 mb-2">
                        Welcome back, {user?.full_name?.split(' ')[0]}
                    </h1>
                    <p className="text-charcoal-700/60">Discover new crafts and artisans curated for you</p>
                </div>

                {/* Recommended Artisans */}
                {artisans.length > 0 && (
                    <section className="mb-14">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-medium text-charcoal-800 tracking-tight">Artisans to Follow</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {artisans.map((artisan) => (
                                <Link
                                    key={artisan._id}
                                    to={`/gallery/${artisan._id}`}
                                    className="group text-center p-5 bg-white border border-cream-200 hover:border-gold-400 transition-all duration-300 hover:shadow-md"
                                >
                                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-charcoal-800 text-cream-50 flex items-center justify-center text-xl font-medium overflow-hidden">
                                        {artisan.profile_image ? (
                                            <img src={artisan.profile_image} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            artisan.full_name?.charAt(0)?.toUpperCase()
                                        )}
                                    </div>
                                    <h3 className="text-sm font-medium text-charcoal-800 truncate">{artisan.full_name}</h3>
                                    <p className="text-xs text-charcoal-700/50 mt-1">{artisan.followers_count} followers</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Recommended Crafts */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-medium text-charcoal-800 tracking-tight">Recommended Crafts</h2>
                    </div>

                    {crafts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {crafts.map((craft) => (
                                <Link
                                    key={craft._id}
                                    to={`/craft/${craft._id}`}
                                    className="group bg-white border border-cream-200 overflow-hidden card-hover"
                                >
                                    <div className="aspect-square bg-cream-100 overflow-hidden">
                                        {craft.images?.[0] ? (
                                            <img
                                                src={craft.images[0]}
                                                alt={craft.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                loading="lazy"
                                                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling && (e.target.nextSibling.style.display = 'flex'); }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-charcoal-700/20 text-sm">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-sm font-medium text-charcoal-800 truncate">{craft.title}</h3>
                                        <p className="text-xs text-charcoal-700/50 mt-1">
                                            by {craft.artisan_id?.full_name || 'Unknown'}
                                        </p>
                                        <div className="flex items-center justify-between mt-3">
                                            <span className="text-sm font-medium text-gold-500">₹{craft.price?.toLocaleString()}</span>
                                            <div className="flex items-center gap-3 text-xs text-charcoal-700/40">
                                                <span className="flex items-center gap-1"><Heart size={12} /> {craft.likes_count || 0}</span>
                                                <span className="flex items-center gap-1"><Eye size={12} /> {craft.views_count || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white border border-cream-200">
                            <p className="text-charcoal-700/50 mb-4">No crafts available yet</p>
                            {user?.is_artisan && (
                                <Link to="/create" className="btn-gold text-sm inline-flex items-center gap-2">
                                    Add Your First Craft <ArrowRight size={14} />
                                </Link>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
