import { Request, Response, NextFunction } from 'express'
import * as apn from 'apn'
import { User } from '../models/user';
import { NotificationEntry, IUserNotificationEntry } from "../models/user-notification"
import { INotificationService } from '../services/notification-service'
import { DecodedRequest, DecodedBody } from '../interfaces/decoded-request'
import StatusError from '../error/status-error'
import { NotificationCount } from '../models/notification-count'

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
        let err = new StatusError("NO ROUTE HERE")
        err.status = 404
        next(err)
    }

    public sendNotificationToUser(req: DecodedRequest, res: Response, next: NextFunction) {
        const decodedBody = req.decoded as DecodedBody
        const user = decodedBody.data
        const message = req.body.message;

        const deviceTokensiOS: string[] = user.deviceTokens.filter((device) => device.deviceOS === "iOS").map(d => d.deviceToken);
        const deviceTokensAndroid: string[] = user.deviceTokens.filter((device) => device.deviceOS === "android").map(d => d.deviceToken);

        const expiry = Math.floor(Date.now() / 1000) + 3600 // Expires 1 hour from now.
        const bundleId = "com.mangafruit.compendium"

        const note = this.buildNotification(expiry, 3, "ping.aiff", message, { 'messageFrom': 'John Appleseed' }, bundleId)

        console.log(`this.sendNotification(bundleId, user._id, message, note, deviceTokensiOS)`)
        console.log(`this.sendNotification(${bundleId}, ${user._id}, ${message}, ${note}, ${deviceTokensiOS})`) 

        this.sendNotification(bundleId, user._id, message, note, deviceTokensiOS)
        res.json({
            message: "Notification sent "
        })
    }

    public sendNotificationToOrganisation(req: DecodedRequest, res: Response, next: NextFunction) {
        const organisations: string[] = req.body.organisations
        const message = req.body.message
        const bundleId = req.body.bundleId

        User.find({ organisations: {$in: organisations} })
            .then((res) => {
                if (!res || res.length === 0) {
                    let e = new StatusError(`No Users for given organisation/s ${organisations}`)
                    e.status = 404
                    throw e
                }
                return res
            })
            .then((users) => {
                console.log(`\n\nusers = ${users}\n\n`)
                const expiry = Math.floor(Date.now() / 1000) + 3600 // Expires 1 hour from now.
                const note = this.buildNotification(expiry, 3, "ping.aiff", message, { 'string': 'John Appleseed' }, bundleId)
                let numberOfNotificatationsSent = 0
                for (const user of users) {
                    numberOfNotificatationsSent += 1
                    const useriOSTokens = user.deviceTokens.filter(dt => dt.deviceOS == 'iOS').map(dt => dt.deviceToken)            
                    this.sendNotification(bundleId, user._id, message, note, useriOSTokens)
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

    private async sendNotification(bundleId: string, userId: string, message: string, note, deviceTokens){

        try {
            const allCounters = await NotificationCount.find({})

            if (allCounters === undefined || allCounters.length == 0) {
                const firstCounter = await NotificationCount.create({})
                firstCounter.numberOfNoticationsSent = 1
                await firstCounter.save()
            } else {
                const counter = allCounters[0]
                const counts = counter.numberOfNoticationsSent
                counter.numberOfNoticationsSent += 1
                await counter.save()
            }
        } catch (err) {
            console.log(`error ----- ${err}`)
        }

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
}