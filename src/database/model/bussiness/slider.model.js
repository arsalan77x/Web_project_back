const mongoose = require('mongoose')

const DOCUMENT_NAME = 'Slider';
const COLLECTION_NAME = 'sliders';


const Schema = new mongoose.Schema({

  title: {
    type: String,
    required: false
  },
  caption: {
    type: String,
    required: false
  },
  link: {
    type: String,
    required: false
  },
  pic_url: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    required: false,
    select: false,
  },
  updatedAt: {
    type: Date,
    required: false,
    select: false,
  },
},
  {
    versionKey: false,
  },
);

module.exports = mongoose.model(DOCUMENT_NAME, Schema, COLLECTION_NAME)
