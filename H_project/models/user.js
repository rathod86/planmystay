const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const passport = require("passport");
// ...existing code...
const userSchema = new Schema({
    email: {
        type: String,
        required: true // <-- fix typo: 'require' to 'required'
    }
});

userSchema.plugin(passportLocalMongoose); // <-- fix here

module.exports = mongoose.model('User', userSchema); // Capitalize 'User' for convention