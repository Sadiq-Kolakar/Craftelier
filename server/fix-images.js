const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const fixes = [
    {
        title: 'Indigo Block Print Scarf',
        img: 'https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=600&h=600&fit=crop'
    },
    {
        title: 'Embroidered Cushion Covers',
        img: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600&h=600&fit=crop'
    },
    {
        title: 'Blown Glass Vase',
        img: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=600&h=600&fit=crop'
    },
    {
        title: 'Handwoven Silk Table Runner',
        img: 'https://images.unsplash.com/photo-1615529151169-7b1ff50dc7f2?w=600&h=600&fit=crop'
    }
];

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    console.log('Connected');
    for (const fix of fixes) {
        const result = await Product.updateOne(
            { title: new RegExp(fix.title, 'i') },
            { $set: { images: [fix.img] } }
        );
        console.log(fix.title, ':', result.modifiedCount, 'updated');
    }
    console.log('Done!');
    process.exit(0);
}).catch(e => {
    console.error('Error:', e.message);
    process.exit(1);
});
