const Order = require('../model/bussiness/order.model')
const {InternalError, NoEntryError, NoDataError} = require('../../core/ErrorHandler')
const paramHelper = require('../../helper/queryParam.helper')
const aggregateManager = require('../../helper/aggregateMaker.helper')
const _ = require('lodash')
const mongoose = require('mongoose')

module.exports = class OrderRepo {
    static async get_list(params) {
        const aggregate = aggregateManager(params, [])
        let data = await Order.aggregate(aggregate)
        data.count = await Order.countDocuments()
        return data
    }

    static async get_one(id) {
        let data = await Order.findById(id)
        if (data == null) throw new NoDataError()
        return data
    }

    static async update_one(id, newData) {
        let order
        order = await Order.findOneAndUpdate({_id: id}, newData, {returnOriginal: false})
        return order
    }

    static async create_one(data) {
        const order = new Order(data)
        const newOrder = await order.save()

        return newOrder
    }

    static async delete_one(id) {
        const order = await Order.deleteOne({_id: id})
        return this.get_list()
    }

    static async delete_list(ids) {
        ids.map((id) => {
            this.delete_one(id)
        })

        return this.get_list()
    }

    static async report_get_list_with_sum(params) {
        const aggregate = aggregateManager(
            params,
            [],
            [
                {
                    $group: {
                        _id: null,
                        allprice: {$sum: '$price'},
                        allpriceafteroff: {$sum: '$price_after_off'},
                        orders: {$push: '$$ROOT'},
                    },
                },
            ],
        )
        let data = await Order.aggregate(aggregate)
        return data
    }
    static async report_get_list_sum_product(params) {
        const aggregate = aggregateManager(
            params,
            [],
            [
                {
                    $unwind: '$detail',
                },
                {
                    $group: {
                        _id: '$detail.product',
                        count: {$sum: 1},
                        price: {$sum: '$price'},
                        priceafteroff: {$sum: '$price_after_off'},
                    },
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'product',
                    },
                },
                {$unwind: '$product'},
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'product.category',
                        foreignField: '_id',
                        as: 'category',
                    },
                },
                {$unwind: '$category'},
                {
                    $project: {
                        name: '$product.name',
                        code: '$product.code',
                        pic_url: '$product.pic_url',
                        category: '$category.name',
                        price: 1,
                        count: 1,
                        priceafteroff: 1,
                    },
                },
                {
                    $facet: {
                        data: [
                            {
                                $group: {
                                    _id: null,
                                    products: {$push: '$$ROOT'},
                                },
                            },
                        ],
                        total: [
                            {
                                $group: {
                                    _id: null,
                                    totalprice: {$sum: '$price'},
                                    totalpriceoff: {$sum: '$priceafteroff'},
                                    totalcount: {$sum: '$count'},
                                },
                            },
                        ],
                    },
                },
                {
                    $unwind: '$data',
                },

                {
                    $unwind: '$total',
                },
                {
                    $project: {
                        p: '$data.products',
                        t: '$total',
                    },
                },
                {
                    $unwind: '$p',
                },
                {
                    $project: {
                        count: '$p.count',
                        price: '$p.price',
                        priceoff: '$p.priceafteroff',
                        name: '$p.name',
                        code: '$p.code',
                        category: '$p.category',
                        pic_url: '$p.pic_url',
                        count_percent: {
                            $multiply: [
                                {
                                    $divide: ['$p.count', '$t.totalcount'],
                                },
                                100,
                            ],
                        },
                        price_percent: {
                            $multiply: [
                                {
                                    $divide: ['$p.price', '$t.totalprice'],
                                },
                                100,
                            ],
                        },
                        price_off_percent: {
                            $multiply: [
                                {
                                    $divide: ['$p.priceafteroff', '$t.totalpriceoff'],
                                },
                                100,
                            ],
                        },
                    },
                },
                {
                    $facet: {
                        data: [
                            {
                                $group: {
                                    _id: null,
                                    products: {$push: '$$ROOT'},
                                },
                            },
                        ],
                        total: [
                            {
                                $group: {
                                    _id: null,
                                    totalprice: {$sum: '$price'},
                                    totalpriceoff: {$sum: '$priceafteroff'},
                                    totalcount: {$sum: '$count'},
                                },
                            },
                        ],
                    },
                },
                {
                    $unwind: '$data',
                },

                {
                    $unwind: '$total',
                },
                {
                    $project: {
                        products: '$data.products',
                        total: '$total',
                    },
                },
            ],
        )
        let data = await Order.aggregate(aggregate)
        return data[0]
    }
}
