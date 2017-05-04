var db = require('../db')
var Schema = db.Schema

var Trend = db.model('Trend', {
	trend: {type: String},
	tweets: [{
		user: {
			screen_name: {type: String},
			name: {type: String}
		},
		text: {type: String},
		created_at: {type: String},
		id_str: {type: String}
	}],
	tweet_volume: {type: Number}
})

var Time = db.model('Time', {
	date: {type: Number, required: true, default: Date.now },
	trends: [{type: Schema.Types.ObjectId, ref:'Trend'}]
})

module.exports.Trend = Trend
module.exports.Time = Time
