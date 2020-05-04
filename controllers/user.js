const User = require("../models/user");

exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res
                    .status(400)
                    .json({
                        error: "No user found in db"
                    });
        }
        req.profile=user; // we are adding an extra information in our req named json file
        console.log(`${req.profile.name} information is passed from getUserById`);
        next();
    });
};

exports.getUser=(req,res)=>{
    // get back for password
    req.profile.salt=undefined; // as it's now a copied data from db, so it's not gonna change into db, but we dont wanna show crucial information
    req.profile.encryptedPassword=undefined; // as it's now a copied data from db, so it's not gonna change into db, but we dont wanna show crucial information
    req.profile.createdAt=undefined; // as it's now a copied data from db, so it's not gonna change into db, but we dont wanna show crucial information
    req.profile.updatedAt=undefined; // as it's now a copied data from db, so it's not gonna change into db, but we dont wanna show crucial information
    console.log(`${req.profile.name} information is passed from getUser`);
    return res
            .status(200)
            .json({
                TotalInfo: req.profile,
                Name: req.profile.name,
                Email: req.profile.email
            });
};