const AuthorModel = require("../models/authorModel")
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const validator = require('../Middleware/validation')

//============================================create author============================================================***

const createAuthors = async function (req, res) {
    try {
        let data = req.body;
        if (Object.keys(data).length< 0) {
            return res.status(400).send({ status: false, msg: "body can not be empty" })
        }

        const {fname,lname,title,email,password} = data
            // We have handled edge cases here
            if(!validator.isValid(fname)){
                return res.status(400).send({status:false, msg:"full Name is required"})
            }
            if(!validator.isValid(lname)){
                return res.status(400).send({status:false, msg:"last Name is required"})
            }
            if(!validator.isValid(title)){
                return res.status(400).send({status:false, msg:"title is required"})
            }
            
        if (!(title.trim() === "Mr" ||title.trim() === "Miss" ||title.trim() === "Mrs")) {
            return res.status(400).send({status:false, msg:"title should be this[Mr, Mrs,Miss]"})
        }

            if(!validator.isValid(password)){
                return res.status(400).send({status:false, msg:"password is required"})
            }
            if(!validator.isValid(email)){
                return res.status(400).send({status:false, msg:"email is required"})
            }
            if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))) {
                return res.status(400).send({ status: false, message: 'email should be a valid email address' })
            }
            let checkEmail = await AuthorModel.findOne({ email:email })
            if (checkEmail) return res.status(400).send({ msg: "Email already exist" })

         
            //  here the model is created in database
            let savedDate = await AuthorModel.create(data)
            res.status(201).send({ status: true, data: savedDate })

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
}
 
//================================================login author====================================================***

const login = async function (req, res) {

    let userName = req.body.email;
    let pass = req.body.password;

    if(!validator.isValid(password)){
        return res.status(400).send({status:false, msg:"password is required"})
    }
    if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))) {
        return res.status(400).send({ status: false, message: 'email should be a valid email address' })
    }

    let user = await AuthorModel.findOne({ email: userName, password: pass });
    if (!user)
        return res.send({ status: false,msg: "username or the password is not correct"});

    let token = jwt.sign(
        {
            authorId: user._id.toString(),
            country: "India",
            organisation: "FUnctionUp",
        },
        "bloggers"
    );
    res.setHeader("x-api-key", token);
    res.send({ status: true, data: token });
};


module.exports = {createAuthors,login};
