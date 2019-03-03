import { Request, Response, NextFunction } from 'express'

export class YoutubeDownloaderController {

    constructor() {
        this.downloadVideo = this.downloadVideo.bind(this) //makes me bind this to proper this

    }

    public async downloadVideo(req: Request, res: Response, next: NextFunction) {
        res.json({
            message: req.body
        })
    }

    
}
