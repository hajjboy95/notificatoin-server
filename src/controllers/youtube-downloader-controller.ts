import { Request, Response, NextFunction } from 'express'
import * as fs from 'fs'
var ytdl = require('ytdl-core');
const path = require('path');

export class YoutubeDownloaderController {

    constructor() {
        this.downloadVideo = this.downloadVideo.bind(this) //makes me bind this to proper this
        this.downloadVideoG = this.downloadVideoG.bind(this) //makes me bind this to proper this

    }

    public downloadVideo(req: Request, res: Response, next: NextFunction) {
        const url = req.body.ytURL
        this.download(url,req,res,next)
    }

    public downloadVideoG(req: Request, res: Response, next: NextFunction) {
        const url = req.query.ytURL
        this.download(url,req,res,next)
    }
    
    private download(url: String, req: Request, res: Response, next: NextFunction) {
        ytdl(url, { filter: (format) => format.container === 'mp4' })
        .pipe(fs.createWriteStream('video.mp4')).on('finish', () => {
            res.download('video.mp4')
        }).on('error', (e) => {
            console.log(`error occured ${e}`)
            next(e)
        })
    }
}
