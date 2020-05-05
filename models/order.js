const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
// information regarding an individual product present into the order page of an user while he's going to place his order
const ProductCartSchema = new mongoose.Schema({
    // based on the products present in product.js
    product:{
        type:ObjectId,
        ref:"Product"
    },
    name:String,
    count:Number,
    price: Number // price of that individual product
});

const ProductCart=mongoose.model("ProductCart",ProductCartSchema);
// information regarding the all (might be one or might be many) the products(productCartSchema) present in to the order page before placing the order for a particular user
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