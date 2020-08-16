import React from 'react'; 
import Button from './Button';
import MiniPoem from './MiniPoem';

const History = (props) => {
	if (!props.history || !props.history.length) {
		return null;
	}
	const buttonText = `${props.history.length ? 'Save & ' : '' } Start New Poem`;
	const poem = [...props.history][props.currentPoemIndex];
	const valid = poem ? poem.valid : false;

	const lines = poem.activeEdit ? {...poem.activeEdit} : poem.lines;

	return (
		<div className="history">
				{props.history.length ? 
				props.history.map((poem, index) => {
					let isCurrentPoem = (index === props.currentPoemIndex);					
					return (
						<span key={index}>
							<>
								<button 
									disabled={isCurrentPoem}
									className="poemHistoryButton" 
									key={index} 
									onClick={(e) => props.togglePoemHistory(index)}>
								
									{isCurrentPoem ? 
										<h4><strong>{poem.title}</strong></h4> 
									: <h4>{poem.title}</h4>}
									<br/>									
									<MiniPoem 
										title={poem.title}
										lines={lines} 
										className="miniPoem" 
										index={index}/>
									{isCurrentPoem ? <span>*<sub>active poem</sub></span> : null}
								</button>
							</>
						</span>
					);
				}) : <div>No poems</div>}
		</div>		
	);
		
	};

	export default History; 