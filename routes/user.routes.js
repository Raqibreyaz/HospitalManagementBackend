import express from 'express'
import { getAllDoctors, getUserDetails, loginUser, logoutUser, addNewPatient, addNewAdmin, addNewDoctor } from '../controllers/user.controllers.js'
import { isAdminAuthenticated, isDoctorAuthenticated, isPatientAuthenticated } from '../middlewares/auth.middlewares.js'

const router = express.Router()

router.post('/patient/register', addNewPatient)

router.post('/login', loginUser)

router.post('/admin/addnew', isAdminAuthenticated, addNewAdmin)

router.get('/get-doctors', getAllDoctors)

router.get('/patient/me', isPatientAuthenticated, getUserDetails)

router.get('/admin/me', isAdminAuthenticated, getUserDetails)

router.get('/doctor/me', isDoctorAuthenticated, getUserDetails)

router.get('/admin/logout', isAdminAuthenticated, logoutUser)

router.get('/patient/logout', isPatientAuthenticated, logoutUser)

router.get('/doctor/logout', isDoctorAuthenticated, logoutUser)

router.post('/doctor/addnew', isAdminAuthenticated, addNewDoctor)

export default router

