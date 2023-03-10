const _ = require('lodash');

module.exports = function whatToUpdate(newData, omitList, prefixKey) {
    let body =newData
    let fieldToUpdate = {}
    body = _.omit(body, omitList)

    for (var key in body) {
        fieldToUpdate[`${prefixKey}${key}`] = newData[key]
    }

    fieldToUpdate[`${prefixKey}updatedAt`] = Date.now()

    return fieldToUpdate
}