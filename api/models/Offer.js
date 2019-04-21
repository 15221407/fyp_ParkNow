/**
 * Offer.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    carparkId: {
      type: 'string'
    },

    // carparkName: {
    //   type: 'string'
    // },

  //   offerType: {
  //     type: 'string',
  //     enum: ['special', 'standard']
  //  },

    day: {
      type: 'string'
    },

    dayIndex: {
      type: 'integer'
    },


    startTime: {
      type: 'string'
   },

   endTime: {
      type: 'string'
    },

  charge: {
      type: 'integer'
    },

    },

};

