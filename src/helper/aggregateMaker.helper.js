const mongoose = require('mongoose')

module.exports = function aggregateManager(params, befor, after) {
    if (!params || Object.keys(params).length === 0) {
        params = {}
        params.sort = { 'createdAt': -1 }

    }
    if (!params.sort) params.sort = { 'createdAt': -1 }

    let aggregate = []
    if (befor)
        for (let val of befor) {
            aggregate.push(val)
        }
    if (params) {
        if (params.filter) aggregate.push({ $match: params.filter })
        if (params.regex) aggregate.push({ $match: params.regex })

        if (params.dateFilter) {
            const dateObj = params.dateFilter
            Object.keys(dateObj).forEach(function (key) {
                const dateTo = dateObj[key].to ?
                    new Date(dateObj[key].to) : new Date(Date.now())
                aggregate.push(
                    {
                        $match:
                        {
                            [`${key}`]:
                            {
                                "$gte": new Date(dateObj[key].from),
                                "$lte": dateTo
                            }
                        }
                    })
            });
        }

        if (params.sort) aggregate.push({ $sort: params.sort })
        if (params.skip) aggregate.push({ $skip: params.skip })
        if (params.limit) aggregate.push({ $limit: params.limit })
    }
    if (after)
        for (let val of after) {
            aggregate.push(val)
        }
    // console.log(aggregate)
    return aggregate
}