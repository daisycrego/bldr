import React, { Fragment } from 'react';
import MiniPoem from './MiniPoem';
import Button from '@mui/material/Button';

const History = (props) => {
    if (!props.history || !props.history.length) {
        return null;
    }
    const poem = [...props.history].filter(
        (poem) => poem.id === props.currentPoem
    );

    const valid = poem ? poem.valid : false;

    const lines = poem.linesEdit ? { ...poem.linesEdit } : poem.lines;

    return (
        <div className='history'>
            {props.history.length ? (
                props.history
                    .filter((poem) => !poem.archived)
                    .map((poem, index) => {
                        let isCurrentPoem = poem.id === props.currentPoem;
                        return (
                            <span key={index}>
                                <Fragment>
                                    <Button
                                        disabled={isCurrentPoem}
                                        className='poemHistoryButton'
                                        key={index}
                                        onClick={(e) =>
                                            props.togglePoemHistory(poem.id)
                                        }
                                    >
                                        <h4>
                                            <strong>{poem.title}</strong>
                                        </h4>
                                        <br />
                                        <MiniPoem
                                            lines={
                                                poem.linesEdit
                                                    ? poem.linesEdit
                                                    : poem.lines
                                            }
                                            className='miniPoem'
                                            index={index}
                                        />
                                        {isCurrentPoem ? (
                                            <span>
                                                *<sub>active poem</sub>
                                            </span>
                                        ) : null}
                                    </Button>
                                </Fragment>
                            </span>
                        );
                    })
            ) : (
                <div>No poems</div>
            )}
        </div>
    );
};

export default History;
