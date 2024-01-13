const Item = require('../models/Item');

const getAllItems = async (req, res) => {
    try {
        let items = await Item.find();

        if (items.length === 0) {
            return res.status(400).json({ message: 'Lista przedmiotów jest pusta' });
        }
        
        res.status(200).json({items: items});
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getItem = async (req, res) => {
    try {
      const { itemId } = req.query;

      if (!itemId) {
        return res.status(400).json({ message: 'ItemId is required' });
      }

      const item = await Item.findById(itemId);
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }

      res.status(200).json({ item });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
}

const addItem = async (req, res) => {
  const { name, category, photo, price, description, quantity, shipping1, shipping2 } = req.body;
  try {
      if(!name || !category || !photo || !price || !description || !quantity){
        return res.status(404).json({ message: 'Not enough information given' });
      }

      if(!shipping1 && !shipping2){
        return res.status(404).json({ message: 'No shipping option' });
      }

      const newItem = new Item({ name, category, photo, price, description, quantity, shipping1, shipping2 });

      await newItem.save();

      res.status(200).json({ message: "Przedmiot zapisany pomyślnie", item: newItem });
  } catch (error) {
      console.log('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
}

const deleteItem = async (req, res) => {
  const { itemId } = req.query;
  try {

    if (!itemId) {
      return res.status(400).json({ message: 'itemId parameter is required' });
    }

    const existingItem = await Item.findById(itemId);
    if (!existingItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    await Item.deleteOne(existingItem);

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Item.distinct("category");
    res.status(200).json({ categories: categories });
  } catch (error) {
    console.error("Error getting categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const sort = async (req, res) => {
  try {
    const { minPrice, maxPrice, category, orderBy, sortOrder } = req.query;

    let query = {};

    if (minPrice) {
      query.price = { $gte: parseFloat(minPrice) };
    }

    if (maxPrice>0) {
      query.price = { ...query.price, $lte: parseFloat(maxPrice) };
    }

    if (category) {
      query.category = category;
    }

    let sortQuery = {};
    let order = -1;
    if(sortOrder==="asc"){
      order = 1;
    }

    if(orderBy){
      if(orderBy==="date"){
        sortQuery = { createdAt: order };
      }
      else if(orderBy==="average"){
        const items = await Item.find(query);
        const itemsWithAverageRating = await Item.averageRating(items, order);
        return res.status(200).json({ items: itemsWithAverageRating });
      }
      else if(orderBy==="price"){
        sortQuery = { price: order };
      }
    }
    const items = await Item.find(query).sort(sortQuery);

    res.status(200).json({ items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {getAllItems, getItem, addItem, deleteItem, getAllCategories, sort};