/**
 * Carpark.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    mallId:{
      type: 'integer',
      unique: true
    },
    name: {
      type: 'string'
    },

    lots: {
      type: 'integer'
    },

    uid: {
      type: 'integer'
    },
    
  },

};

