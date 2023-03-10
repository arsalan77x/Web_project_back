const Product = require('../model/bussiness/product.model');
const { InternalError, NoEntryError, NoDataError } = require('../../core/ErrorHandler');
const paramHelper = require('../../helper/queryParam.helper');
const aggregateManager = require('../../helper/aggregateMaker.helper');
const _ = require('lodash');
const mongoose = require('mongoose')


module.exports = class ProductRepo {

    static async get_list(params) {
        const aggregate = aggregateManager(params,
            [
                { $lookup: { from: 'categories', localField: 'category', foreignField: '_id', as: 'category' } },
                { $unwind: "$category" },

            ]
        )
        let data = await Product.aggregate(aggregate)
        data.count = await Product.countDocuments()
        return data
    }

    static async get_menu(params, catid) {
        let matchCategoryFilter = catid ? { $match: { category: catid } } : { $sort: { a: -1 } }
        const aggregate = aggregateManager(params,
            [
                matchCategoryFilter,
                { $lookup: { from: 'categories', localField: 'category', foreignField: '_id', as: 'category' } },
                { $unwind: "$category" },

            ],
            [
                { $group: { _id: '$category', products: { $push: '$$ROOT' } } },
                { $unwind: "$_id" },
                { $project: { 'products': 1, '_id': 0, 'category': '$_id' } }
            ]
        )
        let data = await Product.aggregate(aggregate)
        // console.log(data)
        return data
    }

    static async get_one(id) {
        let data = await Product.findById(id)
        if (data == null) throw new NoDataError()
        return data
    }

    static async update_one(id, newData) {
        const product = await Product.findOneAndUpdate({ _id: id }, newData, { returnOriginal: false })
        return product

    }

    static async create_one(data) {
        const product = new Product({
            name: data.name,
            caption: data.caption,
            product: data.product,
            price: data.price,
            packprice: data.packprice,
            order: data.order,
            ishidden: data.ishidden,
            donthave: data.donthave,
            size: data.size,
            off_percent: data.off_percent,
            star: data.star,
            pic_url: data.pic_url,
            code: data.code,
            daily_offer: data.daily_offer,
            daily_off: data.daily_off,
            price_after_off: data.price_after_off,
            types: data.types,
  
            category: data.category
        })
        const newProduct = await product.save()
        return newProduct
    }

    static async delete_one(id) {
        const product = await Product.deleteOne({ _id: id })
        return this.get_list()


    }

    static async delete_list(ids) {
        ids.map(id => {
            this.delete_one(id)
        })

        return this.get_list()

    }
}
