const success = (code, message, data, res) => {
    res.status(200).send({
        code,
        message,
        data,
    })
}
const failed = (error, req, res, next) => {
    error.status = error.status || 500;
    next(error, req, res, next)
}
module.exports = {
    success,
    failed
}