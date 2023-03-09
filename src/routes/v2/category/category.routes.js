
const express = require('express')
const { authorization, role } = require('../../../auth/authorization.middleware')
const authentication = require('../../../auth/authentication.middleware')
const router = express.Router()
const { category } = require('./category.controller')

router.get('/list', category.get_list)
router.get('/one/:id', category.get_one)
router.put('/one', category.create_one)
router.patch('/one/:id', category.update_one)
router.delete('/one/:id', category.delete_one)
router.delete('/list', category.delete_list)


module.exports = router
