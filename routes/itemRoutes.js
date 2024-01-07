const express = require("express");

const { getAllItems, getItem, addItem, deleteItem } = require("../controllers/ItemController");

const router = express.Router();

router.get('/all', getAllItems);
router.get('/byId', getItem);
router.post('/add', addItem);
router.delete('/delete', deleteItem);

module.exports = router;