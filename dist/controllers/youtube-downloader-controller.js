"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
class YoutubeDownloaderController {
    // downloadsPath = `${__dirname}/../vids/`
    constructor() {
        this.downloadVideo = this.downloadVideo.bind(this); //makes me bind this to proper this
        this.indexpage = this.indexpage.bind(this); //makes me bind this to proper this
    }
    downloadVideo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = req.body.ytURL;
            const videoFormat = req.body.videoFormat;
            const vidPath = yield this.fakeDownload(url, videoFormat);
            res.render('video-downloaded.ejs', { videoUrl: vidPath });
            // try {
            //     const youtubeVideoPath = await this.downloadVid(url, videoFormat)
            //     res.render('index.ejs', { videoUrl: url, format: videoFormat, err: null, vidPath: youtubeVideoPath})    
            // } catch (error) {
            //     res.render('index.ejs', { videoUrl: url, format: videoFormat, err: error, vidPath: null })
            // }        
        });
    }
    downloadVid(url, format) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
                switch (format) {
                    case 'mp4': {
                        try {
                            const vidPath = yield this.download(url, format);
                            // res.render('index.ejs', { videoUrl: url, format: format, err: null, vidPath: vidPath })
                        }
                        catch (error) {
                            rej(error);
                            // res.render('index.ejs', { videoUrl: url, format: format, err: error, vidPath: null })
                        }
                    }
                    case 'mp3': {
                    }
                    case 'flv': {
                    }
                    default: {
                        console.log("Invalid choice");
                        break;
                    }
                }
            }));
        });
    }
    indexpage(req, res, next) {
        res.render('index.ejs', { videoUrl: null, format: null });
    }
    fakeDownload(url, format) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                const currentTime = Date.now();
                const vidPath = `${currentTime}-v.${format}`;
                res(vidPath);
                setTimeout(() => {
                    console.log("Download has finished");
                }, 3500);
            });
        });
    }
    download(url, format) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                const currentTime = Date.now();
                const vidPath = `${currentTime}-v.${format}`;
                ytdl(url, { filter: (format) => format.container === format })
                    .pipe(fs.createWriteStream(vidPath))
                    .on('finish', () => {
                    res(vidPath);
                })
                    .on('error', (e) => {
                    rej(e);
                });
            });
        });
    }
}
exports.YoutubeDownloaderController = YoutubeDownloaderController;
//# sourceMappingURL=youtube-downloader-controller.js.map