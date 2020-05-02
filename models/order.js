const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const ProductCartSchema = new mongoose.Schema({
    // based on the products present in product.js
    product:{
        type:ObjectId,
        ref:"Product"
    },
    name:String,
    count:Number,
    price: Number // price of each individual product
});

const ProductCart=mongoose.model("ProductCart",ProductCartSchema);

const OrderSchema = new mongoose.Schema({
    products:[ProductCartSchema],
    transaction_id:{},
    amount:{
        type:Number
    },
    address:String,
    updates: Date,
    user:{
        type: ObjectId,
        ref: "User"
    }
},
{
    timestamps:true
});

// module.exports
const Order=mongoose.model("Order",OrderSchema);

// we are exproting 2 classes
module.exports={Order,ProductCart};