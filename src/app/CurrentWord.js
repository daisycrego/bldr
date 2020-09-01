import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import TextareaAutosize from 'react-textarea-autosize'

export const CurrentWord = () => {	
	const 	displaySyllableUpdate = false, 
			displayDefinitionUpdate = false, 
			displayWordResetButton = false; 
	
	const dispatch = useDispatch()

	const existingWord = useSelector(state => state.currentWord)

	console.log(`existingWord: ${JSON.stringify(existingWord)}`)

	const [currentWord, setCurrentWord] = useState(existingWord)

	console.log(`currentWord: ${currentWord}`)

	const syllableCount = currentWord ? currentWord.syllables : 0;

	return (
		<React.Fragment>
			<div className="currentWord">
				<h1 className="currentWordDisplay">
				{currentWord ? currentWord.text : ''}
				</h1>
				
			<span className="currentWordSyllables">
				<TextareaAutosize 
					className="currentWordSyllableCount" 
					value={syllableCount}
				/>
				
				<textarea 
					className="currentWordSyllableText" 
					disabled 
					value={` syllable${(syllableCount > 1 || syllableCount === 0) ? "s" : ""}`}
				/>
			</span>
			
			{displaySyllableUpdate ? 
				<React.Fragment>
					<button value="Update syllable count"/>
					<button value="Cancel"/>
				</React.Fragment>
			: null}
					 
			<TextareaAutosize 
				className="currentDefinition" 
				value={currentWord ? currentWord.definition : ''}
			/> 
				
			{displayDefinitionUpdate ? 
				<React.Fragment>
					<button value="Update definition"/>
					<button value="Cancel"/>
				</React.Fragment>
			: null}
			
			{displayWordResetButton ? 
			<button 
				value={`Reset syllable count & definition`}
			/>
			: null}


			</div>
			
		</React.Fragment>
	);
};