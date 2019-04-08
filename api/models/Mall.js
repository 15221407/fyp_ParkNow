/**
 * Mall.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    mallId:{
      type: 'string',
      unique: true
    },

    mallName: {
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

    contact:{
      type: 'integer'
    },

    latitude: {
      type: 'decimal'
    },

    longitude: {
      type: 'decimal'
    },

    detail: {
      type: 'string'
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
