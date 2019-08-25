"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
const user_1 = require("../models/user");
const verify_1 = require("../middleware/verify");
class UserController {
    constructor() {
    }
    getUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const allUsers = yield user_1.User.find({});
            res.json({
                users: allUsers
            });
        });
    }
    getCurrentUserDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.decoded.data._id;
            const currentUser = yield user_1.User.find({ _id: userId });
            res.json({
                user: currentUser
            });
        });
    }
    loginUser(req, res, next) {
        passport.authenticate('local', function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return next(info);
            }
            req.logIn(user, function (err) {
                if (err) {
                    return next(new Error('Could not log in user'));
                }
                let token = verify_1.Verify.getToken(user);
                return res.status(200).json({
                    token: token
                });
            });
        })(req, res, next);
    }
    createUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let body = req.body;
            var newUser = new user_1.User({
                username: body.username,
                email: body.email,
                firstname: body.firstname,
                lastname: body.lastname,
                role: body.role,
                isVerified: body.isVerified,
                passwordResetToken: body.passwordResetToken,
                passwordResetExpires: body.passwordResetExpires,
                deviceTokens: body.deviceTokens,
                organisations: body.organisations,
            });
            try {
                const email = yield user_1.User.findOne({ email: newUser.email });
                if (email) {
                    return next(new Error("Email has already been registered"));
                }
                const user = yield user_1.User.register(newUser, req.body.password);
                if (!user) {
                    return next(new Error("No User Defined"));
                }
                yield passport.authenticate('local')(req, res, next);
                return res.status(200).json({ user });
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user-controller.js.map