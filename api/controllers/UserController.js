/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    home: function (req, res) {
        User.findOne({ uid : req.session.uid}).exec(function(err ,user){
            return res.view('user/home' , { 'user':user});
        })
    },
    
    //Account Managment
    index: function (req, res) {
        User.find().exec(function (err, users) {
            return res.view('user/index', { 'users': users });
        });
    },
        
    edit: function(req,res){
        if (req.method == "GET") {
            User.findOne(req.params.id).exec(function (err, user) {
                if (user == null)
                    return res.send("No such person!");
                else
                    return res.view('user/edit', { 'user': user });
            });
        } else {
            User.findOne(req.params.id).exec(function (err, user) {
                user.username = req.body.User.username;
                user.password = req.body.User.password;
                user.save();
                return res.send("Record updated");
            });
        }
    
        },
    
    delete: function(req,res){
        User.findOne(req.params.id).exec(function (err, user) {
            if (user.role == 'member'){
                Car.find().where({uid: user.uid}).exec(function(err,car){
                    Member.findOne({uid: user.uid}).exec(function(err,member){
                        car.destroy();
                        member.destroy();
                        user.destroy();
                        return res.send('Deleted')
                    })
                })
            }else{
                user.destroy();
                return res.send('Deleted')
            }
        })
    },


    login: function (req, res) {

        if (req.method == "GET")
            return res.view('user/login');
        else {
            User.findOne({ username: req.body.username }).exec(function (err, user) {
    
                if (user == null || user.role == "member")
                    return res.send("Wrong Username/Password.");
    
                if (user.password != req.body.password)
                    return res.send("Wrong Username/Password.");
    
                    console.log("The session id " + req.session.id + " is going to be destroyed.");
    
                    req.session.regenerate(function (err) { 
                     console.log("The new session id is " + req.session.id + ".");
                     console.log("The uid is " + user.uid + ".");
                    req.session.username = req.body.username;
                    req.session.role = user.role;
                    req.session.uid = user.uid;
                    return res.send("Logined");
                });
            });
        }
    },

    loginForApp: function (req, res) {

            User.findOne({ username: req.body.username }).exec(function (err, user) {
    
                if (user == null || user.role != "member")
                    return res.send("No such user");
    
                if (user.password != req.body.password)
                    return res.send("Wrong Password");
    
                    console.log("The session id " + req.session.id + " is going to be destroyed.");
                    req.session.regenerate(function (err) {
                     console.log("The new session id is " + req.session.id + ".");
                     console.log("The uid is " + user.uid + ".");
                     req.session.username = req.body.username;
                     req.session.role = user.role;
                     req.session.uid = user.uid;
                    return res.send("Sign In Sccessfully")
                });
            });
    },

    getUserId: function (req, res) {
        console.log("User Id: " + req.session.uid);
        return res.send(req.session.uid);
    },

    logout: function (req , res) {
        console.log("The current session id " + req.session.id + " is going to be destroyed.");
        if (req.session.role == 'member'){
            Member.findOne({ uid : req.session.uid}).exec(function (err, member) {
                member.deviceToken = "null";
                member.save();
                req.session.destroy(function (err) {
                    return res.send("Logout successfully");
                });
            });
        }else{
            req.session.destroy(function (err) {
                return res.send("Logout successfully");
            });
        }
    },
    
    getPoint: function (req, res) {
        Member.findOne({ uid : req.session.uid }).exec(function (err, member) {
            console.log(req.session.uid )
            console.log(member.point)
            var point = member.point.toString()
            return res.send(point);
        });
    },

};

