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
}

exports.signout = (req, res) => {
    res.json({
        message: "user signout!!"
    });
    console.log("signed out");
}

exports.signin = (req, res) => {
    const { email, password } = req.body;
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
    User.findOne({ email }, (err, user) => {
        if (err) {
            return res
                .status(400)
                .json({
                    error: "400 BAD REQUEST, Database is unable to find request information."
                })
        }
        if (!user.authenticate(password)) {
            return res
                .status(401)
                .json({
                    error: "email and password donot match"
                })
        }
        //signin the user, give the user required token
        const token = jwt.sign({ _id: user._id }, process.env.SECRET);
        // put token in cookie, use date accordingly
        res.cookie("token", token, { expire: new Date() + 9999 });

        //send respond to front end
        const { _id, name, email, role } = user;
        return res.json({
            token,
            user: { _id, name, email, role }
        });
    });
}