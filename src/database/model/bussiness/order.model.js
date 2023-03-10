
const mongoose = require('mongoose')
const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'orders';

const typeCountSchema = new mongoose.Schema({
  size: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: false
  },
  count: {
    type: Number,
    required: false
  },

});




const addressSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false
  },
  detail: {
    type: String,
    required: false
  }

});

const pTypeSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',
    required: false
  },
  name: {
    type: String,
  },
  types: {
    type: [typeCountSchema],
    required: false
  },


});

const Schema = new mongoose.Schema({

  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'customer',
    required: true
  },
  product_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
      required: true
    }
  ],
  detail: [{
    type: pTypeSchema,
    required: false
  }],
  time: {
    type: Date,
    required: true,
    default: Date.now
  },
  is_new: {
    type: Boolean,
    default: true
  },
  is_print: {
    type: Boolean,
    default: false
  },
  print_time: {
    type: Number,
    default: 0
  },
  address: {
    type: addressSchema,
    required: true
  },
  customer_name: {
    type: String,
    required: false
  },
  customer_phone: {
    type: String,
    required: false
  },
  delivery_time: {
    type: String,
    required: false
  },
  state: {
    type: String,
    required: false
  },
  caption: {
    type: String,
    required: false
  },
  deliver_type: {
    type: String,
    required: false
  },
  pay_type: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: false
  },
  price_after_off: {
    type: Number,
    required: false
  },
  send_price: {
    type: Number,
    required: false
  }, 
  packprice: {
    type: Number,
    required: false
  },
  final_price_pay: {
    type: Number,
    required: false
  },

  ref_id: {
    type: String,
    required: false
  },
  factor_number: {
    type: String,
    required: false
  },
  factor_id: {
    type: String,
    required: false
  },
},
  {
    versionKey: false,
  },
);

module.exports = mongoose.model(DOCUMENT_NAME, Schema, COLLECTION_NAME)
