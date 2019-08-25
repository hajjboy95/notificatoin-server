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
const user_notification_1 = require("../models/user-notification");
class NotificationService {
    notificationSendFailed(userId, notification) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userNotificationModel = yield user_notification_1.UserNotification.findOne({ userId: userId });
                if (userNotificationModel == null) {
                    const userNotificationNewModel = yield user_notification_1.UserNotification.create({ userId: userId });
                    userNotificationNewModel.failures = notification;
                    yield userNotificationNewModel.save();
                }
                else {
                    const fullFailures = userNotificationModel.failures.concat(notification);
                    userNotificationModel.failures = fullFailures;
                    yield userNotificationModel.save();
                }
            }
            catch (error) {
                console.log("caught error in notification service", error);
            }
        });
    }
    notificationSendSuccess(userId, notification) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userNotificationModel = yield user_notification_1.UserNotification.findOne({ userId: userId });
                if (userNotificationModel == null) {
                    const userNotificationNewModel = yield user_notification_1.UserNotification.create({ userId: userId });
                    userNotificationNewModel.successes = notification;
                    yield userNotificationNewModel.save();
                }
                else {
                    const fullSuccesses = userNotificationModel.successes.concat(notification);
                    userNotificationModel.successes = fullSuccesses;
                    yield userNotificationModel.save();
                }
            }
            catch (error) {
                console.log("caught error in notification service", error);
            }
        });
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification-service.js.map