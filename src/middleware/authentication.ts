// const passport = require('passport')
// const LocalStrategy = require('passport-local').Strategy
import * as passport from 'passport'
import * as LocalStrategy from 'passport-local'
import User = require('../models/user')

const Stategy = LocalStrategy.Strategy
exports.local = passport.use(new Stategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
