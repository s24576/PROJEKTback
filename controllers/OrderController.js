const Order = require('../models/Order');
const Shipping = require('../models/Shipping');

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
        return res.status(200).json({id: savedOrder._id});
    }
    catch (error) {
        console.log('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
}

const getOrder = async (req, res)=>{

}

module.exports = {addOrder, getOrder};