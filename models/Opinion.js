const mongoose = require("mongoose");

const opinionSchema = new mongoose.Schema({
  itemId: { type: String, required: true },
  author: {type: String, required: true},
  comment: { type: String, required: true },
  rating: { type: Number, required: true },
});

const Opinion = mongoose.model("Opinion", opinionSchema);

module.exports = Opinion;
