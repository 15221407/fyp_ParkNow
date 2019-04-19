/**
 * Member.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    uid: {
      type: 'string',
      unique: true
  },

    username: {
      type: 'string',
      unique: true
    },

    point: {
      type: 'integer',
      defaultsTo: 0
    },
     
    deviceToken: {
      type: 'string',
      defaultsTo: 'null'
}


  //   has: {
  //     collection: 'pointRecord',
  //     via: 'belongsTo'
  // },

  

  },

};

