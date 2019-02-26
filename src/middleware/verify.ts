import * as jwt from 'jsonwebtoken'
import { User } from './../models/user'
import { Request, Response, NextFunction } from 'express'
import StatusError from "../error/status-error"
import {DecodedRequest, DecodedBody} from '../interfaces/decoded-request'

export class Verify {
    static getToken = (user: any) => {
        return jwt.sign({ data: user }, "config.secretKey", {
            expiresIn: 604800 // 1 week for token to expire
        })
    }

    static verifyOrdinaryUser = (req: DecodedRequest, res: Response, next: NextFunction) => {
        const token = (req.body.token || req.query.token || req.headers['x-access-token']) as string
        if (token) {
            jwt.verify(token, 'config.secretKey', (err, decoded) => {
                if (err) {
                    const err = new StatusError('You are not authenticated!')
                    err.status = 401
                    next(err)
                } else {
                    req.decoded = decoded
                    next()
                }
            })
        } else {
            const err = new StatusError('No token provided!')
            err.status = 403
            next(err)
        }
    }

    static verifyAdmin = (req: DecodedRequest, res: Response, next: NextFunction) => {
        const decodedBody = req.decoded as DecodedBody
        if (decodedBody.data.role === 0) { //change this to enum
            const err = new StatusError('Only An Admin can be seen here :D')
            err.status = 401
            return next(err)
        } else {
            next()
        }

    }
}
