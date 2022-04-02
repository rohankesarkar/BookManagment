const bookModel =require("../Models/booksModel");
const userModel =require("../Models/userModel");
const reviewModel =require("../Models/reviewModel");
const mongoose = require("mongoose");
const validator = require('../Validator/validation');



//  ************************************************************* POST /books ************************************************************* //

const createBook = async function(req,res) {
    try {
        const body =req.body;

        const query = req.query;
        if(validator.isValidBody(query)) {
            return res.status(400).send({ status: false, msg: "Invalid parameters"});
        }

        //Validate body
        if (!validator.isValidBody(body)) {
            return res.status(400).send({ status: false, msg: "body should not be empty" });
        }

        const {title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt} = body;

        //Validate title
        if (!validator.isValid(title)) {
            return res.status(400).send({ status: false, msg: "Book title is required" });
        }

        //Validate excerpt
        if (!validator.isValid(excerpt)) {
            return res.status(400).send({ status: false, msg: "Book excerpt is required" });
        }

        //Validate userId
        if (!validator.isValid(userId)) {
            return res.status(400).send({ status: false, msg: "userId is required" });
        }

        // Validation of userId
        if(!validator.isValidobjectId(userId)) {
            return res.status(400).send({ status: false, msg: "Invalid userId"});
        }

        //Validate ISBN
        if (!validator.isValid(ISBN)) {
            return res.status(400).send({ status: false, msg: "ISBN is required" });
        }

        // Validation of ISBN
        if(!validator.isValidateISBN(ISBN)) {
            return res.status(400).send({ status: false, msg: "ISBN validation is required"});
        }

        //Validate category
        if (!validator.isValid(category)) {
            return res.status(400).send({ status: false, msg: "category is required" });
        }

        //Validate subcategory
        if (!validator.isValid(subcategory)) {
            return res.status(400).send({ status: false, msg: "subcategory is required" });
        }

        //Validate releasedAt
        if (!validator.isValid(releasedAt)) {
            return res.status(400).send({ status: false, msg: "releasedAt is required" });
        }

        // Validation of releasedAt
        if(!validator.isValidDate(releasedAt)) {
            return res.status(400).send({ status: false, msg: "Validation of releasedAt is required"})
        }


        // Cheking duplicate Entry Of Book 
        let duplicateEntries = await bookModel.find();
        let duplicateLength = duplicateEntries.length

        if (duplicateLength != 0) {
            // Checking duplicate title
            const duplicateTitle = await bookModel.findOne({ title: title });
            if (duplicateTitle) {
                return res.status(400).send({status: false, msg: `${title} title already exists` });
            }

            // Checking duplicate ISBN
            const duplicateISBN = await bookModel.findOne({ ISBN: ISBN });
            if (duplicateISBN) {
                return res.status(400).send({status: false, msg: `${ISBN} ISBN already exists` });
            }
        }

        let user = await userModel.findById(userId);
        if(!user) {
            return res.status(400).send({ status: false, msg: "UserId not found"})
        }


        const bookData = {
            title,
            excerpt,
            userId,
            ISBN,
            category,
            subcategory,
            reviews,
            releasedAt: releasedAt ? releasedAt: "releasedAt is required",
        };

        let savedBook = await bookModel.create(bookData);
     return  res.status(201).send({status: true, msg: "New book created", data: savedBook})
    }
    catch (err) {
        console.log("This is the error :", err.message)
        return res.status(500).send({ msg: "Error", error: err.message })
    }
}

module.exports.createBook = createBook





// ************************************************************* GET /books ************************************************************* //

const getBook = async function (req, res) {
    try {
        // const queryParams = req.query;

        const body = req.body;
        if(validator.isValidBody(body)) {
            return res.status(400).send({ status: false, msg: "Body must not be present"})
        }

        let filter = {
            isDeleted: false
            // deletedAt: null
        }
        
            if(req.query.userId) {
                if(!(validator.isValid(req.query.userId) && validator.isValidobjectId(req.query.userId))) {
                    return res.status(400).send({status: false, msg: "UserId not valid"})
                }
                filter["userId"] = req.query.userId
            }

            if(req.query.category) {
                if(!validator.isValid(req.query.category)) {
                    return res.status(400).send({status: false, msg: "Book Category not valid"})
                }
                filter["category"] = req.query.category.trim()
            }

            if(req.query.subcategory) {
                if(!(validator.isValid(req.query.subcategory))) {
                    return res.status(400).send({status: false, msg: "subcategory not valid"})
                }
                filter["subcategory"] = req.query.subcategory.trim()
            }
                    
        

        let bookData = await bookModel.find(filter).select({_id: 1, title: 1, excerpt: 1, userId: 1, category: 1,reviews: 1, releasedAt: 1 });
        
        const bookDetail = bookData.sort(function(a,b) {
            if(a.title.toLowerCase() < b.title.toLowerCase()) { return -1 };
            if(a.title.toLowerCase() > b.title.toLowerCase()) { return 1 };
            return 0;
        })
        if(bookData.length > 0) {
            return res.status(200).send({status:true,count: bookDetail.length,message: 'Books list', data:bookDetail})
        } else {
            return res.status(404).send({ status: false, msg: "Book not found"})
        }
        
    } catch (err) {
        console.log("This is the error :", err.message)
        return res.status(500).send({ msg: "Error", error: err.message })
    }
}

