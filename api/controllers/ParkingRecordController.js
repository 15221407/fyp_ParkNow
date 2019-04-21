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


// calculate: function(req, res){
//   //calculate the total parking fee
//   var hour ;
//   var feePerHour ; 
//   var totalFee ;

//   ParkingRecord.findOne({ uid : req.session.uid , state:'enter'}).exec(function(err,record){
//     if(record == null || record.paid == "Y"){
//         console.log("culcalate: No Record" )
//         res.send("0");
//       // return res.send("No Record"); 
//     }else {
//         var enterTime = new Date(record.enterAt);
//         var currentTime = new Date();
//         var diff = currentTime .getTime() - enterTime.getTime();
//         hour = Math.ceil(diff/3600000) ; 
//         Carpark.findOne({ carparkId : record.carparkId}).exec(function(err,carpark){
          
//           feePerHour = carpark.parkingFee;
//           totalFee =  hour * feePerHour;
//           res.send(totalFee+","+hour+","+feePerHour+","+record.mallName);
//         // res.send({totalFee , hour,  feePerHour});
//       })
//   } 
//   })
// },

calculate: function(req, res){
  //calculate the total parking fee
  ParkingRecord.findOne({ uid : req.session.uid , state:'enter'}).exec(function(err,record){
    if(record == null || record.paid == "Y"){
        console.log("culcalate: No Record" )
        res.send("0");
      // return res.send("No Record"); 
    }else {
        var enterTime = new Date(record.enterAt);
        var currentTime = new Date();
        var offerDict = {}

        Carpark.findOne({ carparkId : record.carparkId}).exec(function(err,carpark){
          Offer.find().where({ carparkId: { contains: record.carparkId}}).exec(function(err,offers){
            //put offer into Dictionary
            for (x in offers) {
             var index = offers[x].dayIndex;
              offer = [ offers[x].day , offers[x].startTime , offers[x].endTime,offers[x].charge]
              offerDict[index] = offer ;
            }          

            var totalCharge = 0 ; 
            var hour = 0 ;
            var peakHour = 0 ;
            var freeParkingHr = 3;
            var free1 = 0 ;
            var free2 = 0 ;
            var free3 = 0 ;

            while( enterTime < currentTime ){
              var sDay = enterTime.getDay();
              var enterTimeStr = enterTime.toTimeString();
              var enterTimeStr = enterTimeStr.split(' ')[0];

              if(sDay in offerDict){
                  if( (enterTimeStr > offerDict[sDay][1]) &&  ( enterTimeStr < offerDict[sDay][2])){
                    //in peak hour
                    totalCharge += offerDict[sDay][3];
                    peakHour += 1;
                    hour += 1;
                  }else if (sDay == 0 || sDay == 6){
                    //in normal hour on weekends
                    totalCharge += carpark.chargeOnWeekends ;
                    hour += 1;
                  }else{
                    //in normal hour on weekdays
                    totalCharge += carpark.chargeOnWeekday ;
                    hour += 1;
                  }
              }else{
                if (sDay == 0 || sDay == 6){
                  //in normal hour on weekends
                  totalCharge += carpark.chargeOnWeekends ;
                  hour += 1;
                }else{
                  //in normal hour on weekdays
                  totalCharge += carpark.chargeOnWeekday ;
                  hour += 1;
                }
              }
              enterTime.setHours( enterTime.getHours() + 1 );

              if( freeParkingHr == 3){
                free1 = totalCharge;
              }else if (freeParkingHr == 2){
                free2 = totalCharge;
              }else if (freeParkingHr == 1){
                free3 = totalCharge;
              }
              freeParkingHr -= 1;
            }
            console.log("totalCharge")
            console.log(totalCharge)
            console.log(peakHour)
            console.log(hour)
            console.log(free1)
            console.log(free2)
            console.log(free3)

          res.send(record.mallName + "," + totalCharge + "," + hour + "," + free1 + ","+ free2 + ","+ free3);
      })
    })
  } 
  })
},

  calculateBeforePay: function(req,res){
  ParkingRecord.findOne({ uid : req.session.uid , state:'enter'}).exec(function(err,record){
    if(record == null || record.paid == "Y"){
        console.log("culcalate: No Record" )
        res.send("0");
    }else {

    var enterTime = new Date(record.enterAt);
    var currentTime = new Date();
    var offerDict = {}

    Carpark.findOne({ carparkId : record.carparkId}).exec(function(err,carpark){
      Offer.find().where({ carparkId: { contains: record.carparkId}}).exec(function(err,offers){
        //put offer into Dictionary
        for (x in offers) {
        var index = offers[x].dayIndex;
          offer = [ offers[x].day , offers[x].startTime , offers[x].endTime,offers[x].charge]
          offerDict[index] = offer ;
        }          

        var totalCharge = 0 ; 
        var redemptionHour = req.body.redemptionHour;
        var redemptionPoint = req.body.redemptionPoint;

        while( enterTime < currentTime ){
          var sDay = enterTime.getDay();
          var enterTimeStr = enterTime.toTimeString();
          var enterTimeStr = enterTimeStr.split(' ')[0];

          if(sDay in offerDict){
              if( (enterTimeStr > offerDict[sDay][1]) &&  ( enterTimeStr < offerDict[sDay][2])){
                //in peak hour
                totalCharge += offerDict[sDay][3];
              }else if (sDay == 0 || sDay == 6){
                //in normal hour on weekends
                totalCharge += carpark.chargeOnWeekends ;
              }else{
                //in normal hour on weekdays
                totalCharge += carpark.chargeOnWeekday ;
              }
          }else{
            if (sDay == 0 || sDay == 6){
              //in normal hour on weekends
              totalCharge += carpark.chargeOnWeekends ;
            }else{
              //in normal hour on weekdays
              totalCharge += carpark.chargeOnWeekday ;
            }
          }
          enterTime.setHours( enterTime.getHours() + 1 );

          if(redemptionHour < 0 ){
            redemptionPoint = totalCharge
            redemptionHour -= 1;
            console.log("redemption")
            console.log(redemptionHour)
            console.log(redemptionPoint)
          }
        }

        console.log("payment method" + totalCharge)
        var finalCharge = totalCharge - redemptionPoint;
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
          amount: finalCharge,
          paymentMethodNonce: nonceFromTheClient,
          options: {
            submitForSettlement: true
          }
        }, function (err, result) {
          console.log(result.success);
          if (result.success){ 
            // module.exports.updateAfterPayment(req,deductedPoint,finalCharge);
            res.send("Charged succefully");
          }
        });

    });
    });
  }
  });
},

updateAfterPayment: function(req,res){
  console.log("run????")
  console.log(req.body);
  ParkingRecord.findOne({ uid : req.session.uid , state:'enter'}).exec(function(err,parking){
    parking.paid = "Y" 
    parking.save(); 

    Member.findOne({ uid : req.session.uid}).exec(function(err,member){
      console.log(req.body.redemptionPoint)
      member.point -= req.body.redemptionPoint ;
      member.save();  

      var dateString = new Date().toString();
      PaymentRecord.create().exec(function(err,payment){
        payment.paidAt = dateString;
        payment.mallId = parking.mallId;
        payment.mallName = parking.mallName;
        payment.uid = parking.uid;
        console.log(req.body);
        payment.paidFee = req.body.finalCharge;
        payment.paymentOf = parking.parkingId;
        payment.save();
      })

      if(req.body.redemptionPoint > 0){
        PointRecord.create().exec(function(err,point){
            point.actionAt = dateString;
            point.uid = parking.uid
            point.mallId = parking.mallId
            point.mallName = parking.mallName
            point.type = 'redeem'
            point.amount = req.body.redemptionPoint
            point.save();
           })
       }
       res.send("Charged succefully.")
    })
  })
}

};



