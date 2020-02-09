import {NextFunction, Request, Response} from "express";
import {Listing} from '../models/listings'
import {DecodedRequest} from "../interfaces/decoded-request";
import {ResponseBody} from "../models/ResponseBody";

export class ListingController {

    constructor() {
        console.log("index controller inititialized")
    }

    public async rootIndex(req: Request, res: Response) {
        const listings = await Listing.find({});
        res.json(new ResponseBody(true, listings));
    }

    public async createListing(req: DecodedRequest, res: Response, next: NextFunction) {
        const {title, price, imgUrl, images} = req.body;
        if (!title || !price || !imgUrl || !images) {
            return next(new ResponseBody(false, "Missing Parameters"));
        }
        const listing = new Listing({
            title: title,
            price: price,
            imgUrl: imgUrl,
            images: images
        });
        await listing.save();
        return res.json(new ResponseBody(true, "successfully created"));
    }
}
