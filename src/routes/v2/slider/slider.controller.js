const { SuccessResponse } = require('../../../core/ApiResponse');
const SliderRepo = require('../../../database/repository/SliderRepo');
const { ErrorHandler } = require('../../../core/ErrorHandler');
const _ = require('lodash');
const paramHelper = require('../../../helper/queryParam.helper');
const mongoose = require('mongoose')

module.exports = {
    slider:
    {
    
        get_list: async function (req, res) {
            try {
                const params = paramHelper(req)
                const slider = await SliderRepo.get_list(params);

                new SuccessResponse('AllSuccess').send(res, slider);
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },
        get_one: async function (req, res) {
            try {
                const id = mongoose.Types.ObjectId(req.params.id)
                const slider = await SliderRepo.get_one(id);

                new SuccessResponse('AllSuccess').send(res, slider);
            } catch (error) {
                ErrorHandler.handle(error, res)
            }

        },
        create_one: async function (req, res) {
            try {
                const newData = req.body
                const slider = await SliderRepo.create_one(newData);
                new SuccessResponse('AllSuccess').send(res, slider);
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },
        update_one: async function (req, res) {
            try {
                const id = mongoose.Types.ObjectId(req.params.id)

                const newData = req.body
                const slider = await SliderRepo.update_one(id, newData);
                new SuccessResponse('AllSuccess').send(res, slider);
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },

        delete_one: async function (req, res) {
            try {
                const id = mongoose.Types.ObjectId(req.params.id)
                const slider = await SliderRepo.delete_one(id);
                new SuccessResponse('AllSuccess').send(res, slider);
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },
        delete_list: async function (req, res) {
            try {
                const params = paramHelper(req)
                const slider_ids = (params.filter["slider_ids"])
                const sliders = await SliderRepo.delete_list(slider_ids);
                new SuccessResponse('AllSuccess').send(res, sliders);
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        }
    }
}