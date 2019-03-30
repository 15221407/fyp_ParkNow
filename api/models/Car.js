/**
 * Car.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

  uid: {
      type: 'string'
  },

  licensePlate: {
      type: 'string',
      unique: true
  }

//   state: {
//       type: 'string',
//       enum: ['enter', 'leave'],
//       defaultsTo: 'leave'
//   }

  },

};

