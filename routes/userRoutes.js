const express = require("express");

const { login, register, info } = require("../controllers/UserController");

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/info', info);

module.exports = router;