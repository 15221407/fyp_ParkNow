/**
 * RFIDTagController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    //register Tag with License plate
    registerTag:function(req,res){
        if( req.method == "GET"){
            return res.view('mall/registerTag');
        }else{
            RFIDTag.findOne({ tagID : req.body.Tag.tagID }).exec(function(err, tag){
                if(tag == null){
                    console.log("hihi")
                    RFIDTag.create(req.body.Tag).exec(function (err, rfid){
                        console.log(req.body.Tag)
                        res.view("mall/registerTag")
                    })
                }else{
                    res.send("The tag has been register before.")
                }
            })
        }
    },

    callReader: function(req ,res){
        // var shell = new ActiveXObject("WScript.Shell");
        // shell.run("java -cp 'C:\Users\yuping\Documents\NetBeansProjects\java\samples_nb\dist\samples_nb.jar' samples.read tmr:///COM3  --ant 1,2");
        // return res.send("hello");
        const exec = require("child_process").exec
        exec("call C:\reader.bat", (error, stdout, stderr) => {
            if (error) {
                console.log(error)
                res.view('carpark/reader',{ 'msg' :'error!'} )
                return;
              }else{
                res.view('carpark/reader',{ 'msg' :'The reader is working....'} )
              }
        })
    },

    detectTags:function(req, res){
        if (req.method == "GET"){
            console.log("Detect Tag: " + req.params.id);
            RFIDTag.findOne({ tagID: req.params.id}).exec(function(err,tag){
                if(tag != null){
                    ParkingRecord.findOne({ uid : tag.uid , state : 'enter'}).exec(function(err,parking){
                        if( parking != null){
                            console.log("location: Zone A" )
                            tag.location = 'zoneA';
                            tag.save();
                            return res.send("Zone A.")
                        }else{
                            return res.send("Not in carpark")
                        }
                    })  
                }else{
                    console.log("No such Tag");
                    return res.send("No Such Tag")
                }
            })
        }
    },

    //get location of car
    getLocation: function(req,res){
        if( req.method == GET){
            RFIDTag.findOne({ licensePlate: req.params.id }).exec(function(err,tag){
                if( tag == null){
                    return res.send("Please register a tag first.")
                }else{
                    return res.send(tag.location);
                }
            })
        }
    }

};

