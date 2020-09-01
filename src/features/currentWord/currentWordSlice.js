import { createSlice, nanoid } from '@reduxjs/toolkit'

const word = {"text": "hobbit", "definition": "from the Shire", "syllables": 2}
const initialState = word; 

const currentWordSlice = createSlice({
	name: 'currentWord', 
	initialState, 
	reducers: {
		currentWordUpdated(state, action) {
			const word = action.payload
			state = {
				text: word, 
				syllables: 0,
				definition: "tbd"
			}
			console.log(JSON.stringify(state))
		}
	}
})

export const { currentWordUpdated } = currentWordSlice.actions

export default currentWordSlice.reducer



