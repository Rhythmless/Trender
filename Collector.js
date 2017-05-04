var database         = require('./Database'),
    gettingFunctions = require('./GettingFunctions');

var collectionInterval = 30 * 60 * 1000;

function updateData() {
    var time = Date.now();

    console.log("[Collector.js] collecting trends for time", time);
    gettingFunctions.getFinalData().then(function (data) {

        database.storeData(data);

        // update data again after the collection interval
    });
}

module.exports.updateData = updateData;
