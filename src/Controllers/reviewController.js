const bookModel = require("../Models/booksModel");
const userModel = require("../Models/userModel");
const reviewModel = require("../Models/reviewModel");
const mongoose = require("mongoose");
const validator = require("../Validator/validation");

// Post review /books/:bookId
const bookReview = async function (req, res) {
  try {
    const params = req.params.bookId
        body = req.body
        const { reviewedBy, reviewedAt, rating, review } = body;

        if (!validator.isValidobjectId(params)) {
            return res.status(400).send({ status: false, message: "Invalid bookId." })
        }

        // Validate body
        if (!validator.isValidBody(body)) {
            return res.status(400).send({ status: false, message: 'Provide review body.' })
        }

        // Validate reviewedBy
        if (!validator.isValid(reviewedBy)) {
            return res.status(400).send({ status: false, message: "Reviewer's name is required" })
        }

        // Validate reviewedAt
        if(!validator.isValid(reviewedAt)) {
            return res.status(400).send({ status: false, message: "reviewedAt is required" })
        }

        // Validation of reviewedAt
        if(!validator.isValidDate(reviewedAt)) {
            return res.status(400).send({ status: false, message: "Validation of reviewedAt is required"})
        }
        
        // Validate rating
        if (!validator.isValid(rating)) {
            return res.status(400).send({ status: false, message: "Rating is required" })
        }
        
        //Validate rating between 1-5.
        if (!(rating > 0 && rating < 6)) {
            return res.status(400).send({ status: false, message: "Rating must be between 1 to 5." })
        }

        // Validate review
        if(!validator.isValid(review)) {
            return res.status(400).send({ status: false, message: "Review is required"})
        }


        const searchBook = await bookModel.findById({_id: params})
        if (!searchBook) {
            return res.status(404).send({ status: false, message: `Book does not exist by this ${params}.` })
        }

        //verifying the book is deleted or not
        if (searchBook.isDeleted === true) {
            return res.status(400).send({ status: false, message: "Book has been already deleted." })
        }
        body.bookId = searchBook._id;

        const saveReview = await reviewModel.create(body)
        const response = await reviewModel.findOne({ _id: saveReview._id }).select({__v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0 })
        return res.status(201).send({ status: true, data: response })
    } 
  catch (err) {
    console.log("This is the error :", err.message);
    return res.status(500).send({ msg: "Error", error: err.message });
  }
};

module.exports.bookReview = bookReview;
