
const messageTranslator = (msg, res) => {
    var translated = ""
    Object.keys(res.langs.phrases).forEach(phrase => {
        if (phrase == msg) {
            translated = res.langs.t(phrase)
        }
    })
    return translated
}
module.exports = { messageTranslator }