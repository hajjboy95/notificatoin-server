import { Request, Response } from "express";
import { IndexController } from "../controllers/index-controller";
import { Routes } from  "./routes-interface";

export class IndexRoute implements Routes {

    public indexController: IndexController = new IndexController()

    public routes(app) {
        app.route('/')
        .get(this.indexController.rootIndex);
    }
}