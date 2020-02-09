import { Document, Schema, Model, model } from "mongoose";

export interface IListing {
    title: string;
    price: string;
    imgUrl: string;
    images: string[];
}

let ListingSchema = new Schema({
    title: {type: String, required: true},
    price: {type: String, required: true},
    imgUrl: {type: String, required: true},
    images: [{type: String}],
    summary: {type: String, required: true, maxlength: 100},
    description: {type: String, required: true, maxlength: 1000}
}, {timestamps: true});

export interface IListingModel extends IListing, Document {
    _id: string;
}

export const Listing: Model<IListingModel> = model<IListingModel>("Listing", ListingSchema);