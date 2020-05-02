const mongoose = require('mongoose');

const categorySchema=new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
        unique: true
    },
},
{
    timestamps:true // make sure takes exact time of when it's created and store as a information into the user info
});

module.exports=mongoose.model("Category",categorySchema);