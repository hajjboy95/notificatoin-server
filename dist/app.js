"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const index_routes_1 = require("./routes/index-routes");
const push_notification_routes_1 = require("./routes/push-notification-routes");
const user_routes_1 = require("./routes/user-routes");
const youtube_downloader_routes_1 = require("./routes/youtube-downloader-routes");
const mongoose = require("mongoose");
const passport = require("passport");
mongoose.Promise = require("bluebird");
const status_error_1 = require("./error/status-error");
const morgan = require("morgan");
g;
const authenticate = require('./middleware/authentication');
class App {
    constructor() {
        this.routes = [];
        this.mongoUrl = 'mongodb://localhost/notification-server';
        this.app = express();
        this.configEjs();
        this.configLogger();
        this.configMiddleware();
        this.configRoutes([new index_routes_1.IndexRoute(), new push_notification_routes_1.PushNotificationRoute(), new user_routes_1.UserRoute(), new youtube_downloader_routes_1.YoutubeDownloaderRoute()]);
        this.configErrorHandlers();
        this.mongoSetup();
    }
    configMiddleware() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(passport.initialize());
    }
    configRoutes(routes) {
        this.routes = routes;
        this.routes.forEach(element => {
            element.routes(this.app);
        });
    }
    configEjs() {
        this.app.set('views', './src/views');
        this.app.set('view engine', 'ejs');
        this.app.use(express.static(__dirname + '/public'));
        this.app.use(express.static(__dirname + '/public/assets/v'));
    }
    configLogger() {
        this.app.use(morgan('combined'));
    }
    configErrorHandlers() {
        // this catches 404 errors 
        this.app.get('*', (req, res, next) => {
            let err = new status_error_1.default(`${req.ip} tried to reach ${req.originalUrl}`);
            err.status = 404;
            next(err);
        });
        this.app.use((err, req, res, next) => {
            if (err) {
                next(err);
            }
            else {
                const err = new status_error_1.default('Not Found');
                err.status = 404;
                next(err);
            }
        });
        // development error handler
        // will print stacktrace
        if (this.app.get('env') === 'development') {
            this.app.use((err, req, res, next) => {
                res.status(err.status || 500);
                res.json({
                    message: err.message,
                    error: err
                });
            });
        }
        // production error handler
        // no stacktraces leaked to user
        this.app.use((err, req, res, next) => {
            res.status(err.status || 500);
            res.json({
                message: err.message,
                error: {}
            });
        });
    }
    mongoSetup() {
        mongoose.connect(this.mongoUrl, { useNewUrlParser: true });
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map