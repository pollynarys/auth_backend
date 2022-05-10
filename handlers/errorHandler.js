module.exports = class CustomError extends Error {
    status
    errors

    constructor(status, message, errors = []) {
        super(message)
        this.status = status
        this.errors = errors
    }

    static UnauthorizedErr() {
        return new CustomError(401, 'user unauthorized')
    }

    static BadRequest(message, errors = []) {
        return new CustomError(400, message, errors)
    }
}
