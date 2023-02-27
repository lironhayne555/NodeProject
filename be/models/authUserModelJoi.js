const Joi = require("joi");
const JOI = require("joi");

class AuthUserModelJOI {
    // 1. Constructor that accepts an object with the authUserModel properties
    constructor(object) {
        this.username = object.username;
        this.email = object.email;
        this.password = object.password;
        this.biz = object.biz;
    }

    // The common domaintor of validation for 2 or more endpoint validations
    static #baselineValidation = {
        username: JOI.string().required().min(3).max(20),
        email: JOI.string().required()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net']}}),
        password: JOI.string().required().min(8).max(12),
        biz: JOI.boolean().allow('', null).empty(['', null]).default(false)
    }

    static #registerValidation = JOI.object( AuthUserModelJOI.#baselineValidation );
    static #loginValidation = JOI.object( AuthUserModelJOI.#baselineValidation );

    // Validate the JOI schema
    validateRegisreration() {
        const result = AuthUserModelJOI.#registerValidation.validate( this, {absortEarly: false});
        return result;
    }

    validateLogin() {
        const result = AuthUserModelJOI.#loginValidation.validate( this, {absortEarly: false});
        return result;
    }

}

module.exports = AuthUserModelJOI;