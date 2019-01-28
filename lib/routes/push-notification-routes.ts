import { Request, Response, Application } from "express";
import { PushController } from "../controllers/push-controller";
import { Routes } from  "./routes-interface";
import *  as apn from "apn";
import { options } from "../configurations/options";

export class PushNotificationRoute implements Routes {

    public pushController: PushController
    public apnProvider: apn.Provider

    constructor() {
        this.apnProvider = new apn.Provider(options);
        this.pushController = new PushController(this.apnProvider);
    }

    routes(app: Application) {
        console.log("routes called -----")
        console.log(this.pushController);


        app.route('/notification')
        .get(this.pushController.getNotifications);

        app.route('/notification/send')
        .get(this.pushController.sendNotification);

    }
}
