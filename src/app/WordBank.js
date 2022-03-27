import React from 'react';

const WordBank = (props) => {
    let words = props.words;
    if (!words) {
        words = [];
    }
    const items = words.map((word, i) => {
        if (!word) {
            return;
        }
        return (
            <li>
                <span>
                    <h2>{word.text}</h2>
                    <hr />
                    {word.syllables ? (
                        <p>
                            {word.syllables} syllable
                            {word.syllables > 1 ? 's' : null}
                        </p>
                    ) : (
                        <p> No syllable count </p>
                    )}
                    <p>{word.definition}</p>
                </span>
            </li>
        );
    });

    return <ul>{items}</ul>;
};

export default WordBank;
