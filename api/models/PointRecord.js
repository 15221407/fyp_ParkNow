/**
 * PointRecord.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    mallName: {
      type: 'string'
    },

    shopId: {
      type: 'integer'
    },

    shopName: {
      type: 'string'
    },

    userId: {
      type: 'integer' 
  },

    genTime: {
      type: 'string'
  },

    consumption: {
      type: 'float'
  },

    point: {
      type: 'integer'
  }

 
  //   belongsTo: {
  //     collection: 'member',
  //     via: 'has'
  // },

  },

};

