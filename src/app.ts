import * as express from "express"
import * as bodyParser from "body-parser"

import { Routes } from "./routes/routes-interface"
import { IndexRoute } from "./routes/index-routes"
import { PushNotificationRoute } from "./routes/push-notification-routes"
import { UserRoute } from "./routes/user-routes"
import { YoutubeDownloaderRoute } from "./routes/youtube-downloader-routes"

import * as mongoose from "mongoose"

import * as passport from "passport"
(<any>mongoose).Promise = require("bluebird")
import StatusError from "./error/status-error"
import * as morgan from "morgan"
const authenticate = require('./middleware/authentication')

class App {
  public app: express.Application
  public routes: Routes[] = []
  public mongoUrl: string = 'mongodb://localhost/notification-server'

  constructor() {
    this.app = express()
    this.configLogger()
    this.configMiddleware()
    this.configRoutes([new IndexRoute(), new PushNotificationRoute(), new UserRoute(), new YoutubeDownloaderRoute()])
    this.configErrorHandlers()
    this.mongoSetup()
  }

  private configMiddleware(): void {
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: false }))
    this.app.use(passport.initialize())
  }

  private configRoutes(routes: Routes[]): void {
    this.routes = routes
    this.routes.forEach(element => {
      element.routes(this.app)
    })
  }

  private configLogger() {
    this.app.use(morgan('combined'))
  }

  private configErrorHandlers() {

    // this catches 404 errors 
    this.app.get('*', (req, res, next) => {
      let err = new StatusError(`${req.ip} tried to reach ${req.originalUrl}`)
      err.status = 404
      next(err)
    })

    this.app.use((err: StatusError, req, res, next) => {
      if (err) { next(err) } else {
        const err = new StatusError('Not Found')
        err.status = 404
        next(err)
      }
    })

    // development error handler
    // will print stacktrace
    if (this.app.get('env') === 'development') {
      this.app.use((err: StatusError, req, res, next) => {
        res.status(err.status || 500)
        res.json({
          message: err.message,
          error: err
        })
      })
    }

    // production error handler
    // no stacktraces leaked to user
    this.app.use((err, req, res, next) => {
      res.status(err.status || 500)
      res.json({
        message: err.message,
        error: {}
      })
    })
  }
  private mongoSetup(): void {
    mongoose.connect(this.mongoUrl, { useNewUrlParser: true })
  }
}

export default new App().app