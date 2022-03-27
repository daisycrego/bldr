import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
    poemAdded,
    poemUpdated,
    poemReset,
} from '../../features/poems/poemSlice';
import { CurrentWord } from './CurrentWord';

export const PoemBuilder = ({ match }) => {
    const { poemId } = match.params;
    const poem = useSelector((state) =>
        state.poems.find((poem) => poem.id === poemId)
    );

    const [title, setTitle] = useState(poem.title);
    const [lines, setLines] = useState(poem.lines);

    const dispatch = useDispatch();
    const history = useHistory();

    if (!poem) {
        return (
            <section>
                <h2> Poem not found! </h2>
            </section>
        );
    }

    const syllableCounts = poem.syllableCounts;
    const syllableLimits = poem.syllableLimits;
    const placeholders = poem.placeholders;

    const onTitleChanged = (e) => setTitle(e.target.value);

    const onSavePoemClicked = () => {
        if (lines) {
            dispatch(poemUpdated({ id: poemId, title, lines }));
        }
    };

    const onCreatePoemClicked = () => {
        onSavePoemClicked();
        dispatch(poemAdded());
    };

    const onResetPoemClicked = () => {
        dispatch(poemReset(poemId));
    };

    const linesRendered = lines.map((line, lineNum) => (
        <span key={`line_${lineNum}`} className='line'>
            <textarea
                key={lineNum}
                value={line}
                onChange={(e, lineNum) => this.handleLineChange(e, lineNum)}
                onClick={(e, lineNum) => this.handlePoemClick(e, lineNum)}
                placeholder={placeholders[lineNum]}
            />
            <h4 key={`counter_${lineNum}`} className='counter'>
                {' '}
                {syllableCounts[lineNum]} / {syllableLimits[lineNum]}
            </h4>
        </span>
    ));

    return (
        <React.Fragment>
            <div className='poemBuilder'>
                <div className='poem'>
                    <div className='row'>
                        <div className='title'>
                            <span>
                                <span className={'underline'}>title</span>:
                            </span>
                            <textarea
                                className='title'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <h2 title={title} onChange={onTitleChanged} />
                        <button onClick={onSavePoemClicked}>Save</button>
                        <button onClick={onCreatePoemClicked}>
                            Save & Create New
                        </button>
                        <button onClick={onResetPoemClicked}>Reset</button>
                    </div>
                    <div className='lines'>
                        {linesRendered}
                        <hr className='divider' />
                    </div>
                </div>
                <CurrentWord />
            </div>
        </React.Fragment>
    );
};
