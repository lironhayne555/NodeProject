const { boolean } = require("joi");
const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    biz: Boolean,
})

const UserModel = mongoose.model("UserModel",UserSchema,"users");

module.exports = UserModel;