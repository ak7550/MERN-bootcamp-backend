const express = require('express');
const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const { getProductById, createProduct, getProduct, getAllUniqueCategories, getAllProducts, photo, removeProduct, updateProduct } = require("../controllers/product");

// all parameters
router.param("userId", getUserById);
router.param("productId", getProductById);


//actual routes
//auth routes
router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct);
// read routes
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo); // performance optimization

//delete route
router.delete("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, removeProduct);
//update route
router.put("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, updateProduct);

//listing route
router.get("/product", getAllProducts);
router.get("/products/categories", getAllUniqueCategories);
module.exports = router;