/**
 * MallController
 *
 * @description :: Server-side logic for managing Malls
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

        // create function
    
create: function (req, res) {
    if (req.method == "POST") {
        Mall.create(req.body.Mall).exec(function (err, model) {
            return res.send("Successfully Created!");
        });
    } else {
        return res.view('mall/create');
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
        return res.view('mall/index', { 'malls':malls});
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
            model.name = req.body.Mall.name;
            model.district = req.body.Mall.district;
            model.address = req.body.Mall.address;
            model.contact = req.body.Mall.contact;
            model.long = req.body.Mall.long;
            model.lat = req.body.Mall.lat;
            model.fee = req.body.Mall.fee;
            model.poster = req.body.Mall.poster;
            model.detail = req.body.Mall.detail;
            model.save();
            return res.send("Record updated");
        });
    }
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

