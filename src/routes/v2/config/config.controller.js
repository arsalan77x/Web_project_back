const {SuccessResponse, AuthFailureResponse} = require('../../../core/ApiResponse')
const {BadRequestError, ForbiddenError, ErrorHandler} = require('../../../core/ErrorHandler')
const mongoose = require('mongoose')

const configModel = require('../../../database/model/bussiness/config.model')

module.exports = {
    config: {
        get_list: async function (req, res) {
            try {
                let config = await configModel.find()
                config = config[0]
                new SuccessResponse('AllSuccess').send(res, config)
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },
        get_one: async function (req, res) {
            try {
                let config = await configModel.find()
                config = config[0]
                const id = mongoose.Types.ObjectId(config._id)

                const conf = await configModel.findById(id)

                new SuccessResponse('AllSuccess').send(res, conf)
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },
        update_one: async function (req, res) {
            try {
                let config = await configModel.find()
                config = config[0]
                const newData = req.body
                const id = mongoose.Types.ObjectId(config._id)

                const conf = await configModel.findOneAndUpdate({_id: id}, newData, {
                    returnOriginal: false,
                })

                new SuccessResponse('AllSuccess').send(res, conf)
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },
    },
}
