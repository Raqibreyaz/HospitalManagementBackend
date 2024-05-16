import jwt from 'jsonwebtoken'
import Apierror from './Apierror.middlewares.js'
import catchAsyncError from './catchAsyncError.middlewares.js'
import userModel from '../models/user.models.js'

const isAdminAuthenticated = catchAsyncError(async (req, res, next) => {

    let token = req.cookies.adminToken

    // if  user has admin token
    if (!token)
        return next(new Apierror("admin is not authenticated", 400))

    // verify the admin
    let admin = jwt.verify(token, process.env.JWT_SECRET_KEY)

    req.user = await userModel.findById(admin.id)

    if (req.user.role !== "admin") {
        return next(new Apierror("user not authorized to this task", 500))
    }

    return next()
}
)

const isPatientAuthenticated = catchAsyncError(async (req, res, next) => {

    let token = req.cookies.patientToken

    // if  user has admin token
    if (!token)
        return next(new Apierror("patient is not authenticated", 400))

    // verify the admin
    let patient = jwt.verify(token, process.env.JWT_SECRET_KEY)

    req.user = await userModel.findById(patient.id)

    if (req.user.role !== "patient") {
        return next(new Apierror("user not authorized to this task", 500))
    }

    return next()
}
)

const isDoctorAuthenticated = catchAsyncError(async (req, res, next) => {

    let doctorToken = req.cookies.doctorToken;

    if (!doctorToken)
        return next(new Apierror("doctor is not authenticated"))

    let doctor = jwt.verify(doctorToken, process.env.JWT_SECRET_KEY)

    req.user = await userModel.findById(doctor.id)

    if (req.user.role !== "doctor")
        return next(new Apierror("user not authorized for this task", 400))

    return next()
}
)

export { isPatientAuthenticated, isAdminAuthenticated, isDoctorAuthenticated }
