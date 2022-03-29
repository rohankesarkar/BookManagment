const express = require('express');
const router = express.Router();

const userController= require("../controllers/userController")
const bookController = require("../Controllers/bookController")
const reviewController = require("../Controllers/reviewController")



router.post('/register', userController.createUser)

router.post('/login', userController.login)

router.post('/books', bookController.createBook)

router.get('/books',bookController.getBook)

router.get('/books/:bookId',bookController.getBookWithReview)

router.put('/books/:bookId', bookController.updateBooks)

router.delete('/books/:bookId', bookController.deleteBook)

router.post('/books/:bookId/review', reviewController.bookReview)


module.exports = router;