const express = require('express')
const Logger = require('./core/Logger')
const bodyParser = require('body-parser')
const cors = require('cors')
const {corsUrl, environment} = require('../config')
const {NotFoundError, ErrorHandler, InternalError} = require('./core/ErrorHandler')
const createLocaleMiddleware = require('express-locale')
const whichLangMiddleware = require('./i18n/whichLangMiddleware')
const handleAllRoutes = require('./routes/routing')
const {databaseConnector} = require('./database')
const fileUpload = require('express-fileupload')
const visitor = require('./core/logger.middleware')
const { NotFoundResponse } = require('./core/ApiResponse')
const dbConnection = databaseConnector()

process.on('uncaughtException', (e) => {
    console.log(e)
    Logger.error(e)
})
const app = express()
app.use(cors())
app.options('*', cors())

app.use(visitor)
app.use(bodyParser.json({limit: '20mb'}))
app.use(bodyParser.urlencoded({limit: '20mb', extended: true, parameterLimit: 50000}))
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3002'], optionsSuccessStatus: 200 }));

app.use(
    createLocaleMiddleware({
        priority: ['accept-language', 'default'],
        default: 'en_US',
    }),
)
app.use(whichLangMiddleware)
app.use(fileUpload())

app.use('/api/v2', express.static(__dirname + '../../public'))
handleAllRoutes(app)

app.use((req, res, next) => next(new NotFoundResponse("URL notfound")))
app.use((err, req, res, next) => {
    if (err instanceof ErrorHandler) {
        console.log(err)

        ErrorHandler.handle(err, res)
    } else {
        if (environment === 'development') {
            Logger.error(err)
            return res.status(500).send(err.message)
        }
        console.log(err)

        ErrorHandler.handle(new InternalError(), res)
    }
})

module.exports = app
