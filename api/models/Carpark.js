/**
 * Carpark.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    mallId:{
      type: 'string',
    },

    mallName:{
      type: 'string',
    },

    carparkId: {
      type: 'string',
      unique: true
    },

    carparkName: {
      type: 'string',
      unique: true
    },

    district: {
      type: 'string',
      enum: ['New Territories', 'Kowloon', 'Hong Kong Island' ]
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

    chargeOnWeekday: {
      type: 'integer'
    },

    chargeOnWeekends: {
      type: 'integer'
    },

    // peakHourFee: {
    //   type: 'integer'
    // },

    // parkingCharge: {
    //   type: 'integer'
    // },

    offer:{
      type: 'string'
    }
    
  },

};

