import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usersAPI, productsAPI } from '../services/api';
import { Heart, Eye, UserPlus, UserMinus } from 'lucide-react';

export default function Gallery() {
    const { id } = useParams();
    const { user } = useAuth();
    const [artisan, setArtisan] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [artisanRes, productsRes] = await Promise.all([
                    usersAPI.getProfile(id),
                    productsAPI.getAll({ artisan_id: id }),
                ]);
                setArtisan(artisanRes.data.data);
                setProducts(productsRes.data.data?.products || []);
                setIsFollowing(artisanRes.data.data?.followers?.includes(user?._id));
            } catch (err) {
                console.error('Failed to load gallery:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, user?._id]);

    const handleFollow = async () => {
        setFollowLoading(true);
        try {
            if (isFollowing) {
                await usersAPI.unfollowUser(id);
                setIsFollowing(false);
                setArtisan(prev => ({ ...prev, followers_count: prev.followers_count - 1 }));
            } else {
                await usersAPI.followUser(id);
                setIsFollowing(true);
                setArtisan(prev => ({ ...prev, followers_count: prev.followers_count + 1 }));
            }
        } catch (err) {
            console.error('Follow action failed:', err);
        } finally {
            setFollowLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 bg-cream-50 flex items-center justify-center">
                <div className="animate-pulse text-charcoal-700 tracking-wider">Loading gallery...</div>
            </div>
        );
    }

    if (!artisan) {
        return (
            <div className="min-h-screen pt-24 bg-cream-50 flex items-center justify-center">
                <p className="text-charcoal-700/60">Artisan not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 bg-cream-50 page-enter">
            {/* Artisan Header */}
            <div className="border-b border-cream-200 bg-white">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        <div className="w-24 h-24 rounded-full bg-charcoal-800 text-cream-50 flex items-center justify-center text-3xl font-medium overflow-hidden flex-shrink-0">
                            {artisan.profile_image ? (
                                <img src={artisan.profile_image} alt="" className="w-full h-full object-cover" />
                            ) : (
                                artisan.full_name?.charAt(0)?.toUpperCase()
                            )}
                        </div>
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-3xl font-medium text-charcoal-800 mb-2">{artisan.full_name}</h1>
                            {artisan.bio && (
                                <p className="text-charcoal-700/60 max-w-lg mb-4">{artisan.bio}</p>
                            )}
                            <div className="flex items-center gap-6 justify-center md:justify-start text-sm text-charcoal-700/50">
                                <span><strong className="text-charcoal-800">{artisan.followers_count}</strong> followers</span>
                                <span><strong className="text-charcoal-800">{products.length}</strong> crafts</span>
                            </div>
                        </div>
                        {user?._id !== id && (
                            <button
                                onClick={handleFollow}
                                disabled={followLoading}
                                className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium tracking-wide transition-all duration-300 ${isFollowing
                                        ? 'border border-charcoal-800 text-charcoal-800 hover:bg-red-50 hover:border-red-400 hover:text-red-500'
                                        : 'bg-charcoal-800 text-cream-50 hover:bg-charcoal-900'
                                    }`}
                            >
                                {isFollowing ? <><UserMinus size={16} /> Unfollow</> : <><UserPlus size={16} /> Follow</>}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Crafts Grid */}
            <div className="max-w-7xl mx-auto px-6 py-10">
                <h2 className="text-xl font-medium text-charcoal-800 mb-6 tracking-tight">Collection</h2>
                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {products.map((craft) => (
                            <Link
                                key={craft._id}
                                to={`/craft/${craft._id}`}
                                className="group bg-white border border-cream-200 overflow-hidden card-hover"
                            >
                                <div className="aspect-square bg-cream-100 overflow-hidden">
                                    {craft.images?.[0] ? (
                                        <img src={craft.images[0]} alt={craft.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-charcoal-700/20 text-sm">No Image</div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="text-sm font-medium text-charcoal-800 truncate">{craft.title}</h3>
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
                        <p className="text-charcoal-700/50">No crafts in this gallery yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}
