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
      type: 'integer'
    },

    uid: {
      type: 'integer'
    },

    username: {
      type: 'string'
    },

    licensePlate: {
      type: 'string'
  }

  },

};

