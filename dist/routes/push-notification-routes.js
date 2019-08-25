"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const push_notification_controller_1 = require("../controllers/push-notification-controller");
const apn = require("apn");
const options_1 = require("../configurations/options");
const verify_1 = require("../middleware/verify");
const notification_service_1 = require("../services/notification-service");
class PushNotificationRoute {
    constructor() {
        this.apnProvider = new apn.Provider(options_1.options);
        this.pushNotificationService = new notification_service_1.NotificationService();
        this.pushController = new push_notification_controller_1.PushNotificationController(this.apnProvider, this.pushNotificationService);
    }
    routes(app) {
        app.route('/notification')
            .get(verify_1.Verify.verifyOrdinaryUser, this.pushController.getNotifications);
        app.route('/notification/send')
            .post(verify_1.Verify.verifyOrdinaryUser, this.pushController.sendNotificationToUser);
        app.route('/notification/send/organisation')
            .post(verify_1.Verify.verifyOrdinaryUser, this.pushController.sendNotificationToOrganisation); //need to verify its an admin
    }
}
exports.PushNotificationRoute = PushNotificationRoute;
//# sourceMappingURL=push-notification-routes.js.map