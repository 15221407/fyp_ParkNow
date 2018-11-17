/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

    var users = [
        { "username": "admin", "password": "123456", "point": 10 , "id": 101 },
        { "username": "user1", "password": "123456","point": 40 , "id": 102 },
        { "username": "user2", "password": "123456","point": 30 , "id": 103 },
        { "username": "user3", "password": "123456","point": 20 , "id": 104 }
    ];
    
    users.forEach(function (user) {
        User.create(user).exec(function (err, model) { });
    });


Token.findOne(1).exec(function (err, model) {

    if (model == null) {
  
        var tokens = [
            { "type":"oneFree" ,"mall":"New Town Plaza", "name": "One hour free parking coupon","point": 10, "detail":"One hour for free parking", "image":"http://kartrocket-mtp.s3.amazonaws.com/all-stores/image_crafterscornerdemo/data/coupons.gif", "id": 1 },
            { "type":"threeFree" ,"mall":"apm", "name": "Three hours free parking coupon","point": 30, "detail":"Three hours for free parking", "image":"https://bestgear.me/wp-content/uploads/2017/07/coupons.jpg", "id": 2 }
        ];
  
        tokens.forEach(function (token) {
            Token.create(token).exec(function (err, model) { });
        });
    }
  });


Mall.findOne(635).exec(function (err, model) {

  if (model == null) {

      var malls = [
          { "district":"New Territories" ,"name":"New Town Plaza", "address": "Sha Tin Centre Street, Sha Tin","contact": "2608 9329","parkingFee":15,"spending":200,"detail":"Welcome to New Town Plaza, the flagship shopping centre of Sun Hung Kai Properties. Located in the heart of Sha Tin, adjacent to Sha Tin station, New Town Plaza offers around 2 million sq. ft. of exceptional shopping, dining and lifestyle facilities. One of the largest developments of its kind in Hong Kong, New Town Plaza comprises Phase I, Phase III and HomeSquare, as well as a second phase housing New Town Tower and the Royal Park Hotel.", "poster" : "http://www.newtownplaza.com.hk/sites/default/files/inline-images/poster.jpg", "lots":150, "id": 635 },
          { "district":"Kowloon" ,"name":"apm", "address": "NO. 418 Kwun Tong Road, Kwun Tong, Kowloon","contact": "2267 0883","parkingFee":12,"spending":300, "detail":"This is evident in its determination to develop East Kowloon in recent years with Millennium City phases one through five: the largest shopping and commercial complex in Hong Kong. The name is a combination of am and pm, or day and night, reflecting the innovative late night shopping and Omni lifestyle magazine concept. Retailers will stay open until midnight, restaurants to 2:00am and entertainment spots till dawn.", "poster":"https://www.hkapm.com.hk/cccms/lib/uploads/system/application_20180731_zeeAf.jpg", "lots":100, "id": 637 }
      ];

      malls.forEach(function (mall) {
          Mall.create(mall).exec(function (err, model) { });
      });

  }

});
  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
