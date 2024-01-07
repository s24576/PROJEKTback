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

//DODAC POTWIERDZENIE ZE OPERACJE WYKONUJE ADMIN
const addItem = async (req, res) => {
  const { name, photo, price, description, quantity, shipping1, shipping2 } = req.body;
  try {
      //timestampsy
      const added = new Date();
      // ewentualna unikalność przedmiotów
      const newItem = new Item({ name, photo, price, description, quantity, added, shipping1, shipping2 });

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

module.exports = {getAllItems, getItem, addItem, deleteItem};