import { Request, Response, NextFunction } from 'express'
import * as fs from 'fs'
var ytdl = require('ytdl-core');

export class YoutubeDownloaderController {
    downloadsPath =  `${__dirname}/../vids/`

    constructor() {
        this.downloadVideo = this.downloadVideo.bind(this) //makes me bind this to proper this
        this.downloadVideoG = this.downloadVideoG.bind(this) //makes me bind this to proper this
    }

    public downloadVideo(req: Request, res: Response, next: NextFunction) {
        const url = req.body.ytURL
        this.download(url,req,res,next)
    }

    public downloadVideoG(req: Request, res: Response, next: NextFunction) {
        // const url = req.query.ytURL
        // this.download(url,req,res,next)
        res.render('index.ejs', {title: "😘 Amina 😘", user: "😘"})
    }

    private download(url: String, req: Request, res: Response, next: NextFunction) {
        const currentTime = Date.now()
        const vidPath = `${this.downloadsPath}${currentTime}-vid.mp4`

        ytdl(url, { filter: (format) => format.container === 'mp4' })
        .pipe(fs.createWriteStream(vidPath))
        .on('finish', () => {
            res.download(vidPath)
        }).on('error', (e) => {
            next(e)
        })
    }
}
