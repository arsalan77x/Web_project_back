const mongoose = require('mongoose')
const regexQuery = require('./regexQuery.helper')

const filterHelper = (filter) => {
    var filter = JSON.parse(filter)
    return filter
}
module.exports = function paramHelper(req) {
    var filter = (req.query.filter) ? filterHelper(req.query.filter) : null
    var regex = (req.query.regex) ? JSON.parse(req.query.regex) : null
    var lang = (req.query.lang) ? req.query.lang : null

    var dateFilter = (req.query.date) ? JSON.parse(req.query.date) : null
    var skip = parseInt(req.query.skip, 10);
    var limit = parseInt(req.query.limit, 10);
    var field = req.query.sort;
    var order = parseInt(req.query.order, 10);
    var sort = {}
    sort[field] = order;

    const params = {}

    if (skip) params.skip = skip
    if (limit) params.limit = limit
    if (dateFilter) params.dateFilter = dateFilter
    if (order) params.sort = sort
    if (regex) params.regex = regexQuery(regex);
    if (filter) params.filter = filter
    if (lang) params.lang = lang

    return params
}