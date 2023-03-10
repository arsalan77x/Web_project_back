const mongoose = require('mongoose')

const DOCUMENT_NAME = 'Config';
const COLLECTION_NAME = 'configs';

const FactorSchema = new mongoose.Schema({
    today_date: {
        type: Date,
        required: false,
    },
    factor_number: {
        type: Number,
        required: false,
    }
})


const Schema = new mongoose.Schema({

    factor: {
        type: { FactorSchema },
        required: true,
    },
},
    {
        versionKey: false,
    },
);
module.exports = mongoose.model(DOCUMENT_NAME, Schema, COLLECTION_NAME)
