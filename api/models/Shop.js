/**
 * Shop.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    mallId: {
      type: 'string',
  },

    mallName: {
      type: 'string',
  },

    shopNo: {
      type: 'string'
    }, 

    shopName: {
      type: 'string'
    },

    shopId: {
      type: 'string',
      unique: true
    },
    
    under: {
      collection: 'mall',
      via: 'supervises'
  },

  },

};