module.exports.getBook = getBook





// *********************************************************** GET /books/:bookId ***********************************************************//

const getBookWithReview = async function(req,res) {
    try {
        const _id = req.params.bookId;

        // Book Id not valid
        if(!validator.isValidobjectId(_id)) {
            return res.status(400).send({status:false, msg:"BookId is not valid"})
        }

        // Body must not be present
        const body = req.body;
        if(validator.isValidBody(body)) {
            return res.status(400).send({ status: false, msg: "Body must not be present"})
        }

        // Query must not be present
        const query = req.query;
        if(validator.isValidBody(query)) {
            return res.status(400).send({ status: false, msg: "Invalid parameters"});
        }

        if (Object.keys(_id).length === 0) {
            return res.status(400).send({ status: false, msg: "Invalid request" });
        }


        // Book Details with Book Id
        let bookDetails = await bookModel.findOne({ _id, isDeleted: false });
        if (!bookDetails) {
            return res.status(404).send({ status: false, message: "No book found" });
        }

        const {title,excerpt,userId,ISBN,category,subcategory,releasedAt,deletedAt,isDeleted,reviews,createdAt,updatedAt} = bookDetails;
        
        let reviewData = await reviewModel.find({ bookId: _id, isDeleted: false });

        // const book = {_id,title,excerpt,userId,category,subcategory,isDeleted,reviews: reviewData.length,deletedAt,releasedAt,createdAt,updatedAt,reviewsData: reviewData};
        const data = bookDetails.toObject();
        data['reviewsData'] = reviewData

        return res.status(200).send({ status: true, data:data})
    }
    
    catch (err) {
        console.log("This is the error :", err.message)
        return res.status(500).send({ msg: "Error", error: err.message })
    }
}

module.exports.getBookWithReview = getBookWithReview





// ********************************************************** PUT /books/:bookId ********************************************************** //

// PUT /books/:bookId  - update
const updateBooks = async function (req, res) {
    try {
        const updateBookData = {}
    let bookId = req.params.bookId
    if(!bookId) return res.status(400).send({status:false, msg:"bookId is required"})

    // Query must not be present
    const query = req.query;
    if(validator.isValidBody(query)) {
        return res.status(400).send({ status: false, msg: "Invalid parameters"});
    }

    let { title, excerpt, releasedAt, ISBN, subcategory } = req.body

    
    if(title.trim().length == 0) return res.status(400).send({status:false, msg:"Please entre  title"})
    if(excerpt.length == 0) return res.status(400).send({status:false, msg:"Please entre  excerpt"})
    if(subcategory.length == 0) return res.status(400).send({status:false, msg:"Please entre title"})



        let titleExist = await bookModel.findOne({ title: title })
    if (titleExist) return res.status(400).send({ status: false, msg: "title exist already" })

     

    if(!validator.isValidateISBN(ISBN)) {
        return res.status(400).send({ status: false, msg: "ISBN validation is required"});
    }
    
    
    let isbnExist = await bookModel.findOne({ ISBN: ISBN })
    if (isbnExist) return res.status(400).send({ status: false, msg: "ISBN exist already" })

    let data = await bookModel.findById(bookId)
    if (!data.isDeleted == false){
        return res.status(404).send({ status: false, msg: "data is already deleted"})
 }
 if (subcategory) {
    let dbsubcategory = data.subcategory;
    subcategory = [...dbsubcategory,subcategory];
    subcategory = subcategory.filter((val, index, arr) => arr.indexOf(val) == index)
    req.body.subcategory = subcategory

}
// if(subcategory) {
//     if(!Object.prototype.hasOwnProperty.call(updateBookData, '$addToSet')) updateBookData['$addToSet']={}
    
//     if(Array.isArray(subcategory)){
//         updateBookData['$addToSet']['subcategory'] = {$each: [...subcategory]}
//     }
//     if(typeof subcategory === "string") {
//         updateBookData['addToSet']['subcategory'] =subcategory
//     }
// }


    let updatedBook = await bookModel.findByIdAndUpdate({_id:bookId, isDeleted:false}, req.body,{new:true})
     return res.status(200).send({status:true, data:updatedBook})

}
    catch (err) {
        console.log("This is the error :", err.message)
        return res.status(500).send({ msg: "Error", error: err.message })
    }
}

