const mongoose = require('mongoose')

const DOCUMENT_NAME = 'Log'
const COLLECTION_NAME = 'logs'

const Schema = new mongoose.Schema(
    {
        ip: {
            type: String,
        },
        path: {
            type: String,
        },
        method: {
            type: String,
        },
        who: {
            type: String,
        },
        did: {
            type: String,
        },
        onthe: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            required: true,
            select: false,
        },
    },
    {
        versionKey: false,
    },
)

module.exports = mongoose.model(DOCUMENT_NAME, Schema, COLLECTION_NAME)
