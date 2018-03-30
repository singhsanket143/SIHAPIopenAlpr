var express = require('express');
var app = express();
var todosRoutes = require('./routes/todos');
var bodyParser = require('body-parser');
var OpenalprApi = require('openalpr_api');
var base64Img = require('base64-img');
var api = new OpenalprApi.DefaultApi();
app.set("view engine", "ejs");
var secretKey = "sk_4e1fcb3737ff33d1f8c43035";
var country = "in";
var imageBytes = base64Img.base64Sync('path/2.jpg');
var opts = {
    'recognizeVehicle': 0,
    'state': "",
    'returnImage': 0,
    'topn': 10,
    'prewarp': ""
};
var arr = [];
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
var callback = function(error, data, response) {
    if (error) {
        console.error(error);
    } else {

        var a=JSON.parse(response["text"]);
        // console.log(a["results"][0]["plate"]);
        var plateResponse = a["results"];
        for(var i=0;i<plateResponse.length;i++) {
            var obj = {
                plate: plateResponse[i]["plate"],
                coordinates: plateResponse[i]["vehicle_region"]
            }
            arr.push(obj);
        }
        console.log(arr);
    }
};
app.get('/', function(req, res) {
    res.json(arr);
});
// app.get('/apicall', function (req, res) {
//     api.recognizeBytes(imageBytes, secretKey, country, opts, callback);
// });
api.recognizeBytes(imageBytes.substr(22), secretKey, country, opts, callback);

app.use('/api/todos', todosRoutes);

app.listen(3000, function () {
    console.log("App is running");
});