const mongoose = require("mongoose");

const shippingSchema = new mongoose.Schema({
    type: {type: String, required: true},
    name: {type: String, default:'' },
    surname: {type: String, default:'' },
    email: {type: String, default:'' },
    address: {type: String, default:'' },
    postalcode: {type: String, default:'' },
    city: {type: String, default:'' },
    number: {type: String, default:'' },
    code: {type: String, default:'' },
});

const Shipping = mongoose.model("Shipping", shippingSchema);

module.exports = Shipping;