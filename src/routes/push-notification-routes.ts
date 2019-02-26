import { Request, Response, Application } from "express"
import { PushNotificationController } from "../controllers/push-notification-controller"
import { Routes } from "./routes-interface"
import *  as apn from "apn"
import { options } from "../configurations/options"
import { Verify } from "../middleware/verify"
import { NotificationService, INotificationService } from '../services/notification-service'

export class PushNotificationRoute implements Routes {

    public pushController: PushNotificationController
    public apnProvider: apn.Provider
    public pushNotificationService: INotificationService
    constructor() {
        this.apnProvider = new apn.Provider(options)
        this.pushNotificationService = new NotificationService()
        this.pushController = new PushNotificationController(this.apnProvider, this.pushNotificationService);
    }

    routes(app: Application) {
        app.route('/notification')
            .get(Verify.verifyOrdinaryUser, this.pushController.getNotifications)

        app.route('/notification/send')
            .post(Verify.verifyOrdinaryUser, this.pushController.sendNotificationToUser)

        app.route('/notification/send/organisation')
            .post(Verify.verifyOrdinaryUser, this.pushController.sendNotificationToOrganisation) //need to verify its an admin
    }
}
