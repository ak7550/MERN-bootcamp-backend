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

exports.getAllUserInfo=(req,res)=>{
    User.find({},function(err, users) {
        if (!users || err) { // if the user doesn't exist in our db or any other kind of error while searching into the db (that error may store in err argument)
            return res
                .status(503)
                .json({
                    error: "Requested information not found"
                });
        }
        // there's no error, and the arr is not empty
        let userJson={
            users:[]
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