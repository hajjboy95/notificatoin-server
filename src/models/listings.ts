import { Document, Schema, Model, model  } from "mongoose";
import * as mongoose from "mongoose";

export interface IListing {
    title: string;
    price: string;
    imgUrl: string;
    images: string[any];
    summary: string,
    description: string,
    location: string,
    rating: number,
    vendorId: string
}

let ListingSchema = new Schema({
    title: {type: String, required: true},
    price: {type: String, required: true},
    imgUrl: {type: String, required: true},
    images: [{
        original: {type: String},
        thumbnail: {type: String}
    }],
    summary: {type: String, required: true, maxlength: 100},
    description: {type: String, required: true, maxlength: 4000},
    location: {type: String, required: true, maxlength: 100},
    rating: {type: String, required: true, min: 1, max:5},
    vendorId: {type: mongoose.Schema.Types.ObjectId,}
}, {timestamps: true});

export interface IListingModel extends IListing, Document {
    _id: string;
}

export const Listing: Model<IListingModel> = model<IListingModel>("Listing", ListingSchema);