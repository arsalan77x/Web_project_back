const { SuccessResponse } = require('../../../core/ApiResponse')
const { ErrorHandler } = require('../../../core/ErrorHandler')
const LogRepo = require('../../../database/repository/LogRepo')
const { report_get_list_with_sum, report_get_list_sum_product } = require('../../../database/repository/OrderRepo')
const paramHelper = require('../../../helper/queryParam.helper')
const { findOrderByToday } = require('../order/helper')

module.exports = {
    report: {
        todayorder: async function (req, res) {
            try {
                let now = new Date(Date.now())

                let namovaffagh = await findOrderByToday(now, { state: 'پرداخت ناموفق' })
                let movaffagh = await findOrderByToday(now, { state: 'ثبت سفارش موفق' })
                let readyServe = await findOrderByToday(now, { state: 'آماده شده جهت تحویل' })
                let readySend = await findOrderByToday(now, { state: 'ارسال شده توسط پیک' })
                let amadesazi = await findOrderByToday(now, { state: 'در حال آماده سازی' })

                var result = {
                    hozoori: 0,
                    namovaffagh: namovaffagh.length,
                    movaffagh: movaffagh.length,
                    readyServe: readyServe.length,
                    readySend: readySend.length,
                    amadesazi: amadesazi.length,
                }
                new SuccessResponse('AllSuccess').send(res, result)
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },
        orderListSum: async function (req, res) {
            try {
                const params = paramHelper(req)

                let result = await report_get_list_with_sum(params)
                new SuccessResponse('AllSuccess').send(res, result)
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },
        orderListSumProduct: async function (req, res) {
            try {
                const params = paramHelper(req)

                let result = await report_get_list_sum_product(params)
                new SuccessResponse('AllSuccess').send(res, result)
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },

        logQuery: async function (req, res) {
            try {
                const params = paramHelper(req)

                let result = await LogRepo.get_list(params)
                new SuccessResponse('AllSuccess').send(res, result)
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },
        newView: async function (req, res) {
            try {
                new SuccessResponse('AllSuccess').send(res, true)
            } catch (error) {
                ErrorHandler.handle(error, res)
            }
        },

    }
}
