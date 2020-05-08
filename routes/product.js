const router = require("express").Router;

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const { getProductById } = require("../controllers/product");

// all parameters
router.param("userId",getUserById);
router.param("productId",getProductById);


//actual routes

module.exports = router;