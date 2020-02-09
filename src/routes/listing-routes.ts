import { Request, Response } from "express"
import { ListingController } from "../controllers/listing-controller"
import { Routes } from  "./routes-interface"
import {Verify} from "../middleware/verify";

export class ListingRoute implements Routes {

    public listingController: ListingController = new ListingController();

    public routes(app) {
        app.route('/listing')
            .get(this.listingController.rootIndex)
            .post(Verify.verifyOrdinaryUser, this.listingController.createListing)
    }
}