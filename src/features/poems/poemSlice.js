import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit'
import { client } from '../../client'
import { useSelector } from 'react-redux'

const initialState = {
	poems: [],
	status: 'idle', 
	error: null
}

export const fetchPoems = createAsyncThunk('posts/fetchPoems', async () => {
	//let activeUser = useSelector(state => state.users.activeUser)

	let activeUser
	if (!activeUser) {
		console.log(`no active user found, defaulting to a`)
		activeUser = "a"
	}

	const response = await client.get(`wordAPI/poem/${activeUser}`)
	console.log(response)
	return response
})

const poemSlice = createSlice({
	name: 'poems', 
	initialState, 
	reducers: {
		poemAdded: {
			reducer(state, action) {
				state.poems.push(action.payload)
			},
			prepare(userId=null, lines=null, title=null) {
				const syllableLimits = [5,7,5]
				const syllableCounts = [0,0,0]
				const placeholders = ["haikus are easy", "but sometimes they don't make sense", "refrigerator"]
				const valid = false
				const id = nanoid()
				if (!userId) { userId = "" }
				if (!lines) { lines = ["", "", ""]}
				if (!title) { title = `Poem ${id}`}
				return {
					payload: {
						id: id,
						date: new Date().toISOString(),
						user: userId, 
						title,
						lines, 
						valid,
						syllableLimits, 
						syllableCounts, 
						placeholders,
						reactions: {thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0}
					}
				}
			}
		},
		poemUpdated(state, action) {
			const { id, title, lines } = action.payload
			const existingPoem = state.poems.find(poem => poem.id === id)
			if (existingPoem) {
				existingPoem.title = title
				existingPoem.lines = lines
			}
		},
		poemReset(state, action) {
			const id = action.payload
			console.log(`poemReset, id: ${JSON.stringify(id)}`) 
			const existingPoem = state.poems.find(poem => poem.id === id) 
			if (existingPoem) {
				existingPoem.syllableCounts = [0,0,0]
				existingPoem.lines = ["","",""]
				existingPoem.valid = false
			}
		},
		reactionAdded(state, action) {
			const { poemId, reaction } = action.payload
			const existingPoem = state.poems.poems.find(poem => poem.id === poemId)
			if (existingPoem) {
				existingPoem.reactions[reaction]++
			}
		}
	},
	extraReducers: {
		[fetchPoems.pending]: (state, action) => {
			state.status='loading'
		},
		[fetchPoems.fulfilled]: (state, action) => {
			state.status = 'succeeded'
			state.poems = state.poems.concat(action.payload)
		},
		[fetchPoems.rejected]: (state, action) => {
			state.status = 'failed'
			state.error = action.error.message
		}
	}
})

export const { poemAdded, poemUpdated, poemReset, reactionAdded } = poemSlice.actions

export default poemSlice.reducer

export const selectAllPoems = state => state.poems.poems

export const selectPoemById = (state, poemId) => {
	return state.poems.poems.find(poem => poem.id === poemId)
}