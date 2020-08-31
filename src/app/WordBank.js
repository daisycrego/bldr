import React from 'react'; 

const WordBank = (props) => {
	let words = props.words; 
	if (!words) { words = []; }
	console.log(`WordBank words: ${JSON.stringify(props.words)}`);
	const items = words.map((word, i) => {
		console.log(`word: ${JSON.stringify(word)}`);
		if (!word) { return; }
		return ( 
			<li>
				<span>
					<h2>{word.text}</h2>
					<hr/>
					{word.syllables ? 
						<p>{word.syllables} syllable{word.syllables > 1 ? "s" : null}</p>
					: <p> No syllable count </p>}
					<p>{word.definition}</p>
				</span>
			</li>
		);
	});

	console.log(`items: ${items}`); 

	return (
		<ul>
			{items}
		</ul>
	);
};

export default WordBank; 