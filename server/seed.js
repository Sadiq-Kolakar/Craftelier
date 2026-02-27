require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dns = require('dns');

// Set Google DNS for Atlas SRV resolution
dns.setServers(['8.8.8.8', '8.8.4.4']);

const User = require('./models/User');
const Product = require('./models/Product');

// ─── Sample Artisans ────────────────────────────────────────
const artisans = [
    {
        full_name: 'Ananya Sharma',
        email: 'ananya@craftelier.com',
        password: 'demo123456',
        bio: 'Master potter with 15 years of experience. I create contemporary ceramics inspired by traditional Indian forms. Each piece is hand-thrown and wood-fired.',
        is_artisan: true,
        profile_image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face'
    },
    {
        full_name: 'Ravi Krishnan',
        email: 'ravi@craftelier.com',
        password: 'demo123456',
        bio: 'Third-generation woodworker from Kerala. I craft furniture and decorative pieces using reclaimed teak and traditional joinery techniques.',
        is_artisan: true,
        profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'
    },
    {
        full_name: 'Meera Patel',
        email: 'meera@craftelier.com',
        password: 'demo123456',
        bio: 'Textile artist blending Bandhani and contemporary design. My fabrics tell stories of Gujarati heritage through modern silhouettes.',
        is_artisan: true,
        profile_image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face'
    },
    {
        full_name: 'Arjun Desai',
        email: 'arjun@craftelier.com',
        password: 'demo123456',
        bio: 'Jewelry designer creating minimalist pieces from recycled silver and ethically sourced gemstones. Each design is a wearable sculpture.',
        is_artisan: true,
        profile_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face'
    },
    {
        full_name: 'Priya Nair',
        email: 'priya@craftelier.com',
        password: 'demo123456',
        bio: 'Contemporary painter exploring the intersection of nature and abstraction. My work uses natural pigments on handmade paper.',
        is_artisan: true,
        profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face'
    },
    {
        full_name: 'Karthik Rao',
        email: 'karthik@craftelier.com',
        password: 'demo123456',
        bio: 'Glass artist specializing in blown glass vessels and sculptural lighting. Trained in Murano, Italy. Studio based in Bangalore.',
        is_artisan: true,
        profile_image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face'
    }
];

