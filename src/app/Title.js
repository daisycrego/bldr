import React from 'react';

const Title = (props) => {
    return (
        <div className='title'>
            <span>
                <span className={'underline'}>title</span>:
            </span>
            <textarea
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
