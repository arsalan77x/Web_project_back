const Customer = require('../model/bussiness/customer.model')
const {NoDataError, BadRequestError, InternalError} = require('../../core/ErrorHandler')
const aggregateManager = require('../../helper/aggregateMaker.helper')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const _ = require('lodash')
const Role = require('../model/role.model')
const {createTokens} = require('../../auth/authUtils')
const whatToUpdateHelper = require('../../helper/whatToUpdate.helper')

const keystoreRepo = require('./KeystoreRepo')

module.exports = class CustomerRepo {
    static async get_list(params) {
        const aggregate = aggregateManager(params, [])
        let data = await Customer.aggregate(aggregate)
        data.count= await Customer.countDocuments()

        return data
    }

    static async get_one(id) {
        let data = await Customer.findById(id)
        if (data == null) throw new NoDataError()
        return data
    }

    static async update_one(id, newData) {
        let updated
        updated = await this.updateInfo(id, newData)

        if (newData.password) updated = await this.updatePassword(id, newData.password)
        return this.get_one(id)
    }

    static async create_one(data) {
        const customer = await this.get_list({filter: {username: data.username}})
        if (customer.length != 0) throw new BadRequestError('Customer already registered')

        const accessTokenKey = crypto.randomBytes(64).toString('hex')
        const refreshTokenKey = crypto.randomBytes(64).toString('hex')
        const passwordHash = await bcrypt.hash(data.password, 10)

        const newCustomer = {
            username: data.username,
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: passwordHash,
        }
        const createdCustomer = await Customer.create(newCustomer)
        const keystore = await keystoreRepo.create(
            createdCustomer._id,
            accessTokenKey,
            refreshTokenKey,
        )

        let returnedCustomer = {
            _id: createdCustomer._id,
            username: createdCustomer.username,
            name: createdCustomer.name,
        }
        const tokens = await createTokens(
            createdCustomer,
            keystore.primaryKey,
            keystore.secondaryKey,
        )
        return {customer: returnedCustomer, token: tokens}
    }

    static async delete_one(id) {
        const customer = await Customer.deleteOne({_id: id})
        return this.get_list()
    }

    static async delete_list(ids) {
        ids.map((id) => {
            this.delete_one(id)
        })

        return this.get_list()
    }

    static async updateInfo(userId, newData) {
        const update = await whatToUpdateHelper(
            newData,
            ['password', 'roles', 'createdAt', 'updatedAt', '_id'],
            '',
        )
        const result = await Customer.findOneAndUpdate(
            {_id: userId},
            {
                $set: update,
            },
            {returnOriginal: false},
        )
            .lean()
            .exec()
        return result
    }
    static async updatePassword(userId, newPassword) {
        const now = new Date()

        const passwordHash = await bcrypt.hash(newPassword, 10)

        const result = await Customer.findOneAndUpdate(
            {_id: userId},
            {$set: {password: passwordHash, updatedAt: now}},
            {returnOriginal: false},
        )
            .lean()
            .exec()

        return result
    }
    static async updateRoles(userId, newRoles) {
        const now = new Date()
        let roles = []
        const mapResult = await newRoles.map(async (roleCode) => {
            const role = await Role.findOne({code: roleCode})
                .select('+email +password')
                .lean()
                .exec()

            if (!role) throw new InternalError('RoleMustBeDefined')
            roles.push(role._id)
        })
        const a = await Promise.all(mapResult)
        const result = await Customer.findOneAndUpdate(
            {_id: userId},
            {$set: {roles: roles, updatedAt: now}},
            {returnOriginal: false},
        )
            .lean()
            .exec()

        return result
    }
}
