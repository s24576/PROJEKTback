const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const opinionRoutes = require('./routes/opinionRoutes');
const orderRoutes = require('./routes/orderRoutes');

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

app.use("/api/user", userRoutes);
app.use("/api/item", itemRoutes);
app.use("/api/opinion", opinionRoutes);
app.use("/api/order", orderRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
