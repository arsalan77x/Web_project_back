const Polyglot = require('node-polyglot')
const { messages } =require('./i18n') 

module.exports= async function whichLangMiddleware(req, res, next){
    const locale = req.locale.language
    res.langs = new Polyglot()
    if (locale == 'fr') {
        res.langs.extend(messages.fr)
    } else {
        res.langs.extend(messages.en)
    }

    next()
}