const { SuccessResponse } = require('../../../core/ApiResponse');
const CategoryRepo = require('../../../database/repository/CategoryRepo');
const { ErrorHandler } = require('../../../core/ErrorHandler');
const _ = require('lodash');
const paramHelper = require('../../../helper/queryParam.helper');
const mongoose = require('mongoose')
const fileUpload = require('../../../core/fileUpload')
module.exports = {
    category:
    {
        get_list: async function (req, res) {
            try {
                const params = paramHelper(req)
                const category = await CategoryRepo.get_list(params);

                new SuccessResponse('AllSuccess').send(res, category);
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },
        get_one: async function (req, res) {
            try {
                const id = mongoose.Types.ObjectId(req.params.id)
                const category = await CategoryRepo.get_one(id);

                new SuccessResponse('AllSuccess').send(res, category);
            } catch (error) {
                ErrorHandler.handle(error, res)
            }

        },
        create_one: async function (req, res) {
            try {
                const newData = req.body
                const category = await CategoryRepo.create_one(newData);
                new SuccessResponse('AllSuccess').send(res, category);
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },
        update_one: async function (req, res) {
            try {
                const id = mongoose.Types.ObjectId(req.params.id)

                const newData = req.body
                const category = await CategoryRepo.update_one(id, newData);
                new SuccessResponse('AllSuccess').send(res, category);
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },

        delete_one: async function (req, res) {
            try {
                const id = mongoose.Types.ObjectId(req.params.id)
                const garage = await CategoryRepo.delete_one(id);
                new SuccessResponse('AllSuccess').send(res, garage);
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },
        delete_list: async function (req, res) {
            try {
                const params = paramHelper(req)
                const category_ids = (params.filter["category_ids"])
                const categorys = await CategoryRepo.delete_list(category_ids);
                new SuccessResponse('AllSuccess').send(res, categorys);
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        }
    }
}