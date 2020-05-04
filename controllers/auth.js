require('dotenv').config();
const User = require("../models/user");
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJwt = require("express-jwt");
// signup method will save the user information into our database
exports.signup = (req, res) => {
    console.log("Request body: ", req.body);
    //use of validationResult
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // i dont want my code to be executed after that.
        return res.status(422).json({
            err: errors.array()[0].msg,
            parameter: errors.array()[0].param,
            location: errors.array()[0].location,
            // errors is an object gives us an array.
        });
    }
    const user = new User(req.body);
    user.save((err) => {
        // console.log(err);
        if (err)
            res.status(400).json({
                err: "user is not been able to get stored in DB"
            });
        else
            res.json({
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                completeName: user.name,
                email: user.email,
                // password: user.password,
                // ecryptedPassword: user.encryptedPassword,
                // salt: user.salt
            }); // only one thing as a response can be passed to the client, so else part is necessary as if gets executed it's gonna show an error while executing or sending another response to the client
    });
    console.log(`End of signing up method for the given info of ${req.body} by converting it into ${user}`);
};

exports.signout = (req, res) => {
    res
        .clearCookie("token")
        .status(200)
        .json({
            message: "User signedout!!"
        });
    console.log("signed out");
};

exports.signin = (req, res) => {
    const errors = validationResult(req);
    const { email, password } = req.body;
    if (!errors.isEmpty()) // if there's any error in req
    {
        // i dont want my code to be executed after that.
        return res.status(422).json({
            err: errors.array()[0].msg,
            parameter: errors.array()[0].param,
            location: errors.array()[0].location,
            // errors is an object gives us an array.
        });
    }
    User.findOne({ email }, (err, user) => {
        if (!user || err) { // if the user doesn't exist in our db or any other kind of error while searching into the db (that error may store in err argument)
            return res
                .status(503)
                .json({
                    error: "Requested information not found"
                });
        }
        if (!user.authenticate(password)) { // if the password doesnot match
            return res
                .status(401)
                .json({
                    error: "email and password donot match"
                });
        }
        //signin the user, give the user required token
        const token = jwt.sign({ _id: user._id }, process.env.SECRET);
        // put token in cookie, use date accordingly
        res.cookie("token", token, { expire: Date.now() + 9999 });
        //"token" is the name of the cookie
        //send respond to front end
        const { _id, name, email, role } = user;
        res.status(200)
            .json({
                token,
                user: { _id, name, email, role }
            });
        console.log(`End of signing in method for the given info of ${req.body} by converting it into ${user} the passed response is not possible to log out.And the passed token is:\n ${token}\nComplete response is: ${res} and response body is: ${res.body}. cookie is: ${res.cookie}`);
        // cookie is a call back function, understood from console
    });
};

//protected routes, we will use if the user is signedin or authenticated
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    // works on the request handler
    userProperty: "auth" //user's personal authentication
    //expressJwt already having a next(); covered up for us, so we dont need to write next() once again into our custom middlewares.
});

// custom middlewares
exports.isAuthenticated = (req, res, next) => {
    // in front end we have set a property known as profile, is been set if the user is loged in. How does it's happening, we'll think of it in front end part
    // profile clarifies the user is signedin, req.auth clarifies the user is authenticated
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!checker) {
        return res
            .status(403)
            .json({
                error: "Access Denied!",
                message: `${req.profile.name} is not Authenticated`
            })
    }
    console.log(`${req.profile.name} is Authenticated`);
    next();
};
exports.isAdmin = (req, res, next) => {
    // if the user profile role is 0, that means he is a regular user, if it's 1 then he's an admin
    id(req.profile.role === 0)
    {
        return res
            .status(403)
            .json({
                error: "You are not an admin\n Access Denied!!",
                message: `${req.profile.name} is not an Admin`
            })
    }
    console.log(`${req.profile.name} is an Admin`);
    next();
};