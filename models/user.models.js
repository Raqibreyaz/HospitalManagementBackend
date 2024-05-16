import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = mongoose.Schema({
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
    password: {
        type: String,
        minLength: [8, "password must contain at least 8 characters"],
        required: true,
        // when getting the user password will not be given
        select: false
    },
    role: {
        type: String,
        enum: ["admin", "doctor", "patient"]
    },
    appointments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'appointment'
        }
    ],
    doctorDepartment: {
        type: String
    },
    doctorAvatar: {
        public_id: String,
        url: String
    }
})


userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        return next()
    }

    this.password = await bcrypt.hash(this.password, 10)
}
)

userSchema.methods.comparePassword = async function (enteredPassword) {
    let check = await bcrypt.compare(enteredPassword, this.password);

    return check
}

userSchema.methods.generateJsonWebToken = function () {
    return jwt.sign({ id: this._id, email: this.email }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES
    })
}

export default mongoose.model('user', userSchema)

