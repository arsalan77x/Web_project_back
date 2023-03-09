const express = require('express')
const authentication = require('../../../auth/authentication.middleware')
const { authorization, role } = require('../../../auth/authorization.middleware')
const router = express.Router()
const { user } = require('./user.controller')

router.post('/signin', user.signin)
router.post('/signout', authentication, user.signout)
router.get('/verify', authentication, user.verify)

router.get('/list', authentication, role('admin'), authorization, user.get_list)
router.get('/one/:id', user.get_one)
router.patch('/one/:id', authentication, role('admin'), authorization, user.update_one)
router.put('/one', authentication, role('admin'), authorization, user.create_one)
router.delete('/one/:id', authentication, role('admin'), authorization, user.delete_one)
router.delete('/list', authentication, role('admin'), authorization, user.delete_list)

module.exports = router
