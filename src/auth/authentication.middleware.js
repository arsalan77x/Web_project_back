const UserRepo = require('../database/repository/UserRepo');
const { AuthFailureError, AccessTokenError, TokenExpiredError, ErrorHandler } = require('../core/ErrorHandler');
const { JWT } = require('./JWT');

const KeystoreRepo = require('../database/repository/KeystoreRepo');
const { Types } = require('mongoose');
const { getAccessToken, validateTokenData } = require('./authUtils');
const { validator, ValidationSource } = require('../core/validation/validator');
const schema = require('./schema');
const express = require('express');
const CustomerRepo = require('../database/repository/CustomerRepo');

const router = express.Router();

module.exports = router.use(
    validator(schema.auth, ValidationSource.HEADER),
    async (req, res, next) => {
        try {
        req.accessToken = getAccessToken(req.headers.authorization, req);
            const payload = await JWT.validate(req.accessToken, req);
            validateTokenData(payload, req);

            let user = await UserRepo.findById(new Types.ObjectId(payload.sub));
            if (!user) {
                user = await CustomerRepo.get_one(new Types.ObjectId(payload.sub));
                if (!user) throw new AuthFailureError('UserNotRegistered');

            }
            req.user = user;


            const keystore = await KeystoreRepo.findforKey(req.user._id, payload.prm);
            if (!keystore) throw new AuthFailureError('InvalidAccessToken');
            req.keystore = keystore;

            return next();
        } catch (e) {

            ErrorHandler.handle(e, res);;
        }
    })

