const express = require('express')
const LogRepo = require('../database/repository/LogRepo')
const visitor = (req, res, next) => {
    LogRepo.create_one(req.ip, req.path, req.method)
    next()
}
module.exports = visitor
