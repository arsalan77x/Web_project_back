const {messageTranslator} = require('../i18n/translator')
const Logger = require('./Logger')
const StatusCode = {
    SUCCESS: 10000,
    FAILURE: 10001,
    RETRY: 10002,
    INVALID_ACCESS_TOKEN: 10003,
}

const ResponseStatus = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500,
}


const responseManager = async (response, res) => {
    try {
        const translated = await messageTranslator(response.message, res)
        if (translated !== '') response.message = translated
    } catch (err) {
        Logger.error('' + err)
    }
    return res.status(response.status).json(response)
}

class ApiResponse {
    constructor(statusCode, status, message) {
        this.response = {statusCode: statusCode, status: status, message: message}
        this.status = status
        this.statusCode = statusCode
        this.message = message
    }

    send = (res, data) => {
        if (data) {
            this.response.data = data
            this.response.count = data.count
        }
        return responseManager(this.response, res)
    }
}

class AuthFailureResponse extends ApiResponse {
    constructor(message = 'احراز هویت انجام نشد') {
        super(StatusCode.FAILURE, ResponseStatus.UNAUTHORIZED, message)
    }
}

class NotFoundResponse extends ApiResponse {
    constructor(message = 'پیدا نشد') {
        super(StatusCode.FAILURE, ResponseStatus.NOT_FOUND, message)
    }
}

class ForbiddenResponse extends ApiResponse {
    constructor(message = 'ممنوع') {
        super(StatusCode.FAILURE, ResponseStatus.FORBIDDEN, message)
    }
}

class BadRequestResponse extends ApiResponse {
    constructor(message = 'درخواست بد') {
        super(StatusCode.FAILURE, ResponseStatus.BAD_REQUEST, message)
    }
}

class InternalErrorResponse extends ApiResponse {
    constructor(message = 'مشکل درونی') {
        super(StatusCode.FAILURE, ResponseStatus.INTERNAL_ERROR, message)
    }
}

class SuccessMsgResponse extends ApiResponse {
    constructor(message = 'با موفقیت انجام شد') {
        super(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message)
    }
}

class FailureMsgResponse extends ApiResponse {
    constructor(message) {
        super(StatusCode.FAILURE, ResponseStatus.SUCCESS, message)
    }
}

class SuccessResponse extends ApiResponse {
    constructor(message = 'با موفقیت انجام شد') {
        super(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message)
    }
}

module.exports = {
    SuccessResponse,
    FailureMsgResponse,
    SuccessMsgResponse,
    InternalErrorResponse,
    BadRequestResponse,
    ForbiddenResponse,
    NotFoundResponse,
    AuthFailureResponse,
    ApiResponse,
}
