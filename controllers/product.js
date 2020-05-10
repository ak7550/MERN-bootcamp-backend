const Product = require("../models/product");
const formidable = require("formidable");
const _ = require('lodash'); // need a variable but dont wanna use too much explicitly
const fs = require("fs"); // file-system

exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
        .populate("category") // think about it, why have we done that.
        .exec((err, product) => {
            if (err) {
                console.log(`Error is: ${err}`);
                return res.status(400).json({
                    messsage: err
                });
            }
            req.product = product;
            next();
        });
}

exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            console.log(`Error is: ${err}`);
            return res.status(400).json({
                messsage: err
            });
        }

        // todo: restrictions on field needs to put <=== important
        let product = new Product(fields);


        // handling the file accordingly
        if (file.photo) {
            if (file.photo.size > 3 * 1024 * 1024) { // bigger than 3mb
                console.log(`File size is too big`);
                return res.status(400).json({
                    err: `File size is too big`
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        } // to manage the file

        // save to db
        product.save((err, product) => {
            if (err) {
                console.log(`Error is: ${err}`);
                return res.status(400).json({
                    messsage: err
                });
            }
            console.log(`Product saved to  db is: ${product}`);
            res.json(product);
        });
    });
}