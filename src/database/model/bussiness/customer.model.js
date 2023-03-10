const mongoose = require('mongoose')
const DOCUMENT_NAME = 'Customer';
const COLLECTION_NAME = 'customers';

const addressSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false
  },
  detail: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    select: false
  }

});

const Schema = new mongoose.Schema({

  name: {
    type: String,
    required: false
  },
  username: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    trim: true,
    select: false,
  },
  credit: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  is_deleted: {
    type: Boolean,
    required: true,
    default: false,
    select: false,
  },
  address: [{
    type: addressSchema,
    required: false
  }],
  pic_url: {
    type: String,
    required: false
  },

  sign_up_time: {
    type: Date,
    default: Date.now,
    required: true,
    select: false,
  },
  last_login_time: {
    type: Date,
    default: Date.now,
    required: true,
    select: false,

  },

  phone: {
    type: String,
    unique: true,
    required: false,
  },
  gender: {
    type: String,
    required: false,
  },
  nation_id: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  verif_code: {
    type: String,
    required: false,
  },
  verified: {
    type: Boolean,
    required: false,
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

