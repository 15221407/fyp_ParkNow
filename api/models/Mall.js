/**
 * Mall.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    mallId:{
      type: 'integer',
      unique: true
    },

    name: {
      type: 'string',
      unique: true
    },

    district: {
      type: 'string',
      enum: ['New Territories', 'Kowloon', 'Hong Kong Island' ]
  },

    address: {
      type: 'string'
    },

    parkingFee: {
      type: 'integer'
    },

    peakHourFee: {
      type: 'integer'
    },

    // spending: {
    //   type: 'integer'
    // },

    redemptionPoint: {
      type: 'integer'
    },

    detail: {
      type: 'string'
    },

    contact: {
      type: 'string'
    },
    
    lots: {
      type: 'integer'
    },

    latitude: {
      type: 'decimal'
    },

    longitude: {
      type: 'decimal'
    },

    poster: {
      type: 'string'
    },
 
    supervises: {
      collection: 'shop',
      via: 'under'
  },

//   supervises: {
//     collection: 'carpark',
//     via: 'under'
// }

  }
};
