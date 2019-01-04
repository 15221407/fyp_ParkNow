/**
 * ShopController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    addPoint: function (req, res) {
        if (req.method == "GET")
         Mall.find().exec(function (err, malls) {
            return res.view('shop/addPoint');
        });
        else {
            User.findOne(req.params.id).exec(function (err, model) {
                model.point = req.body.User.point + model.point ;
                model.save();
                return res.send("Record updateds");
            });
        }
    }
};