// ─── Sample Products ─────────────────────────────────────────
const products = [
    // Ananya's pottery
    {
        title: 'Wabi-Sabi Ceramic Bowl',
        description: 'A hand-thrown ceramic bowl with organic imperfections that celebrate the beauty of wabi-sabi. Glazed in earthy tones with a matte finish. Perfect for serving or as a decorative centerpiece.',
        price: 3200,
        category: 'pottery',
        images: ['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&h=600&fit=crop'],
        artisan_index: 0
    },
    {
        title: 'Terracotta Planter Set',
        description: 'Set of three hand-shaped terracotta planters in graduated sizes. Each pot features unique thumb-pressed textures and natural unglazed finish. Drainage holes included.',
        price: 4500,
        category: 'pottery',
        images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&h=600&fit=crop'],
        artisan_index: 0
    },
    {
        title: 'Raku Tea Cup Pair',
        description: 'A pair of raku-fired tea cups with copper-lustre glaze. The unpredictable kiln magic creates unique patterns on each cup. Comes in a handmade wooden box.',
        price: 2800,
        category: 'pottery',
        images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=600&fit=crop'],
        artisan_index: 0
    },

    // Ravi's woodwork
    {
        title: 'Teak Serving Board',
        description: 'Hand-carved serving board from reclaimed teak. Features live edge and food-safe mineral oil finish. Each board is one-of-a-kind with natural grain patterns.',
        price: 5500,
        category: 'woodwork',
        images: ['https://images.unsplash.com/photo-1611486212355-d276af4581c0?w=600&h=600&fit=crop'],
        artisan_index: 1
    },
    {
        title: 'Walnut Desk Organizer',
        description: 'Minimalist desk organizer crafted from American walnut. Features compartments for pens, cards, and phone. Finished with natural beeswax polish.',
        price: 3800,
        category: 'woodwork',
        images: ['https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=600&h=600&fit=crop'],
        artisan_index: 1
    },
    {
        title: 'Carved Wooden Wall Art',
        description: 'Intricate geometric wall art carved from a single piece of rosewood. Inspired by temple architecture of South India. Measures 60cm x 40cm.',
        price: 12000,
        category: 'woodwork',
        images: ['https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=600&h=600&fit=crop'],
        artisan_index: 1
    },

    // Meera's textiles
    {
        title: 'Indigo Block Print Scarf',
        description: 'Hand block-printed cotton scarf in natural indigo dye. Features traditional Ajrakh motifs reinterpreted with modern geometry. 200cm x 70cm.',
        price: 2200,
        category: 'textiles',
        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=600&fit=crop'],
        artisan_index: 2
    },
    {
        title: 'Handwoven Silk Table Runner',
        description: 'Luxurious silk table runner handwoven on a pit loom. Features Patola-inspired double ikat pattern in gold and burgundy. 180cm x 35cm.',
        price: 6800,
        category: 'textiles',
        images: ['https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=600&h=600&fit=crop'],
        artisan_index: 2
    },
    {
        title: 'Embroidered Cushion Covers',
        description: 'Set of two cushion covers with Kutchi mirror-work embroidery. Made by women artisans from Bhuj. Pure cotton with zip closure. 45cm x 45cm.',
        price: 3500,
        category: 'textiles',
        images: ['https://images.unsplash.com/photo-1629949009765-35e1ba54d702?w=600&h=600&fit=crop'],
        artisan_index: 2
    },

    // Arjun's jewelry
    {
        title: 'Hammered Silver Cuff',
        description: 'Minimalist cuff bracelet in recycled sterling silver. Hand-hammered texture catches light beautifully. Adjustable fit. Comes with anti-tarnish pouch.',
        price: 4200,
        category: 'jewelry',
        images: ['https://images.unsplash.com/photo-1515562141589-67f0d569b5c2?w=600&h=600&fit=crop'],
        artisan_index: 3
    },
    {
        title: 'Moonstone Drop Earrings',
        description: 'Delicate drop earrings featuring rainbow moonstone cabochons set in 22k gold-plated silver. Handcrafted using ancient granulation technique.',
        price: 5800,
        category: 'jewelry',
        images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop'],
        artisan_index: 3
    },
    {
        title: 'Geometric Pendant Necklace',
        description: 'Architectural pendant in brushed silver with geometric cutouts. 18-inch chain with adjustable clasp. Each piece is handcut and filed to perfection.',
        price: 3600,
        category: 'jewelry',
        images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop'],
        artisan_index: 3
    },

    // Priya's paintings
    {
        title: 'Abstract Landscape — Monsoon',
        description: 'Original acrylic painting on handmade cotton paper. Inspired by the Western Ghats during monsoon season. Natural pigments blended with modern acrylics. 60cm x 45cm.',
        price: 15000,
        category: 'painting',
        images: ['https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=600&fit=crop'],
        artisan_index: 4
    },
    {
        title: 'Botanical Study — Wild Orchids',
        description: 'Detailed botanical illustration of wild orchids found in Kodaikanal. Watercolor and ink on archival paper. Unframed, 40cm x 30cm.',
        price: 8500,
        category: 'painting',
        images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=600&fit=crop'],
        artisan_index: 4
    },

    // Karthik's glasswork
    {
        title: 'Blown Glass Vase — Ocean',
        description: 'Hand-blown glass vase in swirling ocean blues and teals. Created using Murano-inspired techniques. Each piece is entirely unique. Height 30cm.',
        price: 9500,
        category: 'glasswork',
        images: ['https://images.unsplash.com/photo-1518882570164-c8d2e44d6530?w=600&h=600&fit=crop'],
        artisan_index: 5
    },
    {
        title: 'Glass Pendant Light — Amber',
        description: 'Hand-blown pendant light in warm amber glass. Includes brass fitting and adjustable cord. Creates beautiful warm lighting patterns. Diameter 25cm.',
        price: 11000,
        category: 'glasswork',
        images: ['https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=600&h=600&fit=crop'],
        artisan_index: 5
    }
];

// ─── Seed Function ───────────────────────────────────────────
async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✓ Connected to MongoDB Atlas');

        // Clear existing demo data (keep the test user)
        const testUser = await User.findOne({ email: 'test@craftelier.com' });
        await Product.deleteMany({ artisan_id: { $nin: testUser ? [testUser._id] : [] } });
        await User.deleteMany({ email: { $in: artisans.map(a => a.email) } });
        console.log('✓ Cleared previous demo data');

        // Create artisan users
        const createdArtisans = [];
        for (const artisan of artisans) {
            const user = await User.create(artisan);
            createdArtisans.push(user);
            console.log(`  + Artisan: ${user.full_name}`);
        }

        // Create products
        let productCount = 0;
        for (const product of products) {
            const artisan = createdArtisans[product.artisan_index];
            await Product.create({
                title: product.title,
                description: product.description,
                price: product.price,
                category: product.category,
                images: product.images,
                artisan_id: artisan._id,
                views_count: Math.floor(Math.random() * 200) + 10,
                likes_count: Math.floor(Math.random() * 50) + 5
            });
            productCount++;
        }
        console.log(`✓ Created ${productCount} products`);

        // Make test user follow a few artisans
        if (testUser) {
            const followIds = createdArtisans.slice(0, 3).map(a => a._id);
            await User.findByIdAndUpdate(testUser._id, {
                $addToSet: { following: { $each: followIds } },
                following_count: followIds.length
            });
            for (const artisan of createdArtisans.slice(0, 3)) {
                await User.findByIdAndUpdate(artisan._id, {
                    $addToSet: { followers: testUser._id },
                    $inc: { followers_count: 1 }
                });
            }
            console.log(`✓ Test user now follows ${followIds.length} artisans`);
        }

        console.log('\n🎉 Seed complete! Refresh your dashboard to see the content.');
        process.exit(0);
    } catch (error) {
        console.error('Seed failed:', error.message);
        process.exit(1);
    }
}

seed();
