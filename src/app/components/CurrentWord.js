import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWord } from '../../features/words/wordSlice';

import TextareaAutosize from 'react-textarea-autosize';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export const CurrentWord = () => {
    const displaySyllableUpdate = false,
        displayDefinitionUpdate = false,
        displayWordResetButton = false;

    const dispatch = useDispatch();

    const currentWord = useSelector((state) => state.words.currentWord);
    const loadingStatus = useSelector((state) => state.words.status);
    const error = useSelector((state) => state.words.error);

    if (loadingStatus === 'idle') {
        if (currentWord['word']) {
            dispatch(fetchWord(currentWord['word']));
        }
    }
    const syllableCount = currentWord ? currentWord.syllables : 0;

    return (
        <React.Fragment>
            <div className='currentWord'>
                <h1 className='currentWordDisplay'>
                    {currentWord ? currentWord['word'] : ''}
                </h1>

                <span className='currentWordSyllables'>
                    {loadingStatus === 'loading' ? (
                        <div className='loader'>Loading</div>
                    ) : (
                        <React.Fragment>
                            <TextField
                                className='currentWordSyllableCount'
                                value={syllableCount}
                            />

                            <span className='currentWordSyllableText'>
                                {` syllable${
                                    syllableCount > 1 || syllableCount === 0
                                        ? 's'
                                        : ''
                                }`}
                            </span>
                        </React.Fragment>
                    )}
                    {loadingStatus === 'failed' ? <div>{error}</div> : null}
                </span>

                {displaySyllableUpdate ? (
                    <React.Fragment>
                        <Button value='Update syllable count' />
                        <Button value='Cancel' />
                    </React.Fragment>
                ) : null}

                {loadingStatus === 'loading' ? (
                    <div className='loader'>Loading</div>
                ) : (
                    <TextField
                        multiline
                        maxRows='4'
                        className='currentDefinition'
                        value={currentWord ? currentWord.definition : ''}
                    />
                )}

                {displayDefinitionUpdate ? (
                    <React.Fragment>
                        <Button value='Update definition' />
                        <Button value='Cancel' />
                    </React.Fragment>
                ) : null}

                {displayWordResetButton ? (
                    <Button value={`Reset syllable count & definition`} />
                ) : null}
            </div>
        </React.Fragment>
    );
};
