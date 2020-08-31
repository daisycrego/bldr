import { createSlice, nanoid } from '@reduxjs/toolkit'

const initialMap = new Map()
initialMap.set('hobbit', word)
const initialState = { wordMap: initialMap, currentWord: null }; 
const word = {"word": "hobbit", "definition": "from the Shire", "syllables": 2}

const wordsSlice = createSlice({
	name: 'words', 
	initialState, 
	reducers: {
		wordAdded: {
			reducer(state, action) {
				state.wordMap.set(action.payload.word, action.payload)
			},
			prepare(word, definition, syllables) {
				return {
					payload: {
						word,
						definition, 
						syllables,
						original: { 
							word,
							definition,
							syllables
						}
					}
				}
			}
		},
		wordUpdated(state, action) {
			const { word, definition, syllables } = action.payload
			const existingWord = state.wordMap.get(word)
			if (existingWord) {
				existingWord.definition = definition
				existingWord.syllables = syllables
			}
			state.wordMap.set(word, existingWord)
		},
		currentWordUpdated(state, action) {
			const word = action.payload
			console.log(`updating currentWord to ${JSON.stringify(word)}`);
			state.currentWord = word
		}
	}
})

export const { wordAdded, wordUpdated, currentWordUpdated } = wordsSlice.actions

export default wordsSlice.reducer



