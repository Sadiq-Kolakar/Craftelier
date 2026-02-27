import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productsAPI } from '../services/api';
import { Heart, Eye, ArrowLeft, ShoppingBag } from 'lucide-react';

export default function CraftDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const [craft, setCraft] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        const fetchCraft = async () => {
            try {
                const res = await productsAPI.getById(id);
                setCraft(res.data.data);
                setLiked(res.data.data?.likes?.includes(user?._id));
            } catch (err) {
                console.error('Failed to load craft:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCraft();
    }, [id, user?._id]);

    const handleLike = async () => {
        try {
            const res = await productsAPI.like(id);
            setLiked(res.data.data.liked);
            setCraft(prev => ({
                ...prev,
                likes_count: res.data.data.liked ? prev.likes_count + 1 : prev.likes_count - 1
            }));
        } catch (err) {
            console.error('Like failed:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 bg-cream-50 flex items-center justify-center">
                <div className="animate-pulse text-charcoal-700 tracking-wider">Loading...</div>
            </div>
        );
    }

    if (!craft) {
        return (
            <div className="min-h-screen pt-24 bg-cream-50 flex items-center justify-center">
                <p className="text-charcoal-700/60">Craft not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 bg-cream-50 page-enter">
            <div className="max-w-7xl mx-auto px-6 py-10">
                {/* Back */}
                <button onClick={() => window.history.back()} className="flex items-center gap-2 text-sm text-charcoal-700/60 hover:text-charcoal-800 transition-colors mb-8">
                    <ArrowLeft size={16} /> Back
                </button>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Images */}
                    <div>
                        <div className="aspect-square bg-cream-100 overflow-hidden mb-4">
                            {craft.images?.[selectedImage] ? (
                                <img src={craft.images[selectedImage]} alt={craft.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-charcoal-700/20">No Image</div>
                            )}
                        </div>
                        {craft.images?.length > 1 && (
                            <div className="flex gap-2">
                                {craft.images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        className={`w-16 h-16 overflow-hidden border-2 transition-colors ${i === selectedImage ? 'border-gold-500' : 'border-cream-200'
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div>
                        <p className="text-xs tracking-[0.2em] text-gold-500 uppercase mb-3">{craft.category}</p>
                        <h1 className="text-3xl md:text-4xl font-medium text-charcoal-800 mb-4">{craft.title}</h1>

                        <div className="flex items-center gap-4 mb-6 text-sm text-charcoal-700/50">
                            <span className="flex items-center gap-1"><Heart size={14} /> {craft.likes_count || 0} likes</span>
                            <span className="flex items-center gap-1"><Eye size={14} /> {craft.views_count || 0} views</span>
                        </div>

                        <p className="text-3xl font-light text-charcoal-800 mb-8">₹{craft.price?.toLocaleString()}</p>

                        <p className="text-charcoal-700/70 leading-relaxed mb-8">{craft.description}</p>

                        {/* Artisan */}
                        <Link
                            to={`/gallery/${craft.artisan_id?._id}`}
                            className="flex items-center gap-4 p-4 bg-white border border-cream-200 hover:border-gold-400 transition-colors mb-8"
                        >
                            <div className="w-12 h-12 rounded-full bg-charcoal-800 text-cream-50 flex items-center justify-center text-lg font-medium overflow-hidden">
                                {craft.artisan_id?.profile_image ? (
                                    <img src={craft.artisan_id.profile_image} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    craft.artisan_id?.full_name?.charAt(0)?.toUpperCase()
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-charcoal-800">{craft.artisan_id?.full_name}</p>
                                <p className="text-xs text-charcoal-700/50">View gallery</p>
                            </div>
                        </Link>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-2 px-6 py-3 border transition-all duration-300 text-sm font-medium ${liked
                                        ? 'border-red-400 text-red-500 bg-red-50'
                                        : 'border-charcoal-800 text-charcoal-800 hover:bg-charcoal-800 hover:text-cream-50'
                                    }`}
                            >
                                <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
                                {liked ? 'Liked' : 'Like'}
                            </button>
                            <button className="btn-gold flex items-center gap-2 text-sm">
                                <ShoppingBag size={16} /> Contact Artisan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
