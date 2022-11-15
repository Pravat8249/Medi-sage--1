const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

//-----------------------------------------------basic Validations-------------------------------------------------------------//

//check for the requestbody cannot be empty --
const isValidRequestBody = function (value) {
    return Object.keys(value).length > 0
}

//validaton check for the type of Value --
const isValid = (value) => {
    if (typeof value == 'undefined' || typeof value == null) return false;
    if (typeof value == 'string' && value.trim().length == 0) return false;
    if (typeof value != 'string') return false
    return true
}






//-------------------------------------------------API-1 [/register]--------------------------------------------------//

const createUser = async function (req, res) {
    try {
        let requestBody = req.body

        //validation for request body and its keys --
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: "invalid request parameters.plzz provide user details" })
            return
        }

        //Validate attributes --
        let {  name, email, phone, country,country_code } = requestBody

    
      

        if (!isValid(name)) {
            res.status(400).send({ status: false, message: "name is required" })
            return
        }

        //this will validate the type of name including alphabets and its property withe the help of regex.
        if (!/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/.test(name)) {
            return res.status(400).send({ status: false, message: "Please enter valid user name." })
        }

        //Email Validation --
        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "plzz enter email" })
        }
        const emailPattern = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})/       //email regex validation for validate the type of email.

        if (!email.match(emailPattern)) {
            return res.status(400).send({ status: false, message: "This is not a valid email" })
        }

        email = email.toLowerCase().trim()
        const emailExt = await userModel.findOne({ email: email })
        if (emailExt) {
            return res.status(409).send({ status: false, message: "Email already exists" })
        }


        //Phone Validations--
        if (!isValid(phone)) {
            return res.status(400).send({ status: false, message: "plzz enter mobile" })
        }

        //this regex will to set the phone no. length to 10 numeric digits only.
        if (!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(phone)) {
            return res.status(400).send({ status: false, message: "Please enter valid 10 digit mobile number." })
        }

        const phoneExt = await userModel.findOne({ phone: phone })
        if (phoneExt) {
            return res.status(409).send({ status: false, message: "phone number already exists" })
        }

        //for Country validation

        if (!isValid(country)) {
            res.status(400).send({ status: false, message: "Country is required" })
            return
        }

        //this will validate the type of country including alphabets and its property withe the help of regex.
        if (!/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/.test(country)) {
            return res.status(400).send({ status: false, message: "Please enter valid country name." })
        }
        if (!isValid(country_code)) {
            res.status(400).send({ status: false, message: "country Code is required" })
            return
        }

        //this will validate the type of country code including alphabets and its property withe the help of regex.
        if (!/^\+?\d+$/.test(country_code)) {
            return res.status(400).send({ status: false, message: "Please enter valid country code." })
        }
    

  //Creation of data--
        let saveData = await userModel.create(requestBody)
        return res.status(201).send({ status: true, message: "success", data: saveData })
    }

    //catch errors will throw whenever you skip something into your piece of code 
    //or did'nt handle error properly for those key-vales who has been in required format.
    catch (err) {
        return res.status(500).send({ status: "error", message: err.message })
    }
}



//------------------------------------------------API-2 [/loginUser]-------------------------------------------------------//

const loginUser = async function (req, res) {
    try {
        const data = req.body;
        if (!isValidRequestBody(data)) return res.status(400).send({ status: false, message: "Please enter  mail and password" })

        const { email, phone } = data

        //validation for login
        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "please enter email" })
        }

        //Email format Validation--
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.toLowerCase().trim())) {
            return res.status(400).send({ status: false, message: "please enter valid email address" })
        }
        //email = email.trim()

        if (!isValid(phone)) {
            return res.status(400).send({ status: false, message: "please enter phone number" })
        }
        //pasword length should be min 8 and max 15 characters --
        if (!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(phone)) {
            return res.status(400).send({ status: false, message: "Please enter valid 10 digit mobile number." })
        }

        //find data from userModel--
        let user = await userModel.findOne({ email, phone });
        if (!user)
            return res.status(404).send({ status: false, message: "Please enter email address and phone" });

        //token generation--
        let token = jwt.sign(
            {
                userId: user._id.toString(),
                //this is the payload data to jwt token it will validate the issue at and exp time with particular userId. 
            },
            "medi-sage",{expiresIn: "3600s"}
        );
        
        return res.status(200).send({ status: true, message: "token successfully Created", token: token });
    }
    catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: "error", message: err.message })
    }
}

//------------------------------------------------API-3 [/Get Students]-------------------------------------------------------//

const getStudents = async function (req, res) {

    try {

        let data = req.query;
        let filter = { $and: [{ isDeleted: false,  ...data }] };
        // console.log(filter);
        if (!(data)) res.status(400).send({ status: false, msg: "please enter your query" })
        let studentPresent = await userModel.find(filter)
        if (studentPresent.length === 0) {
            res.status(404).send({ status: false,msg: " your query does not match with any student" })
        } else {
            res.status(200).send({ status: true, data: studentPresent })
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}






module.exports = { loginUser, createUser,getStudents };