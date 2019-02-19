import { Request, Response, Application } from "express"
import { PushNotificationController } from "../controllers/push-notification-controller"
import { Routes } from  "./routes-interface"
import *  as apn from "apn"
import { options } from "../configurations/options"
import {Verify} from "../middleware/verify"

export class PushNotificationRoute implements Routes {

    public pushController: PushNotificationController
    public apnProvider: apn.Provider

    constructor() {
        this.apnProvider = new apn.Provider(options)
        this.pushController = new PushNotificationController(this.apnProvider)
    }

    routes(app: Application) {
        app.route('/notification')
        .get(Verify.verifyOrdinaryUser ,this.pushController.getNotifications)

        app.route('/notification/send')
        .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, this.pushController.sendNotification)
    }
}
