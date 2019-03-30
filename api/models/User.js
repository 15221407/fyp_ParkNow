/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    uid:{
      type: 'string',
      unique: true
    },
    
    username: {
      type: 'string',
      unique: true
    },

    password: {
      type: 'string'
    },

    role: {
      type: 'string',
      enum: ['admin', 'mall' , 'member', 'shop' , 'carpark', 'visitor'],
      defaultsTo: 'visitor'
  },


toJSON: function () {
    var obj = this.toObject();
    delete obj.password;
    return obj;
}

  }
};

