const Log = require('../model/log.model')
const aggregateManager = require('../../helper/aggregateMaker.helper')

const _ = require('lodash')
const mongoose = require('mongoose')

module.exports = class LogRepo {
    static async get_list(params) {
        const aggregate = aggregateManager(params, [],
            [
                {
                    $group:
                    {
                        _id: { $dayOfYear: "$createdAt" },
                        click: { $sum: 1 },
                    }
                },
                {
                    $project: { _id: 0, day: "$_id", click: 1 }
                }
            ]
        )
        let data = await Log.aggregate(aggregate)

        return data
    }

    static async create_one(ip, path, method, who, did, on) {
        const newData = {
            ip: ip,
            path: path,
            method: method,
            who: who,
            did: did,
            onthe: on,
        }
        const log = new Log(newData)
        const newLog = await log.save()

        return newLog
    }
}
