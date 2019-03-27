/**
 * Token.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    uid: {
      type: 'integer'
    },

    mallId:{
      type: 'integer',
      unique: true
    },

    mallName: {
      type: 'string',
      unique: true
    },

    type: {
        type:'string',
        enum: ['redeem', 'add'],
    },

    amount:{
      type: 'integer',
    },

    redeemAt:{
      type: 'string'
    },


  }
};

