import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Users, ShoppingBag } from 'lucide-react';

export default function Landing() {
    const featuredCategories = [
        { name: 'Pottery', image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=500&fit=crop' },
        { name: 'Textiles', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=500&fit=crop' },
        { name: 'Woodwork', image: 'https://images.unsplash.com/photo-1611486212355-d276af4581c0?w=400&h=500&fit=crop' },
        { name: 'Jewelry', image: 'https://images.unsplash.com/photo-1515562141589-67f0d569b5c2?w=400&h=500&fit=crop' },
    ];

    return (
        <div className="min-h-screen bg-cream-50">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-cream-50/90 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <span className="text-2xl font-semibold tracking-tight text-charcoal-800">Craftelier</span>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-sm tracking-wide text-charcoal-700 hover:text-gold-500 transition-colors px-4 py-2">
                            Sign In
                        </Link>
                        <Link to="/signup" className="btn-primary text-sm">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl mx-auto text-center animate-fade-in">
                        <p className="text-gold-500 tracking-[0.3em] text-sm uppercase mb-6">Premium Artisan Marketplace</p>
                        <h1 className="text-5xl md:text-7xl font-medium text-charcoal-800 leading-[1.1] mb-8">
                            Where Craft<br />Meets Elegance
                        </h1>
                        <p className="text-lg text-charcoal-700/70 leading-relaxed mb-10 max-w-xl mx-auto">
                            Discover extraordinary handcrafted pieces from talented artisans around the world. Each creation tells a unique story of skill, passion, and artistry.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Link to="/signup" className="btn-primary inline-flex items-center gap-2">
                                Explore Collection <ArrowRight size={16} />
                            </Link>
                            <Link to="/login" className="btn-outline">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12 border-y border-cream-200">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
                    <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <div className="flex items-center justify-center gap-2 mb-2 text-gold-500">
                            <Sparkles size={18} />
                            <span className="text-3xl font-light text-charcoal-800">500+</span>
                        </div>
                        <p className="text-sm text-charcoal-700/60 tracking-wide">Unique Crafts</p>
                    </div>
                    <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <div className="flex items-center justify-center gap-2 mb-2 text-gold-500">
                            <Users size={18} />
                            <span className="text-3xl font-light text-charcoal-800">200+</span>
                        </div>
                        <p className="text-sm text-charcoal-700/60 tracking-wide">Artisans</p>
                    </div>
                    <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <div className="flex items-center justify-center gap-2 mb-2 text-gold-500">
                            <ShoppingBag size={18} />
                            <span className="text-3xl font-light text-charcoal-800">50+</span>
                        </div>
                        <p className="text-sm text-charcoal-700/60 tracking-wide">Categories</p>
                    </div>
                </div>
            </section>

            {/* Featured Categories */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="text-gold-500 tracking-[0.3em] text-xs uppercase mb-3">Explore</p>
                        <h2 className="section-title">Featured Categories</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {featuredCategories.map((cat, i) => (
                            <div
                                key={cat.name}
                                className="group relative aspect-[4/5] overflow-hidden cursor-pointer animate-slide-up"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h3 className="text-white text-xl font-medium tracking-wide">{cat.name}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-6 bg-cream-100">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-gold-500 tracking-[0.3em] text-xs uppercase mb-3">How It Works</p>
                    <h2 className="section-title mb-14">A Seamless Experience</h2>
                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            { step: '01', title: 'Discover', desc: 'Browse curated collections from talented artisans worldwide' },
                            { step: '02', title: 'Connect', desc: 'Follow your favorite artisans and stay inspired by their work' },
                            { step: '03', title: 'Collect', desc: 'Acquire unique handcrafted pieces that tell a story' },
                        ].map((item) => (
                            <div key={item.step} className="text-center">
                                <span className="text-5xl font-light text-gold-400/40 block mb-4">{item.step}</span>
                                <h3 className="text-xl font-medium text-charcoal-800 mb-3">{item.title}</h3>
                                <p className="text-charcoal-700/60 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-medium text-charcoal-800 mb-6">
                        Begin Your Collection
                    </h2>
                    <p className="text-charcoal-700/60 mb-10 max-w-lg mx-auto">
                        Join a community of art lovers and support independent artisans creating extraordinary work.
                    </p>
                    <Link to="/signup" className="btn-gold inline-flex items-center gap-2">
                        Create Your Account <ArrowRight size={16} />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-cream-200 py-12 px-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <span className="text-lg font-medium text-charcoal-800 tracking-tight">Craftelier</span>
                    <p className="text-xs text-charcoal-700/40 tracking-wide">© 2026 Craftelier. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
