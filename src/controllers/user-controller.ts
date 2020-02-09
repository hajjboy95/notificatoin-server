import {Request, Response, NextFunction} from 'express'
import * as passport from 'passport'
import {Token, User} from '../models/user'
import {Verify} from "../middleware/verify"
import {DecodedRequest} from '../interfaces/decoded-request';
const crypto = require('crypto');

export class UserController {

    constructor() {
    }

    public async getUsers(req: Request, res: Response, next: NextFunction) {
        const allUsers = await User.find({});
        res.json({
            users: allUsers
        })
    }

    public async getCurrentUserDetails(req: DecodedRequest, res: Response, next: NextFunction) {
        const userId = req.decoded.data._id
        const currentUser = await User.find({_id: userId})
        res.json({
            user: currentUser
        })
    }


    public loginUser(req: Request, res: Response, next: NextFunction) {
        passport.authenticate('local', function (err, user, info) {
            if (err) {
                return next(err)
            }
            if (!user) {
                return next(info)
            }
            req.logIn(user, function (err) {
                if (err) {
                    return next(new Error('Could not log in user'))
                }
                let token = Verify.getToken(user)
                return res.status(200).json({
                    token: token
                })
            })
        })(req, res, next)
    }

    public async createUser(req: Request, res: Response, next: NextFunction) {
        let body = req.body;

        const newUser = new User({
            username: body.username,
            email: body.email,
            firstname: body.firstname,
            lastname: body.lastname,
            role: body.role,
            isVerified: body.isVerified,
            passwordResetToken: body.passwordResetToken,
            passwordResetExpires: body.passwordResetExpires,
        });

        try {
            const email = await User.findOne({email: newUser.email})
            if (email) {
                return next(new Error("Email has already been registered"))
            }
            const user = await User.register(newUser, req.body.password);
            if (!user) {
                return next(new Error("No User Defined"))
            }

            await user.save();
            await passport.authenticate('local')(req, res, next);
            const tokenInfo = {
                _userId: user._id,
                token: crypto.randomBytes(16).toString('hex')
            };
            const token = new Token(tokenInfo);
            await token.save();
            // should send an email with the verification link
            return res.status(200).json(token)
        } catch (e) {
            next(e)
        }
    }

    // convert to async typescript
    public confirmToken(req: Request, res: Response, next: NextFunction) {
        const tokenId = req.params.tokenId;
        Token.findOne({token: tokenId}, function (err, token) {
            if (err) return next(err);
            if (!token) {
                return res.json({err: "Invalid Token"});
            }
            User.findOne({_id: token._userId}, function (err, user) {
                user.isVerified = true;
                if (err) return next(err);
                user.save(function (err) {
                    if (err) return next(err);
                    res.json({
                        status: true,
                        message: "User is now verified"
                    });
                });
            });
        });
    }
}
