"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controllers_1 = require("../controllers/user.controllers");
const router = (0, express_1.Router)();
router.route('/auth/register').post(user_controllers_1.registerUser);
router.route('/auth/login').post(user_controllers_1.loginUser);
router.route('/greet').get(user_controllers_1.greet);
exports.default = router;
