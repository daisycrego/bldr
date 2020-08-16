## Poem builder app
#### Thu Aug 13 2020 3:27 am

### `Game` component --> parent, holds all of the state
```javascript
class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			counter: 0, 
			currentPoemIndex: 0,
			currentWord: null,
			criteria: {
				lineCount: 3,
				syllableLimits: [5,7,5],
				placeholders: ["Line 1 uses 5 syllables", "Line 2 uses 7 syllables", "Line 3 uses 5 syllables"],
				exampleHaiku: ["haikus are easy", "but sometimes they don't make sense", "refrigerator"],
				exampleHaikuOriginal:["haikus are easy", "but sometimes they don't make sense", "refrigerator"],
			},		
			history: null, 
			map: new Map(), 
			poemIsEmpty: true,
		};
	};
[...]
}
```

- Here is the only constructor, the source of all of the props downstream, the single source of truth. 
- Keep changing up what is passed to the `Game` component itself as props, but for now sticking with only haikus, so the only `criteria` object is for haikus, simpler that way for now anyway. The `criteria` holds the `syllableLimits` and the `history` holds the individual `syllableCounts`, although I'm feeling like doing those on the fly as needed anyway... I'm going to implement that change quickly. 
- As usual that tangent actually fixed the problem that lead me to start this walkthrough :). Was having issues validating the haiku for some reason, but the situation seems much improved now.

### Fixing everything that's broken, approaching MVP (MLP tbd)
##### Thu Aug 13 2020 9:50 am

- Moving around state and props and functions very hastily introduced a lot of bugs. Systematic development is the idea here. Bursts of inspiration and progress are great but you have to clean up after your mess sometimes. Be careful about that. Many projects aren't the kind you can muck up and chuck away, etc. 
- Code review to start things off. But first, a gif:

![gif error](imgs/haikus3_error.gif)

### `Game` component, continued
- One addition to the constructor, `syllableCounts`. Still deciding the best way to manage tallying the syllable counts to find the best flow for the user, especially given the potential for latency searching for words vs. typing speed. Once values are cached it gets much faster, obviously. Glad that I spent some time introducing the caching schema (further below):  
```
class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			counter: 0, 
			currentPoemIndex: 0,
			currentWord: null,
			criteria: {
				lineCount: 3,
				syllableLimits: [5,7,5],
				placeholders: ["Line 1 uses 5 syllables", "Line 2 uses 7 syllables", "Line 3 uses 5 syllables"],
				exampleHaiku: ["haikus are easy", "but sometimes they don't make sense", "refrigerator"],
				exampleHaikuOriginal:["haikus are easy", "but sometimes they don't make sense", "refrigerator"],
			},		
			history: null, 
			map: new Map(), 
			poemIsEmpty: true,
			syllableCounts: [0, 0, 0],
		};
	};
	
```

#### `lookupWord` (~reusable/timesaving/managing async) and `addWordToMap` (caching)
- The interplay of these functions is a little odd, but it seems to work. `lookupWord` is an extendable function. You pass it a piece of `text`, a function `next`, and any arguments that go along with `next` in the varargs, `...nextArgs`. Should look into the JS specifics of these more, but things seem to work similarly to Java and logically in general. 

> Side note, falling in love with ES6 syntax. And JSX. Woah. Goodbye Django! Wouldn't mind some flask, I guess... But nah this is what's most intriguing to me right now, so let's see it through. React JS. Redux next. React native. Whatever else. 

- Back to the functions. I'll include everything that's relevant together for the `lookupWord` sequence:  

```javascript
class Game extends React.Component {
	[...]
	
	lookupWord = (text, next, ...nextArgs) => {
		if (!text && !next) { console.log(`lookupWord --> word: ${text}`); return null; }
		var url = `http://localhost:8080/wordAPI/${text}`;
		fetch(url)
			.then(res => res.json())
			.then(res => {
				const word = {
					text: text,
					definition: res.definition,
					syllables: res.syllables,
					edited: res.edited,
					activeEdit: res.activeEdit
				}
				next(word, nextArgs);
			})
			.catch(err => err);
	};

	// checks in map cache for word. cache hit --> 
	// returns the word object, cache miss -> 
	// returns null and calls lookupWord before 
	// updating the map cache
	addWordToMap = (word, next) => {
		const map = new Map(this.state.map);
		if (map.get(word) === undefined) {
			// lookup word
			this.lookupWord(word, (wordObject) => { 
				this.setState({map: map.set(word, wordObject)}); 
				next(wordObject); 
			});
		} else {
			next(map.get(word)); // use cached word
		}		
	};
```
- `addWordToMap` is the only function currently using `lookupWord`, but that could change soon. `lookupWord` is a handy function that will fetch word data from the API and pass that data along to a callback you give it, `next`, with optional varargs. I figure all of the code having to do with fetching on the client side should be in `lookupWord`. Very useful for passing code to update state along to some external library. Should adapt the function later to be more general. Very common paradigm in JS, I'm finding. 
- Another great feature of `addWordToMap` is that it introduces local caching! Adding the support for storing words was quite simple compared to what I'm tackling now with managing saving current drafts implicitly, mostly because of the way I set up the app previously, which was more focused on getting the UI to a point where I don't want to kill myself operating it. Especially the text-related stuff. But that will come later. Anyway, for managing the words I used a Map, it seemed to be the most straightforward implementation. The Map, called `map`, is maintained in `Game`'s enormous state. 
- I might think about revamping the naming or adding more objects to decrease the need to name complexity in some cases. `Clean Code` had some stuff straight off the bat about that, I should read it later. 

#### Reducing code re-use: many `cancel`, `continue`, `update`, **`handle`**, etc, handler functions

##### `cancel` handlers
javascript
```
class Game extends React.Component {
	
