"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const index_routes_1 = require("./routes/index-routes");
const push_notification_routes_1 = require("./routes/push-notification-routes");
const mongoose = require("mongoose");
class App {
    constructor() {
        this.routes = [];
        this.mongoUrl = 'mongodb://localhost/notification-server';
        this.app = express();
        this.config();
        this.routes.push(new index_routes_1.IndexRoute(), new push_notification_routes_1.PushNotificationRoute());
        this.routes.forEach(element => {
            element.routes(this.app);
        });
        this.mongoSetup();
    }
    config() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
    mongoSetup() {
        mongoose.Promise = global.Promise;
        mongoose.connect(this.mongoUrl);
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map