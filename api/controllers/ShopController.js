/**
 * ShopController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    addPoint: function (req, res) {
        if (req.method == "GET"){
    
            Shop.findOne( { uid : req.session.uid }).exec(function (err, shop) {
                return res.view('shop/addPoint', { 'mallName': shop.mallName, 'shopuid': shop.uid , 'shopName': shop.name});
            });
        }else {
            // Shop.findOne( { uid : req.session.uid }).exec(function (err, shop) {
                PointRecord.create(req.body.PointRecord).exec(function (err, pointRecord) {
                    Member.findOne({ uid: pointRecord.userId}).exec(function (err, member) {
                        if (member == null){ 
                            return res.send("No such user");
                        }
                    member.point = parseInt(pointRecord.point) + parseInt(member.point) ; 
                    // member.has.add(pointRecord.id);
                    // shop.create.add(pointRecord.id);
                    pointRecord.save();
                    member.save();
            });
        });
        // });
              Shop.findOne( { uid : req.session.uid }).exec(function (err, shop) {
                return res.view('shop/addPoint', {'mallName': shop.mallName, 'shopuid': shop.uid , 'shopName': shop.name});
            });
            }
    }
}

