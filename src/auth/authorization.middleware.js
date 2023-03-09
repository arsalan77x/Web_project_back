const {
    AuthFailureError,
    AccessTokenError,
    TokenExpiredError,
    ErrorHandler,
} = require('../core/ErrorHandler')
const express = require('express')
const RoleRepo = require('../database/repository/RoleRepo')
const router = express.Router()

const authorization = router.use(async (req, res, next) => {
    try {
        console.log('hiiiiiii')
        if (!req.user || !req.user.roles) throw new AuthFailureError('PermissionDenied')

        const role = await RoleRepo.findByCode(req.currentRoleCode)
        if (!role) throw new AuthFailureError('PermissionDenied')

        const validRoles = req.user.roles.filter(
            (userRole) => userRole._id.toHexString() === role._id.toHexString(),
        )

        if (!validRoles || validRoles.length == 0) throw new AuthFailureError('PermissionDenied')

        return next()
    } catch (e) {
        ErrorHandler.handle(e, res)
    }
})

const role = (privilege) => (req, res, next) => {
    const PRIV_CODE = {
        admin: 3,
        user: 1,

    }
    req.currentRoleCode = PRIV_CODE[privilege]
    next()
}
module.exports = {authorization, role}
