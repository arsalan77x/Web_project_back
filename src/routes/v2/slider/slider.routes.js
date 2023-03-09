
const express = require('express')
const { authorization, role } = require('../../../auth/authorization.middleware')
const authentication = require('../../../auth/authentication.middleware')
const router = express.Router()
const { slider } = require('./slider.controller')

router.get('/list', slider.get_list)
router.get('/one/:id', slider.get_one)
router.put('/one', slider.create_one)
router.patch('/one/:id', slider.update_one)
router.delete('/one/:id', slider.delete_one)
router.delete('/list', slider.delete_list)
module.exports = router
