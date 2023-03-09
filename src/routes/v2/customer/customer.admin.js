const { SuccessResponse } = require('../../../core/ApiResponse');
const CustomerRepo = require('../../../database/repository/CustomerRepo');
const { ErrorHandler } = require('../../../core/ErrorHandler');
const _ = require('lodash');
const paramHelper = require('../../../helper/queryParam.helper');
const mongoose = require('mongoose')

module.exports = {
    customer_admin:
    {

        get_list: async function (req, res) {
            try {
                const params = paramHelper(req)
                const customer = await CustomerRepo.get_list(params);

                new SuccessResponse('AllSuccess').send(res, customer);
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },
        
        get_one: async function (req, res) {
            try {
                const id = mongoose.Types.ObjectId(req.params.id)
                const customer = await CustomerRepo.get_one(id);

                new SuccessResponse('AllSuccess').send(res, customer);
            } catch (error) {
                ErrorHandler.handle(error, res)
            }

        },
        create_one: async function (req, res) {
            try {
                const newData = req.body
                const customer = await CustomerRepo.create_one(newData);
                new SuccessResponse('AllSuccess').send(res, customer);
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },
        update_one: async function (req, res) {
            try {
                const id = mongoose.Types.ObjectId(req.params.id)

                const newData = req.body
                const customer = await CustomerRepo.update_one(id, newData);
                new SuccessResponse('AllSuccess').send(res, customer);
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },

        delete_one: async function (req, res) {
            try {
                const id = mongoose.Types.ObjectId(req.params.id)
                const customer = await CustomerRepo.delete_one(id);
                new SuccessResponse('AllSuccess').send(res, customer);
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },
        delete_list: async function (req, res) {
            try {
                const params = paramHelper(req)
                const customer_ids = (params.filter["customer_ids"])
                const customers = await CustomerRepo.delete_list(product_ids);
                new SuccessResponse('AllSuccess').send(res, customers);
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        }
    }
}