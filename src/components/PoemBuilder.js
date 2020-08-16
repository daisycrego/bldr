import React from 'react'; 
import Lines from './Lines';
import CurrentWord from './CurrentWord';
import Button from './Button';
import Title from './Title';

const PoemBuilder = (props) => {
	const poem = props.poem; 
	if (!poem) { return null; }
	const lines = poem.activeEdit ? poem.activeEdit : poem.lines;
	console.log(`PoemBuilder: lines: ${lines}`);
	const valid = poem.valid;
	
	return (
		<>
			<div className="poem">
				
				{poem ? 
					<>

					<div className="row">
					<Title
					title={poem ? poem.title : ""}
					handleTitleChange={props.handleTitleChange}
					edited={props.titleEdited}
					/>
					
					{ !props.poemIsEmpty ?   					
							<>
							<Button
								handleClick={props.handleSavePoem}
								value={"Save & create new poem"}/>
							<Button
								handleClick={props.handleResetPoem}
								value={"Reset"}/>
							</>
					: null }
					</div>

					<div className="lines">
						<Lines 
							handleKeyDown={props.handleKeyDown}
							handleClick={props.handleClick}
							lines={lines} 
							syllableLimits={props.criteria.syllableLimits}
							syllableCounts={props.syllableCounts}
							exampleHaiku={props.criteria.exampleHaiku}
							autoresize={props.autoresize}
							currentLine={props.currentLine}
							handleLineChange={props.handleLineChange}
							handlePlaceholderMouseover={props.handlePlaceholderMouseover}
							handlePlaceholderMouseout={props.handlePlaceholderMouseout}
						/>
						<hr className="divider"/>
					</div>


					</>
				: null }

				


			</div>
			
			{poem && !props.poemIsEmpty ? 
				<>
					{props.valid ? 
						<div>
							<h1>This haiku is valid!</h1>
						</div>			
					: null}
	
					<CurrentWord currentWord={props.currentWord}
							handleSyllableChange={props.handleSyllableChange}
							displaySyllableUpdate={props.displaySyllableUpdate}
							continueSyllableUpdate={props.continueSyllableUpdate}
							cancelSyllableUpdate={props.cancelSyllableUpdate}
							autoresize={props.autoresize}
							handleResetClick={props.handleResetClick}
							handleCurrentWordChange={props.handleCurrentWordChange}
							handleDefinitionChange={props.handleDefinitionChange}
							continueDefinitionUpdate={props.continueDefinitionUpdate}
							cancelDefinitionUpdate={props.cancelDefinitionUpdate}
							displayDefinitionUpdate={props.displayDefinitionUpdate}
							viewOriginalWord={props.viewOriginalWord}
							displayOriginalWord={props.displayOriginalWord}
							handleCurrentWordReset={props.handleCurrentWordReset}
						/> 
				</>
					
			: null}				
			
			
		</>
	)
};

export default PoemBuilder; 