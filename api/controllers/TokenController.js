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
    Token.find().exec(function (err, persons) {
        return res.view('token/index', { 'tokens': tokens });
    });
},

};

// 