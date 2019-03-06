import { Request, Response, NextFunction } from 'express'
import * as fs from 'fs'
var ytdl = require('ytdl-core');

export class YoutubeDownloaderController {
    downloadsPath =  `${__dirname}/../vids/`

    constructor() {
        this.downloadVideo = this.downloadVideo.bind(this) //makes me bind this to proper this
        this.indexpage = this.indexpage.bind(this) //makes me bind this to proper this
    }

    public downloadVideo(req: Request, res: Response, next: NextFunction) {
        console.log("HELLO downloadVideo" )
        console.log(req.body)
        const url = req.body.ytURL
        const videoFormat = req.body.videoFormat
        console.log(`url = ${url} \nvideoFormat = ${videoFormat}`)
        res.render('index.ejs', {videoUrl: url, format: videoFormat })
        // this.download(url,req,res,next)
    }

    public indexpage(req: Request, res: Response, next: NextFunction) {
        console.log("HELLO")
        // const url = req.query.ytURL
        // this.download(url,req,res,next)
        res.render('index.ejs', {videoUrl: null, format: null })
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
