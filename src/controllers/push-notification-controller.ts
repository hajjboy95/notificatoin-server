import { Request, Response } from 'express'
import * as apn from 'apn'

export class PushNotificationController {

    public apnProvider: apn.Provider
    // define a new service that stores the notifications that have been sent to the user
    // service stores all successful and failed notifications in seperate array

    constructor(apnProvier: apn.Provider) {
        this.sendNotification = this.sendNotification.bind(this) //makes me bind this to proper this
        this.apnProvider = apnProvier
    }

    public getNotifications(req: Request, res: Response) {
        res.json({
            message: "get notificatoins"
        })
    }

    public sendNotification(req: Request, res: Response) {
        let deviceToken = "9CD5BF95BC283D2D933376E477AD38D9D82A362A0049BC3633ADC4C58BED9B61"
        const note = new apn.Notification()

        note.expiry = Math.floor(Date.now() / 1000) + 3600 // Expires 1 hour from now.
        note.badge = 3
        note.sound = "ping.aiff"
        note.alert = "What are you doing now?"
        note.payload = { 'messageFrom': 'John Appleseed' }
        note.topic = "com.mangafruit.compendium"

        this.apnProvider.send(note, deviceToken).then((result) => {
            if (result.failed.length > 0) {
                res.json(result.failed);
            } else {
                res.json({
                    message: "notification send successfully :D"
                })
            }
        })
    }
}