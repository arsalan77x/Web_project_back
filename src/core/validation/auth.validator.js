const {check} = require('express-validator')
module.exports = function validator(functionName){
    switch (functionName) {
        case 'login': {
            return [
                check('email')
                    .exists().withMessage('emailRequiredField')
                    .isEmail().withMessage('emailIsEmail'),
                check('password')
                    .exists().withMessage('passwordRequiredField')
            ]
        }
        case 'forgotPassword': {
            return [
                check('email')
                    .exists().withMessage('emailRequiredField')
                    .isEmail().withMessage('emailIsEmail')
            ]
        }
    }
}