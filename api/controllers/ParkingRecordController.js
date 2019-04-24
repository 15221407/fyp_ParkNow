/**
 * ParkingRecordController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  // json function
  json: function (req, res) {
    ParkingRecord.find().where({ uid : { contains: req.session.uid } , recordType : { contains: 'NP'}}).exec(function (err, records) {
        console.log(records)
        return res.json(records);
    });
  },

getParkingState: function(req,res){
  ParkingRecord.findOne({ uid : req.session.uid , state:'enter'}).exec(function(err,record){
    if(record != null){
      console.log(record.state + "," + record.paid);
      return res.send(record.state + "," + record.paid );
    }else{
      return res.send('leave,Y' )
    }
  })
},

getLicensePlate:function(req,res){

  ParkingRecord.findOne({ uid : req.session.uid , state:'enter'}).exec(function(err,record){
    if(record == null){
      console.log("LicensePlate: No Record" )
      return res.send("No Record")
    }else {
      console.log("LicensePlate: " + record.licensePlate)
      return res.send(record.licensePlate)
  }
  })

},


getMallName:function(req,res){

  ParkingRecord.findOne({ uid : req.session.uid , state:'enter'}).exec(function(err,record){
    if(record == null){
      console.log("LicensePlate: No Record" )
      return res.send("No Record")
    }else {
      console.log("LicensePlate: " + record.mallName)
      return res.send(record.mallName + "-" + record.carparkName)
  }
  })

},

getEnterAt:function(req,res){

  ParkingRecord.findOne({ uid : req.session.uid , state:'enter'}).exec(function(err,record){
    if(record == null){
      console.log("enterAt: No Record" )
      return res.send("No Record")
    }else {
      console.log("enterAt: " + record.enterAt)
      return res.send(new Date(record.enterAt).toLocaleString())
  } 
  })

},


getParkingTime:function(req,res){

  ParkingRecord.findOne({ uid : req.session.uid , state:'enter'}).exec(function(err,record){
      if(record == null){
          console.log("enterAt: No Record" )
          return res.send("No Record"); 
      }else {
        var enterTime = new Date(record.enterAt);
        var currentTime = new Date();
        var diff = currentTime .getTime() - enterTime.getTime();
        console.log(diff);
        return res.send(diff.toString()); 
    } 
  })

},





};



