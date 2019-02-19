"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
class JsonResponseStructure {
    static retJson(code, data, message, messageDetail, success, total) {
        return {
            code: code,
            data: data,
            message: message,
            messageDetail: messageDetail,
            success: success,
            total: total
        }
    }
}
exports.JsonResponseStructure = JsonResponseStructure
class MessageDetail {
    constructor(action, icon, title, type) {
        this.action = action
        this.icon = icon
        this.title = title
        this.type = type
    }
}
class IndexController {
    constructor() {
        console.log("index controller inititialized")
    }
    rootIndex(req, res) {
        res.json({
            message: "Amina 😘"
        })
    }
}
exports.IndexController = IndexController
//# sourceMappingURL=index-controller.js.map