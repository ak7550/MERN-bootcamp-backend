const User = require("../models/user");
const Order = require("../models/order");

exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res
                .status(400)
                .json({
                    error: "No user found in db"
                });
        }
        req.profile = user; // we are adding an extra information in our req named json file
        console.log(`${req.profile.name} information is passed from getUserById`);
        next();
    });
};

exports.getUser = (req, res) => {
    // get back for password
    req.profile.salt = undefined; // as it's now a copied data from db, so it's not gonna change into db, but we dont wanna show crucial information
    req.profile.encryptedPassword = undefined; // as it's now a copied data from db, so it's not gonna change into db, but we dont wanna show crucial information
    req.profile.createdAt = undefined; // as it's now a copied data from db, so it's not gonna change into db, but we dont wanna show crucial information
    req.profile.updatedAt = undefined; // as it's now a copied data from db, so it's not gonna change into db, but we dont wanna show crucial information
    console.log(`${req.profile.name} information is passed from getUser`);
    return res
        .status(200)
        .json({
            TotalInfo: req.profile,
            Name: req.profile.name,
            Email: req.profile.email
        });
};

exports.getAllUserInfo = (req, res) => {
    User.find({}, function (err, users) {
        if (!users || err) { // if the user doesn't exist in our db or any other kind of error while searching into the db (that error may store in err argument)
            return res
                .status(503)
                .json({
                    error: "Requested information not found"
                });
        }
        // there's no error, and the arr is not empty
        let userJson = {
            users: []
        };
        console.log(`All user total information: ${users}`); // serves the purpose res.json(users);
        res.status(200).json(users);
        users.forEach(user => {
            console.log(`User No: ${users.indexOf(user)}`);
            console.log(`================================`);
            console.log(`${user}`);
            //not showing me the plainpassword, though it's visible at at singnup route
            console.log(`\n${user.password}`);
            userJson.users.push(user);
        });
        res.status(200).json(userJson);
    });
};

exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(
        { _id: req.profile._id },
        { $set: req.body }, // i wanna update all the information that has been pased through my request
        { new: true, useFindAndModify: false }, //compulsory parameter according to the documentation
        (err, user) => {
            if (err) {
                res.status(400).json({
                    error: "Not authorised to update this user"
                })
            }
            // user.salt=undefined; // as it's now a copied data from db, so it's not gonna change into db, but we dont wanna show crucial information
            // user.encryptedPassword=undefined; // as it's now a copied data from db, so it's not gonna change into db, but we dont wanna show crucial information
            // user.createdAt=undefined; // as it's now a copied data from db, so it's not gonna change into db, but we dont wanna show crucial information
            // user.updatedAt=undefined; 
            res.status(200).json(user);
            console.log(`Changed profile is: ${user}`);

        }
    )
};

exports.userPurchaseList = (req, res) => {
    Order.find({ user: req.profile._id }) // got the user which id is as same as of req.profile._id
        .populate("user", "_id name") // read documentation of mongoose populate // populate is only taking the _id and the name and assgining it to user object of order instance
        .exec((err, order) => {
            if (err || !order) {
                return res.status(400)
                    .json({
                        error: "No order in this account or something might get wrong"
                    });
            }
            res.status(200).json(order);
        });
};


exports.pushOrderInPurchaseList = (req, res,next) => {
    let purchases=[];
    Order.find({user: req.profile._id})
    // in frontend we will pack complete cart information for tht particular user with it's req.body as req.body.order.products (how will we do that, we will think about it later)
    req.body.order.products.forEach(product=>{
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transactionId: req.body.order.transactionId
        }); 
        // store this into database. purchases is now storing the orders that now the user is gonna make along with it's transaction id, though each of the product will have same transaction id when it will be orders at the same time
        // now i have to update the user purchase list
        User.findOneAndUpdate({
            _id: req.profile._id
        },
        { // according to the documentation
            $push:{
                purchases:purchases
            }
        },
        {
            new:true // send me the updated one from the db
        },
        (err,purchase)=>{
            if(err){
                return res.status(400).json({
                    error:"Unable to save purchase list"
                });
            }
            next();
        });
    });
};