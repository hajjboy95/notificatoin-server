import { Request, Response } from "express";
import { PushController } from "../controllers/push-controller";
import { Routes } from  "./routes-interface";


export class PushRoute implements Routes {
    public pushController: PushController = new PushController()
    
    routes(app) {
        app.route('/notification')
        .get(this.pushController.getNotifications);
    }
}
