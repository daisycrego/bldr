import React, {Fragment} from 'react';
import PoemBuilder from './PoemBuilder';
import History from './History';
import Button from './Button';
import NavBar from './NavBar';
import WordBank from './WordBank';
import SelfDestruct from './SelfDestruct';
import Help from './Help';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import { PoemList} from '../features/poems/poemList'
import { Poem } from '../features/poems/poem'

const production  = 'https://poem-builder.herokuapp.com';
const development = 'http://localhost:5000';
const url_base = (process.env.REACT_APP_ENVIRONMENT === 'development' ? development : production);

const user_id ="a";

function Game () {

	return (
		<Router>
			<NavBar/>

			<div className="App">
				<Switch>
					<Route
						exact
						path="/"
						render={() => (
							<React.Fragment>
								<PoemList/>
							</React.Fragment>
						)}
					/>
					<Route
						exact
						path="/history"
						render={() => (
							<React.Fragment>
								<PoemList/>
							</React.Fragment>
						)}
					/>
					<Route exact path="/poems/:poemId" component={Poem}/>
					<Redirect to="/"/>
				</Switch>
			</div>
		</Router>
	)
	/*

	toggleUser = () => {
		const users = [...this.state.users];
		const nextUser = users.find(user => user.userName != this.state.user.userName); 
		this.setState({user: nextUser});
	};

	componentWillMount() {
		const user = this.state.user;
		if (!user) { console.log(`no current user found, returning`); return; }	
		this.setState({user: user});
		
		this.fetchPoem(user, (history) => {console.log(`fetched history: ${JSON.stringify(history)}`); this.setState({history: history, counter: history.length, currentPoem: history[0] ? history[0].id : null})});
		
		this.fetchWords((words) => {this.setState({map: new Map(words)}); console.log(`map loaded`);}); 

		
		this.fetchMap(user, (map) => {
			if (!map || !map.length) {
				map = new Map();
			}
			this.setState({map: map});
		});
		
	};

	fetchWords = async (next) => {
		console.log(`fetchWords`); 
		const wordUrl = `${url_base}/wordAPI/`; 
		const response = await fetch(wordUrl, {
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			}
		}).then(response => response.json())
		.then(response => next(response));
	};

	fetchPoem = async (user, next) => {
	  if (!user) { return; }
		const poemUrl = `${url_base}/wordAPI/poem/${user.userName}`;
		const response = await fetch(poemUrl, {
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			}
		}).then((response) => response.json())
		.then((response) => {
			next(response);
		});
	};

	fetchMap = async (user, next) => {
		if (!user) { return; }
		const mapUrl = `${url_base}/wordAPI/map/${user.userName}`;
		const response = await fetch(mapUrl, {
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			}
		}).then((response) => response.json())
		.then((response) => {
			if (!response) { next(new Map()); }
			next(response); 
		});
	};

	addWordToMap = (word, next) => {
		const map = new Map(this.state.map);
		if (map.get(word) !== undefined) {
			next(map.get(word)); // use cached word
		} else {
			// lookup word
			this.lookupWord(word, (wordObject) => { 
				this.updateMap(word, wordObject);  
				next(wordObject); 
			});
		}		
	};

	updateMap = (word, wordObject) => {
		console.log(`updateMap`); 
		console.log(`this.state.map: ${JSON.stringify(this.state.map)}`);
		const newMap = new Map(this.state.map);
		newMap.set(word, wordObject)
		this.setState({map: newMap}, this.postMap(this.state.map));
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
		const filteredHist = this.state.history.filter(poem => poem); 
		if (!filteredHist) { return null; }
		return filteredHist.find(poem => {
			return poem.id === this.state.currentPoem;
		}); 
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
		const history = [...this.state.history].map((poem, i) => {
			if (!poem) { return poem; }
			if (poem.id === this.state.currentPoem) {
				poem.lines = poem.linesEdit; 
				return poem;
			} else {
				return poem;
			}
		});

		const newPoem = this.createPoem(); 

		this.setState({ 
			history: [...history, newPoem],
			currentPoem: newPoem.id,
		});

		this.postPoem(poem);
		//this.postMap(this.state.map); 
	};	

	postPoem = (poem) => {
		if (!poem ) { return poem; }
		var poemUrl = `${url_base}/wordAPI/poem`;		
		var headers = {'Content-Type': 'application/json'};
		fetch(poemUrl, {
			method: 'post', 
			body: JSON.stringify(poem),
			headers: headers,
		})
			.then(res => res.json())
			.then(res => {
				console.log(`poem posted: ${JSON.stringify(res)}`);
				console.log(`map: ${JSON.stringify(this.state.map)}`);
				this.postMap(this.state.map);
			})
			.catch(err => err);
	};

	postMap = (map) => {
		if (!map) { return map; };
		console.log(`postMap, map: ${JSON.stringify(map)}`);
		var mapUrl = `${url_base}/wordAPI/map`;
		var headers = {'Content-Type': 'application/json'}; 
		var body = {
			user: this.state.user.userName, 
			map: map,
		}
		fetch(mapUrl, {
			method: 'post', 
			body: JSON.stringify(body),
			headers: headers,
		})
			.then(res => res.json())
			.then(res => console.log(`map posted: ${JSON.stringify(res)}`))
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
		
		const map = this.state.map ? this.state.map : new Map(); 
		const currentWord = map.get(word);
		if (currentWord === null){
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
		let syllableCounts; 
		const history = this.state.history.map((poem, index) => {
			if (!poem) { return poem; }
			if (poem.id === this.state.currentPoem) {
				let currentLines = [...poem.linesEdit];
				if (!currentLines) { currentLines = this.createLines()}
				currentLines[lineNumber] = line;
				lines = currentLines; 
				syllableCounts = lines.map(line => this.getSyllableCount(line));
				return {...poem, linesEdit: currentLines};
			}
		});
		console.log(`handlePoemLineChange: syllableCounts: ${syllableCounts}`); 		
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
		
		const map = new Map(this.state.map); 
		const currentWord = map.get(word);
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
		const map = new Map(this.state.map);
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
			newWord = currentWord;
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

	updateSyllableCounts = (lines) => {
		const syllableCounts = this.getSyllableCounts(lines); 
		this.setState({syllableCounts: syllableCounts});
	};

	getSyllableCounts = (lines) => {
		console.log(`getSyllableCounts: map: ${JSON.stringify(this.state.map)}`); 
		const syllableCounts = lines.map(line => {
			if (!line) {
				return 0;
			}
			const map = new Map(this.state.map);			
			return line.split(" ").reduce((total, word) => {
				if (!map || !map.length) { return; }
				const targetWord = map.get(word);
				if (!targetWord || !('syllables' in targetWord) || targetWord.syllables === undefined) { return total + 0; }	
				return total + targetWord.syllables;
			}, 0); 
		}, this);
		return syllableCounts; 
	};

	getSyllableCount = (line) => {
		if (!line) { return; }
		return line.split(" ").reduce((total, word) => {
				const map = new Map(this.state.map); 
				if (!map || !map.length) { return; }
				const targetWord = map.get(word);
				if (!targetWord || !('syllables' in targetWord) || targetWord.syllables === undefined) { return total + 0; }	
				return total + targetWord.syllables;
		}, 0);
	};

	togglePoemHistory = (poemId) => {
		//if (poemId === this.state.currentPoem) { return; }
		//const currentPoem = this.getCurrentPoem();
		//if (!currentPoem) { return null; }
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
		let lines = poem.linesEdit ? poem.linesEdit : poem.lines;
		if (!lines) { lines = this.createLines()} 

		const currentWord = this.state.currentWord ? (this.state.currentWord.activeEdit ? this.state.currentWord.activeEdit.edit : null) : null; 
		
		const user = this.state.user; 
		const sanitizedHistory = this.state.history.filter(poem => poem); 
		const filteredHistory = sanitizedHistory ? (sanitizedHistory.filter((poem) => poem.user === (user ? user.userName : ''))) : null;

		const syllableCounts = this.getSyllableCounts(lines); 
		console.log(`getView: syllableCounts: ${syllableCounts}, lines: ${lines}`); 

		switch(view) {
			case views.poemBuilder.name:
				return (<PoemBuilder
					poem={poem}
					syllableCounts={syllableCounts}
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
				const map = new Map(this.state.map); 
				const words = Object.keys(this.state.map).map(item => map.get(item));
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

	*/

};

export default Game; 