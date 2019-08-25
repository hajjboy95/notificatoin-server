"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const apn = require("apn");
const user_1 = require("../models/user");
const user_notification_1 = require("../models/user-notification");
const status_error_1 = require("../error/status-error");
const notification_count_1 = require("../models/notification-count");
class PushNotificationController {
    constructor(apnProvier, notificationService) {
        this.sendNotificationToUser = this.sendNotificationToUser.bind(this); //makes me bind this to proper this
        this.sendNotificationToOrganisation = this.sendNotificationToOrganisation.bind(this); //makes me bind this to proper this
        this.apnProvider = apnProvier;
        this.notificationService = notificationService;
    }
    getNotifications(req, res, next) {
        let err = new status_error_1.default("NO ROUTE HERE");
        err.status = 404;
        next(err);
    }
    sendNotificationToUser(req, res, next) {
        const decodedBody = req.decoded;
        const user = decodedBody.data;
        const message = req.body.message;
        const deviceTokensiOS = user.deviceTokens.filter((device) => device.deviceOS === "iOS").map(d => d.deviceToken);
        const deviceTokensAndroid = user.deviceTokens.filter((device) => device.deviceOS === "android").map(d => d.deviceToken);
        const expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        const bundleId = "com.mangafruit.compendium";
        const note = this.buildNotification(expiry, 3, "ping.aiff", message, { 'messageFrom': 'John Appleseed' }, bundleId);
        console.log(`this.sendNotification(bundleId, user._id, message, note, deviceTokensiOS)`);
        console.log(`this.sendNotification(${bundleId}, ${user._id}, ${message}, ${note}, ${deviceTokensiOS})`);
        this.sendNotification(bundleId, user._id, message, note, deviceTokensiOS);
        res.json({
            message: "Notification sent "
        });
    }
    sendNotificationToOrganisation(req, res, next) {
        const organisations = req.body.organisations;
        const message = req.body.message;
        const bundleId = req.body.bundleId;
        user_1.User.find({ organisations: { $in: organisations } })
            .then((res) => {
            if (!res || res.length === 0) {
                let e = new status_error_1.default(`No Users for given organisation/s ${organisations}`);
                e.status = 404;
                throw e;
            }
            return res;
        })
            .then((users) => {
            console.log(`\n\nusers = ${users}\n\n`);
            const expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
            const note = this.buildNotification(expiry, 3, "ping.aiff", message, { 'string': 'John Appleseed' }, bundleId);
            let numberOfNotificatationsSent = 0;
            for (const user of users) {
                numberOfNotificatationsSent += 1;
                const useriOSTokens = user.deviceTokens.filter(dt => dt.deviceOS == 'iOS').map(dt => dt.deviceToken);
                this.sendNotification(bundleId, user._id, message, note, useriOSTokens);
            }
            return `Sent ${numberOfNotificatationsSent} notification`;
        })
            .then((r) => {
            res.json({
                message: r
            });
        })
            .catch((e) => {
            return next(e);
        });
    }
    sendNotification(bundleId, userId, message, note, deviceTokens) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allCounters = yield notification_count_1.NotificationCount.find({});
                if (allCounters === undefined || allCounters.length == 0) {
                    const firstCounter = yield notification_count_1.NotificationCount.create({});
                    firstCounter.numberOfNoticationsSent = 1;
                    yield firstCounter.save();
                }
                else {
                    const counter = allCounters[0];
                    const counts = counter.numberOfNoticationsSent;
                    counter.numberOfNoticationsSent += 1;
                    yield counter.save();
                }
            }
            catch (err) {
                console.log(`error ----- ${err}`);
            }
            this.apnProvider.send(note, deviceTokens).then((result) => {
                const notificationEntries = this.createNotificationEntriesWith(bundleId, userId, message, result);
                if (result.failed.length > 0) {
                    this.notificationService.notificationSendFailed(userId, notificationEntries);
                }
                if (result.sent.length) {
                    this.notificationService.notificationSendSuccess(userId, notificationEntries);
                }
            });
        });
    }
    createNotificationEntriesWith(bundleId, userId, message, result) {
        let notificationEntries = [];
        for (let sent of result.sent) {
            const notificationEntry = new user_notification_1.NotificationEntry(bundleId, userId, sent.device, message, null, null, null);
            notificationEntries.push(notificationEntry);
        }
        return notificationEntries;
    }
    buildNotification(expiry, badge, sound, message, payload, bundleId) {
        const note = new apn.Notification();
        note.expiry = expiry;
        note.badge = badge;
        note.sound = sound;
        note.alert = message;
        note.payload = payload;
        note.topic = bundleId;
        return note;
    }
}
exports.PushNotificationController = PushNotificationController;
//# sourceMappingURL=push-notification-controller.js.map