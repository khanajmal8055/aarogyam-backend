import { Router } from "express";
import { adminCreateUser, deleteAccount, deleteUser, getAllUsers, greet, loginUser, logoutUser, registerUser, updatePassword, updateProfile, updateUser, viewProfile } from "../controllers/user.controllers";
import { verifyJwt } from "../middlewares/authmiddleware";
import { isAdmin } from "../middlewares/admin.middleware";

const router = Router()

// Public Routes
router.route('/user/auth/register').post(registerUser)
router.route('/user/auth/login').post(loginUser)


// Secured User Routes
router.route('/user/auth/logout').post(verifyJwt,logoutUser)
router.route('/user/auth/view-profile').get(verifyJwt , viewProfile)
router.route('/user/auth/update-profile').patch(verifyJwt , updateProfile)
router.route('/user/auth/update-password').patch(verifyJwt , updatePassword)
router.route('/user/auth/delete-account').delete(verifyJwt,deleteAccount)

// Admin Secured Routes

router.route('/admin/user/create').post(verifyJwt,isAdmin,adminCreateUser)
router.route('/admin/user/get-accounts').get(verifyJwt,isAdmin,getAllUsers)
router.route('/admin/user/update-user:userId').patch(verifyJwt,isAdmin,updateUser)
router.route('/admin/user/delete-user:userId').delete(verifyJwt,isAdmin,deleteUser)


export default router