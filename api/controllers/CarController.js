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
                car.userId = req.session.uid ;
                console.log(req.body.licensePlate);
                car.licensePlate = req.body.licensePlate ;
                console.log(req.body.licensePlate);
                car.state = "leave";
                car.save();
                console.log(car);
                Member.findOne({ uid: req.session.uid }).exec(function (err,member) {
                            if (member != null) {
                              member.licensePlate = req.body.licensePlate;
                              member.save();
                            } 
                            console.log(member);
                    });
                return res.send("Successfully Created!");
            }); 
        }
    },


};

