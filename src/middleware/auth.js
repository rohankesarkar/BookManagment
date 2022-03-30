const jwt = require("jsonwebtoken");
const bookModel = require("../Models/booksModel");
const validator = require("../Validator/validation");

const auth = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) {
      return res
        .status(400)
        .send({ Status: false, msg: "Token must be present" });
    }

    let decodedToken = jwt.verify(token, "Group38");
    if (!decodedToken) {
      return res.status(400).send({ status: false, msg: "Invalid token id" });
    }

    if ((userId = req.body.userId)) {
      if (decodedToken.userId != req.body.userId)
        return res
          .status(400)
          .send({ status: false, msg: "You are not authorised user" });
    }

    if ((bookId = req.params.bookId)) {
      const bookId = req.params.bookId;
      if (!(validator.isValid(bookId) && validator.isValidobjectId(bookId))) {
        return res.status(400).send({ status: false, msg: "BookId not valid" });
      }
      let book = await bookModel.findOne({ _id: req.params.bookId });
      if (decodedToken.userId != book.userId)
        return res
          .status(400)
          .send({ status: false, msg: "You are not authorised user b" });
    }

    next();
  } catch (err) {
    console.log("This is the error :", err.message);
    return res.status(500).send({ msg: "Error", error: err.message });
  }
};

module.exports.auth = auth





// const jwt = require('jsonwebtoken')

// const auth = function (req, res, next) {
//     try {
//         let token = req.headers['x-api-key']
//         if (!token) {
//             return res.status(401).send({ status: false, msg: "no authentication token" })
//         } else {
//             let decodeToken = jwt.verify(token, 'Group38')
//             if (decodeToken) {
//                 req.decodeToken = decodeToken
//                 next()

//             } else {
//                 res.status(401).send({ status: false, msg: "not a valid token" })
//             }
//         }

//     } catch (error) {
//         res.status(500).send({ status: false, msg: error })
//     }


// }
// module.exports.auth=auth