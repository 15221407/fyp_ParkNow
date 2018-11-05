/**
 * TokenController
 *
 * @description :: Server-side logic for managing Tokens
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    
    // create function
create: function (req, res) {
    if (req.method == "POST") {
        Token.create(req.body.Token).exec(function (err, model) {
            return res.send("Successfully Created!");
        });
    } else {
        return res.view('token/create');
    }
},


// json function
json: function (req, res) {
    Token.find().exec(function (err, tokens) {
        return res.json(tokens);
    });
},

// index function
index: function (req, res) {
    Token.find().exec(function (err, tokens) {
        return res.view('token/index', { 'tokens':tokens});
    });
},

// update function
update: function (req, res) {
    if (req.method == "GET") {
        Token.findOne(req.params.id).exec(function (err, model) {
            if (model == null)
                return res.send("No such person!");
            else
                return res.view('token/update', { 'token': model });
        });
    } else {
        Token.findOne(req.params.id).exec(function (err, model) {
            model.name = req.body.Token.name;
            model.type = req.body.Token.type;
            model.point = req.body.Token.point;
            model.validTo = req.body.Token.validTo;
            model.validFrom = req.body.Token.validFrom;
            model.image = req.body.Token.image;
            model.detail = req.body.Token.detail;
            model.save();
            return res.send("Record updated");
        });
    }
    },


    detail: function (req, res) {
        Token.findOne(req.params.id).exec(function (err, model) {
            if (model == null) {
                return res.send("No such person!");
            }
            else {
                return res.view('token/detail', { 'token': model });
            }
        });

},

};

// 