
import { Document, Schema, Model, model } from "mongoose";

export interface IUserNotification {
    userId: string
    successes: IUserNotificationEntry[]
    failures: IUserNotificationEntry[]
}

export interface IUserNotificationEntry {
    bundleId: string
    device: string;
    error?: Error;
    status?: string;
    message?: string | any;
    response?: {
        reason: string;
        timestamp?: string;
    };
}

export class NotificationEntry implements IUserNotificationEntry {
    bundleId: string
    userId: string
    device: string;
    message?: string | any;
    error?: Error;
    status?: string;
    response?: {
        reason: string;
        timestamp?: string;
    };

    constructor(bundleId: string, userId: string, device: string, message?: string | any, error?: Error, status?: string, response?: {reason: string, timestamp?: string}) {
        this.bundleId = bundleId
        this.userId = userId
        this.device = device
        this.message = message
        this.error = error
        this.status = status
        this.response = response
    }
}
export interface IUserNotificationModel extends IUserNotification, Document { }
export interface IUserNotificationEntryModel extends IUserNotificationEntry, Document { }

let UserNotificationSchema: Schema = new Schema({
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

export const UserNotification: Model<IUserNotificationModel> = model<IUserNotificationModel>("UserNotification", UserNotificationSchema);
