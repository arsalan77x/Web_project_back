const ZarinpalCheckout = require('zarinpal-checkout');
const zarinpal = ZarinpalCheckout.create('a2f67692-cd20-4414-a80b-b292c84b4da0', false);

const paymentRequest = (desc,email,mobile,amount)=>{

    const a =zarinpal.PaymentRequest({
        Amount: amount, // In Tomans
        CallbackURL: 'https://api.bastanitarasht.ir/api/v2/order/payver',
        Description: desc,
        Email: email,
        Mobile: mobile
      }).then(response => {
          return response
      }).catch(err => {
        return {status:99}
      });
      return a
}

const paymentVerification = (amount, authority)=>{
    const response =zarinpal.PaymentVerification({
        Amount: amount, // In Tomans
        Authority: authority,
      }).then(response => {
          console.log(response)
        return response
      }).catch(err => {
        return {status:99}
      });
      return response
}

module.exports = {paymentRequest, paymentVerification };