import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { wordAdded, wordUpdated } from '../words/wordSlice'
import { currentWordUpdated, fetchWord } from '../words/wordSlice'
import { poemAdded, poemUpdated, poemReset, selectPoemById, addPoem } from './poemSlice'
import { CurrentWord } from '../../app/CurrentWord'
import { PoemAuthor } from './PoemAuthor'
import { TimeNow } from './TimeNow'
import { ReactionButtons } from './ReactionButtons'
import { unwrapResult } from '@reduxjs/toolkit'

export const Poem = ({ match }) => {
  console.log(`Poem rendering`)
  const { poemId } = match.params

  const userId = useSelector(state => state.users.activeUserId)

  const poem = useSelector(state => selectPoemById(state, poemId))

  const wordMap = useSelector(state => state.words.words) 

  const [title, setTitle] = useState(poem ? poem.title : '')
  const [lines, setLines] = useState(poem ? poem.lines : '')
  const [addRequestStatus, setAddRequestStatus] = useState('idle')

  const dispatch = useDispatch()
  const history = useHistory()

  if (!poem) {
    return (
      <section>
        <h2>Poem not found!</h2>
      </section>
    )
  }

  // calculating the syllable counts

  let syllableCounts = poem.syllableCounts

  if (syllableCounts.length) {
    console.log(`setting syllableCounts to ${poem.syllableCounts}`)
    syllableCounts = poem.syllableCounts
  } else {
    console.log(`recalculating syllableCounts`)
    syllableCounts = lines.map(line => {
    if (!line) { return 0; }
    const words = line.split(" ")
    const total = words.reduce((runningTotal, currentWord) => {
      return runningTotal += (wordMap[currentWord] ? wordMap[currentWord]["syllables"] : 0)
    }, 0)
    return total
    })
  }

  //const syllableCounts = poem.syllableCounts ? poem.syllableCounts : [0, 0, 0]; 
  const syllableLimits = poem.syllableLimits; 
  const placeholders = poem.placeholders ? poem.placeholders :  ["haikus are easy", "but sometimes they don't make sense", "refrigerator"]; 

  const onTitleChanged = e => setTitle(e.target.value)

  const id = poem.id
  const reactions = poem.reactions ? poem.reactions : {thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0}
  const date = poem.date ? poem.date : ''

  const canSave =
    [id, title, lines, userId, syllableLimits, syllableCounts, reactions, placeholders].every(Boolean) && addRequestStatus === 'idle'

  const onSaveAndCreatePoemClicked = async () => {
    if (canSave) {
      try {
        setAddRequestStatus('pending')
        const resultAction = await dispatch(
          addPoem({ id, title, lines, user: userId, syllableCounts, syllableLimits, date, reactions })
        )
        unwrapResult(resultAction)
        setTitle('')
        setLines(["", "", ""])
      } catch (err) {
        console.error('Failed to save the post: ', err)
      } finally {
        setAddRequestStatus('idle')
      }
    } else {
      console.log(`cannot save`)
    }

    dispatch(poemAdded(userId))
  }

  
  const onSavePoemClicked = async () => {
    if (canSave) {
      try {
        setAddRequestStatus('pending')
        const resultAction = await dispatch(
          addPoem({ id, title, lines, user: userId, syllableCounts, syllableLimits, date, reactions })
        )
        unwrapResult(resultAction)
        setTitle('')
        setLines(["", "", ""])
      } catch (err) {
        console.error('Failed to save the post: ', err)
      } finally {
        setAddRequestStatus('idle')
      }
    } else {
      console.log(`cannot save`)
    }
  }

  /*
  const onSaveAndCreatePoemClicked = () => {
    dispatch(poemUpdated({id: poemId, title, lines}))
    dispatch(poemAdded(userId))
  }*/

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
      onChange={(e) => handleLineChange(e, lineNum) }
      onClick={(e) => handlePoemClick(e, lineNum) }
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
            <button onClick={onSaveAndCreatePoemClicked}>Save & Create New</button>
            <button onClick={onResetPoemClicked}>Reset</button>
          </div>
        <PoemAuthor userId={poem.user} />
        <TimeNow timestamp={poem.date} />
        <ReactionButtons poem={poem}/>
          <div className="lines">
            {lines.map((line, lineNum) => 
              <span key={`line_${lineNum}`} className="line">
              <textarea 
                key={lineNum} 
                value={line} 
                onChange={(e) => handleLineChange(e, lineNum) }
                onClick={(e) => handlePoemClick(e, lineNum) }
                placeholder={placeholders[lineNum]}
              />
              <h4 key={`counter_${lineNum}`} className="counter"> {syllableCounts[lineNum]} / {syllableLimits[lineNum]}</h4>
              </span>
            )}
            <hr className="divider"/>
          </div>
        </div> 
        <CurrentWord/>
      </div>
    </React.Fragment>
  )
}