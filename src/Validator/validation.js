// const validator = require("email-validator");
const mongoose = require("mongoose")

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false 
    return true;
}


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
    if (!(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(value.trim()))) {
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


module.exports.isValid = isValid
module.exports.isValidBody = isValidBody
module.exports.isValidTitle = isValidTitle
module.exports.isValidNumber = isValidNumber
module.exports.isValidEmail = isValidEmail
module.exports.isValidPassword = isValidPassword