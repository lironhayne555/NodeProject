const { object } = require("joi");
const mongoose = require("mongoose");

const CardSchema = mongoose.Schema({
    id: Number,
    businessName: String,
    description: String,
    address: String,
    phoneNumber: String,
    urlImg : String,
    user_id : Object
})

const CardModel = mongoose.model("CardModel",CardSchema,"cards");

module.exports = CardModel;