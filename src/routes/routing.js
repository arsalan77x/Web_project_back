module.exports = function handleAllRoutes(app) {
    const slider = require('./v2/slider/slider.routes')
    const config = require('./v2/config/config.routes')

    const category = require('./v2/category/category.routes')
    const product = require('./v2/product/product.routes')
    const customer = require('./v2/customer/customer.routes')
    const order = require('./v2/order/order.routes')
    const user = require('./v2/user/user.routes')
    const report = require('./v2/report/report.routes')
    const apiKeyMiddleware = require('../auth/apiKey.middleware')
    const {authorization} = require('../auth/authorization.middleware')
    const {role} = require('../auth/authorization.middleware')
    const authentication = require('../auth/authentication.middleware')

    app.use('/test', (req, res) => {
        res.status(200).send('work v2')
    })

    app.use('/api/v2/slider', apiKeyMiddleware, slider)
    app.use('/api/v2/config', apiKeyMiddleware, config)
 
   
    app.use('/api/v2/category', apiKeyMiddleware, category)
    app.use('/api/v2/product', apiKeyMiddleware, product)
    app.use('/api/v2/customer', apiKeyMiddleware, customer)
    app.use('/api/v2/order', apiKeyMiddleware, authentication, order)
    app.use('/api/v2/user', apiKeyMiddleware, user)
    app.use('/api/v2/report', apiKeyMiddleware, report)
}
