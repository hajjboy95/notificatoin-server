import { Document, Schema, Model, model } from "mongoose";

export interface IListing {
    title: string;
    price: string;
    imgUrl: string;
    images: string[];
}

let ListingSchema = new Schema({
    title: String,
    price: String,
    imgUrl: String,
    images: [{type: String}],
}, {timestamps: true});

export interface IListingModel extends IListing, Document {
    _id: string;
}

export const Listing: Model<IListingModel> = model<IListingModel>("Listing", ListingSchema);