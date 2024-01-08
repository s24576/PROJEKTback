const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  photo: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  shipping1: { type: Boolean, required: true },
  shipping2: { type: Boolean, required: true },
},{timestamps: true}
);

itemSchema.statics.averageRating = async function (items, order){
  const itemIds = items.map(item => item._id);

  const pipeline = [
    {
      $match: {
        _id: { $in: itemIds },
      },
    },
    {
      $lookup: {
        from: "ratings",
        localField: "_id",
        foreignField: "itemId",
        as: "ratings",
      },
    },
    {
      $addFields: {
        averageRating: {
          $ifNull: [{ $avg: "$ratings.rating" }, 0],
        },
      },
    },
    {
      $sort: {
        averageRating: order,
      },
    },
  ];
  return await this.aggregate(pipeline).exec();
}

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
