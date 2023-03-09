const {SuccessResponse, AuthFailureResponse} = require('../../../core/ApiResponse')
const UserRepo = require('../../../database/repository/UserRepo')
const {BadRequestError, ForbiddenError, ErrorHandler} = require('../../../core/ErrorHandler')
const _ = require('lodash')
const mongoose = require('mongoose')
const paramHelper = require('../../../helper/queryParam.helper')
const fileUpload = require('../../../core/fileUpload')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const keystoreRepo = require('../../../database/repository/KeystoreRepo')
const {createTokens} = require('../../../auth/authUtils')

module.exports = {
    user: {
        get_list: async function (req, res) {
            try {
                const params = paramHelper(req)
                const user = await UserRepo.get_list(params)

                new SuccessResponse('AllSuccess').send(res, user)
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },
        get_one: async function (req, res) {
            try {
                const user_id = mongoose.Types.ObjectId(req.params.id)
                const user = await UserRepo.get_one(user_id)

                new SuccessResponse('AllSuccess').send(res, user)
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },
        update_one: async function (req, res) {
            try {
                const user_id = mongoose.Types.ObjectId(req.params.id)
                const newData = req.body
                if (newData.roles)
                    if (newData.roles.includes(5)) {
                        throw new ForbiddenError()
                    }
                const user = await UserRepo.update_one(user_id, newData)
                new SuccessResponse('AllSuccess').send(res, user)
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },
        create_one: async function (req, res) {
            try {
                const user = req.body
                if (user.roles.includes(5)) {
                    throw new ForbiddenError()
                }
                const result = await UserRepo.new_user(
                    user.username,
                    user.phone_number,
                    user.job_title,
                    user.name,
                    user.email,
                    user.password,
                    user.profilePicUrl,
                    user.roles,
                )
                new SuccessResponse('AllSuccess').send(res, result)
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },
        delete_one: async function (req, res) {
            try {
                const user_id = mongoose.Types.ObjectId(req.params.id)
                const user = await UserRepo.delete_one(user_id)
                new SuccessResponse('AllSuccess').send(res, user)
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },
        delete_list: async function (req, res) {
            try {
                const params = paramHelper(req)
                const user_ids = params.filter['user_ids']
                const user = await UserRepo.delete_list(user_ids)
                new SuccessResponse('AllSuccess').send(res, user)
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },
        signin: async function (req, res) {
            try {
                let user = await UserRepo.findByUserName(req.body.username)

                if (!user) throw new BadRequestError('UserNotRegistered')
                if (!user.password) throw new BadRequestError('CredentialNotSet')

                const match = await bcrypt.compare(req.body.password, user.password)
  
                const accessTokenKey = crypto.randomBytes(64).toString('hex')
                const refreshTokenKey = crypto.randomBytes(64).toString('hex')

                await keystoreRepo.create(user._id, accessTokenKey, refreshTokenKey)
                const tokens = await createTokens(user, accessTokenKey, refreshTokenKey)

                const result = {
                    user: _.pick(user, ['_id', 'name', 'roles', 'profilePicUrl']),
                    tokens: tokens,
                }

                // for logging
                req.user = user
                new SuccessResponse('LoginSuccess').send(res, result)
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },

        signout: async function (req, res) {
            try {
                await keystoreRepo.remove(req.keystore._id)
                new SuccessResponse('LogoutSuccess').send(res)
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },
        verify: async function (req, res) {
            try {
                const key = await keystoreRepo.findforKey(req.user._id, req.keystore.primaryKey)
                if (key) {
                    new SuccessResponse('Verified').send(res, req.user.roles)
                }
                new AuthFailureResponse().send(res)
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },
    },
}
