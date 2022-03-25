const userModel = require('../Models/userModel');
const userController = require('../Models/userModel');
const validator = require('../Validator/validation');

const createUser = async function(req,res) {
    try {
        const data = req.body;
        const {title,name,phone,email,password,address} = data;

        //Validate body
        if (!validator.isValidBody(body)) {
            return res.status(400).send({ status: false, msg: "User body should not be empty" });
        }

        //Validate title
        if (!validator.isValid(title)) {
            return res.status(400).send({ status: false, msg: "User title is required" });
        }

        // Validation of title
        if(!validator.isValidTitle(title)) {
            return res.status(400).send({ status: false, msg: "Invalid title"});
        }

        //Validate name
        if (!validator.isValid(name)) {
            return res.status(400).send({ status: false, msg: "User name is required" });
        }

        // Validate phone
        if(!validator.isValid(phone)) {
            return res.status(400).send({ status: false, msg: "User phone number is required"});
        }

        // Validation of phone number
        if(!validator.isValidNumber(phone)) {
            return res.status(400).send({ status: false, msg: "Invalid phone number"});
        }

        //Validate email
        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, msg: "User email is required" });
        }
        
        // Validation of email
        if(!validator.isValidEmail(email)) {
            return res.status(400).send({ status: false, msg: "Invalid email Id"});
        }

        //Validate password
        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, msg: "User password is required" });
        }

        // Validation of password
        if(!validator.isValidPassword(password)) {
            return res.status(400).send({ status: false, msg: "Invalid password"});
        }


        // Cheking duplicate Entry Of User 
        let duplicateEntries = await userModel.find();
        let duplicateLength = duplicateEntries.length

        if (duplicateLength != 0) {
            // Checking duplicate name
            const duplicateName = await userModel.findOne({ name: name });
            if (duplicateName) {
                return res.status(409).send({status: false, msg: "User Name already exists" });
            }

           // Checking duplicate phone
           const duplicatePhone = await userModel.findOne({ phone: phone });
           if (duplicatePhone) {
               return res.status(409).send({status: false, msg: "User phone number already exists" });
            }
            
            // Checking duplicate email
           const duplicateEmail = await userModel.findOne({ email: email });
           if (duplicateEmail) {
               return res.status(409).send({status: false, msg: "User emailId already exists" });
            }
            
            // Checking duplicate password
            const duplicatePassword = await userModel.findOne({ password: password });
           if (duplicatePassword) {
               return res.status(409).send({status: false, msg: "User password already exists" });
            }

            // Finally the registration of User is successful
            const userData = await userModel.create(data)
            res.status(201).send({ status: true, data: userData})

        }

    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}






module.exports.createUser = createUser