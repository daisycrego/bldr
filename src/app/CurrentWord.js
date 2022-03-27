import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWord } from '../features/words/wordSlice';

import TextareaAutosize from 'react-textarea-autosize';

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
                            <TextareaAutosize
                                className='currentWordSyllableCount'
                                value={syllableCount}
                            />

                            <textarea
                                className='currentWordSyllableText'
                                disabled
                                value={` syllable${
                                    syllableCount > 1 || syllableCount === 0
                                        ? 's'
                                        : ''
                                }`}
                            />
                        </React.Fragment>
                    )}
                    {loadingStatus === 'failed' ? <div>{error}</div> : null}
                </span>

                {displaySyllableUpdate ? (
                    <React.Fragment>
                        <button value='Update syllable count' />
                        <button value='Cancel' />
                    </React.Fragment>
                ) : null}

                {loadingStatus === 'loading' ? (
                    <div className='loader'>Loading</div>
                ) : (
                    <TextareaAutosize
                        className='currentDefinition'
                        value={currentWord ? currentWord.definition : ''}
                    />
                )}

                {displayDefinitionUpdate ? (
                    <React.Fragment>
                        <button value='Update definition' />
                        <button value='Cancel' />
                    </React.Fragment>
                ) : null}

                {displayWordResetButton ? (
                    <button value={`Reset syllable count & definition`} />
                ) : null}
            </div>
        </React.Fragment>
    );
};
