const mongoose = require('mongoose')

const DOCUMENT_NAME = 'Keystore';
const COLLECTION_NAME = 'keystores';

const schema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    primaryKey: {
      type: String,
      required: true,
    },
    secondaryKey: {
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

schema.index({ client: 1, primaryKey: 1 });
schema.index({ client: 1, primaryKey: 1, secondaryKey: 1 });

module.exports = mongoose.model(DOCUMENT_NAME, schema, COLLECTION_NAME);
