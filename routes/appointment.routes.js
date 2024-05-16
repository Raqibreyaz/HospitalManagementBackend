import express from 'express'
import { appointUser, getAllAppointments, updateAppointmentStatus, deleteAppointment } from '../controllers/appointment.controllers.js';
import { isAdminAuthenticated, isPatientAuthenticated } from '../middlewares/auth.middlewares.js'

const router = express.Router()

router.post('/appoint', isPatientAuthenticated, appointUser)

router.get('/all-appointments', isAdminAuthenticated, getAllAppointments)

router.post('/update/:id', isAdminAuthenticated, updateAppointmentStatus)

router.post('/delete/:id', isAdminAuthenticated, deleteAppointment)

export default router;