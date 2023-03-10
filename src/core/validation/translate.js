const { validationResult } = require('express-validator')
const fromEntries = require('object.fromentries')
const BadRequestResponse =require('../ApiResponse')
const { NotFoundError, ErrorHandler, BadRequestError } =  require('../../core/ErrorHandler')

const  translateMessages = (errObj, req)=> {

    const errArr = Object.entries(errObj)

   
    errArr.forEach(err => {
        Object.keys(req.polyglot.phrases).forEach(phrase => {
            if (phrase == err[1].msg) {
                err[1].msg = req.polyglot.t(phrase)
            }
        })
    })


    return fromEntries(errArr)
}

module.exports= async function validationErrorResponse(req, res, next){

    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty()) {
        const translated=JSON.stringify(translateMessages(validationErrors.mapped()))
        return ErrorHandler.handle(new BadRequestError(translated));
    } else {
        next()
    }
}