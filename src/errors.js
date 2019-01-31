const email = require('../config').email;

module.exports = class AppError extends Error {
    constructor(status = 500, code = "unknown", message = `Unknown error, please contact ${email} to get support.`) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
        this.code = code;
        this.status = status;
    }
};
