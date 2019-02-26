import { Request, Response, NextFunction } from 'express'
import * as apn from 'apn'
import { User } from '../models/user';
import { NotificationEntry, IUserNotificationEntry } from "../models/user-notification"
import { INotificationService } from '../services/notification-service'
import { DecodedRequest, DecodedBody } from '../interfaces/decoded-request'
import StatusError from '../error/status-error'

export class PushNotificationController {

    public apnProvider: apn.Provider
    public notificationService: INotificationService

    constructor(apnProvier: apn.Provider, notificationService: INotificationService) {
        this.sendNotificationToUser = this.sendNotificationToUser.bind(this) //makes me bind this to proper this
        this.sendNotificationToOrganisation = this.sendNotificationToOrganisation.bind(this) //makes me bind this to proper this
        this.apnProvider = apnProvier
        this.notificationService = notificationService
    }

    public getNotifications(req: Request, res: Response, next: NextFunction) {
        res.json({
            message: "get notificatoins"
        })
    }

    public sendNotificationToUser(req: DecodedRequest, res: Response, next: NextFunction) {
        //get user and do things
        const decodedBody = req.decoded as DecodedBody
        const user = decodedBody.data

        const deviceTokensiOS: string[] = user.deviceTokens.filter((device) => device.deviceOS === "iOS").map(d => d.deviceToken);
        const deviceTokensAndroid: string[] = user.deviceTokens.filter((device) => device.deviceOS === "android").map(d => d.deviceToken);

        const expiry = Math.floor(Date.now() / 1000) + 3600 // Expires 1 hour from now.
        const message = req.query.message;
        const bundleId = "com.mangafruit.compendium"

        const note = this.buildNotification(expiry, 3, "ping.aiff", message, { 'messageFrom': 'John Appleseed' }, bundleId)
        this.sendNotification(bundleId, user._id, message, note, deviceTokensiOS)
        res.json({
            message: "Notification sent "
        })
    }

    private sendNotification(bundleId: string, userId: string, message: string, note, deviceTokens){
        this.apnProvider.send(note, deviceTokens).then((result) => {
            const notificationEntries = this.createNotificationEntriesWith(bundleId, userId, message, result)
            if (result.failed.length > 0) {
                this.notificationService.notificationSendFailed(userId, notificationEntries);
            } 
            if (result.sent.length) {
                this.notificationService.notificationSendSuccess(userId, notificationEntries);
            }
        })
    }
    private createNotificationEntriesWith(bundleId: string, userId: string, message: string, result: any): IUserNotificationEntry[] {
        let notificationEntries: IUserNotificationEntry[] = []
        for (let sent of result.sent) {
            const notificationEntry = new NotificationEntry(bundleId, userId, sent.device, message, null, null, null);
            notificationEntries.push(notificationEntry)
        }
        return notificationEntries
    }

    private buildNotification(expiry: number, badge: number, sound: string, message: string, payload: any, bundleId: string): apn.Notification {
        const note = new apn.Notification()
        note.expiry = expiry
        note.badge = badge
        note.sound = sound
        note.alert = message
        note.payload = payload
        note.topic = bundleId
        return note
    }
    public sendNotificationToOrganisation(req: DecodedRequest, res: Response, next: NextFunction) {
        const organisations: string[] = req.body.organisations
        const message = req.body.message

        User.find({ organisations: organisations})
            .then((res) => {
                if (!res || res.length === 0) {
                    let e = new StatusError(`No Users for given organisation/s ${organisations}`)
                    e.status = 404
                    throw e
                }
                return res
            })
            .then((users) => {
                const expiry = Math.floor(Date.now() / 1000) + 3600 // Expires 1 hour from now.
                const bundleId = req.body.bundleId
                const note = this.buildNotification(expiry, 3, "ping.aiff", message, { 'string': 'John Appleseed' }, bundleId)
                let numberOfNotificatationsSent = 0
                for (const user of users) {
                    numberOfNotificatationsSent += 1
                    this.apnProvider.send(note, user.deviceTokens).then((res) => {
                        console.log(`Sent ${numberOfNotificatationsSent} notification to device token ${user.deviceTokens}`)
                    }).catch((e) => {
                        throw e
                    })
                }
                return `Sent ${numberOfNotificatationsSent} notification`
            })
            .then((r) => {
                res.json({
                    message: r
                })
            })
            .catch((e) => {
                return next(e)
            })
    }

    public async sendNotificationToOrganisationAsync(req: DecodedRequest, res: Response, next: NextFunction) {
        const organisations: string[] = req.body.organisations
        const message = req.body.message
        let users: any[]
        console.log(`organisations = ${organisations}`)
        try {
            users = await User.find({ organisations: organisations })

        } catch (e) {
            return next(e)
        }


        const expiry = Math.floor(Date.now() / 1000) + 3600 // Expires 1 hour from now.
        const bundleId = req.body.bundleId

        const note = this.buildNotification(expiry, 3, "ping.aiff", message, { 'string': 'John Appleseed' }, bundleId)
        for (const user of users) {
            // const deviceTokensiOS: string[] = user.deviceTokens.filter((device) => device.deviceOS === "iOS" ).map(d => d.deviceToken);
            try {
                await this.apnProvider.send(note, user.deviceTokens)
                console.log("Sent 1 notification")
            } catch (e) {
                return next(e)
            }
        }
        // res.json({
        //     message: "something going on"
        // })
        console.log("finished sending notifications")
    }


}