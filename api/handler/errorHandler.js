const debug = require('debug')('errorHandler');
const error = require('./error');

function clientErrorHandler(err, req, res, next) {
    debug(err);
    if(err instanceof error.ClientError) {
        res.status(err.statusCode).json({ message: err.message });
    } else {
        next(err);
    }
}

module.exports = {
    clientErrorHandler
}