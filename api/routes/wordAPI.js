var express = require('express');
var fetch = require('node-fetch');
var util = require('util');
var router = express.Router(); 
var Word = require('../models/Word');

/* 
To use this API from within React, create a function like this: 
fetchWordData(word) {
    var url = "http://localhost:9000/wordAPI/"+word;
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          currentWord: res.word,
          currentWordDefinition: res.definition,
          currentWordSyllables: res.syllables
        });
      })
      .catch(err => err);
  }
*/

router.post('/update', function(request, response, next) {
	console.log("wordAPI -> POST request, updating a word");
	console.log(`word: ${request.params.word}`);
	var wordQuery = { word: request.params.word };
	var newValues = { syllables: request.params.syllables, definition: request.params.definition };
	Word.updateOne(wordQuery, newValues, function(err, results) {
		if (err) { return next(err); }
		console.log(results);
		if (results) {
			response.send(results); 
		}
	});
	// should also update the word in state...
});

router.get('/:word', function(request, response, next) {
	console.log(`running the wordAPI --> GET request`);
	// check if the word is stored already in the word history cache - if it is, don't bother looking it up
	// create a word object for the word and assign it to the word history cache - for now, there is 
	// just one user, but in the future each user will have their own history cache and there
	// will also be a central pool of recently looked up words.
	
	// TODO: check if the word is a contraction, if it is look up the two parts, not the contraction

	// check if word exists in DB
	Word.findOne({'word': request.params.word}, function(err, results) {
		if (err) { return next(err); }
		console.log(results);
		if (results) {
			// Word already exists, return the word that already exists.
			return response.send(results);
		} else {
			// https://www.datamuse.com/api/
			var url = util.format('http://api.datamuse.com/words?sp=%s&md=ds', request.params.word);
			fetch(url)
			.then(res => res.json())
			.then(res => {
				console.log(res);
				if (res==null || res.length==0){
					var word = new Word( 
						{
							word: request.params.word
						}
					)
				} else {
					var word = new Word(
						{
							word: res[0].word ? res[0].word : request.params.word,
							definition: res[0].defs ? res[0].defs[0].toString().replace('n\t', ''): '', 
							syllables: res[0].numSyllables ? res[0].numSyllables : 0,
						}
					);
				}
				word.save(function(err) {
					if (err) { return next(err); }
					return response.send(word);
				});	
			})
			.catch(err => next(err));
		}
	});
});

router.get('/', function(req, res, next) {
	res.sendStatus("Invalid search: please provide a word"); 
});

module.exports = router; 