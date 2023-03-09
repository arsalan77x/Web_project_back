const { SuccessResponse } = require('../../../core/ApiResponse')
const ProductRepo = require('../../../database/repository/ProductRepo')
const { ErrorHandler } = require('../../../core/ErrorHandler')
const _ = require('lodash')
const paramHelper = require('../../../helper/queryParam.helper')
const mongoose = require('mongoose')

module.exports = {
    product: {
        get_list: async function (req, res) {
            try {
                const params = paramHelper(req)
                const product = await ProductRepo.get_list(params)

                new SuccessResponse('AllSuccess').send(res, product)
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },
        get_menu: async function (req, res) {
            try {
            
                const params = paramHelper(req)
                const product = await ProductRepo.get_menu(params)
      
                new SuccessResponse('AllSuccess').send(res, product)
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },
        get_menu_category: async function (req, res) {
            try {
                const catid = mongoose.Types.ObjectId(req.params.catid)
                const product = await ProductRepo.get_menu({}, catid)

                new SuccessResponse('AllSuccess').send(res, product)
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },
        get_one: async function (req, res) {
            try {
                const id = mongoose.Types.ObjectId(req.params.id)
                const product = await ProductRepo.get_one(id)

                new SuccessResponse('AllSuccess').send(res, product)
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },
        create_one: async function (req, res) {
            try {
                const newData = req.body
                const product = await ProductRepo.create_one(newData)
                new SuccessResponse('AllSuccess').send(res, product)
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },
        update_one: async function (req, res) {
            try {
                const id = mongoose.Types.ObjectId(req.params.id)

                const newData = req.body
                const product = await ProductRepo.update_one(id, newData)
                new SuccessResponse('AllSuccess').send(res, product)
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },

        delete_one: async function (req, res) {
            try {
                const id = mongoose.Types.ObjectId(req.params.id)
                const product = await ProductRepo.delete_one(id)
                new SuccessResponse('AllSuccess').send(res, product)
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },
        delete_list: async function (req, res) {
            try {
                const params = paramHelper(req)
                const product_ids = params.filter['product_ids']
                const products = await ProductRepo.delete_list(product_ids)
                new SuccessResponse('AllSuccess').send(res, products)
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },
    },
}
