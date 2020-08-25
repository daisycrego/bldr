var mongoose = require('mongoose');
var Schema = mongoose.Schema; 

var PoemSchema = new Schema (
	{
		id: {type: String, unique: true, required: true },
		user: { type: String },
		title: { type: String },
		lines: [String], 
		linesEdit: [String],
		lineCount: Number,
		type: String, 
		valid: Boolean, 
	});

module.exports = mongoose.model('Poem', PoemSchema);