var mongoose = require('mongoose')
//Replace [INSERT HERE] with the link to where the database is hosted i.e.'mongodb://link-to-data-base'
var url = [INSERT HERE]
mongoose.connect(url, function () {
  console.log('mongodb connected ' + url)
})
module.exports = mongoose