module.exports.updateBooks = updateBooks



// const updateBooks = async function (req, res) {

// try {
//     let filter = {
//         _id: req.params.bookId,
//         isDeleted: false,
//         userId: req.decodeToken._id
//     }
//     let update = {}

//     if (!validator.isValidBody(req.body)) {
//         return res.status(400).send({ status: false, msg: 'body is empty' })

//     }
//     const book = await bookModel.findOne({ _id: _id, isDeleted: false })

//     if (!book) {
//         return res.status(404).send({ status: false, msg: `Book not found` })
//     }

//     if (book.userId.toString() !== req.decodeToken._id) {
//         return res.status(401).send({ status: false, msg: `Unauthorized access!` });

//     }
//     let { title, excerpt, releasedAt, ISBN } = req.body

//     if (title) {
//         if (!validator.isValid(title)) {
//             return res.status(400).send({ status: false, msg: 'title is not valid' })
//         }
//         update['title'] = title
//     }

//     if (excerpt) {
//         if (!validator.isValid(excerpt)) {
//             return res.status(400).send({ status: false, msg: 'excerpt is not valid ' })
//         }
//         update['excerpt'] = excerpt
//     }

//     if (ISBN) {
//         if (!validator.isValid(ISBN)) {
//             return res.status(400).send({ status: false, message: 'ISBN is not valid ' })
//         }
//         update['ISBN'] = ISBN
//     }

//     if (releasedAt) {
//         if (!validator.isValid(releasedAt)) {
//             return res.status(400).send({ status: false, message: 'releasedAt is not valid value ' })
//         }
//         if (!validator.isValidDate(releasedAt)) {
//             return res.status(400).send({ status: false, message: ' Date is not in the form of \"YYYY-MM-DD\" ' })
//         }
//     }

//     let updatedBook = await bookModel.findOneAndUpdate(filter, update, { new: true })
//     if (updatedBook) {
//         return res.status(200).send({ status: true, message: "success", data: updatedBook })
//     }

// } catch (err) {
//     console.log("This is the error :", err.message)
//     res.status(500).send({ msg: "Error", error: err.message })
// }
// }

// module.exports.updateBooks = updateBooks





// ********************************************************** DELETE /books/:bookId ********************************************************** //
// /books/:bookId
const deleteBook = async function(req,res){
    try{
        const bookId = req.params.bookId
           //Validate id
           if (!validator.isValidBody(bookId)) {
            return res.status(400).send({ status: false, msg: " book Id not present" });
          }

          if(!(validator.isValid(bookId) && validator.isValidobjectId(bookId))) {
            return res.status(400).send({status: false, msg: "BookId not valid"})
        }

          let data =await bookModel.findById(bookId)
          if(data.isDeleted == true){
              return res.status(400).send({ status: false, msg: "This book is already deleted" })
          }
          
          if(data.isDeleted == false){
            //   let date = moment().format('YYYY-MM-DD[T]HH:mm:ss')
              await bookModel.findByIdAndUpdate({ _id: bookId, isDeleted: false }, { isDeleted: true, deletedAt: new Date() }, { new: true, upsert:true })
              return res.status(200).send({ status: true, msg: "Book deleted successfully" })
            }
        }
        catch (err) {
        console.log("This is the error :", err.message)
        return res.status(500).send({ msg: "Error", error: err.message })
    }
  }

module.exports.deleteBook = deleteBook




// const deleteBook = async function(req,res){
// try {

//     if (!(validator.isValid(req.params.bookId) && validator.isValidobjectId(req.params.bookId))) {
//         return res.status(400).send({ status: false, msg: "bookId is not valid" })
//     }

//     let filter = {
//         isDeleted: false,
//         _id: req.params.bookId,
//         userId: req.decodeToken._id
//     }
//     const book = await bookModel.findOne({ _id: req.params.bookId, isDeleted: false })

//     if (!book) {
//         return res.status(404).send({ status: false, message: `Book not found` })
//     }

//     if (book.userId.toString() !== req.decodeToken._id) {
//         return res.status(401).send({ status: false, message: `Unauthorized access!` });

//     }
//     let deletedBook = await bookModel.findOneAndUpdate(filter, { isDeleted: true, deletedAt: new Date() })
//     if (deletedBook) {
//         return res.status(200).send({ status: true, msg: "book is successfully deleted" })
//     }
// } catch (err) {
//     console.log("This is the error :", err.message)
//     res.status(500).send({ msg: "Error", error: err.message })
// }
// }



// module.exports.deleteBook = deleteBook


////////////////////////////////////////////////////////// END OF BOOK CONTROLLER //////////////////////////////////////////////////////////////
