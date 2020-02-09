import {Request, Response, Application} from "express"
import {UserController} from "../controllers/user-controller"
import {Routes} from "./routes-interface"
import {Verify} from "../middleware/verify"

export class UserRoute implements Routes {

    public userController: UserController;

    constructor() {
        this.userController = new UserController();
    }

    routes(app: Application) {
        app.route('/user')
            .get(Verify.verifyOrdinaryUser, this.userController.getCurrentUserDetails)

        app.route('/user/all')
            .get(this.userController.getUsers)

        app.route('/user/register')
            .post(this.userController.createUser)

        app.route('/user/login')
            .post(this.userController.loginUser)

        app.route('/user/confirmation/:tokenId')
            .get(this.userController.confirmToken)
    }

}
