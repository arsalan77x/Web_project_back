const express = require('express')
const { authorization, role } = require('../../../auth/authorization.middleware')
const authentication = require('../../../auth/authentication.middleware')
const router = express.Router()
const { report } = require('./report.controller')

router.get('/todayorder', authentication, role('admin'), authorization, report.todayorder)
router.get('/ordersum', authentication, role('admin'), authorization, report.orderListSum)
router.get('/ordersumproduct', authentication, role('admin'), authorization, report.orderListSumProduct)
router.get('/viewer', authentication, role('admin'), authorization, report.logQuery)

router.get('/newview', report.newView)

module.exports = router
