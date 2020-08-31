import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { poemAdded, poemUpdated, poemReset } from '../features/poems/poemSlice'
import { wordAdded, wordUpdated, currentWordUpdated } from '../features/words/wordSlice'
import { CurrentWord } from './CurrentWord'

export const PoemBuilder = ({ match }) => {
	console.log(`PoemBuilder sanity check`)
	const { poemId } = match.params

	const poem = useSelector(state => 
		state.poems.find(poem => poem.id === poemId)
	)

	console.log(JSON.stringify(poem))

	const [title, setTitle] = useState(poem.title)
	const [lines, setLines] = useState(poem.lines)

	const dispatch = useDispatch()
	const history = useHistory()

	if (!poem) {
		return (
			<section>
				<h2> Poem not found! </h2>
			</section>
		)
	}

	const syllableCounts = poem.syllableCounts; 
	const syllableLimits = poem.syllableLimits; 
	const placeholders = poem.placeholders; 

	const onTitleChanged = e => setTitle(e.target.value)

	const onSavePoemClicked = () => {
		if (lines) {
			dispatch(poemUpdated({id: poemId, title, lines}))
		}
	}

	const onCreatePoemClicked = () => {
		onSavePoemClicked()
		dispatch(poemAdded())
	}

	const onResetPoemClicked = () => {
		dispatch(poemReset(poemId))
	}

	const linesRendered = lines.map((line, lineNum) => 
		<span key={`line_${lineNum}`} className="line">
		<textarea 
			key={lineNum} 
			value={line} 
			onChange={(e, lineNum) => this.handleLineChange(e, lineNum)}
			onClick={(e, lineNum) => this.handlePoemClick(e, lineNum)}
			placeholder={placeholders[lineNum]}
		/>
		<h4 key={`counter_${lineNum}`} className="counter"> {syllableCounts[lineNum]} / {syllableLimits[lineNum]}</h4>
		</span>
	)

	return (
		<React.Fragment>
		<div className="poemBuilder">
		<div className="poem"> 
			<div className="row">
			<div className="title">
				<span>
					<span className={'underline'}>title</span>
					:
				</span>
				<textarea 
					className="title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}	
				/>
			</div>

			<h2 title={title} onChange={onTitleChanged}/>
			<button onClick={onSavePoemClicked}>Save</button>
			<button onClick={onCreatePoemClicked}>Save & Create New</button>
			<button onClick={onResetPoemClicked}>Reset</button>
			</div>
			<div className="lines">
				{linesRendered}
				<hr className="divider"/>
			</div>
		</div> 
		<CurrentWord/>
		</div>
		</React.Fragment>
	)
}
	/*
	if (!poem) { return null; }
	const syllableCounts = poem.syllableCounts; 
	const syllableLimits = poem.syllableLimits; 
	if (!syllableCounts || !syllableLimits) {
		console.log(`syllableCounts: ${syllableCounts}, syllableLimits: ${syllableLimits}`);
		return null; 
	}

	const lines = poem.lines; 

	if (!lines) { return null; }

	const poemIsEmpty = lines.reduce((poemIsEmpty, currentLine) => !currentLine && poemIsEmpty, true); 

	const title = poem.title; 

	
	return (
		<React.Fragment>
			<div className="poem">

				<div className="row">
					<Title
					title={title}
					/>
					
					{ !poemIsEmpty ?   					
							<React.Fragment>
								<button
									value="Save"
									/>
								
								</React.Fragment>
					: null }

				</div>
				<div className="lines">
					<Lines
						lines={lines} 
						syllableLimits={syllableLimits}
						syllableCounts={syllableCounts}
						placeholders={placeholders}
						currentLine={currentLine}
					/>
					<hr className="divider"/>
				</div>
			</div>

			<CurrentWord currentWord={currentWord}/>
		</React.Fragment>
	)
	






import React from 'react'; 
import Lines from './Lines';
import { CurrentWord } from './CurrentWord';
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
*/