const express = require('express');
const router = express.Router();

const userController= require("../controllers/userController")
const bookController = require("../Controllers/bookController")
const reviewController = require("../Controllers/reviewController")



router.post('/register', userController.createUser)



module.exports = router;