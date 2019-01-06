/**
 * CarController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    bindYourCar: function(req, res){
        if (req.method == "POST") {
            Car.create(req.body.Car).exec(function (err, car) {
                car.userId = req.seession.uid;
                car.licensePlate = req.body.licensePlate ;
                car.state = "leave";
                car.save();
                Member.findOne({ uid: req.session.id}).exec(function (err,member) {
                            if (member != null) {
                              member.licensePlate = req.body.licensePlate;
                              member.save();
                            } 
                    });
                return res.send("Successfully Created!");
            }); 
        }
    },


};

