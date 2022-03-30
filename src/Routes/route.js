const express = require('express');
const router = express.Router();

const userController= require("../controllers/userController")
const bookController = require("../Controllers/bookController")
const reviewController = require("../Controllers/reviewController")
const auth = require("../middleware/auth")


// User Controller
router.post('/register', userController.createUser)

router.post('/login', userController.login)

// Book Controller
router.post('/books',auth.auth, bookController.createBook)

router.get('/books',auth.auth, bookController.getBook)

router.get('/books/:bookId',auth.auth, bookController.getBookWithReview)

router.put('/books/:bookId',auth.auth, bookController.updateBooks)

router.delete('/books/:bookId',auth.auth, bookController.deleteBook)

// Review Controller
router.post('/books/:bookId/review', reviewController.bookReview)

router.put('/books/:bookId/review/:reviewId', reviewController.updateReview)

router.delete('/books/:bookId/review/:reviewId', reviewController.deleteReview)


module.exports = router;