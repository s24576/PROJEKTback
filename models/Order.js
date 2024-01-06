const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId,ref: "Item", required: true },
  name: { type: String, required: true },
  price: { type: String, required: true },
  quantity: { type: Number,required: true },
});

const orderSchema = new mongoose.Schema({
  shippingId: { type: mongoose.Schema.Types.ObjectId, required: true },
  items: [orderItemSchema],
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
