/**
 * CarController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

        // json function
        json: function (req, res) {
                Car.find().where({ uid : { contains: req.session.uid }}).exec(function (err, cars) {
                console.log(cars)
                return res.json(cars);
                });
     },

    registerYourCar: function(req, res){
            Car.findOne({licensePlate : req.body.licensePlate}).exec(function(err,car){
                if(car != null){
                        return res.send("The car is already registered.");
                }else{
                        Car.create().exec(function (err, car) {
                                car.uid = req.session.uid ;
                                car.licensePlate = req.body.licensePlate ;
                                console.log("car.uid: " + req.session.uid);
                                console.log("car.licensePlate: " + req.body.licensePlate);
                                car.save();
                                return res.send("Successfully registerd!");
                        }); 
                }
            })

    },

    removeCar: function(req,res){
        Car.findOne({uid:req.session.uid , licensePlate : req.body.licensePlate}).exec(function (err,car){
                car.destroy();
                res.send("Successfully Removed.")
        });

    }

};

