exports.showErrorResponse = (res, httpSTTCode, objError= {}) => {
    const { msg, error } =  objError

    return res.status(httpSTTCode).json({
        msg: msg || "Server error!",
        error: error || []
})
}