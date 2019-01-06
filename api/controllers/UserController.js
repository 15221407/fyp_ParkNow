/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    home: function (req, res) {
        console.log(req.session.username);
        return res.view('user/home');
    },
    
    login: function (req, res) {

        if (req.method == "GET")
            return res.view('user/login');
        else {
            User.findOne({ username: req.body.username }).exec(function (err, user) {
    
                if (user == null)
                    return res.send("No such user");
    
                if (user.password != req.body.password)
                    return res.send("Wrong Password");
    
                    console.log("The session id " + req.session.id + " is going to be destroyed.");
    
                    req.session.regenerate(function (err) {
                     console.log("The new session id is " + req.session.id + ".");
                    
                    req.session.username = req.body.username;
                    req.session.role = user.role;
                    req.session.uid = user.id;
                    if(user.role != "member"){
                        return res.view('user/home');
                    }
                    else{
                    return res.send("Sign In Sccessfully");}
    
                });
            });
        }
    },

    logout: function (req , res) {
        console.log("logout")
        console.log("The current session id " + req.session.id + " is going to be destroyed.");
        req.session.destroy(function (err) {
            return res.send("Logout successfully");
        });
    },
    
    getPoint: function (req, res) {
        Member.findOne({ uid : req.session.uid }).exec(function (err, member) {
            console.log(req.session.uid )
            console.log(member.point)
            var point = member.point.toString()
            return res.send(point);
        });
    },

    qrCode: function(req , res) {

        User.findOne({ username: req.body.username }).exec(function (err, user) {
    
            if (user == null)
                return res.send("No such user");
                
                var QRCode = require('qrcode');
                var datetime = new Date();
                QRCode.toDataURL(user.id + ';' + datetime, function (err, url) {
                console.log(url)
                console.log(user.id)
                console.log(datetime)
                // return res.view('user/qrCode' , {qr: url});
                return res.send(url);
                });
        });

   

    }

    
};

