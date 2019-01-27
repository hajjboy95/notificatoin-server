"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apn = require("apn");
class PushController {
    constructor(apnProvier) {
        this.apnProvider = apnProvier;
    }
    getNotifications(req, res) {
        res.json({
            message: "get notificatoins"
        });
    }
    sendNotification(req, res) {
        let deviceToken = "9CD5BF95BC283D2D933376E477AD38D9D82A362A0049BC3633ADC4C58BED9B61";
        var note = new apn.Notification();
        note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        note.badge = 3;
        note.sound = "ping.aiff";
        note.alert = "What are you doing now?";
        note.payload = { 'messageFrom': 'John Appleseed' };
        note.topic = "com.mangafruit.compendium";
        this.apnProvider.send(note, deviceToken).then((result) => {
            console.log("First notification Inshallah this will benifit my family & i");
            res.json({
                message: "notification send successfully :D"
            });
        });
    }
}
exports.PushController = PushController;
//# sourceMappingURL=push-controller.js.map