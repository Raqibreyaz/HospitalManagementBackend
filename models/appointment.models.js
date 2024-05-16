import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: [3, "first name must contain at least 3 characters"]
    },
    lastName: {
        type: String,
        required: true,
        minLength: [3, "last name must contain at least 3 characters"]
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "please provide a valid email"]
    },
    phone: {
        type: String,
        required: true,
        minLength: [10, "phone number must contain exact 10 characters"],
        maxLength: [10, "phone number must contain exact 10 characters"],
    },
    nic: {
        type: String,
        required: true,
        minLength: [11, "Nic must contain exact 11 digits"],
        maxLength: [11, "Nic must contain exact 11 digits"]
    },
    dob: {
        type: Date,
        required: [true, "DOB is required"],
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: true
    },
    appointment_date: {
        type: Date,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    doctor: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        }
    },
    hasVisited: {
        type: Boolean,
        default: false
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    address: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    }
})

export default mongoose.model('appointment', appointmentSchema)

