"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
class NotificationEntry {
    constructor(bundleId, userId, device, message, error, status, response) {
        this.bundleId = bundleId;
        this.userId = userId;
        this.device = device;
        this.message = message;
        this.error = error;
        this.status = status;
        this.response = response;
    }
}
exports.NotificationEntry = NotificationEntry;
let UserNotificationSchema = new mongoose_1.Schema({
    userId: String,
    successes: [{
            bundleId: String,
            userId: String,
            device: String,
            message: Object,
            error: Object,
            status: String,
            response: {
                reason: String,
                timeStamp: String
            }
        }, { timestamps: true }],
    failures: [{
            bundleId: String,
            userId: String,
            device: String,
            message: Object,
            error: Object,
            status: String,
            response: {
                reason: String,
                timeStamp: String
            }
        }, { timestamps: true }]
}, { timestamps: true });
exports.UserNotification = mongoose_1.model("UserNotification", UserNotificationSchema);
//# sourceMappingURL=user-notification.js.map