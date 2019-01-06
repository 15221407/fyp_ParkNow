/**
 * MemberController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    getPoint: function (req, res) {
        Member.findOne({ uid : req.session.uid }).exec(function (err, member) {
            console.log(req.session.uid)
            console.log("point: " + member.point) 
            var point = member.point.toString()
            return res.send(point);
        });
    },

 

    showShoppingRecord: function (req, res) {
        PointRecord.find().where({ userId : { contains: req.session.uid }}).exec( function (err,records ) {
          return res.json(records);
        
        });
    },
    


};

