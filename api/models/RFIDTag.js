/**
 * RFIDTag.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    tagID: {
      type: 'string',
      unique: true
    },

     uid: {
      type: 'string'
    },

    licensePlate: {
      type: 'string',
      unique: true
    },

    location:{
      type: 'string',
      enum: ['entrance', 'zoneB' , 'zoneA'],
      defaultsTo: 'entrance'
    }

  },

};

