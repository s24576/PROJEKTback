const Order = require('../models/Order');
const Shipping = require('../models/Shipping');
const Item = require('../models/Item');
const User = require('../models/User');

const addOrder = async (req, res) => {
    const {type, shipping, cart } = req.body;
    try{
        let newShipping;
        if(type==="shipping1"){
            newShipping = new Shipping({
                type: "shipping1",
                names: shipping.names,
                email: shipping.email,
                number: shipping.number,
                code: shipping.code
            })
        }
        else if(type==="shipping2"){
            newShipping = new Shipping({
                type: "shipping2",
                name: shipping.name,
                surname: shipping.surname,
                email: shipping.email,
                number: shipping.number,
                address: shipping.address,
                postalcode: shipping.postalcode,
                city: shipping.city,
            });
        }
        else{
            return res.status(404).json({error: "Zła forma dostawy"});
        }

        const savedShipping = await newShipping.save();

        const newOrder = new Order({
            shippingId: savedShipping._id,
            items: cart,
        });

        const savedOrder = await newOrder.save();

        for(const item of cart){
            const existingItem = await Item.findById(item.itemId);
            
            existingItem.quantity -= item.quantity;
            await existingItem.save();
        }

        return res.status(200).json({id: savedOrder._id});
    }
    catch (error) {
        console.log('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
}

const getOrder = async (req, res)=>{
    const { orderId } = req.query;

    try{
        if(!orderId){
            return res.status(400).json({ message: 'No ID given'});
        }

        const order = await Order.findById(orderId);
        if(!order){
            return res.status(400).json({ message: 'No order with given ID'});
        }
        
        const shipping = await Shipping.findById(order.shippingId);

        res.status(200).json({order: order, shipping: shipping});

    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getUsersOrder = async (req, res)=>{
    const { userId } = req.query;
    
    try{
        const user = await User.findById(userId);
        if(!user){
            return res.status(400).json({message: 'No user with given ID'});
        }

        
        Order.find({ 'items.itemId': { $exists: true } })
            .populate({
                path: 'shippingId',
                match: { 'email': user.email },
                model: 'Shipping'
            })
            .exec()
            .then((orders)=>{
                if (orders.length === 0) {
                    return res.status(200).json({ message: 'No orders found for the user' });
                  }

                  res.status(200).json({ orders: orders });
            })
            .catch((error)=> {

                console.log('Error:', error);
                res.status(500).json({ message: 'Internal server error' });
            });
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const countShipping = () =>{
    return new Promise(async (resolve, reject) => {
        try {
            const result = await Shipping.aggregate([
                {
                    $group: {
                      _id: '$type',
                      count: { $sum: 1 },
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      count: 1,
                      name: {
                        $cond: {
                          if: { $eq: ['$_id', 'shipping2'] },
                          then: 'kurier',
                          else: 'paczkomat'
                        },
                      },
                    },
                  },
                ]);
      
            resolve(result);
          } catch (error) {
            console.error('Error:', error);
            reject({ message: 'Internal server error' });
          }
        });
}
const getAllShippings = async (req, res) => {
    try {
        const shippingData = await countShipping();
        console.log(shippingData);
        res.status(200).json({shippingData: shippingData});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {addOrder, getOrder, getUsersOrder, getAllShippings};