class ExpresError extends Error{
    constructor(statusCode, message){
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = ExpresError;