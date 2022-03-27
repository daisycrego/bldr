import React from 'react';

const Button = (props) => {
    return (
        <button onClick={props.handleClick} className={props.buttonStyle}>
            {props.value}
        </button>
    );
};

export default Button;
