import { User } from './../models/user'
import { Request, Response, NextFunction } from 'express'

export interface DecodedRequest extends Request {
    decoded: any//makes life easier for now!!!!!
}

export interface DecodedBody {
    data?: User
}