const express = require('express');
const router = express.Router();
const bcrypt_helper = require('../helper/bcrypt_helper');
const bcrypt = require('bcrypt')

const AuthUserModelJOI = require('../models/authUserModelJoi');
const UserModel = require('../models/authUserModel');
const { Router, request, response } = require('express');
const verify_logged_in = require('../middleware/verify_logged_in');

// Register
// Post http://localhost:8080/api/auth/register
router.post("/register", async (request, response) => {
    try{
        // 1. Validate using JOI 
        const userModel = new AuthUserModelJOI(request.body);
        const JOIModel = userModel.validateRegisreration().value;
        const errors = JOIModel.error;
        if (errors) 
            return response.status(400).send(errors);

        // 2. Hash the password and replace it in the 'userModel' object
        JOIModel.password =await bcrypt_helper.hash(JOIModel.password);

        // 3. Create and save JOI model in the db 
        const user = new UserModel(JOIModel);
        await user.save();

        // 4. Create token to be returned to the client
        //userModel.token=jwt.sign({user},"SuchAPerfectDay",{expiresIn:"5m"});
        const token = bcrypt_helper.jwtSign(user); // Instruct the client to store a local "secure" cookie
        response.cookie("token", token, bcrypt_helper.cookieOptions);

        // 5. Remove the password so it's not returned to the client
        delete user.password;

        //6. send the simplidied model back to the client.
        response.status(201).send(`Successfuly registerd ${user.username}, the token is: ${token}`);
    }
    catch(err)
    {
        response.status(500).send(err.message);
    }
})

// login
// http://localhost:8080/api/auth/login
router.post("/login", async (request, response) => {
    try{
        // 1. Validate using JOI 
        const userModel = new AuthUserModelJOI(request.body);
        const JOIModel = userModel.validateRegisreration().value;
        const errors = JOIModel.error;
        if (errors) 
            return response.status(400).send(errors);

        // 2. Check 'usename' and hashed 'password' match
        const loggedInUser = await UserModel.findOne({
            username: JOIModel.username,}).exec();
        const hashedPassword = await bcrypt.compare(request.body.password,loggedInUser.password);
        if(!loggedInUser && !hashedPassword)
        {
            return response.status(401).json("UnAuthorized");
        }

        // 4. Create token to be returned to the client
        const token = bcrypt_helper.jwtSign(loggedInUser); // Instruct the client to store a local "secure" cookie
        response.cookie("token", token, bcrypt_helper.cookieOptions);

        //6. send the simplidied model back to the client.
        response.status(201).send(`Successfuly loged in ${loggedInUser.username}, The token is: ${token} , The Biz value is ${loggedInUser.biz} `);
    }
    catch(err)
    {
        response.status(500).send(err.message);
    }
})

// http://localhost:8080/api/auth/me
router.get('/me',verify_logged_in,async (request,response) => {
    try{
        const user = await UserModel.findOne({_id:request.user.object._id})
        response.status(200).send(user);
    }
    catch(err)
    {
        response.status(500).send(err.message);
    }
})
module.exports = router;

