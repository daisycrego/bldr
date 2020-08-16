import React from 'react';
import Button from './Button';
import CancelContinueButtons from './CancelContinueButtons';

const CurrentWord = (props) => {	
	const { currentWord } = props;	
	const currentWordExists = (currentWord && 'text' in currentWord && 'syllables' in currentWord); 
	const activeEditExists = (currentWord && 'activeEdit' in currentWord && currentWord.activeEdit); 
	if (!currentWordExists && !activeEditExists) { return null; }
	const syllableCount = props.currentWord.syllables; 
	
	return (
		<>
			<div className="currentWord">
				<h1 className="currentWordDisplay">
				{`${currentWordExists ? currentWord.text : ''}`}
				</h1>
				<span 
					onMouseEnter={(e) => props.viewOriginalWord(true)}
					onMouseLeave={(e) => props.viewOriginalWord(false)}>
				{props.currentWord.edited ? 
					
						<button 
							className="asterisk" 			
						>
							*
						</button>
						: null
				}
				{props.displayOriginalWord ? 
					<span className="originalWord">
						<span> This word was edited (by you). Here is the original:</span>
						<br/>
						<span>{currentWord.original ? currentWord.original.syllables : null} syllables</span>
						<br/>
						<span>{currentWord.original ? currentWord.original.definition : null}</span>
						<Button value="Reset word to original" handleClick={props.handleCurrentWordReset}></Button>
					</span>
					: null
				}
				</span>
			
			<span className="currentWordSyllables">
				<textarea 
					className="currentWordSyllableCount" 
					onChange={(e) => props.handleSyllableChange(e)}
					value={syllableCount}
				/>
				
				<textarea 
					className="currentWordSyllableText" 
					disabled 
					value={` syllable${(syllableCount > 1 || syllableCount === 0) ? "s" : ""}`}
				/>
			</span>
			
			{props.displaySyllableUpdate ? 
			<CancelContinueButtons 
				continueText="Update" 
				cancelText="Cancel" 
				handleContinue={props.continueSyllableUpdate} 
				handleCancel={props.cancelSyllableUpdate}
			/>
			: null}
				
			{currentWordExists && 'definition' in currentWord ? 
			<textarea 
				className="currentDefinition autoresize" 
				value={currentWord.definition}
				onChange={(e) => props.handleDefinitionChange(e)}
				onInput={(e) => props.autoresize(e)}
			/> 
			: null}
				
			{props.displayDefinitionUpdate ? 
			<CancelContinueButtons
				continueText="Update"
				cancelText="Cancel"
				handleContinue={props.continueDefinitionUpdate}
				handleCancel={props.cancelDefinitionUpdate}
			/>
			: null}
			
			{props.displayWordResetButton ? 
			<Button 
				handleClick={props.handleResetClick} 
				buttonStyle="recycle"
				value={`Reset syllable count & definition`}
			/>
			: null}


			</div>
			
		</>
	);
};

export default CurrentWord; 