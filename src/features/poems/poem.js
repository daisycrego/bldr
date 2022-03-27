import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { currentWordUpdated, fetchWord } from '../words/wordSlice';
import {
    poemAdded,
    poemReset,
    addPoem,
    fetchActivePoem,
    fetchPoemById,
} from './poemSlice';
import { CurrentWord } from '../../app/components/CurrentWord';
import { PoemAuthor } from './PoemAuthor';
import { TimeNow } from './TimeNow';
import { ReactionButtons } from './ReactionButtons';
import { unwrapResult } from '@reduxjs/toolkit';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export const Poem = ({ match = null }) => {
    const dispatch = useDispatch();
    const history = useHistory();

    let poem = useSelector((state) => state.poems.activePoem);
    if (!poem) {
        poem = {
            user: 'a',
            title: 'Title here...',
            lines: [
                'haikues are easy',
                "but sometimes they don't make sense",
                'refrigerator',
            ],
            lineCount: 3,
            valid: true,
            syllableCounts: [5, 7, 5],
            syllableLimits: [5, 7, 5],
            date: '10/10/2022',
            reactions: [0, 0, 0, 0, 0],
            archived: false,
        };
    }

    console.log('Poem, poem:', poem);

    const poems = useSelector((state) => state.poems.poems);
    const poemStatus = useSelector((state) => state.poems.activePoemStatus);
    const error = useSelector((state) => state.poems.error);
    const [title, setTitle] = useState(poem ? poem.title : '');
    const [lines, setLines] = useState(poem ? poem.lines : ['', '', '']);
    const onTitleChanged = (e) => setTitle(e.target.value);
    let syllableLimits =
        poem && poem.syllableLimits ? poem.syllableLimits : [5, 7, 5];
    let syllableCounts =
        poem && poem.syllableCounts ? poem.syllableCounts : [0, 0, 0];
    let placeholders =
        poem && poem.placeholders
            ? poem.placeholders
            : [
                  'haikus are easy',
                  "but sometimes they don't make sense",
                  'refrigerator',
              ];
    let id = poem && poem.id ? poem.id : id;
    let reactions =
        poem && poem.reactions
            ? poem.reactions
            : { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let date = poem && poem.date ? poem.date : '';
    const userId = useSelector((state) => state.users.activeUserId);

    let canSave = false;

    const wordMap = useSelector((state) => state.words.words);
    const [addRequestStatus, setAddRequestStatus] = useState('idle');

    let fetchActive = false;
    let poemId;
    if (match) {
        poemId = match.params.poemId;
    } else {
        fetchActive = true;
        poemId = null;
    }

    useEffect(() => {
        if (poemStatus === 'idle' && fetchActive) {
            dispatch(fetchActivePoem()).then((poem) => {
                setLines(poem.payload.lines);
                setTitle(poem.payload.title);
            });
        } else if (poemStatus === 'idle') {
            dispatch(fetchPoemById(poemId)).then((poem) => {
                setLines(poem.payload.lines);
                setTitle(poem.payload.title);
            });
        }
    });

    let content;

    const onSaveAndCreatePoemClicked = async () => {
        canSave =
            [
                id,
                title,
                lines,
                userId,
                syllableLimits,
                syllableCounts,
                reactions,
                placeholders,
            ].every(Boolean) && addRequestStatus === 'idle';

        if (canSave) {
            try {
                setAddRequestStatus('pending');
                const resultAction = await dispatch(
                    addPoem({
                        id,
                        title,
                        lines,
                        user: userId,
                        syllableCounts,
                        syllableLimits,
                        date,
                        reactions,
                    })
                );
                unwrapResult(resultAction);
                setTitle('');
                setLines(['', '', '']);
            } catch (err) {
                console.error('Failed to save the post: ', err);
            } finally {
                setAddRequestStatus('idle');
            }
        } else {
            console.log(`cannot save`);
        }

        dispatch(poemAdded(userId));
    };

    const onSavePoemClicked = async () => {
        canSave =
            [
                id,
                title,
                lines,
                userId,
                syllableLimits,
                syllableCounts,
                reactions,
                placeholders,
            ].every(Boolean) && addRequestStatus === 'idle';

        if (canSave) {
            try {
                setAddRequestStatus('pending');
                const resultAction = await dispatch(
                    addPoem({
                        id,
                        title,
                        lines,
                        user: userId,
                        syllableCounts,
                        syllableLimits,
                        date,
                        reactions,
                    })
                );
                unwrapResult(resultAction);
            } catch (err) {
                console.error('Failed to save the post: ', err);
            } finally {
                setAddRequestStatus('idle');
            }
        } else {
            console.log(`cannot save`);
        }
    };

    const onResetPoemClicked = () => {
        dispatch(poemReset(poemId));
    };

    const onChangeCurrentWord = (newWord) => {
        dispatch(currentWordUpdated(newWord));
    };

    const handleLineChange = (e, lineNum) => {
        const newLine = e.target.value;
        let newLines = [...lines];
        newLines[lineNum] = newLine;
        setLines(newLines);

        // save original cursor position
        var cursorStart = e.target.selectionStart,
            cursorEnd = e.target.selectionEnd;

        let line = e.target.value;

        // line from start up to current cursor position
        var leftOfCursor = e.target.value.slice(0, e.target.selectionEnd);
        var words = leftOfCursor.split(' ');
        var currentWord = words[words.length - 1];

        onChangeCurrentWord(currentWord); // this is completing execution AFTER history has already been calculated

        // restore cursor position
        e.target.setSelectionRange(cursorStart, cursorEnd);
    };

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

        onChangeCurrentWord(word);
    };

    if (poemStatus === 'loading') {
        content = <div className='loader'>Loading</div>;
    } else if (poemStatus === 'succeeded') {
        syllableLimits =
            poem && poem.syllableLimits ? poem.syllableLimits : syllableLimits;
        placeholders =
            poem && poem.placeholders ? poem.placeholders : placeholders;
        id = poem && poem.id ? poem.id : id;
        reactions = poem && poem.reactions ? poem.reactions : reactions;
        date = poem && poem.date ? poem.date : date;

        // calculating the syllable counts
        syllableCounts =
            poem && poem.syllableCounts ? poem.syllableCounts : syllableCounts;
        if (!syllableCounts.length) {
            syllableCounts = lines.map((line) => {
                if (!line) {
                    return 0;
                }
                const words = line.split(' ');
                const total = words.reduce((runningTotal, currentWord) => {
                    return (runningTotal += wordMap[currentWord]
                        ? wordMap[currentWord]['syllables']
                        : 0);
                }, 0);
                return total;
            });
        }

        content = (
            <React.Fragment>
                <div className='poemBuilder row'>
                    <div className='poem'>
                        <div className='row'>
                            <div className='title'>
                                <span>
                                    <span className={'underline'}>title</span>:
                                </span>
                                <TextField
                                    className='title'
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <h2 title={title} onChange={onTitleChanged} />
                            <Button onClick={onSavePoemClicked}>Save</Button>
                            <Button onClick={onSaveAndCreatePoemClicked}>
                                Save & Create New
                            </Button>
                            <Button onClick={onResetPoemClicked}>Reset</Button>
                        </div>
                        <PoemAuthor userId={poem ? poem.user : null} />
                        <TimeNow timestamp={poem ? poem.date : ''} />
                        <ReactionButtons poem={poem} />
                        <div className='lines'>
                            {lines
                                ? lines.map((line, lineNum) => (
                                      <span
                                          key={`line_${lineNum}`}
                                          className='line'
                                      >
                                          <TextField
                                              key={lineNum}
                                              value={line}
                                              onChange={(e) =>
                                                  handleLineChange(e, lineNum)
                                              }
                                              onClick={(e) =>
                                                  handlePoemClick(e, lineNum)
                                              }
                                              placeholder={
                                                  placeholders
                                                      ? placeholders[lineNum]
                                                      : ''
                                              }
                                          />
                                          <h4
                                              key={`counter_${lineNum}`}
                                              className='counter'
                                          >
                                              {' '}
                                              {syllableCounts[lineNum]} /{' '}
                                              {syllableLimits[lineNum]}
                                          </h4>
                                      </span>
                                  ))
                                : null}
                            <hr className='divider' />
                        </div>
                    </div>
                    <CurrentWord />
                </div>
            </React.Fragment>
        );
    } else if (poemStatus === 'failed') {
        content = <div>{error}</div>;
    }

    return <React.Fragment>{content}</React.Fragment>;
};
