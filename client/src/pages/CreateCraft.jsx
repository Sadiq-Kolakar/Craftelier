import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { Upload, X, Plus } from 'lucide-react';

const CATEGORIES = [
    { value: 'pottery', label: 'Pottery' },
    { value: 'textiles', label: 'Textiles' },
    { value: 'woodwork', label: 'Woodwork' },
    { value: 'jewelry', label: 'Jewelry' },
    { value: 'painting', label: 'Painting' },
    { value: 'sculpture', label: 'Sculpture' },
    { value: 'glasswork', label: 'Glasswork' },
    { value: 'metalwork', label: 'Metalwork' },
    { value: 'leatherwork', label: 'Leatherwork' },
    { value: 'other', label: 'Other' },
];

export default function CreateCraft() {
    const [form, setForm] = useState({
        title: '',
        description: '',
        price: '',
        category: 'other',
        images: [],
    });
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const addImage = () => {
        if (imageUrl.trim() && form.images.length < 5) {
            setForm({ ...form, images: [...form.images, imageUrl.trim()] });
            setImageUrl('');
        }
    };

    const removeImage = (index) => {
        setForm({ ...form, images: form.images.filter((_, i) => i !== index) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.title || !form.description || !form.price) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            const res = await productsAPI.create({
                ...form,
                price: parseFloat(form.price)
            });
            navigate(`/craft/${res.data.data._id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create craft');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 bg-cream-50 page-enter">
            <div className="max-w-2xl mx-auto px-6 py-10">
                <h1 className="text-3xl font-medium text-charcoal-800 mb-2">List a New Craft</h1>
                <p className="text-charcoal-700/60 text-sm mb-10">Share your creation with the world</p>

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm px-4 py-3 mb-6 border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-xs tracking-wider text-charcoal-700/60 uppercase block mb-2">Title *</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Name of your craft"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            required
                            maxLength={200}
                        />
                    </div>

                    <div>
                        <label className="text-xs tracking-wider text-charcoal-700/60 uppercase block mb-2">Description *</label>
                        <textarea
                            className="input-field resize-none h-32"
                            placeholder="Describe your craft, materials used, and the story behind it..."
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            required
                            maxLength={2000}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs tracking-wider text-charcoal-700/60 uppercase block mb-2">Price (₹) *</label>
                            <input
                                type="number"
                                className="input-field"
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs tracking-wider text-charcoal-700/60 uppercase block mb-2">Category *</label>
                            <select
                                className="input-field"
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Images */}
                    <div>
                        <label className="text-xs tracking-wider text-charcoal-700/60 uppercase block mb-2">Images (URL)</label>
                        <div className="flex gap-2">
                            <input
                                type="url"
                                className="input-field flex-1"
                                placeholder="Paste image URL"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={addImage}
                                className="btn-outline px-4"
                                disabled={!imageUrl.trim() || form.images.length >= 5}
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        {form.images.length > 0 && (
                            <div className="flex gap-2 mt-3 flex-wrap">
                                {form.images.map((img, i) => (
                                    <div key={i} className="relative w-20 h-20 bg-cream-100 border border-cream-200 overflow-hidden group">
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(i)}
                                            className="absolute top-0 right-0 bg-red-500 text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <p className="text-xs text-charcoal-700/40 mt-1">{form.images.length}/5 images</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <Upload size={16} />
                        {loading ? 'Publishing...' : 'Publish Craft'}
                    </button>
                </form>
            </div>
        </div>
    );
}
