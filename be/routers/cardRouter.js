const express = require('express');
const router = express.Router();
const bcrypt_helper = require('../helper/bcrypt_helper');
const bcrypt = require('bcrypt')

const AuthUserModelJOI = require('../models/authUserModelJoi');
const UserModel = require('../models/authUserModel');
const cardModelJOI = require('../models/cardModelJoi');
const verify_logged_in = require('../middleware/verify_logged_in');
const CardModel = require('../models/cardModel');
const {generateNumber} = require('../models/cardModelJoi');
const { request, response } = require('express');
const { find } = require('lodash');
const { findOne } = require('../models/authUserModel');
const CardModelJOI = require('../models/cardModelJoi');

// http://localhost:8080/api/card/
router.post('/',verify_logged_in,async (request,response) => {
    try{
    const cardModel = new cardModelJOI(request.body);
    const JOIModel = cardModel.ValidatePost().value;
    const errors = JOIModel.error;
    if(errors)
         return response.status(400).send(errors);
    let card = new CardModel ({
        id: await JOIModel.generateNumber(),
        businessName: JOIModel.businessName,
        description: JOIModel.description,
        address: JOIModel.address,
        phoneNumber: JOIModel.phoneNumber,
        urlImg: JOIModel.urlImg,
        user_id: request.user.object._id
    })
    await card.save();
    response.status(200).send(card);
    }
    catch(err)
    {
        response.status(500).send(err.message);
    }  
})
router.get('/cards',verify_logged_in, async(request,response) => {
    try{ 
        const cards = await CardModel.find({"user_id":request.user.object._id});
        if(cards.length > 0 )
            response.status(202).send(cards);
        else
            response.status(404).send("No cards found")
    }
    catch(err)
    {
        response.status(500).send(err.message); 
    }
})

// http://localhost:8080/api/card/:id
router.get('/:id',verify_logged_in,async(request,response) => {
    try{
        const id = request.params.id;
        const card = await CardModel.findOne({"_id": id, user_id:request.user.object._id})
        if(!card)
            return response.status(404).send("The Card with the given ID was not found")
        return response.send(card).status(202);
    }
    catch(err){
        response.status(500).send(err.message); 
    }
})
// http://localhost:8080/api/card/:id
router.put('/:id',verify_logged_in,async(request,response) => {
    try{
        const cardModel = new cardModelJOI(request.body);
        const JOIModel = cardModel.ValidatePut();
        const errors = JOIModel.error;
        if(errors)
             return response.status(400).send(errors);
        const updateCard = await CardModel.updateOne({"_id": request.params.id,"user_id":request.user.object._id},JOIModel.value)
        if (updateCard.matchedCount === 0)
        response.sendStatus(404);
    
    //  - [Success] return status 200
    else
        response.status(200).json({modified: updateCard.modifiedCount});
    }
    catch(err)
    {
        response.status(500).send(err.message); 
    }
})

// http://localhost:8080/api/card/:id
router.delete('/:id', verify_logged_in, async(request,response) => {
    try{
       const card= await CardModel.deleteOne({"_id": request.params.id,"user_id": request.user.object._id});
       if(!card)
       return response.status(404).send("The Card with the given ID was not found");

   return response.send("The card is deleted").status(200);
    }
    catch(err)
    {
        response.status(500).send(err.message); 
    }
})
// http://localhost:8080/api/card/cards

module.exports = router;