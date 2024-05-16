import mongoose from "mongoose";
import validator from "validator";

const messageSchema = mongoose.Schema({
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
        validate: [validator.isEmail, "please provide a valid email"],
    },
    phone: {
        type: String,
        required: true,
        minLength: [10, "phone number must contain at exact 10 characters"],
        maxLength: [10, "phone number must contain at exact 10 characters"],
    },
    message: {
        type: String,
        required: true,
        minLength: [10, "Message must contain at least 10 characters"]
    },
    sentAt: {
        type: Date,
        default: Date.now()
    }
})

export default mongoose.model("message", messageSchema)