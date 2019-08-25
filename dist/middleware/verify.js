"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const status_error_1 = require("../error/status-error");
class Verify {
}
Verify.getToken = (user) => {
    return jwt.sign({ data: user }, "config.secretKey", {
        expiresIn: 604800 // 1 week for token to expire
    });
};
Verify.verifyOrdinaryUser = (req, res, next) => {
    const token = (req.body.token || req.query.token || req.headers['x-access-token']);
    if (token) {
        jwt.verify(token, 'config.secretKey', (err, decoded) => {
            if (err) {
                const err = new status_error_1.default('You are not authenticated!');
                err.status = 401;
                next(err);
            }
            else {
                req.decoded = decoded;
                next();
            }
        });
    }
    else {
        const err = new status_error_1.default('No token provided!');
        err.status = 403;
        next(err);
    }
};
Verify.verifyAdmin = (req, res, next) => {
    const decodedBody = req.decoded;
    if (decodedBody.data.role === 0) { //change this to enum
        const err = new status_error_1.default('Only An Admin can be seen here :D');
        err.status = 401;
        return next(err);
    }
    else {
        next();
    }
};
exports.Verify = Verify;
//# sourceMappingURL=verify.js.map