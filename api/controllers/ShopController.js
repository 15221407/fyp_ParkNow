/**
 * ShopController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    index: function (req, res) {
        console.log(req.session.uid)
        // console.log(mallId)
        

        Shop.find().where({ mallId : { contains: req.session.uid }}).exec(function (err, shops) {
            return res.view('shop/index', { 'shops':shops });
        });
    },

    create: function(req, res){
        if (req.method == "GET"){
            Mall.findOne({mallId : req.session.uid}).exec(function (err, malls) {
                return res.view('shop/create', { 'malls':malls});
            });
        }else{
            Shop.create(req.body.Shop).exec(function (err, shop) {
                User.create(req.body.User).exec(function (err, user) {
                    console.log(req.session.uid);
                    
                    Mall.findOne({mallId : req.session.uid}).exec(function (err, mall){
                        shop.mallId = mall.mallId ;
                        shop.mallName = mall.mallName ;
                        shop.shopId = mall.mallId + '-' + user.id;
                        user.uid = mall.mallId + '-' + user.id;
                        user.role = 'shop';
                        shop.save();
                        user.save();
                        res.send("Created.")
                    });
                });
            });
        }
    },

    addPoint: function (req, res) {
        if (req.method == "GET"){
            Shop.findOne( { shopId : req.session.uid }).exec(function (err, shop) {
                return res.view('shop/addPoint', { 'mallName': shop.mallName, 'shopuid': shop.shopId , 'shopName': shop.shopName});
            });
        }else {
            
            Shop.findOne( { shopId : req.session.uid }).exec(function (err, shop) {
                console.log(shop)
                ShoppingRecord.create().exec(function(err,record){
                    record.mallId = shop.mallId
                    record.mallName = shop.mallName
                    record.shopId = shop.shopNo
                    record.shopName = shop.shopName
                    record.uid = req.body.Shopping.uid
                    record.consumption = req.body.Shopping.consumption
                    record.gainedPoint = req.body.Shopping.gainedPoint
                    record.addAt = new Date().toString();
                    record.save();
                    Member.findOne({ uid : req.body.Shopping.uid}).exec(function(err,member){
                        member.point = parseInt(member.point) + parseInt(req.body.Shopping.gainedPoint) ;
                        member.save();
                    })
                    PointRecord.create().exec(function(err,point){
                        point.uid = record.uid
                        point.mallId = record.mallId
                        point.mallName = record.mallName
                        point.type = 'add'
                        point.amount = record.gainedPoint
                        point.actionDate = new Date().toLocaleString();
                        point.save();
                    })
                })
            });
            Shop.findOne( { shopId  : req.session.uid }).exec(function (err, shop) {
                return res.view('shop/addPoint', {'mallName': shop.mallName, 'shopuid': shop.shopId  , 'shopName': shop.shopName});
            });
            }
    }
}

