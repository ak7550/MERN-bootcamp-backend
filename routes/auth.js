const express = require('express');
const router = express.Router();
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");
const { check } = require('express-validator');

router.post("/signup", [
    check("name")
        .isLength({ min: 3 }).withMessage(' User name must be at least 3 chars long'),
    check("email")
        .isEmail().withMessage('Valid email is required'),
    check("password")
        .isLength({ min: 3 }).withMessage(`Password needs to be atleast 3 chars long `)
    // .matches(/\d/).withMessage('must contain a number')
    // .matches(/(?=.*[A-Z])/).withMessage('Password needs to have at least one capital letter ')
    // .matches(/(?=.*[a-z])/).withMessage('Password needs to have at least one small letter ')
    // .matches(/(?=.*[!@#$&*])/).withMessage('Password needs to have a special character ')
    // .not().isIn(['abc', 'password', 'god', 'abc',]).withMessage('Do not use a common word as the password')
    // think of neglecting [], {},<>,(),+=_-^% from password, username and password should not be same
], signup); // how to check if there's any capital and small letter combination or not, use regex making a custom validation


router.post("/signin", [
    check("email")
        .isEmail().withMessage('Valid email is required'),
    check("password")
        .isLength({ min: 3 }).withMessage(`Password needs to be atleast 3 chars long `) // just some basic checking in the time of signin, we will authenticate the information from stored db info
], signin); // how to check if there's any capital and small letter combination or not, use regex making a custom validation


router.get("/signout", signout);

router.get("/testroute", isSignedIn, (req, res) => {
    res
        // .send("A protected route")
        .status(200)
        .json(req.auth) //response if the user is signed in
});
module.exports = router;

