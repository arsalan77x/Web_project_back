const ApiKeyRepo = require('../database/repository/ApiKeyRepo');
const { ForbiddenError } = require('../core/ErrorHandler');
const Logger = require('../core/Logger');
const express = require('express');
const router = express.Router();
const { validator, ValidationSource } = require('../core/validation/validator');
const schema = require('./schema');


module.exports = router.use(
    validator(schema.apiKey, ValidationSource.HEADER),
    async (req, res, next) => {

        return next();
    })