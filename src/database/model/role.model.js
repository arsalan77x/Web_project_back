const mongoose = require('mongoose')

const DOCUMENT_NAME = 'Role';
const COLLECTION_NAME = 'roles';

const Schema = new mongoose.Schema({
    code: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    status: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
        select: false,
    },
    updatedAt: {
        type: Date,
        select: false,
    },
},
    {
        versionKey: false,
    },
);
module.exports = mongoose.model(DOCUMENT_NAME, Schema, COLLECTION_NAME)