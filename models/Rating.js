const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    author: {type: String, required: true},
    rating: { type: Number, required: true },
})

const Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating;