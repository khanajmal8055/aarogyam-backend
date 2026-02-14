import { Router } from "express";
import { bookAppointment, cancelAppointment, getAllAppointments, getAppointment, rescheduleAppointment, updateAppointment, updateAppointmentStatus } from "../controllers/appointment.controllers";
import { verifyJwt } from "../middlewares/authmiddleware";
import { isAdmin } from "../middlewares/admin.middleware";

const router = Router()

// Public Secured Routes
router.route('/user/appointment/book-appointment').post(verifyJwt, bookAppointment)
router.route('/user/appointment/view-appointment').get(verifyJwt , getAppointment)
router.route('/user/appointment/update-appointment:appointmentId').patch(verifyJwt , updateAppointment)
router.route('/user/appointment/reschedule-appointment').patch(verifyJwt,rescheduleAppointment)
router.route('/user/appointment/cancel-appointment').delete(verifyJwt , cancelAppointment)


// Admin and staff secured Routes

router.route('/admin/appointment/get-appointments').get(verifyJwt,isAdmin, getAllAppointments)
router.route('/admin/appointment/update-status').patch(verifyJwt,isAdmin,updateAppointmentStatus)


export default router