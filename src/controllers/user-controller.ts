import { Request, Response, NextFunction } from 'express'
import * as passport from 'passport'
import {User} from '../models/user'
import {Verify} from "../middleware/verify"
import { DecodedRequest } from '../interfaces/decoded-request.js';

export class UserController {

    constructor() {
    }

    public async getUsers(req: Request, res: Response, next: NextFunction) {
        const allUsers = await User.find({})
        res.json ({
            users: allUsers
        })
    }

    public async getCurrentUserDetails(req: DecodedRequest, res: Response, next: NextFunction) {
        const userId = req.decoded.data._id
        const currentUser = await User.find({_id: userId})
        res.json ({
            user: currentUser
        })
    }


    public loginUser(req: Request, res: Response, next: NextFunction) {
        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err) }
            if (!user) { return next(info) }
            req.logIn(user, function(err) {
                if (err) {return next(new Error('Could not log in user')) }
                let token = Verify.getToken(user)
                return res.status(200).json({
                    token: token
                })
            })
        })(req, res, next)
    }

    public async createUser(req: Request, res: Response, next: NextFunction) {
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
            organisations: body.organisations,
        })

        try {
            const email = await User.findOne({email: newUser.email})
            if (email) { return next(new Error("Email has already been registered")) }
            const user = await User.register(newUser, req.body.password); 
            if (!user) { return next(new Error("No User Defined"))}
            await passport.authenticate('local')(req, res, next)
            return res.status(200).json({ user })
        }
        catch (e) {
            next(e)
        }
    }
}
