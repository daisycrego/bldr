import { configureStore } from '@reduxjs/toolkit'
import poemReducer from '../features/poems/poemSlice'
import wordReducer from '../features/words/wordSlice'
import currentWordReducer from '../features/currentWord/currentWordSlice'
import userReducer from '../features/users/userSlice'

export default configureStore({
	reducer: {
		poems: poemReducer, 
		words: wordReducer,
		currentWord: currentWordReducer,
		users: userReducer
		
	}
})