const express = require("express");

const { getAllItems, getItem, addItem, deleteItem, getAllCategories, sort } = require("../controllers/ItemController");

const router = express.Router();

router.get('/all', getAllItems);
router.get('/byId', getItem);
router.post('/add', addItem);
router.delete('/delete', deleteItem);
router.get('/allCategories', getAllCategories)
router.get('/sort', sort);

module.exports = router;