/**
 * ParkingRecordController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

prepay: function(req, res){

  //configure the environment and API credentials
  var braintree = require("braintree");
  var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "9ryqdwt6ng94trgr",
  publicKey: "yr9qv5znttpcbgrj",
  privateKey: "74b56a0784d0b8528683dc3bca7d118b"
});

  //Generate a client token and Send a client token to your client
  gateway.clientToken.generate({}, function (err, response) {
    console.log("Client Token " + response.clientToken +" is generated.");
    var clientToken = response.clientToken
    res.send(response.clientToken);
  });
},

paymentMethod: function(req,res){

    //configure the environment and API credentials
    var braintree = require("braintree");
    var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: "9ryqdwt6ng94trgr",
    publicKey: "yr9qv5znttpcbgrj",
    privateKey: "74b56a0784d0b8528683dc3bca7d118b"
  });

  //Create a transaction
  console.log("The nonce From The Client is " + req.body.payment_method_nonce);
  var nonceFromTheClient = req.body.payment_method_nonce;
  gateway.transaction.sale({
    amount: "10.00",
    paymentMethodNonce: nonceFromTheClient,
    options: {
      submitForSettlement: true
    }
  }, function (err, result) {
    console.log(result.success);
    console.log(result.transaction.status);
    
  });
  
}

};



