var express = require('express');
var fetch = require('node-fetch');
var util = require('util');
var router = express.Router();
var Word = require('../models/Word');
var Poem = require('../models/Poem');
var WordMap = require('../models/WordMap');
const bodyParser = require('body-parser');

var jsonParser = bodyParser.json();

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

router.get('/map/:user', function (request, response, next) {
    console.log(`GET /map/:user, user=${request.params.user}`);
    const user = request.params.user;
    WordMap.find({ user: user }, function (err, results) {
        if (err) {
            next(err);
        }
        if (results) {
            console.log(`GET /map/:user, returning ${results}`);
            return response.send(results);
        } else {
            console.log(`GET /map/:user, returning null`);
            return response.send(null);
        }
    });
});

router.post('/map', jsonParser, function (request, response, next) {
    console.log(`POST /map, request.body=${request.body}`);
    const map = request.body.map;
    const user = request.body.user;
    if (!map || !user) {
        console.log('Map not saved');
        return response.send('Map not saved.');
    }

    WordMap.updateOne(
        { user: user },
        map,
        { upsert: true },
        function (error, doc) {
            if (error) {
                next(error);
            }
            console.log('Successfully saved');
            return response.send('Successfully saved.');
        }
    );
});

router.get('/poem/:user', function (request, response, next) {
    console.log(`GET /poem/:user, user=${request.params.user}`);
    const user = request.params.user;

    Poem.find({ user: user }, function (err, results) {
        if (err) {
            next(err);
        }
        if (results) {
            console.log('GET /poem/:user, results=', results);
            return response.send(results);
        } else {
            console.log('GET /poem/:user, results=', null);
            return response.send(null);
        }
    });
});

router.post('/poem', jsonParser, function (request, response, next) {
    console.log('POST /poem, request.body', request.body);
    const poem = request.body;
    if (!poem) {
        console.log('No poem found');
        return response.send('No poem found');
    }
    Poem.updateOne(
        { id: poem.id },
        poem,
        { upsert: true },
        function (error, doc) {
            if (error) {
                next(err);
            }
            console.log('Poem inserted/updated successfully');
            return response.send(poem);
        }
    );
});

router.post('/update', function (request, response, next) {
    console.log('POST /update (word), request.body=', request.body);
    var wordQuery = { word: request.params.word };
    var newValues = {
        syllables: request.params.syllables,
        definition: request.params.definition,
    };
    Word.updateOne(wordQuery, newValues, function (err, results) {
        if (err) {
            console.log('Error updating word');
            next(err);
        }
        if (results) {
            console.log('Updated word successfully');
            return response.send(results);
        }
    });
});

router.get('/:word', function (request, response, next) {
    console.log('GET /word, request.body=', request.body);
    // check if the word is stored already in the word history cache - if it is, don't bother looking it up
    // create a word object for the word and assign it to the word history cache - for now, there is
    // just one user, but in the future each user will have their own history cache and there
    // will also be a central pool of recently looked up words.

    // TODO: check if the word is a contraction, if it is look up the two parts, not the contraction

    // check if word exists in DB
    Word.findOne({ word: request.params.word }, function (err, results) {
        if (err) {
            return next(err);
        }
        if (results) {
            // Word already exists, return the word that already exists.
            console.log('Word exists... returning=', results);
            return response.send(results);
        } else {
            // https://www.datamuse.com/api/
            var url = util.format(
                'http://api.datamuse.com/words?sp=%s&md=ds',
                request.params.word
            );
            fetch(url)
                .then((res) => res.json())
                .then((res) => {
                    if (res == null || res.length == 0) {
                        var word = new Word({
                            word: request.params.word,
                        });
                    } else {
                        var word = new Word({
                            word: res[0].word
                                ? res[0].word
                                : request.params.word,
                            definition: res[0].defs
                                ? res[0].defs[0].toString().replace('n\t', '')
                                : '',
                            syllables: res[0].numSyllables
                                ? res[0].numSyllables
                                : 0,
                        });
                    }
                    word.save(function (err) {
                        if (err) {
                            return next(err);
                        }
                        console.log('word retrieved... results=', word);
                        return response.send(word);
                    });
                })
                .catch((err) => {
                    console.log('error retrieving word');
                    return next(err);
                });
        }
    });
});

router.get('/', function (req, res, next) {
    console.log('GET / (word)');
    Word.find({}, function (err, words) {
        console.log('returning words=', words);
        return res.send(words);
    });
});

module.exports = router;
