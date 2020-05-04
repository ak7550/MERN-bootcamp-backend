const express = require('express');
const router = express.Router();
const {getUserById,getUser,getAllUserInfo}=require("../controllers/user");
const {isAdmin,isAuthenticated, isSignedIn}=require("../controllers/auth");

router.param("userId",getUserById);
router.get("/user/:userId", isSignedIn,isAuthenticated ,getUser);
// router.get("/users",getAllUserInfo);

module.exports=router; //last line, passing everything to app.js