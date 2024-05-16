import Apierror from '../middlewares/Apierror.middlewares.js';
import catchAsyncError from '../middlewares/catchAsyncError.middlewares.js'
import appointmentModel from '../models/appointment.models.js';
import userModel from '../models/user.models.js';

const appointUser = catchAsyncError(async (req, res, next) => {

    // taking all details
    const { firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date,
        department,
        doctor_firstname,
        doctor_lastname,
        hasVisited,
        address
    } = req.body;

    // check details
    if (!firstName ||
        !lastName ||
        !email ||
        !phone ||
        !nic ||
        !dob ||
        !gender ||
        !appointment_date ||
        !department ||
        !doctor_firstname ||
        !doctor_lastname ||
        !address
    ) {
        return next(new Apierror("please fill complete details", 400))
    }
    // take patient
    let patient = req.user;

    // find doctor
    let doctor = await userModel.find({
        firstName: doctor_firstname,
        lastName: doctor_lastname,
        role: "doctor",
        doctorDepartment: department
    })

    // when no doctors are available
    if (doctor.length === 0)
        return next(new Apierror("No doctors found", 404))

    // when multiple doctors found
    if (doctor.length > 1)
        return next(new Apierror("doctor conflict error", 400))

    // initialize appoinment
    let appointment = await appointmentModel.create({
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date,
        department,
        doctor: {
            firstName: doctor_firstname,
            lastName: doctor_lastname
        },
        doctorId: doctor[0]._id,
        patientId: patient._id,
        hasVisited,
        address
    })

    // insert appointment in both user and the doctor profile
    // patient.appointments.push(appointment._id)
    // doctor.appointments.push(appointment._id)

    res.status(200).json({
        success: true,
        message: 'appointment sent successfully'
    })
}
)


const getAllAppointments = catchAsyncError(async (req, res, next) => {

    let appointments = await appointmentModel.find()

    return res.status(200).json({
        success: true,
        appointments
    })
}
)

const updateAppointmentStatus = catchAsyncError(async (req, res, next) => {

    const { id } = req.params

    let updatedAppointment = await appointmentModel.findByIdAndUpdate(id, req.body, {
        // will return a new document a modification of original
        new: true,
        // mongoose will validate as per the schema
        runValidators: true,
        // will not use the deprecated function
        useFindAndModify: false
    })

    if (!updatedAppointment)
        return next(new Apierror("Appointment Does not exist", 404))

    res.status(200).json({
        success: true,
        message: "appointment status updated",
        updatedAppointment
    })
}
)

const deleteAppointment = catchAsyncError(async (req, res, next) => {
    const { id } = req.params

    let deletedAppointment = await appointmentModel.deleteOne({ _id: id })

    if (!deletedAppointment)
        return next(new Apierror("Appointment Does not exist", 404))

    res.status(200).json({
        success: true,
        message: "appointment deleted",
        deletedAppointment
    })
}
)

export { appointUser, getAllAppointments, updateAppointmentStatus, deleteAppointment }