/**
 * MemberController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    createNewAccount: function(req,res){
        User.findOne({"username" : req.body.username}).exec(function (err, user) {
            if( user != null){
                return res.send("existed")
            }else{
                Member.create().exec(function(err, member){
                    member.username = req.body.username ; 
                    member.point = 0 ; 
                    member.username = req.body.username ; 
                    member.licensePlate = "null";
                    member.deviceToken = "null";
                    
                    User.create().exec(function(err, user){
                        user.uid = "M"+ user.id;
                        user.username = req.body.username ; 
                        user.password =  req.body.password ;
                        user.role =  "member"; 
                        member.uid = user.uid;
                        member.save();
                        user.save();
                        console.log("The session id " + req.session.id + " is going to be destroyed.");
                            req.session.regenerate(function (err) {
                            console.log("The new session id is " + req.session.id + ".");
                            req.session.username = req.body.username;
                            req.session.uid = user.uid;
                            console.log("The uid " + user.uid);
                            console.log("The req.session.uid " + req.session.uid);
                            return res.send("Successfully Created!")
                         });
                        
                    })
                })

            }
        })


     },
    

    getPoint: function (req, res) {
        Member.findOne({ uid : req.session.uid }).exec(function (err, member) {
            console.log("point: " + member.point) 
            var point = member.point.toString()
            return res.send(point);
        });
    },

    saveDeviceToken: function (req, res) {
        Member.findOne({ uid : req.session.uid}).exec(function (err, member) {
        console.log("token:" + req.body.token);
           member.deviceToken = req.body.token;
           member.save();
           return res.send("saved");
        });
    },
 

    showShoppingRecord: function (req, res) {
        PointRecord.find().where({ userId : { contains: req.session.uid }}).exec( function (err,records ) {
          return res.json(records);
        
        });
    },

    showParkingRecord: function (req, res) {
        ParkingRecord.find().where({ uid : { contains: req.session.uid }}).exec( function (err,records ) {
          return res.json(records);
        });
    }

};

