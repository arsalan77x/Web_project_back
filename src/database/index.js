const mongoose = require('mongoose')
const Logger = require('../core/Logger')
const {db} = require('../../config')


const prod_db = `mongodb://${db.user}:${encodeURIComponent(db.password)}@${db.host}:${db.port}/${db.name}`
//console.log(prod_db)
const dbURI = process.env.NODE_ENV == 'test' ? t_db : prod_db
const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    autoIndex: true,
    poolSize: 10, 
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000, 
    socketTimeoutMS: 45000, 
}

async function databaseConnector() {
    mongoose
        .connect(dbURI, options)
        .then(() => {
            Logger.info('Mongoose connection done')
        })
        .catch((e) => {
            Logger.info('Mongoose connection error')
            Logger.info(prod_db)
            Logger.error(e)
        })

    mongoose.connection.on('connected', () => {
    })


    mongoose.connection.on('error', (err) => {
        Logger.error('Mongoose default connection error: ' + err)
    })

    mongoose.connection.on('disconnected', () => {

    })


    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            
            process.exit(0)
        })
    })

    return mongoose.connection
}

module.exports = {databaseConnector}
