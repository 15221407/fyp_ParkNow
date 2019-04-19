/**
 * ParkingRecordController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  // json function
  json: function (req, res) {
    ParkingRecord.find().where({ uid : { contains: req.session.uid } , recordType : { contains: 'NP'}}).exec(function (err, records) {
        console.log(records)
        return res.json(records);
    });
  },

getParkingState: function(req,res){
  ParkingRecord.findOne({ uid : req.session.uid , state:'enter'}).exec(function(err,record){
    if(record != null){
      console.log(record.state + "," + record.paid);
      return res.send(record.state + "," + record.paid );
    }else{
      return res.send('leave,Y' )
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
    if(record == null || record.paid == "Y"){
        console.log("culcalate: No Record" )
        res.send("0");
      // return res.send("No Record"); 
    }else {
        var enterTime = new Date(record.enterAt);
        var currentTime = new Date();
        var diff = currentTime .getTime() - enterTime.getTime();
        hour = Math.ceil(diff/3600000) ; 
        Carpark.findOne({ carparkId : record.carparkId}).exec(function(err,carpark){
          
          feePerHour = carpark.parkingFee;
          totalFee =  hour * feePerHour;
          res.send(totalFee+","+hour+","+feePerHour+","+record.mallName);
        // res.send({totalFee , hour,  feePerHour});
      })
  } 
  })
},

calculateBeforePay: function(req,res){
  //calculate the total parking fee
  var hour ;
  var finalCharge ;
  var deductedPoint ;
  ParkingRecord.findOne({ uid : req.session.uid , state:'enter' }).exec(function(err,record){
      var enterTime = new Date(record.enterAt);
      var currentTime = new Date();
      var diff = currentTime .getTime() - enterTime.getTime();
      hour = Math.ceil(diff/3600000) ; 
      Carpark.findOne({ carparkId : record.carparkId}).exec(function(err,carpark){
        finalCharge =  (hour - req.body.redemptionHour) * carpark.parkingFee ;
        deductedPoint = req.body.redemptionHour * carpark.parkingFee ;
        
        //if the charge more than $0 -> payment
        if(finalCharge > 0 ){

          console.log("payment method" + finalCharge)
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
            amount: finalCharge,
            paymentMethodNonce: nonceFromTheClient,
            options: {
              submitForSettlement: true
            }
          }, function (err, result) {
            console.log(result.success);
            if (result.success){ 
              module.exports.updateAfterPayment(req,deductedPoint,finalCharge);
              res.send("Charged succefully");
            }
          });
        
        }else{
          module.exports.updateAfterPayment(req,deductedPoint,0);
          res.send("Charged succefully");
        }
      })
  })
},

updateAfterPayment: function(req,deductedPoint,totalFee){
  console.log("run????")
  ParkingRecord.findOne({ uid : req.session.uid , state:'enter'}).exec(function(err,parking){
    parking.paid = "Y" 
    parking.save(); 

    Member.findOne({ uid : req.session.uid}).exec(function(err,member){
      member.point -= deductedPoint ;
      member.save();  

      var dateString = new Date().toString();
      PaymentRecord.create().exec(function(err,payment){
        payment.paidAt = dateString;
        payment.mallId = parking.mallId;
        payment.mallName = parking.mallName;
        payment.uid = parking.uid;
        payment.paidFee = totalFee;
        payment.paymentOf = parking.parkingId;
        payment.save();
      })

      if(deductedPoint > 0){
        PointRecord.create().exec(function(err,point){
            point.actionAt = dateString;
            point.uid = parking.uid
            point.mallId = parking.mallId
            point.mallName = parking.mallName
            point.type = 'redeem'
            point.amount = deductedPoint
            point.save();
           })
       }
    })
  })
 


 


}

};



