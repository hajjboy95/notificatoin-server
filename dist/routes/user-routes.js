"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("../controllers/user-controller");
const verify_1 = require("../middleware/verify");
class UserRoute {
    constructor() {
        this.userController = new user_controller_1.UserController();
    }
    routes(app) {
        app.route('/user')
            .get(verify_1.Verify.verifyOrdinaryUser, this.userController.getCurrentUserDetails);
        app.route('/user/all')
            .get(this.userController.getUsers);
        app.route('/user/register')
            .post(this.userController.createUser);
        app.route('/user/login')
            .post(this.userController.loginUser);
    }
}
exports.UserRoute = UserRoute;
//# sourceMappingURL=user-routes.js.map