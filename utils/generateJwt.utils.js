const generateJWt = function (user, status, message, res) {

    let token = user.generateJsonWebToken();

    let cookieName = `${user.role}Token`

    res.status(status).cookie(cookieName, token, {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 1000 * 60 * 60 * 24),
        httpOnly: true,
        secure:true,
        sameSite:"None"
    }).json({
        success: true,
        message: message,
        user,
        token
    })
}

export default generateJWt;