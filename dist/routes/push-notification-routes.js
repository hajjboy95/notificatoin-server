"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const push_controller_1 = require("../controllers/push-controller");
const apn = require("apn");
const options_1 = require("../configurations/options");
class PushNotificationRoute {
    constructor() {
        this.apnProvider = new apn.Provider(options_1.options);
        this.pushController = new push_controller_1.PushController(this.apnProvider);
    }
    routes(app) {
        app.route('/notification')
            .get(this.pushController.getNotifications);
        app.route('/notification/send')
            .get(this.pushController.sendNotification);
    }
}
exports.PushNotificationRoute = PushNotificationRoute;
//# sourceMappingURL=push-notification-routes.js.map