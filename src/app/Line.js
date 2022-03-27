import React, { useRef, useEffect } from 'react';

const Line = (props) => {
    const lineRef = useRef(null);
    useEffect(() => {
        if (props.index === props.currentLine) {
            lineRef.current.focus();
        }
    }, [props.index, props.currentLine]);

    return (
        <span className={`line ${props.lineValid ? 'valid' : 'invalid'}`}>
            <textarea
                ref={lineRef}
                key={props.index}
                contentEditable='true'
                suppressContentEditableWarning={true} //https://stackoverflow.com/questions/49639144/why-does-react-warn-against-an-contenteditable-component-having-children-managed
                onChange={(e) => props.handleLineChange(e, props.index)}
                onKeyDown={(e) => props.handleKeyDown(e, props.index)}
                onClick={(e) => props.handleClick(e, props.index)}
                placeholder={props.placeholderLine}
                value={props.line ? props.line : ''}
            />
            <h4 className='counter'>
                {' '}
                {props.syllableCount} / {props.syllableLimit}
            </h4>
        </span>
    );
};

export default Line;
