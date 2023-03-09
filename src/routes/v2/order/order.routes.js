const express = require('express')
const { authorization, role } = require('../../../auth/authorization.middleware')
const router = express.Router()
const { order } = require('./order.controller')

router.put('/one', order.create_one)
router.get('/list', role('admin'), authorization, order.get_list)
router.get('/list/:cid', order.get_customer_order)
router.get('/one/:id', order.get_one)
router.patch('/one/:id', role('admin'), authorization, order.update_one)
router.delete('/one/:id', role('admin'), authorization, order.delete_one)
router.delete('/list', role('admin'), authorization, order.delete_list)

router.get('/sendprice/:cid/:aid', order.send_price)

router.get('/payver', order.pay_verification)

module.exports = router
