const Category = require("../models/category");


exports.getCategoryById = (req, res, next, id) => {

    Category.findById(id).exec((err, cate) => {
        if (err) {
            return res.status(400).json({
                error: "Category is not found in db"
            });
        }
        req.category = cate; // I have added a new object in my req json
        next();
    });
};

exports.createCategory = (req, res) => {
    const category = new Category(req.body);
    category.save((err, cate) => {
        if (err) {
            console.log(`Error occured!!\n${err}`);
            return res.status(400).json({
                error: "Not able to save in db",
                message: err
            });
        }
        console.log(`Everything is fine. ${cate} is saved on our db.\nreq.body==>${req.body}\nCateogry is==>${category}`);
        res.json({ category });
    });
};

exports.getCategory = (req, res) => {
    return res.status(200).json(req.category);
};

exports.getAllCategory = (req, res) => {
    Category.find().exec((err, allcategories) => {
        if (err) {
            return res.status(400).json({
                message: err,
                error: "No categories found"
            });
        }
        res.json(allcategories);
    });
};

exports.updateCategory = (req, res) => {
    const category = req.category;
    category.name = req.body.name;
    category.save((err, updatedcategory) => {
        if (err) {
            return res.status(400).json({
                message: err,
                error: "No categories found"
            });
        }
        res.json(updatedcategory);
    });
};

exports.removeCategory = (req, res) => {
    const category = req.category;
    category.remove((err, deletedCategory) => {
        if (err) {
            return res.status(400).json({
                message: err,
                error: `Failed to delete ${category}`
            });
        }
        res.json({
            message: `successfully deleted ${deletedCategory}`
        });
    });
};