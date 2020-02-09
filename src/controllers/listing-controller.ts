import {NextFunction, Request, Response} from "express";
import {Listing} from '../models/listings'
import {DecodedRequest} from "../interfaces/decoded-request";
import {ResponseBody} from "../models/ResponseBody";

export class ListingController {

    constructor() {
        console.log("Listing controller initialized")
    }

    public async rootIndex(req: Request, res: Response) {
        const listings = await Listing.find({});
        res.json(new ResponseBody(true, listings));
    }

    public async createListing(req: DecodedRequest, res: Response, next: NextFunction) {
        const vendorId = req.decoded.data._id;
        const {title, price, imgUrl, images, summary, description, location, rating} = req.body;
        if (!title || !price || !imgUrl || !images || !summary || !description || !location || !rating) {
            return next(new ResponseBody(false, "Missing Parameters"));
        }
        const listing = new Listing({
            title: title,
            price: price,
            imgUrl: imgUrl,
            images: images,
            summary: summary,
            description: description,
            location: location,
            rating: rating,
            vendorId: vendorId
        });
        await listing.save();
        return res.json(new ResponseBody(true, "successfully created"));
    }

    public async findById(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        if (!id) {
            next(new ResponseBody(false, "Missing Id"));
        }
        try {
            const listing = await Listing.findById(id);
            res.json(new ResponseBody(true, listing));
        } catch(e) {
            next(new ResponseBody(false, e));
        }

    }
}
