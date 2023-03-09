const express = require('express')
const {authorization, role} = require('../../../auth/authorization.middleware')
const authentication = require('../../../auth/authentication.middleware')
const router = express.Router()
const {product} = require('./product.controller')

router.get('/list', product.get_list)
router.get('/list/menu', product.get_menu)
router.get('/list/menu/:catid', product.get_menu_category)
router.get('/one/:id', product.get_one)
router.put('/one', product.create_one)
router.patch('/one/:id', product.update_one)
router.delete('/one/:id', product.delete_one)
router.delete('/list', product.delete_list)

module.exports = router
