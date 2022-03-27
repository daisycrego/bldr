import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { wordAdded, wordUpdated } from '../words/wordSlice'
import { currentWordUpdated, fetchWord } from '../words/wordSlice'
import { poemAdded, poemUpdated, poemReset, selectPoemById, addPoem, selectAllPoems, fetchPoems, fetchActivePoem, fetchPoemById, selectActivePoem } from './poemSlice'
import { CurrentWord } from '../../app/CurrentWord'
import { PoemAuthor } from './PoemAuthor'
import { TimeNow } from './TimeNow'
import { ReactionButtons } from './ReactionButtons'
import { unwrapResult } from '@reduxjs/toolkit'

export const Poem = ({ match=null }) => {
  const dispatch = useDispatch()
  const history = useHistory()

  let poem = useSelector(state => state.poems.activePoem)
  const poems = useSelector(state => state.poems.poems)
  const poemStatus = useSelector(state => state.poems.activePoemStatus)
  const error = useSelector(state => state.poems.error)
  const [title, setTitle] = useState(poem ? poem.title : '')
  const [lines, setLines] = useState(poem ? poem.lines : ["", "", ""])
  const onTitleChanged = e => setTitle(e.target.value)
  let syllableLimits = poem && poem.syllableLimits ? poem.syllableLimits : [5,7,5] 
  let syllableCounts = poem && poem.syllableCounts ? poem.syllableCounts : [0,0,0]
  let placeholders = poem && poem.placeholders ? poem.placeholders : ["haikus are easy", "but sometimes they don't make sense", "refrigerator"]
  let id = poem && poem.id ? poem.id : id
  let reactions = poem && poem.reactions ? poem.reactions : {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
  let date = poem && poem.date ? poem.date :  ''
  const userId = useSelector(state => state.users.activeUserId)

  let canSave = false; 
  //[id, title, lines, userId, syllableLimits, syllableCounts, reactions, placeholders].every(Boolean) && addRequestStatus === 'idle'
  console.log(`canSave initial: ${canSave}`)

  
  const wordMap = useSelector(state => state.words.words) 
  const [addRequestStatus, setAddRequestStatus] = useState('idle')

  let fetchActive = false
  let poemId
  if (match) {
    poemId = match.params.poemId
  } else {
    fetchActive = true
    poemId = null
  }

  useEffect(() => {
    if (poemStatus === 'idle' && fetchActive) {
      console.log(`fetching the active poem`)
      dispatch(fetchActivePoem()).then((poem) => { console.log(`poem: ${JSON.stringify(poem)}`); setLines(poem.payload.lines); setTitle(poem.payload.title) } )
    } else if (poemStatus === 'idle') {
      dispatch(fetchPoemById(poemId)).then((poem) => { console.log(`poem: ${JSON.stringify(poem)}`); setLines(poem.payload.lines); setTitle(poem.payload.title) })
    }
  })

  let content

  const onSaveAndCreatePoemClicked = async () => {
    console.log(`addRequestStatus: ${addRequestStatus}, id: ${id}, title: ${title}, lines: ${lines}, userId: ${userId}, syllableLimits: ${syllableLimits}, syllableCounts: ${syllableCounts}, reactions: ${reactions}, placeholders: ${placeholders}`)
    canSave = [id, title, lines, userId, syllableLimits, syllableCounts, reactions, placeholders].every(Boolean) && addRequestStatus === 'idle'
    console.log(`onSavePoemClicked: canSave: ${canSave}`)

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
    console.log(`addRequestStatus: ${addRequestStatus}, id: ${id}, title: ${title}, lines: ${lines}, userId: ${userId}, syllableLimits: ${syllableLimits}, syllableCounts: ${syllableCounts}, reactions: ${reactions}, placeholders: ${placeholders}`)
    canSave = [id, title, lines, userId, syllableLimits, syllableCounts, reactions, placeholders].every(Boolean) && addRequestStatus === 'idle'
    console.log(`onSavePoemClicked: canSave: ${canSave}`)

    if (canSave) {
      try {
        setAddRequestStatus('pending')
        const resultAction = await dispatch(
          addPoem({ id, title, lines, user: userId, syllableCounts, syllableLimits, date, reactions })
        )
        unwrapResult(resultAction)
      } catch (err) {
        console.error('Failed to save the post: ', err)
      } finally {
        setAddRequestStatus('idle')
      }
    } else {
      console.log(`cannot save`)
    }
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
  }

  if (poemStatus === 'loading') {

    content = <div className="loader">Loading</div>

  } else if (poemStatus === 'succeeded') {

    syllableLimits = poem && poem.syllableLimits ? poem.syllableLimits : syllableLimits
    placeholders = poem && poem.placeholders ? poem.placeholders : placeholders
    id = poem && poem.id ? poem.id : id
    reactions = poem && poem.reactions ? poem.reactions : reactions
    date = poem && poem.date ? poem.date :  date
    //canSave =
    //[id, title, lines, userId, syllableLimits, syllableCounts, reactions, placeholders].every(Boolean) && addRequestStatus === 'idle'
    //console.log(`canSave after poem loaded: ${canSave}`)

    // calculating the syllable counts
    syllableCounts = poem && poem.syllableCounts ? poem.syllableCounts : syllableCounts
    if (!syllableCounts.length) {
      syllableCounts = lines.map(line => {
      if (!line) { return 0; }
      const words = line.split(" ")
      const total = words.reduce((runningTotal, currentWord) => {
        return runningTotal += (wordMap[currentWord] ? wordMap[currentWord]["syllables"] : 0)
      }, 0)
      return total
      })
    } 

    content = 
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
          <PoemAuthor userId={poem ? poem.user : null} />
          <TimeNow timestamp={poem ? poem.date : ''} />
          <ReactionButtons poem={poem}/>
            <div className="lines">
              {lines ? lines.map((line, lineNum) => 
                <span key={`line_${lineNum}`} className="line">
                <textarea 
                  key={lineNum} 
                  value={line} 
                  onChange={(e) => handleLineChange(e, lineNum) }
                  onClick={(e) => handlePoemClick(e, lineNum) }
                  placeholder={placeholders ? placeholders[lineNum] : ""}
                />
                <h4 key={`counter_${lineNum}`} className="counter"> {syllableCounts[lineNum]} / {syllableLimits[lineNum]}</h4>
                </span>
              ) : null}
              <hr className="divider"/>
            </div>
          </div> 
          <CurrentWord/>
        </div>
      </React.Fragment>

  } else if (poemStatus === 'failed') {

    content = <div>{error}</div>

  }

  return (
    <React.Fragment>
      { content }
    </React.Fragment>
  )

}
