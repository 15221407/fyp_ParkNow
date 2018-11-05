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



      // Load the bcrypt module
  var bcrypt = require('bcrypt');

  // Generate a salt
  var salt = bcrypt.genSaltSync(10);

  
    var users = [
        { "username": "admin", "password": "123", "id": 101, "point":50 },
        { "username": "user1", "password": "123", "id": 102, "point":12 }
    ];
 

  users.forEach(function (user) {

      user.password = bcrypt.hashSync(user.password, salt);

      User.create(user).exec(function (err, model) {

          if ( err ) {
              console.log(err);
              return;
          }

        model.save();
      });

  });




Mall.findOne(635).exec(function (err, model) {

  if (model == null) {

      var malls = [
          { "name": "Mall A", "age": "23", "id": 635 },
          { "name": "Kenny Cheng", "age": "22", "id": 637 }
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
