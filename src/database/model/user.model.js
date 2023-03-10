const mongoose = require('mongoose')

const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'users';

const Schema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        maxlength: 300,
    },
    name: {
        type: String,
    },
    phone_number: {
        type: String,
    },
    job_title: {
        type: String,
    },
    email: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        trim: true,
        select: false,
    },
    profilePicUrl: {
        type: String,
        trim: true,
    },
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    }],
    verified: {
        type: Boolean,
        default: false,
    },
    status: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
        select: false,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        required: true,
        select: false,
    },
},
    {
        versionKey: false,
    },
);
module.exports = mongoose.model(DOCUMENT_NAME, Schema, COLLECTION_NAME)
