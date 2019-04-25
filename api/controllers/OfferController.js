/**
 * OfferController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  // json function
    json: function (req, res) {
        Offer.find().where({ carparkId: { contains: req.body.carpark }}).exec(function (err, offers) {
            var offerStr;
            offers = offers.sort(function (a, b) {
                return a.dateIndex > b.dateIndex ? 1 : -1;
               });
            console.log(offers)
            return res.json(offers);
        });
    },
    
    // index function
    index: function (req, res) {
        // console.log(req.params.id)
        Offer.find().where({ carparkId: { contains: req.params.id }}).exec(function (err, offers) {
            Carpark.findOne({carparkId: req.params.id }).exec(function (err, carpark) {
                return res.view('offer/index', { 'offers': offers , 'carpark' : carpark });
            });
        });
    },

    delete: function(req,res){
        Offer.findOne({id :req.params.id}).exec(function (err, offer) {
            offer.destroy();
            return res.send('Offer deleted')
        })
    },

    create: function(req,res){
        // console.log(req.body.Offer)
        Offer.create(req.body.Offer).exec(function(err,offer){
            if (offer.day == 'Sun'){
                offer.dayIndex = 0;
            }else if (offer.day == 'Mon'){
                offer.dayIndex = 1;
            }else if (offer.day == 'Tue'){
                offer.dayIndex = 2;
            }else if (offer.day == 'Wed'){
                offer.dayIndex = 3;
            }else if (offer.day == 'Thu'){
                offer.dayIndex = 4;
            }else if (offer.day == 'Fri'){
                offer.dayIndex = 5;
            }else if (offer.day == 'Sat'){
                offer.dayIndex = 6;
            }
            offer.save();
            return res.send('Offer added')
        })
    }

};
