import Apierror from "../middlewares/Apierror.middlewares.js";
import catchAsyncError from "../middlewares/catchAsyncError.middlewares.js";
import messageModel from "../models/message.models.js";

const sendMessage = catchAsyncError(async (req, res, next) => {
    
    const { firstName, lastName, email, phone, message } = req.body;

    if (!firstName || !lastName || !email || !phone || !message) {
        return next(new Apierror("please fill full form", 400))
    }

    let createdMessage = await messageModel.create({
        firstName,
        lastName,
        email,
        phone,
        message
    })

    return res.status(200).json({
        success: true,
        message: "message sent successfully"
    })
})

const getAllMessages = catchAsyncError(async (req, res, next) => {

    const messages = await messageModel.find();

    return res.status(200).json({
        success: true,
        messages
    })
}
)

export { sendMessage, getAllMessages }