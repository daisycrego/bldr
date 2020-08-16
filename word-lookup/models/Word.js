var mongoose = require('mongoose');
var Schema = mongoose.Schema; 

var WordSchema = new Schema (
	{
		word: {type: String, required: true, min: 1, max: 100},
		definition: {type: String, min: 1, max: 1000},
		syllables: {type: Number},
	}
)

module.exports = mongoose.model('Word', WordSchema);