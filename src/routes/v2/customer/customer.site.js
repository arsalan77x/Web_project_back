const { SuccessResponse, BadRequestResponse, InternalErrorResponse, AuthFailureResponse } = require('../../../core/ApiResponse');
const CustomerRepo = require('../../../database/repository/CustomerRepo');
const Customer = require('../../../database/model/bussiness/customer.model');
const { ErrorHandler, BadRequestError, AuthFailureError } = require('../../../core/ErrorHandler');
const _ = require('lodash');
const paramHelper = require('../../../helper/queryParam.helper');
const mongoose = require('mongoose');
const validatePhone = require('../../../core/validatePhone');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const keystoreRepo = require('../../../database/repository/KeystoreRepo');
const { createTokens } = require('../../../auth/authUtils');

module.exports = {
    customer_site:
    {

        signup_phone: async function (req, res) {
            try {

                validatePhone(req, res)

            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },

        signup_phone_code: async function (req, res) {

            try {
                const phone = req.params.phone;
                const code = req.params.code;
                var verif_code;

                Customer.findOne({ phone: phone }).lean().exec(function (err, doc) {
                    try {
                        verif_code = doc.verif_code
                        if (true) {
                            Customer.updateOne({ phone: phone }, { $set: { verified: true }, $unset: { verif_code: verif_code } }, function (err, customer) {
                                if (err) {
                                    new AuthFailureResponse("کد وارد شده اشتباه است").send(res, {})
                                }
                                new SuccessResponse("با موفقیت تایید شد").send(res, {})
                            })
                        } else {
                            new AuthFailureResponse("کد وارد شده اشتباه است").send(res, {})

                        }
                    } catch (err) {
                        new InternalErrorResponse(err.message).send(res, {})
                    }

                });

            } catch (error) {
                ErrorHandler.handle(error, res)
            }

        },
        signup: async function (req, res) {

            try {
                const registeredCustomer = Customer.findOne({ phone: req.body.username, verified: true }, async function (err, newcustomer) {
                    if (!newcustomer) {
                        new AuthFailureResponse("شماره شما تایید نشده است").send(res, {})
                    } else {

                        newcustomer.username = req.body.username
                        newcustomer.password = req.body.password
                        newcustomer.name = req.body.name
                        newcustomer.email = req.body.email
                        console.log(newcustomer)
                        const customer = await CustomerRepo.update_one(newcustomer._id, newcustomer);
                        new SuccessResponse('AllSuccess').send(res, customer);
                    }

                })

            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },
        signin: async function (req, res) {
            try {
                let customer = await CustomerRepo.get_list({ filter: { "username": req.body.username } });
                if (customer.length == 0) throw new BadRequestError('UserNotRegistered');
                if (!customer[0].password) throw new BadRequestError('CredentialNotSet');
                customer = customer[0]

                const match = await bcrypt.compare(req.body.password, customer.password);
                if (!match) throw new AuthFailureError('AuthenticationFailure');

                const accessTokenKey = crypto.randomBytes(64).toString('hex');
                const refreshTokenKey = crypto.randomBytes(64).toString('hex');

                const keystore = await keystoreRepo.create(customer._id, accessTokenKey, refreshTokenKey);
                const tokens = await createTokens(customer, accessTokenKey, refreshTokenKey);

                const result = {
                    customer: _.pick(customer, ['_id', 'name', 'roles', 'profilePicUrl']),
                    tokens: tokens,
                }

                // for logging
                req.customer = customer
                new SuccessResponse('LoginSuccess').send(res, result);
            } catch (error) {
                ErrorHandler.handle(error, res);
            }
        },

        signout: async function (req, res) {
            try {
                await keystoreRepo.remove(req.keystore._id);
                new SuccessResponse('LogoutSuccess').send(res);
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },
        verify: async function (req, res) {
            try {
                const user = await CustomerRepo.get_one(req.user._id);
                new SuccessResponse('Verified').send(res, user);
            } catch (error) {
                ErrorHandler.handle(error, res)
            }

        }
    }
}