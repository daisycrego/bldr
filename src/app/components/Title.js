import React from 'react';
import TextField from '@mui/material/TextField';

const Title = (props) => {
    return (
        <div className='title'>
            <span>
                <span className={'underline'}>title</span>:
            </span>
            <TextField
                className={'title'}
                value={props.title}
                onChange={(e) =>
                    props.handleTitleChange(
                        e.target.value,
                        props.currentPoemIndex
                    )
                }
            />
        </div>
    );
};

export default Title;
