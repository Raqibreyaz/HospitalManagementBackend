const catchAsyncError = (func) => {
    return async (req, res, next) => {
        Promise
            .resolve(func(req, res, next))
            .catch((error) => next(error))
    }

}


// const asynchandler = (fn) => {
//     return async (req, res, next) => {
//         try {
//             await fn(req, res, next)
//         } catch (error) {
//             res.status(error.code || 500).json({
//                 success: false,
//                 message: error.message
//             })
//         }
//     }
// }

export default catchAsyncError