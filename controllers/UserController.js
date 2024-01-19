const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const saltRounds = 10;
const key = "TWRkrólpodziemia"; 

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if(!email || !password){
            return res.status(401).json({ message: 'No credentials given' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const { password: _, ...userWithoutPassword } = user.toObject();

        const token = jwt.sign({ user: userWithoutPassword }, key, {
            expiresIn: "1h",
        })

        res.status(200).json({ message: 'Login successful', token: token, user: user });
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const register = async (req, res) => {
    const { email, password } = req.body;
    try {
        if(!email || !password){
            return res.status(401).json({ message: 'No credentials given' });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hash = await bcrypt.hash(password, saltRounds);
        const newUser = new User({ email, password: hash, admin: false });
        await newUser.save();

        res.status(200).json({ message: 'Registration successful' });
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const info = async (req, res) => {
    const { token } = req.query;
    try {
        if(!token){
            return res.status(404).json({ message: 'No token given' });
        }

        const decodedToken = jwt.verify(token, key);
    
        const user = await User.findById(decodedToken.user._id);
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        
        const { password, ...userWithoutPassword } = user.toObject();
    
        res.status(200).json({ user: userWithoutPassword });
      } catch (error) {
        if (error.name === 'JsonWebTokenError') {
          return res.status(401).json({ message: 'Invalid token' });
        }
    
        console.log('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
};

module.exports = {login, register, info};