import { Request, Response, Application } from "express";
import { UserController } from "../controllers/user-controller";
import { Routes } from  "./routes-interface";

export class UserRoute implements Routes {

    public userController: UserController

    constructor() {
        this.userController = new UserController();
    }

    routes(app: Application) {
        app.route('/user/register')
        .post(this.userController.createUser)

        app.route('/user/login')
        .post(this.userController.loginUser)
    }

}
