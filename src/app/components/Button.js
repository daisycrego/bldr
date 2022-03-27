import React from 'react';
import Button from '@mui/material/Button';

const Button = (props) => {
    return (
        <Button onClick={props.handleClick} className={props.buttonStyle}>
            {props.value}
        </Button>
    );
};

export default Button;
