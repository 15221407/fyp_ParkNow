/**
 * PaymentRecordController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
  // json function
  json: function (req, res) {
    PaymentRecord.find().where({ uid : { contains: req.session.uid }}).exec(function (err, records) {
        console.log(records)
        return res.json(records);
    });
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
      // console.log("Client Token " + response.clientToken +" is generated.");
      // var clientToken = response.clientToken
      res.send(response.clientToken);
    });
  },

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
              var totalHour = 0 ;
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
                      totalCharge += offerDict[sDay][3]; //in peak hour
                      totalHour += 1;
                    }else if (sDay == 0 || sDay == 6){
                      totalCharge += carpark.chargeOnWeekends ; //on weekends
                      totalHour += 1;
                    }else{
                      totalCharge += carpark.chargeOnWeekday ; //on weekdays
                      totalHour += 1;
                    }
                }else{
                  if (sDay == 0 || sDay == 6){
                    totalCharge += carpark.chargeOnWeekends ; //on weekends
                    totalHour += 1; 
                  }else{
                    totalCharge += carpark.chargeOnWeekday ; //on weekdays
                    totalHour += 1;
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
            res.send(record.mallName + "," + totalCharge + "," + totalHour + "," + free1 + ","+ free2 + ","+ free3);
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
          // var redemptionPoint = req.body.redemptionPoint;
          var redemptionPoint = 0;
  
          while( enterTime < currentTime ){
            var sDay = enterTime.getDay();
            var enterTimeStr = enterTime.toTimeString();
            var enterTimeStr = enterTimeStr.split(' ')[0];
  
            if(sDay in offerDict){
                if( (enterTimeStr > offerDict[sDay][1]) &&  ( enterTimeStr < offerDict[sDay][2])){
                  totalCharge += offerDict[sDay][3]; //in peak hour
                }else if (sDay == 0 || sDay == 6){
                  totalCharge += carpark.chargeOnWeekends ; //on weekends
                }else{
                  totalCharge += carpark.chargeOnWeekday ;//on weekdays
                }
            }else{
              if (sDay == 0 || sDay == 6){
                
                totalCharge += carpark.chargeOnWeekends ; //on weekends
              }else{
                totalCharge += carpark.chargeOnWeekday ;//on weekdays
              }
            }
            enterTime.setHours( enterTime.getHours() + 1 );
  
            if(redemptionHour > 0 ){
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
         setTimeout(function() {
          // console.log("setTimeout????");
          module.exports.checkTimeout(req.session.uid);
         }, 5*60000);
      })
    })
  },

  push: function (userId, message ) {

    var token = '';

    Member.findOne({ uid: userId }).exec(function (err, member) {
        token = member.deviceToken;
        console.log(member.deviceToken);
    var apn = require('apn');
    // Set up apn with the APNs Auth Key
    var apnProvider = new apn.Provider({
        token: {
            key: '/Users/christy/Desktop/Fyp/fyp_ParkNow/api/controllers/AuthKey_Q5BYH559L8.p8', // Path to the key p8 file
            keyId: 'Q5BYH559L8', // The Key ID of the p8 file (available at https://developer.apple.com/account/ios/certificate/key)
            teamId: '2867B572P4', // The Team ID of your Apple Developer Account (available at https://developer.apple.com/account/#/membership/)
        },
        production: false // Set to true if sending a notification to a production iOS app
    });

    // Enter the device token from the Xcode console
    var deviceToken = member.deviceToken;
    // Prepare a new notification
    var notification = new apn.Notification();
    // Specify your iOS app's Bundle ID (accessible within the project editor)
    notification.topic = 'hk.edu.hkbu.comp.LS08Push';
    // Set expiration to 1 hour from now (in case device is offline)
    notification.expiry = Math.floor(Date.now() / 1000) + 3600;
    // Set app badge indicator
    notification.badge = 1;
    // Play ping.aiff sound when the notification is received
    notification.sound = 'ping.aiff';
    // Display the following message (the actual notification text, supports emoji)
    notification.alert = message;
    // Send any extra payload data with the notification which will be accessible to your app in didReceiveRemoteNotification
    notification.payload = { id: 123 };
    // Actually send the notification
    apnProvider.send(notification, deviceToken).then(function (result) {
    // Check the result for any failed devices
    console.log(result);
    });
});
},

  checkTimeout: function(uid){
    console.log("Over 15 minutes??????");
    ParkingRecord.findOne({ uid : uid , state : 'enter', paid : 'Y'}).exec(function(err,parking){
      if( parking != null){
          parking.state = 'overtime';
          parking.save();
          ParkingRecord.create().exec(function (err,record) {
            record.parkingId = "OT-" + record.id ; 
            record.recordType = "OT" ; 
            record.mallName = parking.mallName;
            record.mallId = parking.mallId;
            record.carparkId = parking.carparkId;
            record.carparkName = parking.carparkName;
            record.uid = parking.uid;
            record.licensePlate = parking.licensePlate;
            record.enterAt  = new Date().toString();
            record.state  = 'enter';
            record.save();
            //push notification
            message = "Timeout. Please pay for overtime";
            module.exports.push(record.uid, message);
            console.log("Over 15 minutes");
            return;
      })
      }
    })

  }
};
