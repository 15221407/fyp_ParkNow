/**
 * ParkingRecordController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

getParkingState: function(req,res){
  ParkingRecord.findOne({ uid : req.session.uid , state:'enter'}).exec(function(err,record){
    if(record != null){
      console.log("Parking State: enter" )
      return res.send("enter")
    }
  })
},

getLicensePlate:function(req,res){

  ParkingRecord.findOne({ uid : req.session.uid , state:'enter'}).exec(function(err,record){
    if(record == null){
      console.log("LicensePlate: No Record" )
      return res.send("No Record")
    }else {
      console.log("LicensePlate: " + record.licensePlate)
      return res.send(record.licensePlate)
  }
  })

},

getEnterAt:function(req,res){

  ParkingRecord.findOne({ uid : req.session.uid , state:'enter'}).exec(function(err,record){
    if(record == null){
      console.log("enterAt: No Record" )
      return res.send("No Record")
    }else {
      console.log("enterAt: " + record.enterAt)
      return res.send(new Date(record.enterAt).toLocaleString())
  } 
  })

},


getParkingTime:function(req,res){

  ParkingRecord.findOne({ uid : req.session.uid , state:'enter'}).exec(function(err,record){
    if(record == null){
      console.log("enterAt: No Record" )
      return res.send("No Record"); 
    }else {
      var enterTime = new Date(record.enterAt);
      var currentTime = new Date();
      var diff = currentTime .getTime() - enterTime.getTime();
      console.log(diff);
      return res.send(diff.toString()); 
  } 
  })

},


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


calculate: function(req, res){
  //calculate the total parking fee
  var hour ;
  var feePerHour ; 
  var totalFee ;

  ParkingRecord.findOne({ uid : req.session.uid , state:'enter'}).exec(function(err,record){
    if(record == null){
      console.log("culcalate: No Record" )
      totalFee = 0 ;
      res.send(totalFee.toString());
      // return res.send("No Record"); 
    }else {
      var enterTime = new Date(record.enterAt);
      var currentTime = new Date();
      var diff = currentTime .getTime() - enterTime.getTime();
      hour = Math.ceil(diff/3600000) ; 
      Mall.findOne({mallId : record.mallId}).exec(function(err,mall){
        feePerHour = mall.parkingFee;
        totalFee =  hour * feePerHour;
        res.send(totalFee+","+hour+","+feePerHour+","+record.mallName);
        // res.send({totalFee , hour,  feePerHour});
      })
  } 
  })
},

calculateBeforePay: function(req, res){
  //calculate the total parking fee
  var hour ;
  var finalFee ;
  var deductedPoint ;
  ParkingRecord.findOne({ uid : req.session.uid , state:'enter' }).exec(function(err,record){
      var enterTime = new Date(record.enterAt);
      var currentTime = new Date();
      var diff = currentTime .getTime() - enterTime.getTime();
      hour = Math.ceil(diff/3600000) ; 
      Mall.findOne({mallId : record.mallId}).exec(function(err,mall){
        finalFee =  (hour - req.body.redemptionHour) * mall.parkingFee ;
        deductedPoint = req.body.redemptionHour * mall.parkingFee ;
        if(finalFee > 0 ){
        module.exports.paymentMethod(req,finalFee,deductedPoint);
        }else{

        }
      })
  })
},

paymentMethod: function(req,totalFee,deductedPoint,res){
    console.log("payment method" + totalFee)
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
    // amount: "10.00",
    amount: totalFee,
    paymentMethodNonce: nonceFromTheClient,
    options: {
      submitForSettlement: true
    }
  }, function (err, result) {
    console.log(result.success);
    module.exports.updateAfterPayment(req,deductedPoint);
    // console.log(result.transaction.status);
    // res.send("Charged succefully")
  });
  
},

updateAfterPayment: function(req,deductedPoint){
  console.log("run????")
  ParkingRecord.findOne({ uid : req.session.uid , state:'enter'}).exec(function(err,record){
    record.paid = "Y" 
    record.save(); 

    Member.findOne({ uid : req.session.uid}).exec(function(err,member){
      member.point -= deductedPoint ;
      member.save();  
      
      Token.create().exec(function(err,token){
        token.uid = req.session.uid
        token.mallId = record.mallId
        token.mallName = record.mallName
        token.type = "redeem"
        token.amount = deductedPoint
        token.redeemAt =  new Date().toString();
        token.save()

      })
    })
  })
 
 


}

};



