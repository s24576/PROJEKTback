const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Item = require('./models/Item');
const Opinion = require('./models/Opinion');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const uri = "mongodb+srv://s24576:uzf8bk4qPaLvB1NJ@cluster.ac2qqok.mongodb.net/projekt?retryWrites=true&w=majority";

const app = express();
const PORT = process.env.PORT || 3001;

mongoose.connect(uri)
    .then(() => {
        console.log('Connected successfully');
    })
    .catch((error) => console.log('Connection failure', error));
    
app.use(express.json());
app.use(cors());

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const { password: _, ...userWithoutPassword } = user.toObject();

        res.json({ message: 'Login successful', user: userWithoutPassword });
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    try {
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
});

app.get('/api/get/items', async (req, res) => {
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
});

app.post('/api/admin/add/item', async (req, res) => {
    const { name, photo, price, description, quantity, shipping1, shipping2 } = req.body;
    try {
        // ewentualna unikalność przedmiotów
        const added = new Date();
        const newItem = new Item({ name, photo, price, description, quantity, added, shipping1, shipping2 });

        await newItem.save();

        res.status(200).json({ message: "Przedmiot zapisany pomyślnie", item: newItem });
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/add/opinion', async(req, res)=>{
    const { itemId, author, comment, rating} = req.body;
    try{
        const newOpinion = new Opinion({ itemId, author, comment, rating});
        await newOpinion.save();
        res.status(200).json({ message: "Opinia zapisana pomyślnie"});
    }
    catch (error) {
        console.log('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

app.get('/api/get/opinions', async(req, res)=>{
    const { itemId } = req.body;
    try{
        let opinions = await Opinion.find();

        if(opinions.length===0){
            res.status(400).json({message: 'Brak opinii'});
        }

        res.status(200).json({opinions: opinions});
    }
    catch (error) {
        console.log('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
