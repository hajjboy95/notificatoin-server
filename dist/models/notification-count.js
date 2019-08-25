"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const NotificationCountSchema = new mongoose_1.Schema({
    numberOfNoticationsSent: { type: Number, default: 0 }
}, { timestamps: true });
exports.NotificationCount = mongoose_1.model("NotificaionCount", NotificationCountSchema);
//# sourceMappingURL=notification-count.js.map