// const validator = require("email-validator");
const mongoose = require("mongoose")

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false 
    if (typeof value === 'number' && value.toString().trim().length === 0) return false
    return true;
}
//  && typeof value === ['string']

const isValidBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
}

const isValidTitle = function (title) {
    return ['Mr', 'Mrs', 'Miss'].indexOf(title) !== -1
}

const isValidNumber = function (value) {
    if (!(/^(\+\d{1,3}[- ]?)?\d{10}$/.test(value.trim()))) {
        return false
    }
    return true
}

const isValidEmail = function (value) {
    if (!(/^[a-z0-9+_.-]+@[a-z0-9.-]+$/.test(value.trim()))) {
        return false
    }
    return true
}

const isValidPassword = function(value) {
    if(!(/^[a-zA-Z0-9'@&#.\s]{8,15}$/.test(value.trim()))) {
        return false
    }
    return true
}

const isValidobjectId = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId)
}

const isValidateISBN = function(value) {
    if(!(/^(?:ISBN(?:-1[03])?:? )?(?=[-0-9 ]{17}$|[-0-9X ]{13}$|[0-9X]{10}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?(?:[0-9]+[- ]?){2}[0-9X]$/.test(value.trim()))) {
        return false
    }
    return true
}

const isValidDate = (date) => {
    //instead we can use date regex
    const specificDate = new Date(date).setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);
    return specificDate < today;
}





module.exports.isValid = isValid
module.exports.isValidBody = isValidBody
module.exports.isValidTitle = isValidTitle
module.exports.isValidNumber = isValidNumber
module.exports.isValidEmail = isValidEmail
module.exports.isValidPassword = isValidPassword
module.exports.isValidobjectId = isValidobjectId
module.exports.isValidateISBN = isValidateISBN
module.exports.isValidDate = isValidDate