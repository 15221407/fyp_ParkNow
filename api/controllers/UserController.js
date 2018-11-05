/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    
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
    
                    return res.json(req.session);
    
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

