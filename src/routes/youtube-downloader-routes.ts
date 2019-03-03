import { Request, Response, Application } from "express"
import { Routes } from  "./routes-interface"
import { YoutubeDownloaderController } from "../controllers/youtube-downloader-controller"
import { Verify } from "../middleware/verify"

export class YoutubeDownloaderRoute implements Routes {

    public youtubeDownloaderController: YoutubeDownloaderController

    constructor() {
        this.youtubeDownloaderController = new YoutubeDownloaderController()
    }

    routes(app: Application) {

        app.route('/youtube')
        .post(this.youtubeDownloaderController.downloadVideo)

    }

}
