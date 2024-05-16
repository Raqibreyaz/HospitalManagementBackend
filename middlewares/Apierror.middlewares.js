class Apierror extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
    }
}

export const errorMiddleware = (error, req, res, next) => {
    error.message = error.message || "Internal server error";
    error.statusCode = error.statusCode || 500

    // 11000 code occurs when a user already exists in the database
    if (error.code === 11000) {
        const message = `Duplicate ${Object.keys(error.keyValue)} entered`
        error = new Apierror(message, 400)
    }

    // occurs when token is expired
    if (error.name === "JsonWebTokenError") {
        const message = `json web token is expired , try again`
        error = new Apierror(message, 400)
    }

    // occurs when user enters invalid values
    if (error.name === "CastError") {
        const message = `invalid ${error.path}`
        error = new Apierror(message, 400)
    }

    const errorMessage = error.errors ? Object.values(error.errors).map((err) => (err.message)).join(' ') : error.message

    return res.status(error.statusCode).json({
        success: false,
        message: errorMessage
    })
}


export default Apierror;