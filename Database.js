var model = require('./models/trend')

function storeData(d) {
    var trendObjIds = [];

    for(var i = 0; i < d.length; i++){
            var Tweets = [];
            for(var x = 0; x < d[i].tweets.length; x++){
                tweet = d[i].tweets[x];
                User = tweet.user;
                userobj = {screen_name: User.screen_name, name: User.name};
                Tweets.push({user: userobj, text: tweet.text, id_str: tweet.id_str, created_at: tweet.created_at});   
            }  
       
       var trend = new model.Trend({
           trend: d[i].trend.name,
           tweet_volume: d[i].trend.tweet_volume,
           tweets: Tweets
       })
       trend.save(trend);
       trendObjIds.push(trend._id);
    }

    var time = new model.Time({
        trends: trendObjIds
    })
    time.save(time)

}

module.exports.storeData = storeData;
