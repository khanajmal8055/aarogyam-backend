"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controllers_1 = require("../controllers/user.controllers");
const authmiddleware_1 = require("../middlewares/authmiddleware");
const admin_middleware_1 = require("../middlewares/admin.middleware");
const router = (0, express_1.Router)();
// Public Routes
router.route('/user/auth/register').post(user_controllers_1.registerUser);
router.route('/user/auth/login').post(user_controllers_1.loginUser);
// Secured User Routes
router.route('/user/auth/logout').post(authmiddleware_1.verifyJwt, user_controllers_1.logoutUser);
router.route('/user/auth/view-profile').get(authmiddleware_1.verifyJwt, user_controllers_1.viewProfile);
router.route('/user/auth/update-profile').patch(authmiddleware_1.verifyJwt, user_controllers_1.updateProfile);
router.route('/user/auth/update-password').patch(authmiddleware_1.verifyJwt, user_controllers_1.updatePassword);
router.route('/user/auth/delete-account').delete(authmiddleware_1.verifyJwt, user_controllers_1.deleteAccount);
// Admin Secured Routes
router.route('/admin/user/create').post(authmiddleware_1.verifyJwt, admin_middleware_1.isAdmin, user_controllers_1.adminCreateUser);
router.route('/admin/user/get-accounts').get(authmiddleware_1.verifyJwt, admin_middleware_1.isAdmin, user_controllers_1.getAllUsers);
router.route('/admin/user/update-user:userId').patch(authmiddleware_1.verifyJwt, admin_middleware_1.isAdmin, user_controllers_1.updateUser);
router.route('/admin/user/delete-user:userId').delete(authmiddleware_1.verifyJwt, admin_middleware_1.isAdmin, user_controllers_1.deleteUser);
exports.default = router;
