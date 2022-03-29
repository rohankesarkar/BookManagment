const userModel = require('../Models/userModel');
const jwt = require("jsonwebtoken")
const validator = require('../Validator/validation');


// Post /register
const createUser = async function(req,res) {
    try {
        const body = req.body;
        
        const query = req.query;
        if(validator.isValidBody(query)) {
            return res.status(400).send({ status: false, msg: "Invalid parameters"});
        }

        const {title,name,phone,email,password,address} = body;

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

        }

        // Finally the registration of User is successful
        const userData = await userModel.create(body)
        res.status(201).send({ status: true, msg: userData})

    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}



// Post /login
const login = async function(req,res) {
    try {
        const body = req.body

        const query = req.query;
        if(validator.isValidBody(query)) {
            return res.status(400).send({ status: false, msg: "Invalid parameters"});
        }

        //Validate body
        if (!validator.isValidBody(body)) {
            return res.status(400).send({ status: false, msg: "Login body should not be empty" });
        }

        // email and password
        let email = req.body.email
        let password = req.body.password

        //Validate email
        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, msg: "Email id is required" });
        }

        // Validation of email
        if(!validator.isValidEmail(email)) {
            return res.status(400).send({ status: false, msg: "Email is not valid"});
        }

        //Validate password
        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, msg: "Password is required" });
        }

        // Validation of password
        if(!validator.isValidPassword(password)) {
            return res.status(400).send({ status: false, msg: "Invalid password"});
        }

        if(email && password) {
            let user = await userModel.findOne({email: email, password: password})

            if (user) {
                const Token = jwt.sign({
                    userId: user._id,
                    iat: Math.floor(Date.now() / 1000), //issue date
                    exp: Math.floor(Date.now() / 1000) + 60 * 60 //expiry date
                }, "Group38")  
                res.header('x-api-key', Token)

                res.status(200).send({ status: true, msg: "success", data: Token })
            } else {
                return res.status(400).send({ status: false, msg: "Invalid Credentials" })
            }
        } else {
            return res.status(400).send({ status: false, msg: "request body must contain  email and password" })
        }
    }
    catch (err) {
        console.log("This is the error :", err.message)
        return res.status(500).send({ msg: "Error", error: err.message })
    }
}


module.exports.createUser = createUser
module.exports.login = login