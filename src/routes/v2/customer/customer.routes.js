
const express = require('express')
const { authorization, role } = require('../../../auth/authorization.middleware')
const authentication = require('../../../auth/authentication.middleware')
const router = express.Router()
const { customer_admin } = require('./customer.admin')
const { customer_site } = require('./customer.site')



router.get('/list', authentication, customer_admin.get_list)
router.get('/one/:id', authentication, customer_admin.get_one)
router.put('/one', authentication, role('admin'), authorization, customer_admin.create_one)
router.patch('/one/:id', authentication, customer_admin.update_one)
router.delete('/one/:id', authentication, role('admin'), authorization, customer_admin.delete_one)
router.delete('/list', authentication, role('admin'), authorization, customer_admin.delete_list)

router.get('/signup/ver/:phone', customer_site.signup_phone)
router.get('/signup/ver/:phone/:code', customer_site.signup_phone_code)
router.post('/signup', customer_site.signup)
router.post('/signout', authentication, customer_site.signout)



router.post('/signin', customer_site.signin)
router.get('/verify', authentication, customer_site.verify)

module.exports = router
