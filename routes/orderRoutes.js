const express = require("express");

const {addOrder, getOrder, getUsersOrder} = require("../controllers/OrderController");

const router = express.Router();

router.post('/add', addOrder);
router.get('/byId', getOrder);
router.get('/byUser', getUsersOrder);

module.exports = router;