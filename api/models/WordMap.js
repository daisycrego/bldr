var mongoose = require('mongoose');
var Schema = mongoose.Schema; 

var WordMapSchema = new Schema (
	{
		user: { type: String, unique: true },
		map: { type: Map, of: Object }, 
	});

module.exports = mongoose.model('WordMap', WordMapSchema);