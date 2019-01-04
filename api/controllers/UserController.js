/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    home: function (req, res) {
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
                    // model.deviceToken = req.body.deviceToken;
                    // model.save();

                    req.session.regenerate(function (err) {
                     console.log("The new session id is " + req.session.id + ".");
                    req.session.username = req.body.username;
                    req.session.role = user.role;
                    // return res.view('user/home');
                    return res.send("Sign In Sccessfully");
    
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
        User.findOne({ name: req.body.username }).exec(function (err, user) {
            console.log(req.body.username)
            // console.log(user.point)
            // var point = user.point.toString()
            return res.send("");
        });
    },

    qrCode: function(req , res) {

        User.findOne({ username: req.body.username }).exec(function (err, user) {
    
            if (user == null)
                return res.send("No such user");

                console.log("qrCode")
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

