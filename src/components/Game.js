import React from 'react';
import PoemBuilder from './PoemBuilder';
import History from './History';
import Button from './Button';
import NavBar from './NavBar';

const production  = 'https://poem-builder.herokuapp.com';
const development = 'http://localhost:5000';
const url_base = (process.env.NODE_ENV ? production : development);

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
			displayHistory: false,
			activeView: null,
			views: {
				poemBuilder: "poemBuilder",
				myWords:  "myWords",
				help:  "help",
				selfDestruct:  "selfDestruct",
				history:  "history",
			},
			viewNames: {
				poemBuilder: "Current Build",
				myWords:  "Word Bank",
				help:  "Help",
				selfDestruct:  "Self Destruct",
				history:  "My Poems",
			},
		};
	};

	toggleView = (view="") => {
		if (!view || !(view in this.state.views)) { 
			return; 
		} 
		// toggle history on/off
		else if (view === this.state.views.history) {
			this.setState({displayHistory: !this.state.displayHistory});
		}
		else if (view === this.state.activeView){
			return;
		}
		else {
			this.setState({activeView: view});
		}
	};
	
	// checks in map cache for word. cache hit --> 
	// returns the word object, cache miss -> 
	// returns null and calls lookupWord before 
	// updating the map cache
	addWordToMap = (word, next) => {
		const map = new Map(this.state.map);
		if (map.get(word) !== undefined) {
			next(map.get(word)); // use cached word
		} else {
			// lookup word
			this.lookupWord(word, (wordObject) => { 
				this.setState({map: map.set(word, wordObject)}); 
				next(wordObject); 
			});
		}		
	};
	
	autoresize = (e) => {
		let input = e.target; 
		input.style.height = 'auto';
		input.style.height = input.scrollHeight+'px';
		input.scrollTop = input.scrollHeight; 
		window.scrollTo(window.scrollLeft, (input.scrollTop + input.scrollHeight));
	};

	cancelWarning = (displayWarning, resetSyllables=true, resetDefinition=true) => {
		if (this.state.currentWord && this.state.currentWord.activeEdit) {
			this.updateCurrentWord(null, resetSyllables, resetDefinition);
		}
		this.setState({displayWarning: false});
	};

	continueUpdate = (displayWarning, updateSyllables=true, updateDefinition=true) => {
		if (!this.state.currentWord || !this.state.currentWord.activeEdit) { return; }
		
		const currentWord = {...this.state.currentWord};
		
		const newSyllableCount = (updateSyllables ? this.state.currentWord.activeEdit.edit.syllables : currentWord.syllables);
		const newDefinition = (updateDefinition ? this.state.currentWord.activeEdit.edit.definition : currentWord.definition); 
		
		const newWord = {...currentWord, syllables: newSyllableCount, definition: newDefinition, original:{...currentWord}, edited: true, activeEdit: false};
		const map = new Map(this.state.map);
		map.delete(currentWord.text);
		map.set(currentWord.text, newWord);

		let valid; 
		const history = this.state.history.map((poem, i) => {
			if (i === this.state.currentPoemIndex){
				valid = this.validatePoem();
				return {...poem, valid: valid}
			} else { return poem }; 
		});

		if (updateSyllables) {
			this.cancelWarning(this.state.displaySyllableUpdate, true, false); 
		}

		if (updateDefinition) {
			this.cancelWarning(this.state.displayDefinitionUpdate, false, true);
		}

		this.updateSyllableCounts();
		
		this.setState({
			map: map,
			displaySyllableUpdate: false,
			currentWord: newWord,
			history: history,
			valid: valid,
		});
	};
	
	createPoem(count=null, title=`Haiku`){
		const num = count ? count : this.state.counter;
		this.incrementCounter();
		const fullTitle = `${title} ${num}`;
		let newPoem = {
			title: fullTitle,
			lines: Array(3).fill(""),
			lineCount: 3,
			type: "haiku",
			activeEdit: Array(3).fill(""),
			valid: false,
		};
		return newPoem;
	};
	
	createWord(text="", syllables="", definition=""){
		const word = {
			text: text,
			syllables: syllables, 
			definition: definition,
			activeEdit: {
				syllables: false,
				definition: false,
				edit: {}
			},
			edited: false,
		};
		return {...word};
	};
	
	getSyllableCount = (word) => {
		const map = new Map(this.state.map);
		const targetWord = map.get(word);
		if (!targetWord) { return 0; }		
		return targetWord.syllables; 
	};
	
	handleClick = (e, lineNumber) => {			
		// https://stackoverflow.com/questions/7563169/detect-which-word-has-been-clicked-on-within-a-text
		var word = '';
		let selection = window.getSelection().modify;
		if (selection && window.getSelection) {
						
			// save original cursor position
			// http://dimafeldman.com/js/maintain-cursor-position-after-changing-an-input-value-programatically/
			var cursorStart = e.target.selectionStart,
				cursorEnd = e.target.selectionEnd;
			
			var sel = window.getSelection();
			if (sel.isCollapsed) {
				sel.modify('move', 'forward', 'character');
				sel.modify('move', 'backward', 'word');
				sel.modify('extend', 'forward', 'word');
				word = sel.toString();
				sel.modify('move', 'forward', 'character'); // clear selection
			} else {
				word = sel.toString();
			}
			
			// restore cursor position
			e.target.setSelectionRange(cursorStart, cursorEnd);
		}
		
		const currentWord = this.state.map.get(word);
		if (currentWord === undefined){
			this.updateCurrentWord(word);
		} else {
			this.setState({
				currentWord: {...currentWord, edited:false},
			});
		}
		
		this.setState({currentLine: lineNumber});
	};
	
	handleCreateNewPoem = () => {	
		const newPoem = {...this.createPoem()}; 
		let history;
		if (!this.state.history) { history = [ newPoem ]}
		else {
			history = [...this.state.history, newPoem];
		}
						 
		this.setState({ 
			history: history,
			currentPoemIndex: (history.length ? history.length-1 : 0),
			poemIsEmpty: true,
			activeView: this.state.views.poemBuilder
		});
	};
	
	handleCurrentWordChange = (e) => {
		this.updateCurrentWord(e.target.value);
	};
	
	handleCurrentWordReset = () => {
		this.updateCurrentWord(this.state.currentWord.original.text);
	};
	
	// keycodes: https://keycode.info/
	handleKeyDown = (e) => {
		let currentLine; 
		switch(e.key) {
			case 'Enter':
				e.preventDefault();
				break;
			case 'ArrowDown': 
				e.preventDefault(); 
				currentLine = {...this.state.currentLine};
				if (++currentLine < this.state.lineCount) {
					this.setState({ currentLine: currentLine });
				}
				break; 
			case 'ArrowUp': 
				e.preventDefault();
				currentLine = {...this.state.currentLine}; 
				if (--currentLine >= 0) {
					this.setState({ currentLine: currentLine });
				}
				break;
			default:
				return;
		}
	};
	
	handleLineChange = (e, lineNumber) => {		
		// save original cursor position
		var cursorStart = e.target.selectionStart,
			cursorEnd = e.target.selectionEnd;		
		
		let line = e.target.value;

		// line from start up to current cursor position
		var leftOfCursor = e.target.value.slice(0,e.target.selectionEnd);
		var words = leftOfCursor.split(" ");
		var currentWord = words[words.length-1];

		this.updateCurrentWord(currentWord);
		
		let currentPoem = [...this.state.history][this.state.currentPoemIndex];  

		const history = this.state.history.map((poem, index) => {
			if (index === this.state.currentPoemIndex) {
				let currentLines = [...poem.activeEdit];
				if (!currentLines) { currentLines = Array(this.state.lineCount).fill("")}
				currentLines[lineNumber] = line;
				return {...poem, activeEdit: currentLines};
			} else {
				return {...poem, activeEdit: null}; 
			}
		});
		
		const lines = (currentPoem.activeEdit && currentPoem.activeEdit.length) ? currentPoem.activeEdit : currentPoem.lines; 

		this.setState({ 
			history: history,
			poemIsEmpty: this.isPoemEmpty(lines)
		});

		this.validatePoem();		
				
		// restore cursor position
		e.target.setSelectionRange(cursorStart, cursorEnd); 
	};
	
	handlePlaceholderMouseout = (lineNumber) => {
		if (!this.state.exampleHaiku) { return; }
		
		this.setState({
			exampleHaiku: this.state.exampleHaiku.map((item, i) => 
				(lineNumber === i) ? this.state.exampleHaikuOriginal[i] : item
			)
		});
	};
	
	handlePlaceholderMouseover = (lineNumber) => {
		if (!this.state.exampleHaiku) { return; }
		
		this.setState({
			exampleHaiku: this.state.exampleHaiku.map((item, i) => 
				(i === lineNumber) ? this.state.placeholders[i] : this.state.exampleHaikuOriginal[i]
		)});
	};
		
	handleResetClick = () => {
		this.updateCurrentWord();
		this.setState({originalWordWarning: false});
	};
	
	handleResetPoem = () => {
		this.setState({ 
			history: [...this.state.history].splice(this.state.currentPoemIndex, 1, this.createPoem()),
			poemIsEmpty: true,
		});
	};
	
	handleSavePoem = () => {
		const poem = [...this.state.history].splice(this.state.currentPoemIndex,1).find(e=>true); 
		if (!poem || !poem.lines){
			
			this.setState({
				poemIsEmpty:true
			});
			return;
		}
		
		// replaces `lines` with `activeEdit`s 
		const history = [...this.state.history].map((item, i) => {
			if (i === this.state.currentPoemIndex) {
				item.lines = [...item.activeEdit]; 
				item.activeEdit = null;
				return item;
			} else {
				return item;
			}
		});

		this.setState({ 
			history: history,
			currentPoemIndex: history.length-1,
		});

		this.handleCreateNewPoem();
	};	

	handleDefinitionChange = (e) => {
		if (e.target.value && e.target.value !== this.state.currentWord.definition) {
			this.setState({displayDefinitionUpdate: true});
		} else {
			this.setState({displayDefinitionUpdate: false});
		}

		this.setState({
			currentWord: {
				...this.state.currentWord, 
				activeEdit: {...this.state.activeEdit, 
					definition: true, 
					edit: {...this.state.currentWord, definition: e.target.value}}
			}
		});
	};

	handleSyllableChange = (e) => {
		if (e.target.value && e.target.value !== this.state.currentWord.syllables) {
			this.setState({displaySyllableUpdate: true});
		} else {
			this.setState({displaySyllableUpdate: false})
		}
		
		this.setState({
			currentWord: {
				...this.state.currentWord, 
				activeEdit: {...this.state.activeEdit, 
					syllables: true, 
					edit: {...this.state.currentWord, syllables: (e.target.value ? parseInt(e.target.value) : '')}
				}
			}
		});		
	};
	
	handleTitleChange = (newTitle) => {
		this.setState({history: this.state.history.map((poem, index) => {
			if (index === this.state.currentPoemIndex) {
				return {...poem, title: newTitle}
			} else {
				return poem; 
			}
		})});
	};
	
	incrementCounter = () => {
		
		this.setState({counter: this.state.counter+1});
	};
	
	isPoemEmpty = (lines) => {
		if (!lines || !lines.length) {
			return true; 
		}
		return lines.reduce((total, currentLine) => total && !currentLine, true);
	};
	
	lookupWord = (text, next, ...nextArgs) => {
		if (!text && !next) { console.log(`lookupWord --> word: ${text}`); return null; }
		var url = `${url_base}/wordAPI/${text}`;
		console.log(`url: ${url}`);
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

	togglePoemHistory = (index=0) => {
		if (index === this.state.currentPoemIndex) { return; }
		const currentPoem = [...this.state.history][this.state.currentPoemIndex];
		console.log(`togglePoemHistory, history1: ${JSON.stringify(this.state.history)}`);

		console.log(`togglePoemHistory, currentPoem: ${JSON.stringify(currentPoem)}`);
		if (!currentPoem) { return null; }
		const lines = (currentPoem.activeEdit && currentPoem.activeEdit.length) ? currentPoem.activeEdit : currentPoem.lines;
		console.log(`togglePoemHistory, lines: ${JSON.stringify(currentPoem.activeEdit)}`);
		console.log(`togglePoemHistory, index: ${JSON.stringify(this.state.currentPoemIndex)}`);
		console.log(`togglePoemHistory, [...history]: ${JSON.stringify([...this.state.history])}`);
		const newPoem = {...[...this.state.history][this.state.currentPoemIndex], lines: currentPoem.activeEdit};
		console.log(`togglePoemHistory, newPoem: ${JSON.stringify(newPoem)}`);
		let history = [...this.state.history];
		history.splice(this.state.currentPoemIndex,1,newPoem);


		console.log(`togglePoemHistory, history3: ${JSON.stringify(history)}`);


		this.setState({
			history: history,
			currentPoemIndex: index,
			poemIsEmpty: this.isPoemEmpty(lines),
		});
	};

	// If newWord=`null`, refresh currentWord by querying the db and overwriting local changes to syllable/definition. 
	// Else, replace currentWord with the lookup results for newWord. 
	updateCurrentWord = (newWord=null, resetSyllables=true, resetDefinition=true) => {
		const currentWord = {...this.state.currentWord};
		if (!currentWord && !newWord) { return; }
		if (!newWord) { 
			newWord = ('text' in currentWord) ? currentWord.text : '';
		} 
		this.addWordToMap(newWord, (wordObject) => {
			this.setState({currentWord: {...wordObject, activeEdit: false}})
		}); 
	};

	getCurrentPoem = () => {
		return [...this.state.history].splice(this.state.currentPoemIndex, 1).find(e=>true); 
	}

	updateSyllableCounts = () => {
		const poem = this.getCurrentPoem(); 
		if (!poem || !poem.lines || !poem.lines.length || !poem.activeEdit || !poem.activeEdit.length) { return null; }
		
		const lines = (poem.activeEdit.length ? poem.activeEdit : poem.lines);

		const syllableCounts = lines.map(line => {
			if (!line) {
				return 0;
			}
			
			return line.split(" ").reduce((total, word) => {
				const targetWord = this.state.map.get(word);
				if (!targetWord || !('syllables' in targetWord) || targetWord.syllables === undefined) { return total + 0; }	
				return total + targetWord.syllables;
			}, 0); 
		});
		this.setState({syllableCounts: syllableCounts});
		return syllableCounts; 
	}

	validatePoem = (lines) => {
		const syllableCounts = this.updateSyllableCounts();
		if (!lines) {
			return false;
		}
		for (let i = 0; i < lines.length; i++) {
			if (syllableCounts[i] !== this.state.criteria.syllableLimits[i]) {
				this.setState({valid: false});
				return false;
			}
		}
		this.setState({valid:true});
		return true; 
	};
	
	viewOriginalWord = (viewStatus) => {
		
		this.setState({ originalWordWarning: viewStatus});
	};
	
	renderSwitch(view) {
		
		let poem = {}; 
		if (this.state.history) {
			poem = [...this.state.history][this.state.currentPoemIndex];
		} 
		const viewOptions = this.state.views;

		switch(view) {
			case null: 
				return null;
			case viewOptions.poemBuilder:
				return (
					<>
					<PoemBuilder 
							syllableCounts={this.state.syllableCounts}
							poem={poem}
							valid={this.state.valid}
							poemIsEmpty={this.state.poemIsEmpty}
							map={this.state.map}
							criteria={this.state.criteria}
							lineCount={this.state.lineCount} 
							currentPoemIndex={this.state.currentPoemIndex}
							handleKeyDown={this.handleKeyDown}
							handleClick={this.handleClick}
							currentWord={this.state.currentWord}
							handleSyllableChange={this.handleSyllableChange}
							displaySyllableUpdate={this.state.displaySyllableUpdate}
							displayDefinitionUpdate={this.state.displayDefinitionUpdate}
							autoresize={this.autoresize}
							currentLine={this.state.currentLine}
							handleResetClick={this.handleResetCurrentWordClick}
							handleLineChange={this.handleLineChange}
							handleCurrentWordChange={this.handleCurrentWordChange}
							handleDefinitionChange={this.handleDefinitionChange}
							
							continueDefinitionUpdate={() => this.continueUpdate(this.state.displayDefinitionUpdate, false, true)}
							continueSyllableUpdate={() => this.continueUpdate(this.state.displaySyllableUpdate, true, false)}
							
							cancelDefinitionUpdate={() => this.cancelWarning(this.state.displayDefinitionUpdate, false, true)}
							cancelSyllableUpdate={() => this.cancelWarning(this.state.displaySyllableUpdate, true, false)}
							handleSavePoem={this.handleSavePoem}
							handleResetPoem={this.handleResetPoem}
							viewOriginalWord={this.viewOriginalWord}
							displayOriginalWord={this.state.displayOriginalWord}
							handleCurrentWordReset={this.handleCurrentWordReset}
							handleTitleChange={this.handleTitleChange}
							titleEdited={this.state.titleEdited}
							handlePlaceholderMouseover={this.handlePlaceholderMouseover}
							handlePlaceholderMouseout={this.handlePlaceholderMouseout}
							createPoem={this.createPoem}
							updateSyllableCounts={this.updateSyllableCounts}
						/>
						{this.state.displayHistory ? 
							<History 
								history={this.state.history}
								currentPoemIndex={this.state.currentPoemIndex}
								togglePoemHistory={this.togglePoemHistory}
								poemIsEmpty={this.state.poemIsEmpty}
								/>
							: null
						}
						
					</>
				);
				break;
			case viewOptions.history:
				break;
			case viewOptions.myWords:
				break;
			case viewOptions.help:
				break;
			case viewOptions.selfDestruct:
				break;
			default: 
				return;

		}
	}



	render() {	

		let startButtonText = "Build!";

		

		return (
			<>
			
			{this.state.activeView ? 

				<>
				 <NavBar 
				 	buttonNames={this.state.viewNames} handleClick={this.toggleView}
				 	handleMouseover={this.handleMouseoverHistory}
				 	handleMouseout={this.handleMouseoutHistory}
				 />
				 {this.renderSwitch(this.state.activeView)}
				</>
				:
				<Button buttonStyle="startButton" handleClick={this.handleCreateNewPoem} value={startButtonText} displayHistory={this.state.displayHistory}/>
			}
			</>
		);
	}
			
};

export default Game; 