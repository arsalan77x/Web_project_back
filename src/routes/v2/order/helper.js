const {BadRequestError, InternalError} = require('../../../core/ErrorHandler')
const Config = require('../../../database/model/bussiness/config.model')
const {toIranTimeZone} = require('../../../core/persianDate')
const Order = require('../../../database/model/bussiness/order.model')
const Product = require('../../../database/model/bussiness/product.model')
const {InternalErrorResponse} = require('../../../core/ApiResponse')
const {CONFIG_ID} = require('../../../../config')




async function sendPriceCalc(lat, lon) {
    return 0
}

async function basketPriceCalc(req) {
    try {
        let priceAfterOff = 0
        let priceBeforeOff = 0
        let sumPackPrice = 0
        const products = await req.body.detail.map(async (requestedProduct) => {
            const foundedProduct = await Product.findById(
                requestedProduct.product,
                async function (err, localProduct) {
                    if (err) {
                        new BadRequestResponse(err.message).send(res)
                    } else {
                        if (localProduct.packprice) {
                            sumPackPrice += parseInt(localProduct.packprice)
                        }
                        const offPercent = localProduct.off_percent
                        const types = await requestedProduct.types.map(async (rtype) => {
                            let local = await localProduct.types.filter(
                                (ltype) => ltype._id == rtype._id,
                            )[0]

                            newType = {}
                            newType.id = rtype._id
                            newType.count = rtype.count
                            newType.size = local.size
                            newType.price = local.price
                            return newType
                        })
                        const alltypes = await Promise.all(types)

                        const priceOfProductAfterOff = await alltypes.map((type) => {
                            const total = type.count * type.price
                            if (offPercent === 0) {
                                return total
                            } else {
                                return total - total * (offPercent / 100)
                            }
                        })

                        const priceOfProductBeforeOff = await alltypes.map((type) => {
                            const total = type.count * type.price
                            return total
                        })

                        const donePriceAfterOff = await Promise.all(priceOfProductAfterOff)
                        const donePriceBeforeOff = await Promise.all(priceOfProductBeforeOff)

                        priceAfterOff += donePriceAfterOff.reduce((a, b) => a + b, 0)
                        priceBeforeOff += donePriceBeforeOff.reduce((a, b) => a + b, 0)
                    }
                },
            )
        })
        const numFruits = await Promise.all(products)
        req.priceAfter = priceAfterOff
        req.priceBefore = priceBeforeOff
        req.packprice = sumPackPrice
    } catch (err) {
        throw new InternalError()
    }
}

async function findOrderByToday(todayDate, filter) {
    let sixAmToday = new Date(Date.now())
    sixAmToday.setHours(6, 0, 0, 0)
    const iranToday = toIranTimeZone(sixAmToday)

    let sixAmYesterday = new Date(Date.now())
    sixAmYesterday.setDate(sixAmYesterday.getDate() - 1)
    sixAmYesterday.setHours(6, 0, 0, 0)
    const iranYesterday = toIranTimeZone(sixAmYesterday)

    let from = ''
    let to = ''
    if (todayDate > sixAmToday) {
        console.log('>')

        from = sixAmToday
        to = Date.now()
    } else {
        console.log('<')

        from = sixAmYesterday
        to = Date.now()
    }

    return Order.find({
        time: {
            $gte: from,
            $lte: to,
        },
        ...filter,
    })
        .lean()
        .exec()
}

async function getFactorNumberOfToday() {
    const config_id = CONFIG_ID
    let today = new Date(Date.now())

    const config = await Config.findOne({_id: config_id})
    let dayOfDB = config.factor.today_date
    dayOfDB = new Date(dayOfDB)
    dayOfDB.setHours(5, 0, 0, 0) // set 5 am to start of day

    let factor_number_db = config.factor.factor_number
    let factor_number

    if (dayOfDB < today) {
        let factor = {today_date: new Date(Date.now()), factor_number: 0}
        const updateDay = await Config.updateOne({_id: config_id}, {factor: factor})
        factor_number = 0
    } else {
        factor_number = factor_number_db + 1
        let factor = {today_date: new Date(Date.now()), factor_number: factor_number}
        const updateDay = await Config.updateOne({_id: config_id}, {factor: factor})
    }
    
    return factor_number
}

async function makeid(length) {
    var result = ''
    var characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
    var charactersLength = characters.length
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

module.exports = {sendPriceCalc, basketPriceCalc, findOrderByToday, getFactorNumberOfToday, makeid}
