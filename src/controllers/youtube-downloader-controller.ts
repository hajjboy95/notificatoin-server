import { Request, Response, NextFunction } from 'express'
import * as fs from 'fs'
var ytdl = require('ytdl-core');


export class YoutubeDownloaderController {
    downloadsPath = `${__dirname}/../vids/`

    constructor() {
        this.downloadVideo = this.downloadVideo.bind(this) //makes me bind this to proper this
        this.indexpage = this.indexpage.bind(this) //makes me bind this to proper this
    }

    public async downloadVideo(req: Request, res: Response, next: NextFunction) {
        const url = req.body.ytURL
        const videoFormat = req.body.videoFormat

        try {
            const vidPath = await this.download(url, videoFormat)
            res.render('index.ejs', { videoUrl: url, format: videoFormat, err: null, vidPath: vidPath })
        } catch (error) {
            res.render('index.ejs', { videoUrl: url, format: videoFormat, err: error, vidPath: null })
        }
    }

    public indexpage(req: Request, res: Response, next: NextFunction) {
        console.log("HELLO")
        res.render('index.ejs', { videoUrl: null, format: null })
    }

    private async download(url: String, format: String) {
        return new Promise((res, rej) => {
            const currentTime = Date.now()
            const vidPath = `${this.downloadsPath}${currentTime}-vid.mp4`
            
            ytdl(url, { filter: (format) => format.container === 'mp4' })
                .pipe(fs.createWriteStream(vidPath))
                .on('finish', () => {
                    res(vidPath)
                }).on('error', (e) => {
                    rej(e)
                })
        })

    }
}
