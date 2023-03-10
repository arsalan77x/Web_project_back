const Slider = require('../model/bussiness/slider.model');
const { InternalError, NoEntryError, NoDataError } = require('../../core/ErrorHandler');
const paramHelper = require('../../helper/queryParam.helper');
const aggregateManager = require('../../helper/aggregateMaker.helper');
const whatToUpdate = require('../../helper/whatToUpdate.helper')
const _ = require('lodash');
const mongoose = require('mongoose')


module.exports = class SliderRepo {



    static async get_list(params) {
        const aggregate = aggregateManager(params,
            []
        )
        let data = await Slider.aggregate(aggregate)
        data.count= await Slider.countDocuments()

        return data
    }

    static async get_one(id) {
        let data = await Slider.findById(id)
        if (data == null) throw new NoDataError()
        return data
    }

    static async update_one(id, newData) {
        const slider = await Slider.findOneAndUpdate({ _id: id }, newData, { returnOriginal: false })
        return slider

    }

    static async create_one(data) {
        const slider = new Slider({
            title: data.title,
            caption: data.caption,
            link: data.link,
            pic_url: data.pic_url
        })
        const newSlider = await slider.save()
        return newSlider
    }

    static async delete_one(id) {
        const slider = await Slider.deleteOne({ _id: id })
        return this.get_list()


    }

    static async delete_list(ids) {
        ids.map(id => {
            this.delete_one(id)
        })
 
        return this.get_list()

    }
}
