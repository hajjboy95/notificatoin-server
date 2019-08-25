"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const passport = require('passport')
// const LocalStrategy = require('passport-local').Strategy
const passport = require("passport");
const LocalStrategy = require("passport-local");
const user_1 = require("../models/user");
const Stategy = LocalStrategy.Strategy;
exports.local = passport.use(new Stategy(user_1.User.authenticate()));
passport.serializeUser(user_1.User.serializeUser());
passport.deserializeUser(user_1.User.deserializeUser());
//# sourceMappingURL=authentication.js.map