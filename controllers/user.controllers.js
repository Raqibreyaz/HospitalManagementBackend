import catchAsyncError from '../middlewares/catchAsyncError.middlewares.js'
import Apierror from '../middlewares/Apierror.middlewares.js'
import userModel from '../models/user.models.js'
import generateJwtUtils from '../utils/generateJwt.utils.js'
import cloudinary from 'cloudinary'

const addNewUser = catchAsyncError(async (req, res, next) => {

    // take all details
    const { firstName, lastName, email, phone, nic, dob, gender, password, role, doctorDepartment = '', } = req.body

    // if any details are missing then throw error
    if (!firstName || !lastName || !email || !phone || !gender || !password || !role) {
        return next(new Apierror("please fill full form", 400))
    }


    // check if user already exists or not
    let searchedUser = await userModel.findOne({ email })
    if (searchedUser) {
        return next(new Apierror("user already exists", 500))
    }

    // create user object with provided data
    let newUser = {
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        password,
        role
    }

    // when user is a doctor then check and do few more things
    if (role === 'doctor') {

        // doctor department is must
        if (!doctorDepartment)
            return next(new Apierror("please fill full form", 400))

        // check for avatar
        if (!req.files || Object.keys(req.files).length === 0)
            return next(new Apierror("doctor avatar required!", 400))

        const { doctorAvatar } = req.files

        // avatar should be in these formats
        const allowedFormats = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp']
        if (!allowedFormats.includes(doctorAvatar.mimetype))
            return next(new Apierror("file format not supported", 400))

        // now do upload media on cloud
        const cloudinaryResponse = await cloudinary.uploader.upload(doctorAvatar.tempFilePath)


        if (!cloudinaryResponse || cloudinaryResponse.error) {
            console.error('cloudinary error :', cloudinaryResponse.error || 'something went wrong with cloudinary')
        }

        // add details for department and doctor image
        newUser.doctorDepartment = doctorDepartment;
        newUser.doctorAvatar = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url
        }
    }

    let user = await userModel.create(newUser)
    generateJwtUtils(user, 200, `${user.role} registered successfully`, res)
}
)

const addNewPatient = catchAsyncError(async (req, res, next) => {
    req.body.role = 'patient'
    await addNewUser(req, res, next);
})

const addNewAdmin = catchAsyncError(async (req, res, next) => {
    req.body.role = 'admin'
    await addNewUser(req, res, next);
})

const addNewDoctor = catchAsyncError(async (req, res, next) => {
    req.body.role = 'doctor'
    await addNewUser(req, res, next);
}
)

const loginUser = catchAsyncError(async (req, res, next) => {

    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return next(new Apierror("please fill full form", 400))
    }

    let searchedUser = await userModel.findOne({ email }).select("+password")

    if (!searchedUser) {
        return next(new Apierror("Invalid Email or password", 400))
    }

    // since the user password is hidden so select the password to use it
    let passwordCheck = await searchedUser.comparePassword(password);

    if (!passwordCheck)
        return next(new Apierror("Invalid email or password", 400));

    if (role !== searchedUser.role)
        return next(new Apierror("user with this role doesnt exist", 404));

    generateJwtUtils(searchedUser, 200, "user logged in successfully", res)
})

const getAllDoctors = catchAsyncError(async (req, res, next) => {
    const doctors = await userModel.find({ role: "doctor" })
    return res.status(200).json({
        success: true,
        doctors
    })
}
)

const getUserDetails = catchAsyncError(async (req, res, next) => {
    return res.status(200).json({
        success: true,
        user: req.user
    })

}
)

const logoutUser = catchAsyncError(async (req, res, next) => {
    res.status(200)
        .cookie(`${req.user.role}Token`, "", {
            expires: new Date(Date.now()),
            httpOnly: true,
            secure:true,
            sameSite:"None"
        })
        .json({
            success: true,
            message: `${req.user.role} logged out`
        })
}
)

export { addNewPatient, addNewAdmin, addNewDoctor, loginUser, getAllDoctors, getUserDetails, logoutUser };