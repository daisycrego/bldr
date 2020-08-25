import React, {Fragment} from 'react';
import PoemBuilder from './PoemBuilder';
import History from './History';
import Button from './Button';
import NavBar from './NavBar';
import WordBank from './WordBank';
import SelfDestruct from './SelfDestruct';
import Help from './Help';

const production  = 'https://poem-builder.herokuapp.com';
const development = 'http://localhost:5000';
const url_base = (process.env.REACT_APP_ENVIRONMENT === 'development' ? development : production);

const user_id ="a";

class Game extends React.Component {
	constructor(props) {
		super(props); 

		this.state = {
			user: {"userName": "a", "name": "J"},
			users: [{"userName": "a", "name": "J"}, {"userName": "b", "name": "D"}],
			counter: 0,
			currentLine: 0, 
			currentPoem: null, 
			history: null, 
			activeView: "poemBuilder", 
			views: {
				"poemBuilder": {
					"name": "poemBuilder",
					"text": "Current Build"
				},
				"wordBank": {
					"name": "wordBank", 
					"text": "Word Bank"
				},
				"help": {
					"name": "help", 
					"text": "Help"
				}, 
				"selfDestruct": {
					"name": "selfDestruct",
					"text": "Self Destruct"
				},
				"history": {
					"name": "history",
					"text": "My Poems"
				},
			},
			display: {
				"history": false, 
				"syllableUpdate": false,
				"definitionUpdate": false,
				"originalWordWarning": false,
			},
			criteria: {
				lineCount: 3,
				syllableLimits: [5,7,5],
				example: ["haikus are easy", "but sometimes they don't make sense", "refrigerator"],
			},
			map: new Map(), 
			currentWord: null,
			syllableCounts: [0,0,0],
		};
	};



	toggleUser = () => {
		console.log(`toggleUser`);
		const nextUser = this.state.users.find(user => user.userName != this.state.user.userName); 
		this.setState({user: nextUser});
	};

