const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    category_id: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String
    },
    source_image: {
        type: String
    },
    image_config: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Products = mongoose.model('products', productSchema);
module.exports = Products;