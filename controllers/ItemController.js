const Item = require('../models/Item');
const mongoose = require('mongoose');

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

      if(!mongoose.Types.ObjectId.isValid(itemId)){
        return res.status(400).json({message: 'Faulty ID given'});
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

async function isImage(url) {
  try {
    const response = await axios.head(url);
    const contentType = response.headers['content-type'];

    return contentType.startsWith('image/');
  } catch (error) {
    return false;
  }
}


const addItem = async (req, res) => {
  const { name, category, photo, price, description, quantity, shipping1, shipping2 } = req.body;
  try {
      if(!name || !category || !photo || !price || !description || !quantity){
        return res.status(400).json({ message: 'Not enough information given' });
      }

      if(name.trim() === '' || category.trim() === '' || photo.trim() === '' || description.trim() === ''){
        return res.status(400).json({ message: 'Not enough information given' });
      }

      const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
      if(!urlRegex.test(photo) || await isImage(photo)){
        return res.status(400).json({ message: 'Given url is not photo url' });
      }

      if(!shipping1 && !shipping2){
        return res.status(400).json({ message: 'No shipping option' });
      }

      if(!shipping2){
        return res.status(400).json({ message: 'Always must be true' });
      }

      if (isNaN(quantity) || isNaN(price) || quantity <= 0 || price <= 0) {
        return res.status(400).json({ message: 'Quantity and/or price must be positive numbers' });
      }
      
      const newItem = new Item({ name, category, photo, price, description, quantity, shipping1, shipping2 });

      await newItem.save();

      res.status(200).json({ message: "Saved succesfully", item: newItem });
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
    
    if(!mongoose.Types.ObjectId.isValid(itemId)){
      return res.status(400).json({message: 'Faulty ID given'});
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

const editItem = async (req, res) => {
  const { id } = req.body;
  const { name, category, photo, price, description, quantity, shipping1, shipping2 } = req.body.item;
  try {
    if(!id){
      return res.status(404).json({ message: 'No ID given' });
    }

    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({message: 'Faulty ID given'});
    }

    const existingItem = await Item.findById(id);
    if (!existingItem) {
      return res.status(404).json({ message: 'No item with the given ID' });
    }

    if(!name || !category || !photo || !price || !description || !quantity){
      return res.status(400).json({ message: 'Not enough information given' });
    }

    if(name.trim() === '' || category.trim() === '' || photo.trim() === '' || description.trim() === ''){
      return res.status(400).json({ message: 'Not enough information given' });
    }

    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    if(!urlRegex.test(photo) || await isImage(photo)){
      return res.status(400).json({ message: 'Given url is not photo url' });
    }

    if(!shipping1 && !shipping2){
      return res.status(400).json({ message: 'No shipping option' });
    }

    if(!shipping2){
      return res.status(400).json({ message: 'Always must be true' });
    }

    if (isNaN(quantity) || isNaN(price) || quantity <= 0 || price <= 0) {
      return res.status(400).json({ message: 'Quantity and/or price must be positive numbers' });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      id,
      {
        name,
        category,
        photo,
        price,
        description,
        quantity,
        shipping1,
        shipping2,
      },
      { new: true }
    );

    res.status(200).json({ item: updatedItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
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

    if(items.length===0){
      return res.status(400).json({ message: 'No items with given filters' });
    }

    res.status(200).json({ items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {getAllItems, getItem, addItem, deleteItem, editItem, getAllCategories, sort};