"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appointment_controllers_1 = require("../controllers/appointment.controllers");
const authmiddleware_1 = require("../middlewares/authmiddleware");
const admin_middleware_1 = require("../middlewares/admin.middleware");
const router = (0, express_1.Router)();
// Public Secured Routes
router.route('/user/appointment/book-appointment').post(authmiddleware_1.verifyJwt, appointment_controllers_1.bookAppointment);
router.route('/user/appointment/view-appointment').get(authmiddleware_1.verifyJwt, appointment_controllers_1.getAppointment);
router.route('/user/appointment/update-appointment:appointmentId').patch(authmiddleware_1.verifyJwt, appointment_controllers_1.updateAppointment);
router.route('/user/appointment/reshedule-appointment').patch(authmiddleware_1.verifyJwt, appointment_controllers_1.rescheduleAppointment);
router.route('/user/appointment/cancel-appointment').delete(authmiddleware_1.verifyJwt, appointment_controllers_1.cancelAppointment);
// Admin and staff secured Routes
router.route('/admin/appointment/get-appointments').get(authmiddleware_1.verifyJwt, admin_middleware_1.isAdmin, appointment_controllers_1.getAllAppointments);
router.route('/admin/appointment/update-status').patch(authmiddleware_1.verifyJwt, admin_middleware_1.isAdmin, appointment_controllers_1.updateAppointmentStatus);
exports.default = router;
