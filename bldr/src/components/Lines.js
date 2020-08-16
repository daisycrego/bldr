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
					syllableCount={props.syllableCounts[i]}
					index={i}
					handleKeyDown={props.handleKeyDown}
					handleClick={props.handleClick}
					autoresize={props.autoresize}
					handleLineChange={props.handleLineChange}
					handleMouseover={props.handlePlaceholderMouseover}
					handleMouseOut={props.handlePlaceholderMouseout}
				/>);
			})
		: null
	);
}

export default Lines; 