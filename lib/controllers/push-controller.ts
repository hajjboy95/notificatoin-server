import {Request, Response } from 'express';

export class PushController {

    public getNotifications(req: Request, res: Response){
        res.json({
            message: "get notificatoins"
        })
    }
}