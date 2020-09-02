import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { wordAdded, wordUpdated } from '../words/wordSlice'
import { currentWordUpdated } from '../currentWord/currentWordSlice'
import { poemAdded, poemUpdated, poemReset, selectPoemById } from './poemSlice'
import { CurrentWord } from '../../app/CurrentWord'

export const Poem = ({ match }) => {

  const { poemId } = match.params
  console.log(`poemId: ${poemId}`)

  const userId = useSelector(state => state.users.activeUserId)

  const poem = useSelector(state => selectPoemById(state, poemId))

  const [title, setTitle] = useState(poem ? poem.title : '')
  const [lines, setLines] = useState(poem ? poem.lines : '')

  const dispatch = useDispatch()
  const history = useHistory()

  if (!poem) {
    return (
      <section>
        <h2>Poem not found!</h2>
      </section>
    )
  }

  const syllableCounts = poem.syllableCounts ? poem.syllableCounts : [0, 0, 0]; 
  const syllableLimits = poem.syllableLimits ? poem.syllableLimits: [5, 7, 5]; 
  const placeholders = poem.placeholders ? poem.placeholders :  ["haikus are easy", "but sometimes they don't make sense", "refrigerator"]; 

  const onTitleChanged = e => setTitle(e.target.value)

  const onSavePoemClicked = () => {
    if (lines) {
      dispatch(poemUpdated({id: poemId, title, lines}))
    }
  }

  const onCreatePoemClicked = () => {
    onSavePoemClicked()
    dispatch(poemAdded(userId))
  }

  const onResetPoemClicked = () => {
    dispatch(poemReset(poemId))
  }

  const onChangeCurrentWord = (newWord) => {
    dispatch(currentWordUpdated(newWord))
  }

  const handleLineChange = (e, lineNum) => {
    const newLine = e.target.value;
    let newLines = [...lines]
    newLines[lineNum] = newLine; 
    setLines(newLines)

    // save original cursor position
    var cursorStart = e.target.selectionStart,
      cursorEnd = e.target.selectionEnd;    
    
    let line = e.target.value;

    // line from start up to current cursor position
    var leftOfCursor = e.target.value.slice(0,e.target.selectionEnd);
    var words = leftOfCursor.split(" ");
    var currentWord = words[words.length-1];

    onChangeCurrentWord(currentWord); // this is completing execution AFTER history has already been calculated
    
    /*
    let lines;
    const currentPoem = this.getCurrentPoem(); 
    let syllableCounts; 
    const history = this.state.history.map((poem, index) => {
      if (!poem) { return poem; }
      if (poem.id === this.state.currentPoem) {
        let currentLines = [...poem.linesEdit];
        if (!currentLines) { currentLines = this.createLines()}
        currentLines[lineNum] = line;
        lines = currentLines; 
        syllableCounts = lines.map(line => this.getSyllableCount(line));
        return {...poem, linesEdit: currentLines};
      }
    });
    */
    //console.log(`handlePoemLineChange: syllableCounts: ${syllableCounts}`);     
    //this.setState({ history: history, syllableCounts: syllableCounts });

    //this.validatePoem(this.getCurrentPoem());   
        
    // restore cursor position
    e.target.setSelectionRange(cursorStart, cursorEnd); 
  }

  const handlePoemClick = (e, lineNum) => {      
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
    
    onChangeCurrentWord(word)
    
    //this.setState({currentLine: lineNumber});
  };



  const linesRendered = lines.map((line, lineNum) => 
    <span key={`line_${lineNum}`} className="line">
    <textarea 
      key={lineNum} 
      value={line} 
      onChange={(e) => { console.log(lineNum); handleLineChange(e, lineNum)} }
      onClick={(e) => handlePoemClick(e, lineNum)}
      placeholder={placeholders[lineNum]}
    />
    <h4 key={`counter_${lineNum}`} className="counter"> {syllableCounts[lineNum]} / {syllableLimits[lineNum]}</h4>
    </span>
  )

  return (
    <React.Fragment>
      <div className="poemBuilder row">
        <div className="poem"> 
          <div className="row">
            <div className="title">
              <span>
                <span className={'underline'}>title</span>
                :
              </span>
              <textarea 
                className="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)} 
              />
            </div>

            <h2 title={title} onChange={onTitleChanged}/>
            <button onClick={onSavePoemClicked}>Save</button>
            <button onClick={onCreatePoemClicked}>Save & Create New</button>
            <button onClick={onResetPoemClicked}>Reset</button>
          </div>
          <div className="lines">
            {linesRendered}
            <hr className="divider"/>
          </div>
        </div> 
        <CurrentWord/>
      </div>
    </React.Fragment>
  )
}