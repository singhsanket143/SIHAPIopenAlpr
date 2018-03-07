var express = require('express');
var app = express();
var todosRoutes = require('./routes/todos');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.get('/', function (req, res) {
    res.send("Hy");
});

app.use('/api/todos', todosRoutes);

app.listen(3000, function () {
    console.log("App is running");
});