	async componentWillMount() {
		console.log(`componentDidMount`);
		const user = this.state.user;
		if (!user) { console.log(`no current user found, returning`); return; }	
		this.setState({user: user});
		const url = `${url_base}/wordAPI/poem/${user.userName}`;
		console.log(url);
		const response = await fetch(url, {
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			}
		}).then((response) => response.json())
		.then((response) => {
			console.log(response); 
			this.setState({history: response, counter: response.length, currentPoem: response[0].id});
		});		
	};

	addWordToMap = (word, next) => {
		const map = new Map(this.state.map); 
		if (map.get(word) !== undefined) {
			next(map.get(word)); // use cached word
		} else {
			// lookup word
			this.lookupWord(word, (wordObject) => { 
				this.setState({map: this.state.map.set(word, {...wordObject}) }); 
				next(wordObject); 
			});
		}		
	};

	toggleView = (view="") => {
		if (!view || view === this.state.activeView || !(view in this.state.views) ) {
			return; 
		}
		// toggle history on/off
		if (view === this.state.views.history.name) {
			const newDisplay = {...this.state.display, history: !this.state.display.history};
			this.setState({display: newDisplay});
			return;
		}
		this.setState({activeView: view}); 
	};

	getCurrentPoem = () => {
		return [...this.state.history].find(poem => poem.id === this.state.currentPoem); 
		//return [...this.state.history].splice(this.state.currentPoemIndex, 1).find(e=>true);
	};

	handleTitleChange = (newTitle) => {
		this.setState({history: this.state.history.map((poem, index) => {
			if (poem.id === this.state.currentPoem) {
				return {...poem, title: newTitle}
			} else {
				return poem; 
			}
		})});
	};

	handleResetPoem = () => {
		const history = this.state.history.map((item, i) => {
			if (item.id === this.state.currentPoem) {
				item.linesEdit = item.lines; 
			}
			return item;  
		});

		this.setState({ history: history });
	};

	handleSavePoem = () => {
		const poem = this.getCurrentPoem(); 
		if (!poem || !poem.lines){ return; }
		
		// replaces `lines` with `linesEdit`
		const history = [...this.state.history].map((item, i) => {
			if (item.id === this.state.currentPoem) {
				item.lines = item.linesEdit; 
				return item;
			} else {
				return item;
			}
		});

		const newPoem = this.createPoem(); 

		this.setState({ 
			history: [...history, newPoem],
			currentPoem: newPoem.id,
		});

		var url = `${url_base}/wordAPI/poem`;		
		var headers = {'Content-Type': 'application/json'};
		fetch(url, {
			method: 'post', 
			body: JSON.stringify(poem),
			headers: headers,
		})
			.then(res => res.json())
			.then(res => {
				console.log(`result of fetch: ${JSON.stringify(res)}`);
			})
			.catch(err => err);
	};	

	handlePoemClick = (e, lineNumber) => {
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

	handlePoemKeyDown = (e) => {
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

	handlePoemLineChange = (e, lineNumber) => {		
		// save original cursor position
		var cursorStart = e.target.selectionStart,
			cursorEnd = e.target.selectionEnd;		
		
		let line = e.target.value;

		// line from start up to current cursor position
		var leftOfCursor = e.target.value.slice(0,e.target.selectionEnd);
		var words = leftOfCursor.split(" ");
		var currentWord = words[words.length-1];

		this.updateCurrentWord(currentWord); // this is completing execution AFTER history has already been calculated
		
		let lines;
		const currentPoem = this.getCurrentPoem(); 
		let syllableCounts = this.state.syllableCounts; 
		const history = this.state.history.map((poem, index) => {
			if (poem.id === this.state.currentPoem) {
				let currentLines = [...poem.linesEdit];
				if (!currentLines) { currentLines = this.createLines()}
				currentLines[lineNumber] = line;
				lines = currentLines; 
				syllableCounts = lines.map(line => this.getSyllableCount(line));
				return {...poem, linesEdit: currentLines};
			}
		});		
		this.setState({ history: history, syllableCounts: syllableCounts });

		this.validatePoem(this.getCurrentPoem());		
				
		// restore cursor position
		e.target.setSelectionRange(cursorStart, cursorEnd); 
	};

	createLines = (length=this.state.criteria.lineCount) => {
		return new Array(length).fill(""); 
	}

	handlePoemClick = (e, lineNumber) => {			
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

	handleDefinitionChange = (e) => {
		if (e.target.value && e.target.value !== this.state.currentWord.activeEdit.edit.definition) {
			this.setState({display: {...this.state.display, definitionUpdate: true}});
		} else {
			this.setState({display: {...this.state.display, definitionUpdate: false}});
		}

		this.setState({
			currentWord: {
				...this.state.currentWord, 
				activeEdit: {...this.state.currentWord.activeEdit, 
					definition: true, 
					edit: {...this.state.currentWord.activeEdit.edit, definition: e.target.value}}
			}
		});
	};

	handleSyllableChange = (e) => {
		if (e.target.value && e.target.value !== this.state.currentWord.syllables) {
			this.setState({display: {...this.state.display, syllableUpdate: true}});
		} else {
			this.setState({display: {...this.state.display, syllableUpdate: false}});
		}
		
		this.setState({
			currentWord: {
				...this.state.currentWord, 
				activeEdit: {...this.state.currentWord.activeEdit, 
					syllables: true, 
					edit: {...this.state.currentWord.activeEdit.edit, syllables: (e.target.value ? parseInt(e.target.value) : '')}
				}
			}
		});		
	};

	handleStart = () => {
		const newPoem = {...this.createPoem()}; 
		if (this.state.history && this.state.history.length) { return; }
		const history = [ newPoem ];	 
		this.setState({ 
			history: history,
			currentPoem: newPoem.id,
			activeView: this.state.views.poemBuilder.name
		});
	};

	lookupWord = (text, next, ...nextArgs) => {
		if (!text && !next) { console.log(`lookupWord --> word: ${text}`); return null; }
		var url = `${url_base}/wordAPI/${text}`;
		fetch(url)
			.then(res => res.json())
			.then(res => {
				const word = {
					text: text,
					definition: res.definition,
					syllables: res.syllables,
					edited: res.edited,
					activeEdit: {
						edit: res,
					}
				}
				next(word, nextArgs);
			})
			.catch(err => err);
	};

	renderViews = () => {
		let views = [(this.state.display.history ? this.getView(this.state.views.history.name) : null)];
		views.push(this.getView(this.state.activeView)); 
		return views; 
	};

	incrementCounter = () => {
		
		this.setState({counter: this.state.counter+1});
	};

	createPoem = (count=null, title='Haiku') => {
		const num = count ? count : this.state.counter;
		this.incrementCounter();
		const fullTitle = `${title} ${num}`;
		const user = this.state.user; 
		let newPoem = {
			user: user ? user.userName : '',
			id: `${user ? user.userName : ''}_${num}`, 
			title: fullTitle,
			lines: this.createLines(),
			linesEdit: this.createLines(),
			lineCount: 3,
			type: "haiku",
			valid: false,
		};
		return newPoem;
	};

	viewOriginalWord = (viewStatus) => {
		this.setState({ display: {...this.state.display, originalWordWarning: viewStatus}});
	};

	continueUpdate = (displayWarning, updateSyllables=true, updateDefinition=true) => {
		if (!this.state.currentWord || !this.state.currentWord.activeEdit) { return; }
		
		const currentWord = {...this.state.currentWord};
		
		const newSyllableCount = (updateSyllables ? this.state.currentWord.activeEdit.edit.syllables : currentWord.syllables);
		const newDefinition = (updateDefinition ? this.state.currentWord.activeEdit.edit.definition : currentWord.definition); 
		
		const newWord = {...currentWord, syllables: newSyllableCount, definition: newDefinition, original:{...currentWord}, edited: true, activeEdit: {...currentWord}};
		const map = this.state.map;
		map.delete(currentWord.text);
		map.set(currentWord.text, newWord);

		let valid;
		let currentPoem;  
		const history = this.state.history.map((poem, i) => {
			if (poem.id === this.state.currentPoem){
				currentPoem = this.getCurrentPoem(); 
				valid = this.validatePoem(poem.linesEdit);
				return {...currentPoem, valid: valid}
			} else { 
				currentPoem = poem;
				return currentPoem;  
			}; 
		});

		if (updateSyllables) {
			this.cancelWarning(this.state.display.syllableUpdate, true, false); 
		}

		if (updateDefinition) {
			this.cancelWarning(this.state.display.definitionUpdate, false, true);
		}

		this.updateSyllableCounts(currentPoem.linesEdit);
		
		this.setState({
			map: map,
			displaySyllableUpdate: false,
			currentWord: newWord,
			history: history,
		});
	};

	cancelWarning = (displayWarning, resetSyllables=true, resetDefinition=true) => {
		if (this.state.currentWord && this.state.currentWord.activeEdit) {
			this.updateCurrentWord(null, resetSyllables, resetDefinition);
		}
		this.setState({displayWarning: false});
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
			const poem = this.getCurrentPoem(); 
			const lines = poem.linesEdit ? poem.linesEdit : poem.lines;
			const syllableCounts = lines.map(line => this.getSyllableCount(line));
			this.setState({
					currentWord: {...wordObject, 
						activeEdit: {
							syllables: false,
							definition: false, 
							edit: {...wordObject}
						}, 
						syllableCounts: syllableCounts}});					
		}); 
	};

	validatePoem = (poem) => {
		if (!poem) { return; }
		const lines = poem.lines; 
		if (!lines) {
			return false;
		}
		for (let i = 0; i < lines.length; i++) {
			if (this.state.syllableCounts[i] !== this.state.criteria.syllableLimits[i]) {
				this.setState({valid: false});
				return false;
			}
		}
		this.setState({valid:true});
		return true; 
	};

	getSyllableCount = (line) => {
		if (!line) { return; }
		return line.split(" ").reduce((total, word) => {
				const targetWord = this.state.map.get(word);
				if (!targetWord || !('syllables' in targetWord) || targetWord.syllables === undefined) { return total + 0; }	
				return total + targetWord.syllables;
		}, 0);
	};

	togglePoemHistory = (poemId) => {
		if (poemId === this.state.currentPoem) { return; }
		const currentPoem = this.getCurrentPoem();
		if (!currentPoem) { return null; }
	
		
		this.setState({
			currentPoem: poemId,
		});
	};

	getView = (view="") => {
		if (!view || !(view in this.state.views)) {
			return; 
		}

		const views = {...this.state.views};
		const poem = this.getCurrentPoem();
		if (!poem) { console.log(`poem: ${JSON.stringify(poem)}, returning`); return; };
		console.log(`current poem: ${JSON.stringify(poem)}`);
		let lines = poem.linesEdit ? poem.linesEdit : poem.lines;
		if (!lines) { lines = this.createLines()} 

		const currentWord = this.state.currentWord ? (this.state.currentWord.activeEdit ? this.state.currentWord.activeEdit.edit : null) : null; 
		
		const user = this.state.user; 
		const filteredHistory = this.state.history ? this.state.history.filter((item) => { console.log(`item: ${JSON.stringify(item)}`); return item.user === (user ? user.userName : '')}) : null;
		console.log(`filteredHistory: ${JSON.stringify(filteredHistory)}`);

		switch(view) {
			case views.poemBuilder.name:
				return (<PoemBuilder
					poem={poem}
					syllableCounts={this.state.syllableCounts}
					map={this.state.map}
					criteria={this.state.criteria}
					handleKeyDown={this.handlePoemKeyDown}
					handleClick={this.handlePoemClick}
					handleLineChange={this.handlePoemLineChange}
					currentLine={this.state.currentLine}
					handleSavePoem={this.handleSavePoem}
					handleTitleChange={this.handleTitleChange}
					handleDefinitionChange={this.handleDefinitionChange}
					handleSyllableChange={this.handleSyllableChange}
					handleResetPoem={this.handleResetPoem}
					currentWord={currentWord}
					displayDefinitionUpdate={this.state.display.definitionUpdate}
					displaySyllableUpdate={this.state.display.syllableUpdate}
					continueDefinitionUpdate={() => this.continueUpdate(this.state.display.definitionUpdate, false, true)}
					continueSyllableUpdate={() => this.continueUpdate(this.state.display.syllableUpdate, true, false)}
					cancelDefinitionUpdate={() => this.cancelWarning(this.state.display.definitionUpdate, false, true)}
					cancelSyllableUpdate={() => this.cancelWarning(this.state.display.syllableUpdate, true, false)}
					viewOriginalWord={this.viewOriginalWord}
					displayOriginalWord={this.state.display.originalWordWarning}
				/>); 
				break; 
			case views.wordBank.name: 
				const words = Object.keys(this.state.map).map(item => this.state.map.get(item));
				return <WordBank words={words} />;
				break;
			case views.help.name: 
				return <Help />;
				break; 
			case views.selfDestruct.name: 
				return <SelfDestruct />; // "relax... screen, game, photo, gif, etc" 
				break;  
			case views.history.name:
				return <History 
					history={filteredHistory} 
					currentPoem={this.state.currentPoem} 
					togglePoemHistory={this.togglePoemHistory}
				/>;
				break; 
		}
	};

	render() {	
		const buttons = Object.keys(this.state.views).map(item => {
			return {
				"name": item,
				"text": this.state.views[item].text
			};
		});

		const currentUser = this.state.user;
		console.log(`currentUser: ${JSON.stringify(this.state.user)}`);  

		return (
			<Fragment>
			
			{this.state.activeView && this.state.history && this.state.history.length?
				<Fragment>
					<NavBar
						userName={currentUser ? currentUser.name : "?"}
						buttons={buttons}
						selectedButton={this.state.activeView}
						displayHistory={this.state.display.history}
						handleClick={this.toggleView}
						toggleUser={this.toggleUser}
					/>
					{this.renderViews(this.state.activeView)}
				</Fragment>
				:
				<Button 
					buttonStyle="startButton"
					handleClick={this.handleStart}
					value="Build!"
				/>
			}
			
			</Fragment>
		);
	};	
};

export default Game; 