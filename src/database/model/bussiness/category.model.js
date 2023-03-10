
const mongoose = require('mongoose')

const DOCUMENT_NAME = 'Category';
const COLLECTION_NAME = 'categories';

const Schema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },
  caption: {
    type: String,
  },
  order: {
    type: Number,
  },
  icon: {
    type: String,
  },
  childs: {
    type: String,
    ref: 'category'
  },
},
  {
    versionKey: false,
  },
);


module.exports = mongoose.model(DOCUMENT_NAME, Schema, COLLECTION_NAME)
