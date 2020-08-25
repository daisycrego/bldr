import React from 'react'; 
import Line from './Line';

const Lines = (props) => { 
	const lines = props.lines; 
	const placeholders = {...props.exampleHaiku}; 
			
	return (
		lines && lines.length ? 
			lines.map((line, i) => {
				return (<Line 
					className="line"
					lineValid={props.syllableCounts[i] === props.syllableLimits[i] ? true : false}
					key={i} 
					line={line} 
					placeholderLine={placeholders[i]}
					currentLine={props.currentLine}
					syllableLimit={props.syllableLimits[i]} 
					syllableCount={props.syllableCounts[i] ? props.syllableCounts[i]: 0}
					index={i}
					handleKeyDown={props.handleKeyDown}
					handleClick={props.handleClick}
					handleLineChange={props.handleLineChange}
				/>);
			})
		: null
	);
}

export default Lines; 