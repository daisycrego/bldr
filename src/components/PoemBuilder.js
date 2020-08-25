import React from 'react'; 
import Lines from './Lines';
import CurrentWord from './CurrentWord';
import Button from './Button';
import Title from './Title';

const PoemBuilder = (props) => {
	const poem = props.poem; 
	if (!poem) { return null; }
	const lines = poem.linesEdit ? poem.linesEdit : poem.lines;
	if (!lines) { console.log(`lines: ${lines}`); return; }
	const valid = poem.valid;
	const poemIsEmpty = lines.reduce((entirePoemIsEmpty, currentLine) => {
		return !currentLine && entirePoemIsEmpty;  
	}, true);
	
	return (
		<>
			<div className="poem">
				
				{poem ? 
					<>

					<div className="row">
					<Title
					title={poem ? poem.title : ""}
					handleTitleChange={props.handleTitleChange}
					/>
					
					{ !poemIsEmpty ?   					
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
							lines={lines} 
							syllableLimits={props.criteria.syllableLimits}
							syllableCounts={props.syllableCounts}
							exampleHaiku={props.criteria.exampleHaiku}
							currentLine={props.currentLine}
							handleLineChange={props.handleLineChange}
							handleKeyDown={props.handleKeyDown}
							handleClick={props.handleClick}
						/>
						<hr className="divider"/>
					</div>


					</>
				: null }

				


			</div>
			
			{poem && !props.poemIsEmpty ? 
				<>
					{valid ? 
						<div>
							<h1>This haiku is valid!</h1>
						</div>			
					: null}
					
					<CurrentWord 
						currentWord={props.currentWord}
						displaySyllableUpdate={props.displaySyllableUpdate}
						handleSyllableChange={props.handleSyllableChange}
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