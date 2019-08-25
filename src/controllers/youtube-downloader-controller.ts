import { Request, Response, NextFunction } from 'express'
import * as fs from 'fs'
import { rejects } from 'assert';
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');

export class YoutubeDownloaderController {
    // downloadsPath = `${__dirname}/../vids/`

    constructor() {
        this.downloadVideo = this.downloadVideo.bind(this) //makes me bind this to proper this
        this.indexpage = this.indexpage.bind(this) //makes me bind this to proper this
    }

    public async downloadVideo(req: Request, res: Response, next: NextFunction) {
        const url = req.body.ytURL
        const videoFormat = req.body.videoFormat

        const vidPath = await this.fakeDownload(url, videoFormat)
        res.render('video-downloaded.ejs', { videoUrl: vidPath })

        // try {
        //     const youtubeVideoPath = await this.downloadVid(url, videoFormat)
        //     res.render('index.ejs', { videoUrl: url, format: videoFormat, err: null, vidPath: youtubeVideoPath})    
        // } catch (error) {
        //     res.render('index.ejs', { videoUrl: url, format: videoFormat, err: error, vidPath: null })
        // }        
    }

    private async downloadVid(url: String, format: String) {
        return new Promise( async (res, rej) => {
            switch (format) {
                case 'mp4': {
                    try {
                        const vidPath = await this.download(url, format)
                        // res.render('index.ejs', { videoUrl: url, format: format, err: null, vidPath: vidPath })
                    } catch (error) {
                        rej(error)
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
        });
    }

    public indexpage(req: Request, res: Response, next: NextFunction) {
        res.render('index.ejs', { videoUrl: null, format: null })
    }

    private async fakeDownload(url: String, format: String) {
        return new Promise( (res, rej) => {
            const currentTime = Date.now()
            const vidPath = `${currentTime}-v.${format}`
            res(vidPath)
    
            setTimeout(() => {
                console.log("Download has finished")
            }, 3500)
        });
    }

    private async download(url: String, format: String) {
        return new Promise((res, rej) => {
            const currentTime = Date.now()
            const vidPath = `${currentTime}-v.${format}`
            
            ytdl(url, { filter: (format) => format.container === format })
                .pipe(fs.createWriteStream(vidPath))
                .on('finish', () => {
                    res(vidPath)
                })
                .on('error', (e) => {
                    rej(e)
            });
        })

    }
}
