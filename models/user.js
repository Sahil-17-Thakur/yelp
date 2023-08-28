const mongoose = require('mongoose');
const passportLocalMongo = require('passport-local-mongoose');
 

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

userSchema.plugin(passportLocalMongo);
 
const User = mongoose.model('User', userSchema);
module.exports = User;