/**
 * ShoppingRecord.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    mallId: {
      type: 'string'
    },
    
    mallName: {
      type: 'string'
    },

    shopId: {
      type: 'string'
    },
    
    shopName: {
      type: 'string'
    },

    uid: {
      type: 'string'
    },

    consumption: {
      type: 'integer'
    },

    gainedPoint: {
      type: 'integer'
    },

    addAt: {
      type: 'string'
    }

  },

};

