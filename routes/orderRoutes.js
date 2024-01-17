const express = require("express");

const {addOrder, getOrder, getUsersOrder, getAllShippings} = require("../controllers/OrderController");

const router = express.Router();

router.post('/add', addOrder);
router.get('/byId', getOrder);
router.get('/byUser', getUsersOrder);
router.get('/allShipping', getAllShippings);

module.exports = router;