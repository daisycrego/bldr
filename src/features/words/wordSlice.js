import { createSlice, nanoid } from '@reduxjs/toolkit'

const initialMap = {}
const word = {"text": "hobbit", "definition": "from the Shire", "syllables": 2}
initialMap.hobbit = word
const initialState = initialMap; 

const wordsSlice = createSlice({
	name: 'words', 
	initialState, 
	reducers: {
		wordAdded: {
			reducer(state, action) {
				state[action.payload.word] = action.payload 
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
			const existingWord = state[word]
			if (existingWord) {
				existingWord.definition = definition
				existingWord.syllables = syllables
			}
			state[word] = existingWord
		}
	}
})

export const { wordAdded, wordUpdated } = wordsSlice.actions

export default wordsSlice.reducer



