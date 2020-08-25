import React, { Fragment } from 'react'; 
import MiniPoem from './MiniPoem';

const History = (props) => {
	if (!props.history || !props.history.length) {
		return null;
	}
	const poem = [...props.history][props.currentPoemIndex];
	const valid = poem ? poem.valid : false;

	const lines = poem.linesEdit ? {...poem.linesEdit} : poem.lines;

	return (
		<div className="history">
				{props.history.length ? 
				props.history.map((poem, index) => {
					console.log(`poem: ${JSON.stringify(poem)}`);
					let isCurrentPoem = (index === props.currentPoemIndex);					
					return (
						<span key={index}>
							<Fragment>
								<button 
									disabled={isCurrentPoem}
									className="poemHistoryButton" 
									key={index} 
									onClick={(e) => props.togglePoemHistory(index)}>
									<h4><strong>{poem.title}</strong></h4>
									<br/>									
									<MiniPoem
										lines={poem.linesEdit ? poem.linesEdit : poem.lines} 
										className="miniPoem" 
										index={index}/>
									{isCurrentPoem ? <span>*<sub>active poem</sub></span> : null}
								</button>
							</Fragment>
						</span>
					);
				}) 
				: <div>No poems</div>}
		</div>		
	);
		
	};

	export default History; 