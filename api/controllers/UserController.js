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
                    console.log("Userid");
                    req.session.regenerate(function (err) {
                    console.log("Userid");
    
                    req.session.username = req.body.username;
    

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
    
    qrCode: function(req , res) {

        User.findOne({ username: req.body.username }).exec(function (err, user) {
    
            if (user == null)
                return res.send("No such user");

                console.log("qrCode")
                var QRCode = require('qrcode');
                var datetime = new Date();
                QRCode.toDataURL('user:' + user.id + ';date:' + datetime, function (err, url) {
                console.log(url)
                // return res.view('user/qrCode' , {qr: url});
                return res.send(url);
                });
        });

   

    }

    
};

