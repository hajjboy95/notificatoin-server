import { Document, Schema, Model, model } from "mongoose";

export interface INotificationCount {
    numberOfNoticationsSent: number
}

export interface INotificationCountModel extends INotificationCount, Document {}

const NotificationCountSchema: Schema = new Schema({
    numberOfNoticationsSent: { type: Number, default: 0 }
}, { timestamps: true });

export const NotificationCount: Model<INotificationCountModel> = model<INotificationCountModel>("NotificaionCount", NotificationCountSchema)
