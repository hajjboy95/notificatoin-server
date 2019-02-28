import { IUserNotification, NotificationEntry, IUserNotificationEntry, UserNotification } from '../models/user-notification'

export interface INotificationService {
    notificationSendFailed(userId: string, notification: IUserNotificationEntry[]): void
    notificationSendSuccess(userId: string, notifcation: IUserNotificationEntry[]): void
}

export class NotificationService implements INotificationService {

    async notificationSendFailed(userId: string, notification: IUserNotificationEntry[]) {
        try {
            const userNotificationModel = await UserNotification.findOne({userId: userId})

            if (userNotificationModel == null) {
                const userNotificationNewModel = await UserNotification.create({userId: userId})
                userNotificationNewModel.failures = notification
                await userNotificationNewModel.save()
            } else {
                const fullFailures = userNotificationModel.failures.concat(notification)
                userNotificationModel.failures = fullFailures
                await userNotificationModel.save()
            }
        } catch (error) {
            console.log("caught error in notification service",error)
        }
    }

    async notificationSendSuccess(userId: string, notification: IUserNotificationEntry[]) {
        try {
            const userNotificationModel = await UserNotification.findOne({userId: userId})

            if (userNotificationModel == null) {
                const userNotificationNewModel = await UserNotification.create({userId: userId})
                userNotificationNewModel.successes = notification
                await userNotificationNewModel.save()
            } else {
                const fullSuccesses = userNotificationModel.successes.concat(notification)
                userNotificationModel.successes = fullSuccesses
                await userNotificationModel.save()
            }
        } catch (error) {
            console.log("caught error in notification service", error)
        }
    }
}