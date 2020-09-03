var mongoose = require('mongoose');
var Schema = mongoose.Schema; 

var PoemSchema = new Schema (
	{
		id: {type: String, unique: true, required: true },
		user: { type: String },
		title: { type: String },
		lines: [String], 
		lineCount: Number, 
		valid: Boolean, 
		syllableCounts: [Number],
		syllableLimits: [Number],
		date: { type: Date },
		reactions: Object
	});

module.exports = mongoose.model('Poem', PoemSchema);