	cancelDefinitionUpdate = () => {
		if (this.state.currentWord.activeEdit) {
			this.updateCurrentWord(null, false, true);
		}
		this.setState({displayDefinitionUpdate: false});
	};
		
	cancelSyllableUpdate = () => {
		if (this.state.currentWord.activeEdit) { 
			this.updateCurrentWord(null, true, false); 
		}
		this.setState({displaySyllableUpdate: false});
	};

```
- The root of the issue here is that I'm relying on React and the virtual DOM to render everything for me on time, as long as I update the state of the most upstream element, `Game`. So in order to control something like displaying/hiding a set of buttons for editing the current word's syllable count & definition, which is happening at the level of the `CurrentWord` component, I need to make sure that the `Game` is managing the state, unless I can get the `Poem` or `CurrentWord` component more involved. Maybe add hooks? Not sure about their use cases yet. But the issue will always be that if the page re-renders, the virtual DOM is re-rendering all the components downstream of the top-level stateful component to make them aware of some change to state. State can change at any time! Better to implement this in a stateless way, if possible. 
- Thought of a way to combine the functions: 
```javascript
cancelWarning = (displayWarning, resetSyllable=true, resetDefinition=true) => {
	if (this.state.currentWord.activeEdit) {
		this.updateCurrentWord(null, resetSyllables, resetDefinition);
	}
	this.setState({displayWarning: false});
};
```

#### `continue` functions
- These are also closely related: 
```javascript
continueDefinitionUpdate = () => {
	const newDefinition = this.state.currentWord.definition;
	const map = new Map(this.state.map);
	const currentWord = map.get(this.state.currentWord.text);
	
	map.delete(currentWord.text);
	const newWord = {...currentWord, definition: newDefinition, original:{...currentWord}, edited:true};
	
	map.set(currentWord.text, newWord);

	let valid = false;
	const history = this.state.history.map((poem, i) => {
		if (i === this.state.currentPoemIndex){
			valid = this.state.validatePoem();
			return {...poem, valid: valid}
		} else { return poem }; 
	});

	this.setState({
		map: map,
		displayDefinitionUpdate: false,
		currentWord: newWord,
		history: history,
		valid:valid
	});

};
		
continueSyllableUpdate = () => {
	if (!this.state.currentWord.activeEdit) { return; }
	
	const newSyllableCount = this.state.currentWord.activeEdit.edit.syllables;
	const map = this.state.map;
	const currentWord = map.get(this.state.currentWord.text);
	
	const newWord = {...currentWord, syllables: newSyllableCount, original:{...currentWord}, edited: true, activeEdit: false};
	
	map.delete(currentWord.text);
	map.set(currentWord.text, newWord); 

	const history = this.state.history.map((poem, i) => {
		if (i === this.state.currentPoemIndex){
			const valid = this.state.validatePoem();
			return {...poem, valid: valid}
		} else { return poem }; 
	});

	this.setState({
		map: map,
		displaySyllableUpdate: false,
		currentWord: newWord,
		history: history
	});
};

continueUpdate = (displayWarning, updateSyllables=true, updateDefinition=true) => {
	if (!this.state.currentWord.activeEdit) { return; }
	
	const currentWord = {...this.state.currentWord};
	
	const newSyllableCount = (updateSyllables ? this.state.currentWord.activeEdit.edit.syllables : currentWord.syllables);
	const newDefinition = (updateDefinition ? this.state.currentWord.activeEdit.edit.definition : currentWord.definition); 
	
	const newWord = {...currentWord, syllables: newSyllableCount, definition: newDefinition, original:{...currentWord}, edited: true, activeEdit: false};

	map.delete(currentWord.text);
	map.set(currentWord.text, newWord);

	const history = this.state.history.map((poem, i) => {
		if (i === this.state.currentPoemIndex){
			const valid = this.state.validatePoem();
			return {...poem, valid: valid}
		} else { return poem }; 
	});

	if (updateSyllables) {
		this.cancelUpdate(displaySyllableUpdate, true, false); 
	}

	if (updateDefinition) {
		this.cancelUpdate(displayDefinitionUpdate, false, true);
	}
	
	this.setState({
		map: map,
		displaySyllableUpdate: false,
		currentWord: newWord,
		history: history,
		valid: valid,
	});
}
```

### Styling
##### Aug 13 7:12 PM 
- Removed all of the contents of `index.css`, dumped them in a similarly named file, `index2.css`. Whipped out the HTML&CSS picture "textbook" here with examples of fixed-width and liquid layouts. %s sound more reliable to me, and there isn't so much small text, or real images, so the stretch effect won't be an issue. There seem to be other cases to use a fixed-width layout. 
- Here is a quick gif of the site, still buggy, and now minus the bare styling it had. Totally exposed: 

![haikus no style](imgs/haikus_no_style.gif)

### Still Styling

- [Relationship of grid layout to other layout methods](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Relationship_of_Grid_Layout)
- [CSS Flex Box Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout)
- [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout#:~:text=CSS%20Grid%20Layout%20excels%20at,elements%20into%20columns%20and%20rows.)

- Flex Box and Grid layouts are essential for CSS, even if I move beyond pure css later on. Have to have covered these basics at some point. Today's the day! Tackling that scary concept of layouts!

- Notes for flexbox and grid are [here](Layouts.md).


