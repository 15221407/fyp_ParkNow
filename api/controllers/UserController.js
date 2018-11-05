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

                // Load the bcrypt module
                var bcrypt = require('bcrypt');

                // Generate a salt
                var salt = bcrypt.genSaltSync(10);

                if (!bcrypt.compareSync(req.body.password, user.password))
                    return res.send("Wrong Password");

                console.log("The session id " + req.session.id + " is going to be destroyed.");

                req.session.regenerate(function (err) {
                    req.session.username = req.body.username;
                    req.session.uid = user.id;
                    req.session.role = user.role;
                    console.log("The new session id is " + req.session.uid + ".");
                    return res.send("login successfully");

                });
            });
        }
    },

    logout: function(req, res) {

        console.log("The current session id " + req.session.id + " is going to be destroyed.");
    
        req.session.destroy(function (err) {
            return res.send("Log out successfully.");
        });
    },

    
};

