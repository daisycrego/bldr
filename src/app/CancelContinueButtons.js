import React from 'react'; 
import Button from './Button';

const CancelContinueButtons = (props) => {
	return (
		<>
			<Button handleClick={props.handleContinue} buttonStyle="continue" value={props.continueText || "Continue"}/>
			<Button handleClick={props.handleCancel} buttonStyle="cancel" value={props.cancelText || "Cancel"}/>
		</>
	);
}

export default CancelContinueButtons; 