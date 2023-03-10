const Category = require('../model/bussiness/category.model');
const { InternalError, NoEntryError, NoDataError } = require('../../core/ErrorHandler');
const paramHelper = require('../../helper/queryParam.helper');
const aggregateManager = require('../../helper/aggregateMaker.helper');
const whatToUpdate = require('../../helper/whatToUpdate.helper')
const _ = require('lodash');
const mongoose = require('mongoose')


module.exports = class CategoryRepo {



    static async get_list(params) {
        const aggregate = aggregateManager(params,
            []
        )
        let data = await Category.aggregate(aggregate)
        data.count= await Category.countDocuments()

        return data
    }

    static async get_one(id) {
        let data = await Category.findById(id)
        if (data == null) throw new NoDataError()
        return data
    }

    static async update_one(id, newData) {
        const category = await Category.findOneAndUpdate({ _id: id }, newData, { returnOriginal: false })
        return category

    }

    static async create_one(data) {
        const category = new Category({
            name: data.name,
            caption: data.caption,
            icon: data.icon,
            order:data.order
        })
        const newCategory = await category.save()
        return newCategory
    }

    static async delete_one(id) {
        const category = await Category.deleteOne({ _id: id })
        return this.get_list()


    }

    static async delete_list(ids) {
        ids.map(id => {
            this.delete_one(id)
        })

        return this.get_list()

    }
}
