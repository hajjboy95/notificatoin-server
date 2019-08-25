"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const youtube_downloader_controller_1 = require("../controllers/youtube-downloader-controller");
class YoutubeDownloaderRoute {
    constructor() {
        this.youtubeDownloaderController = new youtube_downloader_controller_1.YoutubeDownloaderController();
    }
    routes(app) {
        app.route('/youtube')
            .post(this.youtubeDownloaderController.downloadVideo)
            .get(this.youtubeDownloaderController.indexpage);
    }
}
exports.YoutubeDownloaderRoute = YoutubeDownloaderRoute;
//# sourceMappingURL=youtube-downloader-routes.js.map