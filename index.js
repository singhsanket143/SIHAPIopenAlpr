var express = require('express');
var multer = require('multer');
var upload = multer({dest: 'path/'});
var app = express();
var bodyParser = require('body-parser');
var OpenalprApi = require('openalpr_api');
var base64Img = require('base64-img');
var api = new OpenalprApi.DefaultApi();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var secretKey = "sk_4054dd81742c3b4cf9b7dfd1";
var secretKeyList = ["sk_4e1fcb3737ff33d1f8c43035", "sk_4054dd81742c3b4cf9b7dfd1", "sk_93376376f97e1b101ac0646c", "sk_42b15a825eaefbaa2314b701", "sk_79b3d51d0942ff6e3487cb4f", "sk_c1baf442b2390c33227ba972"];
var country = "in";
var imageBytes;
var opts = {
    'recognizeVehicle': 0,
    'state': "",
    'returnImage': 0,
    'topn': 10,
    'prewarp': ""
};
var arr = [];
var count = 0;
var keynumber = 0;
// multer setup
app.post('/sihapi', upload.single('image'), function (req, res, next) {
    // req.file is the `avatar` file
    console.log(req.file.path);
    imageBytes = base64Img.base64Sync(req.file.path);
    var result;
    count = count + 1;
    if (count > 1799) {
        keynumber = keynumber + 1;
        count = 0;
    }
    secretKey = secretKeyList[keynumber];
    api.recognizeBytes(imageBytes.substr(22), secretKey, country, opts, function (error, data, response) {
        if (error) {
            console.error(error);
        } else {

            var a = JSON.parse(response["text"]);
            // console.log(a["results"][0]["plate"]);
            var plateResponse = a["results"];
            for (var i = 0; i < plateResponse.length; i++) {
                var obj = {
                    plate: plateResponse[i]["plate"],
                    coordinates: plateResponse[i]["vehicle_region"],
                    confidence: plateResponse[i]["confidence"]
                };
                arr.push(obj);
            }
            console.log(arr);
            result = arr;

            res.json(result);
            arr = [];
        }
    });

});


app.listen(3000, function () {
    console.log("App is running");
});