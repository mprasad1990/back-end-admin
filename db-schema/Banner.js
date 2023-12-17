const mongoose = require('mongoose');
const { Schema } = mongoose;

const bannerSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
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

const Banner = mongoose.model('banners', bannerSchema);
module.exports = Banner;