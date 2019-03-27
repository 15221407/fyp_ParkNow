/**
 * CarparkController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    push: function (userId, message ) {

        var token = '';

        Member.findOne({ uid: userId }).exec(function (err, member) {
            token = member.deviceToken;
            console.log(member.deviceToken);
       
        
         console.log(token);
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
        // return res.json({});

    },

    parking: function (req, res) {
        if (req.method == "GET"){
            return res.view('carpark/licensePlateTest', { 'action': 'enter'} )
        } 
        else {
            var message = "Fail";
        
            //get current car park
            Carpark.findOne( { uid : req.session.uid }).exec(function (err, carpark) {
                //find the car owner
                Car.findOne({ licensePlate: req.params.id }).exec(function (err, car) {
                    if(car != null){
                        car.state = "enter";
                        car.save();
                        //create a parking record
                        ParkingRecord.findOne({ licensePlate: req.params.id, state:'enter' }).exec(function (err,parkingRecord) {
                            if (parkingRecord != null){
                                console.log("This car has entered");
                                return;
                            }else{
                                ParkingRecord.create().exec(function (err,parkingRecord) {
                                    parkingRecord.mallName = carpark.name
                                    parkingRecord.mallId = carpark.uid;
                                    parkingRecord.uid = car.userId;
                                    parkingRecord.licensePlate = req.params.id; 
                                    parkingRecord.enterAt  = new Date().toString();
                                    parkingRecord.state  = 'enter';
                                    parkingRecord.save();
                                    //push notification
                                    message = "You entered " + parkingRecord.mallName ;
                                    module.exports.push(car.userId, message);
                                 });

                            }
                        })
                    }else{
                        console.log("Cannot find this car");
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
            var message = "Fail";
        
            //get current car park
            Carpark.findOne( { uid : req.session.uid }).exec(function (err, carpark) {
                //find the car owner
                Car.findOne({ licensePlate: req.params.id }).exec(function (err, car) {
                    if(car != null){
                        car.state = "leave";
                        car.save();
                        //create a parking record
                        ParkingRecord.findOne({ licensePlate: req.params.id, state:'enter' }).exec(function (err,parkingRecord) {
                            if(parkingRecord == null){
                                console.log("Error: This car has not entered carpark before.");
                            }else{
                                
                                parkingRecord.leaveAt  = new Date().toString();
                                parkingRecord.state = "leave";
    ;                           parkingRecord.save();
                                //push notification
                                message = "You leaved " + parkingRecord.mallName ;
                                module.exports.push(car.userId, message);
                            }
                         });
                        }else{
                            console.log("Cannot find this car");
                        }
                });
            });
            return res.view('carpark/licensePlateTest', { 'action': 'leave'} )
            }
    },

};

