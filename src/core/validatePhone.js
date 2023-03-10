var request = require('request');
const Customer = require('../database/model/bussiness/customer.model');
const { SuccessResponse, BadRequestResponse } = require('./ApiResponse');

module.exports = async function (req, res) {

  const phone = req.params.phone;
  const randomNum = JSON.stringify(Math.floor(Math.random() * (100000 - 10000) + 10000))
  const currnetConstomer = await Customer.findOne({ phone: phone }, function (err, doc) {
    if (doc && doc.verified) {
      new BadRequestResponse("این شماره قبلا ثبت شده است").send(res)
    } else {
      try {
        const customer = new Customer({
          phone: phone,
          verif_code: randomNum
        })
        if (doc) {
          const updatedcustomer = Customer.updateOne({ phone: phone }, { verif_code: randomNum })
        } else {
          var newCustomer = customer.save(function (err, doc) {
            if (!doc) {
              new BadRequestResponse("ثبت با مشکل مواجه شد").send(res)
            }
          })
        }
        new SuccessResponse("شماره ثبت شد ").send(res)
      } catch (err) {
        new BadRequestResponse(err).send(res)
      }

    }
  })


};