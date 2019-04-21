/**
 * CarparkController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    // json function
    json: function (req, res) {
        Carpark.find().exec(function (err, carparks) {
            return res.json(carparks);
        });
    },

    index: function (req, res) {     
        Carpark.find().where({ mallId : { contains: req.session.uid }}).exec(function (err, carpark) {
            return res.view('carpark/index', { 'carparks': carpark });
        });
    },

    index2: function (req, res) {     
        Carpark.find().where({ mallId : { contains: req.params.id }}).exec(function (err, carpark) {
            return res.view('carpark/index', { 'carparks': carpark });
        });
    },

    index3: function (req, res) {     
        Carpark.find().exec(function (err, carpark) {
            return res.view('carpark/index', { 'carparks': carpark });
        });
    },

    create: function(req, res){
        if (req.method == "GET"){
            Mall.findOne({mallId : req.session.uid}).exec(function (err, malls){
            return res.view('carpark/create');
            })
        }else{
            Carpark.create(req.body.Carpark).exec(function (err, carpark) {
                User.create(req.body.User).exec(function (err, user) {
                    Mall.findOne({mallId : req.session.uid}).exec(function (err, mall){
                        carpark.mallId = mall.mallId ;
                        carpark.mallName = mall.mallName ;
                        carpark.district = mall.district;
                        carpark.carparkId = mall.mallId + '-CP' + user.id;
                        user.uid = mall.mallId + '-CP' + user.id;
                        user.role = 'carpark';
                        carpark.save();
                        user.save();
                        res.send("Created.")
                    });
                });
            });
        }
    },

    // update function
    edit: function (req, res) {
        if (req.method == "GET") {
            Carpark.findOne(req.params.id).exec(function (err, carpark) {
                if (carpark == null)
                    return res.send("No such person!");
                else
                    return res.view('carpark/edit', { 'carpark': carpark });
            });
        } else {
            Carpark.findOne(req.params.id).exec(function (err, carpark) {
                carpark.carparkName = req.body.Carpark.carparkName;
                carpark.lots = req.body.Carpark.lots;
                carpark.latitude = req.body.Carpark.latitude;
                carpark.longitude = req.body.Carpark.longitude;
                carpark.chargeOnWeekends = req.body.Carpark.chargeOnWeekends;
                carpark.chargeOnWeekday = req.body.Carpark.chargeOnWeekday;
                carpark.save();
                return res.send("updated successfully");
        });
    }
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

    parking: function (req, res) {
        if (req.method == "GET"){
            return res.view('carpark/licensePlateTest', { 'action': 'enter'} )
        } 
        else {
            var message = "Error";
            //get current car park
            Carpark.findOne( { carparkId : req.session.uid }).exec(function (err, carpark) {
                //find the car owner
                Car.findOne({ licensePlate: req.params.id }).exec(function (err, car) {
                    if(car == null){
                        console.log("Cannot find this car");
                    }else{
                        ParkingRecord.findOne({ licensePlate: req.params.id, state:'enter' }).exec(function (err,record) {
                            if (record != null){
                                console.log("This car has entered");
                                return;
                            }else{
                                ParkingRecord.create().exec(function (err,parking) {
                                    RFIDTag.findOne({uid : parking.uid}).exec(function(err,tag){
                                        if( tag != null){
                                            tag.location = 'entrance';
                                            tag.save();
                                        } 
                                    })
                                    parking.parkingId = "NP-" + parking.id ; 
                                    parking.recordType = "NP";
                                    parking.mallName = carpark.mallName;
                                    parking.mallId = carpark.mallId;
                                    parking.carparkId = carpark.carparkId;
                                    parking.carparkName = carpark.carparkName;
                                    parking.uid = car.uid;
                                    parking.licensePlate = req.params.id;
                                    parking.enterAt  = new Date().toString();
                                    parking.state  = 'enter';
                                    parking.save();
                                    //push notification
                                    message = "Welcome to " + parking.mallName + "! You entered " +parking.carparkName;
                                    module.exports.push(car.uid, message);
                                 });

                            }
                        })
                    }
                });
            });
            return res.view('carpark/licensePlateTest', { 'action': 'enter'} )
            }
    },  
    
    
    exit: function (req, res) {
        if (req.method == "GET"){
            return res.view('carpark/licensePlateTest', { 'action': 'leave'} )
        } 
        else {
            var message = "Error";
            //get current car park
            // Carpark.findOne( { uid : req.session.uid }).exec(function (err, carpark) {
                //find the car owner
                Car.findOne({ licensePlate: req.params.id }).exec(function (err, car) {
                    if(car == null){
                        console.log("Cannot find this car");
                        // res.send("Cannot find this car");
                    }else{
                        ParkingRecord.findOne({ licensePlate: req.params.id, state:'enter'}).exec(function (err,parking) {
                            if(parking == null){
                                console.log("Error: This car has not entered carpark before.");
                            }else if (parking.paid == "N"){
                                console.log("Error: This car has not entered carpark before.");
                            }else if (parking.paid == "Y"){
                                PaymentRecord.findOne({ paymentOf : parking.parkingId }).exec(function(err,payment){
                                    var paidTime = new Date(payment.paidAt);
                                    var currentTime = new Date();
                                    var diff = currentTime.getTime() - paidTime.getTime();
                                    var mins = Math.ceil(diff/60000) ;
                                    console.log(mins); 
                                    if ( mins < 15 ){
                                        parking.leaveAt  = new Date().toString();
                                        parking.state = "leave";
                                        RFIDTag.findOne({uid : parking.uid}).exec(function(err,tag){
                                            if( tag != null){
                                                tag.location = 'entrance';
                                                tag.save();
                                            } 
                                            parking.save();
                                            //push notification
                                            message = "You leaved " + parking.mallName ;
                                            module.exports.push(car.uid, message);
                                        })

                                    }else {
                                        ParkingRecord.create().exec(function (err,record) {
                                            record.parkingId = "OT-" + record.id ; 
                                            record.recordType = "OT" ; 
                                            record.mallName = parking.mallName;
                                            record.mallId = parking.mallId;
                                            record.carparkId = parking.carparkId;
                                            record.carparkName = parking.carparkName;
                                            record.uid = car.uid;
                                            record.licensePlate = req.params.id;
                                            record.enterAt  = new Date().toString();
                                            record.state  = 'enter';
                                            record.save();
                                            //push notification
                                            message = "Please pay for overtime";
                                            module.exports.push(car.uid, message);
                                            console.log("Over 15 minutes");
                                        })
                                    }
                                });
                              
                            }else{
                                console.log("Unpaid");
                            }
                         });
                    }
                });
            // });
            return res.view('carpark/licensePlateTest', { 'action': 'leave'} )
            }
    },

};

