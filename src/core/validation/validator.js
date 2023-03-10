const Joi = require('@hapi/joi');
const Logger = require('../Logger');
const { BadRequestError } = require('../ErrorHandler');
const { Types } = require('mongoose');

const ValidationSource = {
    BODY: 'body',
    HEADER: 'headers',
    QUERY: 'query',
    PARAM: 'params',
}

const JoiObjectId = () =>
    Joi.string().custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) return helpers.error('any.invalid');
        return value;
    }, 'Object Id Validation');

const JoiUrlEndpoint = () =>
    Joi.string().custom((value, helpers) => {
        if (value.includes('://')) return helpers.error('any.invalid');
        return value;
    }, 'Url Endpoint Validation');

const JoiAuthBearer = () =>
    Joi.string().custom((value, helpers) => {
        if (!value.startsWith('Bearer ')) return helpers.error('any.invalid');
        if (!value.split(' ')[1]) return helpers.error('any.invalid');
        return value;
    }, 'Authorization Header Validation');

const validator = (schema, source = ValidationSource.BODY) => (
    req,
    res,
    next,
) => {
    try {

        const { error } = schema.validate(req[source]);

        if (!error) return next();

        const { details } = error;
        const message = details.map((i) => i.message.replace(/['"]+/g, '')).join(',');
        Logger.error(message);

        next(new BadRequestError(message));
    } catch (error) {
        next(error);
    }
};

module.exports = { ValidationSource, JoiObjectId, JoiUrlEndpoint, JoiAuthBearer, validator }
