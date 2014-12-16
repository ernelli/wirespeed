var request = require('request');
var fs = require('fs');

var camids = ("333,282,351").split(",");
var previmg = {};


var camurl = "http://www.trafiken.nu/cameraimages/";

function timestamp(d) {
    return d.getFullYear() + ("0" + (1+d.getMonth())).slice(-2) + ("0" + (d.getDate())).slice(-2) + "-" + 
        ("0" + (d.getHours())).slice(-2) + ("0" + (d.getMinutes())).slice(-2) +  ("0" + (d.getSeconds())).slice(-2);
}

function getnewimage(id, cb) {
//http://www.trafiken.nu/cameraimages/351.jpg?time=2014-12-1619:54:30

    var now = new Date();

    now.setHours(now.getHours()-1);

    var time = now.getFullYear() + "-" + ("0" +(1+now.getMonth())).slice(-2) + "-" + ("0" + (now.getDate())).slice(-2) +
    ("0" + (now.getHours())).slice(-2) + ":" + ("0" + (now.getMinutes())).slice(-2) + ":" +  ("0" + (now.getSeconds())).slice(-2);

    var url = camurl + id + ".jpg" + "?time=" + time; // + "?timestamp=" + Date.now();

    //console.log("get url: " + url);

    request({ uri: camurl + id + ".jpg", method: "GET", encoding: null} , function(err, res, imgbody) {
        if(err) {
            console.log("img " + id + " failed: ", err);
            cb(err);
            return;
        }

        if(!previmg[id] || imgbody.length !== previmg[id].length) {
            previmg[id] = imgbody;

            var filename = "" + id + "-" + timestamp(new Date()) + ".jpg";
            
            console.log("write new image for " + filename);
            fs.writeFileSync(filename, imgbody);
        } else {
            //console.log("no new image for " + id + " curr len:" + imgbody.length + ", prev len: " + previmg[id].length);
        }
        

        cb(false);
    });
}

(function getimages() {
    var i = 0;

    //console.log("get images");
    
    (function next() {
        if(i < camids.length) {
            getnewimage(camids[i++], next);
        } else {
            setTimeout(getimages, 30*1000);
        }
    })();
})();