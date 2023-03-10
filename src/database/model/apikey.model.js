const mongoose = require('mongoose')

const DOCUMENT_NAME = 'ApiKey';
const COLLECTION_NAME = 'apikeys';

const schema = new mongoose.Schema(
  {
    key: {
        type: String,
        required: true,
        unique: true,
        maxlength: 1024,
      },
      version: {
        type: Number,
        required: true,
        min: 1,
        max: 100,
      },
      metadata: {
        type: String,
        required: true,
      },
      status: {
        type: Boolean,
        default: true,
      },
      createdAt: {
        type: Date,
        required: true,
        select: false,
      },
      updatedAt: {
        type: Date,
        required: true,
        select: false,
      },
  },
  {
    versionKey: false,
  },
);
module.exports = mongoose.model(DOCUMENT_NAME, schema, COLLECTION_NAME);