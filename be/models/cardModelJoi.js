const JOI = require("joi");
const { default: mongoose } = require("mongoose");
const CardModel = require("./cardModel");
const _ = require('lodash');

class CardModelJOI {
    // 1. Constructor that accepts an object with the authUserModel properties
    constructor(object) {
        this.id = object.id;
        this.businessName = object.businessName; 
        this.description = object.description;
        this.address = object.address;
        this.phoneNumber = object.phoneNumber;
        this.urlImg = object.urlImg;
        this.user_id = object.user_id;
    }

    static #validaetCardBase = {
        id: JOI.number().integer(),
        businessName: JOI.string().required().min(2).max(255),
        description: JOI.string().required().min(2).max(1024),
        address: JOI.string(),
        phoneNumber: JOI.string().min(9).max(10).required().regex(/^0[2-9]\d{7,8}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
        urlImg: JOI.string().min(11).max(1024).allow(null).allow('').empty(null).default("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"),
        user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'users' }
    }
    static #postValidate = JOI.object( CardModelJOI.#validaetCardBase );
    static #putValidate = JOI.object( CardModelJOI.#validaetCardBase );
    static #deleteValidate = JOI.object( CardModelJOI.#validaetCardBase );
    // Validate the JOI schema
    ValidatePost() {
        const result = CardModelJOI.#postValidate.validate(this, {abortEarly: false});
        return result;
    }       
    ValidatePut(){
        const result = CardModelJOI.#putValidate.validate(this, {abortEarly: false});
        return result;
    }
    Validatedelete(){
        const result = CardModelJOI.#deleteValidate.validate(this, {abortEarly: false});
        return result;
    }

    
    async generateNumber() {
    while (true) {
      let randomNumber = _.random(1000, 999999);
      let card = await CardModel.findOne({id: randomNumber });
      if (!card) return String(randomNumber);
    }
    }
}

module.exports = CardModelJOI;
exports.generateNumber = this.generateNumber;