import {mongo} from "mongoose";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose')

var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return re.test(email)
}

const TokenSchema = new Schema ({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 432000 }
});


var UserSchema = new Schema({
    username: { type: String, unique: true },
    password: { type: String },
    email: {
        type: String,
        required: true,
        lowercase: true,
        validate: [validateEmail, 'Please fill a valid email address']
    },
    firstname: { type: String, default: '' },
    lastname: { type: String, default: '' },
    role: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    passwordResetToken: String,
    passwordResetExpires: Date,
    deviceTokens: [{
        deviceOS: String,
        deviceToken: String
    }],
    OauthId: String,
    OauthToken: String,
    organisations: [String] //user can belong to many organisations
}, { timestamps: true })

UserSchema.method.getName = function () {
    return (this.firstname + ' ' + this.lastname)
}

UserSchema.plugin(passportLocalMongoose)

export const User = mongoose.model('User', UserSchema);
export const Token = mongoose.model('Token', TokenSchema);
