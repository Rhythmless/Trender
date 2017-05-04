var database = require('./Database'),
    express  = require('express');
var bodyParser = require('body-parser')
var model = require('./models/trend')

var app = express();
app.use(bodyParser.json())

app.get('/times', function (req, res) {
    console.log("[RestApi.js] GET /times");

    var count = 10;
    if (req.query.count)
        count = req.query.count;

    model.Time.find().select('date -_id').exec(function(err, posts){
        console.log(posts + "get times");
        res.json(posts);
    })
});

app.get('/trends/:time', function (req, res) {
    var time = req.params.time;
    console.log("[RestApi.js] GET /trends/%s", time);

    console.log("[RestApi.js] getting data for latest trends at or before", time);
    model.Time.findOne({"date": {$lte: time }}).sort({date: -1}).populate('trends').exec(function(err, posts){
        console.log(posts)
        res.json(posts);
    })
});

app.get('/daytrends/:time', function (req, res) {
    var time = req.params.time;
    console.log("[RestApi.js] GET /daytrends/%s", time);
    var epochday = 86400000 + Number(time);
    console.log("[RestApi.js] getting data for latest trends at or before", time);
    model.Time.find({"date": {$lte: (epochday), $gte: time }}).sort({date: -1}).populate({path: 'trends', select: 'trend tweet_volume' }).exec(function(err, posts){
        res.json(posts);
    })
});

app.get('/search/:term', function (req, res) {
    var term = req.params.term;
    term = String(term);
    console.log("[RestApi.js] GET /search/%s", term);
    model.Time.find().sort({date: -1}).sort({date: -1}).populate({path: 'trends', match:{"trend": new RegExp(term, 'i')},  select: 'trend'}).exec(function(err, posts){
        console.log(posts)
        //for(i = 0; i < posts.)
        res.json(posts);
    })
});

module.exports = app;

//$and: [{trend: {nin: ['']}}, {trend: new RegExp(term, 'i')}]}