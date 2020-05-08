const Product=require("../models/product");

exports.getProductById=(req,res,next,id)=>{
    Product.findById(id)
            .populate("category") // think about it, why have we done that.
            .exec((err,product)=>{
        if(err){
            console.log(`Error is: ${err}`);
            return res.status(400).json({
                messsage: err
            });
        }
        req.product=product;
        next();
    });
}