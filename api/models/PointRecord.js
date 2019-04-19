/**
 * PointRecord.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    uid: {
      type: 'string'
    },

    mallId:{
      type: 'string'
    },

    mallName: {
      type: 'string',
    },

    type: {
        type:'string',
        enum: ['redeem', 'add'],
    },

    amount:{
      type: 'integer',
    },

    actionAt:{
      type: 'string'
    }

  },

};

