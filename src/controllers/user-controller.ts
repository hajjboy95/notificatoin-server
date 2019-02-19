import { Request, Response, NextFunction } from 'express'
import * as passport from 'passport'
import User = require('../models/user.js')
import {Verify} from "../middleware/verify"

export class UserController {

    constructor() {
    }

    public getUser(req: Request, res: Response) {
    }

    public loginUser(req: Request, res: Response, next: NextFunction) {
        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err) }
            if (!user) { return res.status(401).json({err: info}) }
            req.logIn(user, function(err) {
                if (err) {
                    console.log(err)
                    return res.status(500).json({
                        err: 'Could not log in user'
                    })
                }
                let token = Verify.getToken(user)
                return res.status(200).json({
                    token: token
                })
            })
        })(req, res, next)
    }

    public createUser(req: Request, res: Response, next: NextFunction) {
        let body = req.body

        var newUser = new User({
            username: body.username,
            email: body.email,
            firstname: body.firstname,
            lastname: body.lastname,
            role: body.role,
            isVerified: body.isVerified,
            passwordResetToken: body.passwordResetToken,
            passwordResetExpires: body.passwordResetExpires,
            deviceTokens: body.deviceTokens,
        })

        User.findOne({ email: newUser.email }, function (err, email) {
            if (err) { return err }
            if (email) { return res.json({ err: "Email has already been registered" }) }

            User.register(newUser, req.body.password, function (err, user) {
                if (err) { return res.status(500).json({ err: err }) }
                if (!user) { return res.status(500).json({ err: "No User Defined" }) }
                passport.authenticate('local')(req, res, function () {
                    return res.status(200).json({ user })
                })
            })
        })
    }
}
