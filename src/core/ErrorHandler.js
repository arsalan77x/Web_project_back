const environment = require('../../config')
const {
  AuthFailureResponse,
  AccessTokenErrorResponse,
  InternalErrorResponse,
  NotFoundResponse,
  BadRequestResponse,
  ForbiddenResponse,
} = require('./ApiResponse');
const Logger = require('./Logger');


class ErrorHandler extends Error {
  constructor(statusCode, message) {

    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Logger.error({ status: this.status, message: message, statusCode: statusCode });

    Error.captureStackTrace(this, this.constructor);
  }


  static handle(err, res) {
    console.log(err)
    switch (err.statusCode) {
      case ErrorType.BAD_TOKEN:
      case ErrorType.TOKEN_EXPIRED:
      case ErrorType.UNAUTHORIZED:
        return new AuthFailureResponse(err.message).send(res);
      case ErrorType.ACCESS_TOKEN:
        return new AccessTokenErrorResponse(err.message).send(res);
      case ErrorType.INTERNAL:
        return new InternalErrorResponse(err.message).send(res);
      case ErrorType.NOT_FOUND:
      case ErrorType.NO_ENTRY:
      case ErrorType.NO_DATA:
        return new NotFoundResponse(err.message).send(res);
      case ErrorType.BAD_REQUEST:
        return new BadRequestResponse(err.message).send(res);
      case ErrorType.FORBIDDEN:
        return new ForbiddenResponse(err.message).send(res);
      default: {
        let message = err.message;

        if (environment === 'production') message = 'Something wrong happened.';
        return new InternalErrorResponse(message).send(res);
      }
    }
  }


}


const ErrorType = {
  BAD_TOKEN: 'BadTokenError',
  TOKEN_EXPIRED: 'TokenExpiredError',
  UNAUTHORIZED: 'AuthFailureError',
  ACCESS_TOKEN: 'AccessTokenError',
  INTERNAL: 'InternalError',
  NOT_FOUND: 'NotFoundError',
  NO_ENTRY: 'NoEntryError',
  NO_DATA: 'NoDataError',
  BAD_REQUEST: 'BadRequestError',
  FORBIDDEN: 'ForbiddenError',
}

class AuthFailureError extends ErrorHandler {
  constructor(message = 'نام کاربری یا رمز عبور اشتباه است') {
    super(ErrorType.UNAUTHORIZED, message);
  }
}

class InternalError extends ErrorHandler {
  constructor(message = 'مشکل درونی پیش آمده است') {
    super(ErrorType.INTERNAL, message);
  }
}

class BadRequestError extends ErrorHandler {
  constructor(message = 'درخواست بدی بود') {
    super(ErrorType.BAD_REQUEST, message);
  }
}

class NotFoundError extends ErrorHandler {
  constructor(message = 'پیدا نشد که') {
    super(ErrorType.NOT_FOUND, message);
  }
}

class ForbiddenError extends ErrorHandler {
  constructor(message = 'شما دسترسی ندارید') {
    super(ErrorType.FORBIDDEN, message);
  }
}

class NoEntryError extends ErrorHandler {
  constructor(message = "این موجود نیست اصلا") {
    super(ErrorType.NO_ENTRY, message);
  }
}

class BadTokenError extends ErrorHandler {
  constructor(message = 'توکن شما غیرفعال شده') {
    super(ErrorType.BAD_TOKEN, message);
  }
}

class TokenExpiredError extends ErrorHandler {
  constructor(message = 'توکن شما کارش تمومه') {
    super(ErrorType.TOKEN_EXPIRED, message);
  }
}

class NoDataError extends ErrorHandler {
  constructor(message = 'غیر قاب دسترس') {
    super(ErrorType.NO_DATA, message);
  }
}

class AccessTokenError extends ErrorHandler {
  constructor(message = 'توکن مورد قبول نیست') {
    super(ErrorType.ACCESS_TOKEN, message);
  }
}

class ValidationError extends ErrorHandler {
  constructor(message = 'درخواست مورد پذیرش نیست') {
    super(ErrorType.BAD_REQUEST, message);
  }
}



module.exports = {
  ErrorHandler,
  AuthFailureError,
  AccessTokenError,
  NoDataError,
  TokenExpiredError,
  BadTokenError,
  NoEntryError,
  NotFoundError,
  BadRequestError,
  InternalError,
  ForbiddenError,

  ValidationError,
}