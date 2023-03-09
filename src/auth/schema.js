const Joi = require('@hapi/joi');
const { JoiAuthBearer } = require('../core/validation/validator');

module.exports = {
  apiKey: Joi.object()
    .keys({
      'x-api-key': Joi.string().required(),
    })
    .unknown(true),
  auth: Joi.object()
    .keys({
      authorization: JoiAuthBearer().required(),
    })
    .unknown(true),
};
