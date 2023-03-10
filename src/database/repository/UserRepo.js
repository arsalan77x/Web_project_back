const User = require('../model/user.model')
const Role = require('../model/role.model')
const {InternalError, ForbiddenError, BadRequestError} = require('../../core/ErrorHandler')
const KeystoreRepo = require('./KeystoreRepo')
const {createTokens} = require('../../auth/authUtils')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const whatToUpdateHelper = require('../../helper/whatToUpdate.helper')
const aggregateManager = require('../../helper/aggregateMaker.helper')

module.exports = class UserRepo {
    static async get_list(params) {
        const aggregate = aggregateManager(
            params,
            [],
            [
                {
                    $project: {password: 0, verified: 0, status: 0},
                },
            ],
        )
        let data = await User.aggregate(aggregate)
        data.count = await User.countDocuments()

        return data
    }

    static async get_one(id) {
        let data = await User.findById(id)
        if (data == null) throw new NoDataError()
        return data
    }

    static async update_one(id, newData) {
        let updated
        updated = await this.updateInfo(id, newData)

        if (newData.password) updated = await this.updatePassword(id, newData.password)
        return this.get_one(id)
    }

    static async delete_one(id) {
        const user = await User.deleteOne({_id: id})
        return this.get_list()
    }

    static async delete_list(ids) {
        ids.map((id) => {
            this.delete_one(id)
        })

        return this.get_list()
    }
    static findById(id) {
        return User.findOne({_id: id, status: true})
            .select('+email +password +roles')
            .populate({
                path: 'roles',
                match: {status: true},
            })
            .lean()
            .exec()
    }

    static deleteById(id) {
        return User.deleteOne({_id: id}).lean().exec()
    }
    static findAll() {
        return User.find()
            .populate({
                path: 'roles',
                match: {status: true},
            })
            .lean()
            .exec()
    }
    static findByEmail(email) {
        return User.findOne({email: email, status: true})
            .select('+email +password +roles')
            .populate({
                path: 'roles',
                match: {status: true},
                select: {code: 1},
            })
            .lean()
            .exec()
        return {}
    }
    static findByUserName(username) {
        return User.findOne({username: username})
            .select('+email +password +roles')
            .populate({
                path: 'roles',
                match: {status: true},
                select: {code: 1},
            })
            .lean()
            .exec()
    }

    static async new_user(
        username,
        phone_number,
        job_title,
        name,
        email,
        password,
        profilePicUrl,
        rolls,
    ) {
        const user = await this.findByUserName(username)
        if (user) throw new BadRequestError('User already registered')

        const accessTokenKey = crypto.randomBytes(64).toString('hex')
        const refreshTokenKey = crypto.randomBytes(64).toString('hex')
        const passwordHash = await bcrypt.hash(password, 10)

        const {user: createdUser, keystore} = await this.create(
            {
                username: username,
                phone_number: phone_number,
                job_title: job_title,
                name: name,
                email: email,
                profilePicUrl: profilePicUrl,
                password: passwordHash,
            },
            accessTokenKey,
            refreshTokenKey,
            rolls,
        )

        const tokens = await createTokens(createdUser, keystore.primaryKey, keystore.secondaryKey)
        return {user: createdUser, token: tokens}
    }

    static async create(user, accessTokenKey, refreshTokenKey, roleCodes) {
        const now = new Date()
        let roles = []
        const mapResult = await roleCodes.map(async (roleCode) => {
            const role = await Role.findOne({code: roleCode})
                .select('+email +password')
                .lean()
                .exec()

            if (!role) throw new InternalError('RoleMustBeDefined')
            roles.push(role._id)
        })
        const a = await Promise.all(mapResult)
        user.roles = roles
        user.createdAt = user.updatedAt = now
        //create new user
        const createdUser = await User.create(user)
        const keystore = await KeystoreRepo.create(createdUser._id, accessTokenKey, refreshTokenKey)
        return {user: createdUser.toObject(), keystore: keystore}
    }

    static async updatePassword(userId, newPassword) {
        const now = new Date()

        const passwordHash = await bcrypt.hash(newPassword, 10)

        const result = await User.findOneAndUpdate(
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
        const result = await User.findOneAndUpdate(
            {_id: userId},
            {$set: {roles: roles, updatedAt: now}},
            {returnOriginal: false},
        )
            .lean()
            .exec()

        return result
    }

    static async updateInfo(userId, newData) {
        const now = new Date()
        const update = await whatToUpdateHelper(
            newData,
            ['password', 'roles', 'createdAt', 'updatedAt', '_id'],
            '',
        )
        const result = await User.findOneAndUpdate(
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

    static async updaate(user, accessTokenKey, refreshTokenKey) {
        user.updatedAt = new Date()
        await User.updateOne({_id: user._id}, {$set: {...user}})
            .lean()
            .exec()
        const keystore = await KeystoreRepo.create(user._id, accessTokenKey, refreshTokenKey)
        return {user: user, keystore: keystore}
    }

    static updateInfao(user) {
        user.updatedAt = new Date()
        return User.updateOne({_id: user._id}, {$set: {...user}})
            .lean()
            .exec()
    }
}

// module.exports = { UserRepo }
