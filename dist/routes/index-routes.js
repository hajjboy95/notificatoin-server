"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_controller_1 = require("../controllers/index-controller");
class IndexRoute {
    constructor() {
        this.indexController = new index_controller_1.IndexController();
    }
    routes(app) {
        app.route('/')
            .get(this.indexController.rootIndex);
    }
}
exports.IndexRoute = IndexRoute;
//# sourceMappingURL=index-routes.js.map