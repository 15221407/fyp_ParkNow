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


};

