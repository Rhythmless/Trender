var https = require('https');
var OAuth2 = require('oauth').OAuth2;
// oauth2 is given the api key to access the twitter api in the format of OAuth2('key','key',api access point)
var oauth2 = new OAuth2([INSERT KEY], [INSERT KEY], 'https://api.twitter.com/', null, 'oauth2/token', null);

function getTrends() {
	var trending = '';
	var trendsList = [];
	return new Promise(function (resolve) {
		oauth2.getOAuthAccessToken('', {
			'grant_type': 'client_credentials'
		}, function (e, access_token) {

			var options = {
				hostname: 'api.twitter.com',
				path: '/1.1/trends/place.json?id=1',
				json: true,
				headers: {
					Authorization: 'Bearer ' + access_token
				}
			};

			https.get(options, function (result) {
				var buffer = '';
				result.setEncoding('utf8');
				result.on('data', function (data) {
					buffer += data;
				});
				result.on('end', function () {
					trending = JSON.parse(buffer);
					var counter = 0;
					for (var x = 0; x < trending[0].trends.length; x++) {	//
						if (counter < 5) {
							trendsList.push(trending[0].trends[x]);
							counter++;
						}
					}
					resolve(trendsList);
				});
			});

		});
	});
}

function getTweets(trend) {
	var tweetsList = [];
	return new Promise(function (resolve) {
		if (trend.name.includes("#")) {
			trend = trend.name.replace("#", "%23");
			trend = trend.replace(" ", "%20");
		} else {
			trend = trend.name.replace(" ", "%20");
		}
		trend = encodeURIComponent(trend);
		oauth2.getOAuthAccessToken('', {
			'grant_type': 'client_credentials'
		}, function (e, access_token) {
			var options = {
				hostname: 'api.twitter.com',
				path: '/1.1/search/tweets.json?q=' + trend + '&result_type=mixed&count=90',
				json: true,
				headers: {
					Authorization: 'Bearer ' + access_token
				}
			};
			console.log('[GettingFunctions.js] Path: ' + options.path);
			https.get(options, function (result) {
				var buffer = '';
				result.setEncoding('utf8');
				result.on('data', function (data) {
					buffer += data;
				});
				result.on('end', function () {
					console.log('[GettingFunctions.js] trend (in getTweets()): ' + trend);
					var tweets = JSON.parse(buffer);
					for (var y = 0; y < tweets.statuses.length; y++) {
						tweetsList.push(tweets.statuses[y])
					}
					resolve(tweetsList);
				});
			});

		});
	});
}

function getFinalData() {
	return new Promise(function (resolve) {
		getTrends().then(function (trends) {
			var promises = [];
			var results = [];
			trends.forEach(function (trend, i) {
				promises[i] = getTweets(trend).then(function (tweets) {
					results[i] = {
						'trend': trend,
						'tweets': tweets
					};
				});
			});
			Promise.all(promises).then(function () {
				resolve(results);
			});
		});
	});
}

module.exports.getFinalData = getFinalData;
