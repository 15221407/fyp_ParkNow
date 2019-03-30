/**
 * ParkingRecord.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    mallName: {
      type: 'string'
    },

    mallId: {
      type: 'string'
    },

    uid: {
      type: 'string'
    },
    
    enterAt:{
      type: 'string'
    },

    leaveAt:{
      type:'string'
    },

    state:{
      type:'string',
      enum: ['enter', 'leave'],
      defaultsTo: 'enter'
    },

   paid:{
      type:'string',
      enum: ['Y', 'N'],
      defaultsTo: 'N'
    }
    ,
    licensePlate: {
      type: 'string'
  }

  },

};

