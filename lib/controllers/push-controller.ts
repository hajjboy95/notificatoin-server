import {Request, Response } from 'express';
import *  as apn from 'apn';

export class PushController {


    public getNotifications(req: Request, res: Response) {
        res.json({
            message: "get notificatoins"
        })
    }

    public sendNotification(req: Request, res: Response) {
        var options = {
            token: {
              key: "./AuthKey_MMQ93RJ7AR.p8",
              keyId: "MMQ93RJ7AR",
              teamId: "QUBN3MKV6G"
            },
            production: false
          };
          var apnProvider = new apn.Provider(options);

        let deviceToken = "9CD5BF95BC283D2D933376E477AD38D9D82A362A0049BC3633ADC4C58BED9B61"
        var note = new apn.Notification();

        note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        note.badge = 3;
        note.sound = "ping.aiff";
        note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
        note.payload = {'messageFrom': 'John Appleseed'};
        note.topic = "com.mangafruit.compendium";

        apnProvider.send(note, deviceToken).then( (result) => {
            console.log("First notification Inshallah this will benifit my family & i")      
        });
              
    }
}