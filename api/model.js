const mongoose = require('../database');
const schema = {
	word: { type: mongoose.SchemaTypes.String, required: true },
	definition: { type: mongoose.SchemaTypes.String, required: false},
	syllableCount: { type: mongoose.SchemaTypes.Number, required: true},
};
const collectionName = "builder";
const wordSchema = mongoose.Schema(schema);
const Word = mongoose.model(collectionName, wordSchema);

Word.create({
	word: "one",
	syllableCount: 1
});
module.exports = Word;