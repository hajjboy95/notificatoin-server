import * as express from "express";
import * as bodyParser from "body-parser";

import { IndexRoute } from "./routes/index-routes";
import { PushNotificationRoute } from "./routes/push-notification-routes";

import * as mongoose from "mongoose";
import { Routes } from  "./routes/routes-interface";

class App {
    public app: express.Application
    public routes: Routes[] = []
    public mongoUrl: string = 'mongodb://localhost/notification-server';

    constructor() {
        this.app = express();
        this.config();
        this.routes.push(
            new IndexRoute(),
            new PushNotificationRoute()
        )
        this.routes.forEach(element => {
            element.routes(this.app)
        });
        this.mongoSetup()
    }

    private config(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
    }

    private mongoSetup(): void {
        mongoose.Promise = global.Promise;
        mongoose.connect(this.mongoUrl);
    }
}

export default new App().app