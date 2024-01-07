const express = require("express");

const {addOrder, getOrder} = require("../controllers/OrderController");

const router = express.Router();

router.post('/add', addOrder);
router.get('/byId', getOrder);

module.exports = router;