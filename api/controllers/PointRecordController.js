/**
 * PointRecordController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    // json function
    json: function (req, res) {
        PointRecord.find().where({ uid : { contains: req.session.uid }}).exec(function (err, records) {
            console.log(records)
            return res.json(records);
        });
     },
  

};

