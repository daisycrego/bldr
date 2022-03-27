import React from 'react';

const MiniPoem = (props) => {
    const mapping = props.lines
        ? props.lines.length
            ? props.lines.map((line, index) => {
                  return (
                      <span key={index}>
                          <span>{line}</span>
                          <br />
                      </span>
                  );
              })
            : null
        : null;

    return props.lines && props.lines.length > 0 ? (
        <span onClick={props.handleClick}>{mapping}</span>
    ) : null;
};

export default MiniPoem;
