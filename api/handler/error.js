 const util = require('util');

 const BAD_REQUEST = 400;
 const NOT_FOUND = 404;

 //40x Client Error
 function ClientError(message) {
     Error.call(this, message);
     Error.captureStackTrace(this, arguments.callee);
 };

util.inherits(ClientError, Error);

//400 Bad Request Error
function BadRequestError(message) {
    ClientError.call(this, message);
    this.statusCode = BAD_REQUEST;
};

util.inherits(BadRequestError, ClientError);

//404 Not Found Error
function NotFoundError(message) {
    ClientError.call(this, message);
    this.statusCode = NOT_FOUND;
}

util.inherits(NotFoundError, ClientError);

module.exports = {
    ClientError, 
    BadRequestError,
    NotFoundError
}
