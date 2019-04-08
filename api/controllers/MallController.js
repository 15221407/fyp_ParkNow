/**
 * MallController
 *
 * @description :: Server-side logic for managing Malls
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

// create function
    create: function(req, res){
        if (req.method == "GET") {
            return res.view('mall/create');
        }else{
            Mall.findOne({mallName : req.body.Mall.mallName}).exec(function(err, model){
                if (model == null){
                    Mall.create(req.body.Mall).exec(function (err, mall){
                        User.create(req.body.User).exec(function (err, user) {
                            mall.mallId = 'MA' + user.id ;
                            user.uid = 'MA' + user.id ;
                            user.role = 'mall';
                            mall.save();
                            user.save();
                            res.send("Created.")
                            });
                        });
                }else{
                    res.send("The username has been used.") 
                }
            })
  
            }
},




// json function
json: function (req, res) {
   Mall.find().exec(function (err, malls) {
        return res.json(malls);
    });
},

// index function
index: function (req, res) {
    Mall.find().exec(function (err, malls) {
        return res.view('mall/index', { 'malls':malls });
    });
},

// update function
edit: function (req, res) {
    if (req.method == "GET") {
        Mall.findOne(req.params.id).exec(function (err, model) {
            if (model == null)
                return res.send("No such person!");
            else
                return res.view('mall/edit', { 'mall': model });
        });
    } else {
        Mall.findOne(req.params.id).exec(function (err, model) {
            model.mallName = req.body.Mall.mallName;
            model.district = req.body.Mall.district;
            model.address = req.body.Mall.address;
            model.contact = req.body.Mall.contact;
            model.longitude = req.body.Mall.longitude;
            model.latitude = req.body.Mall.latitude;
            // model.fee = req.body.Mall.fee;
            model.poster = req.body.Mall.poster;
            model.detail = req.body.Mall.detail;
            model.save();
            return res.send("Record updated");
        });
    }
    },

    getLots: function (req, res) {
        console.log("getLots:" + req.body.mallName)
            Mall.findOne({ name: req.body.mallName }).exec(function (err, mall) {
                console.log(req.body.mallName)
                console.log(mall.lots)
                var lots = mall.lots.toString()
                return res.send(lots);
            });
        },

    detail: function (req, res) {
        Mall.findOne(req.params.id).exec(function (err, model) {
            if (model == null) {
                return res.send("No such person!");
            }
            else {
                return res.view('mall/detail', { 'mall': model });
            }
        });

},


};

