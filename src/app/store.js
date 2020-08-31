import { configureStore } from '@reduxjs/toolkit'
import poemReducer from '../features/poems/poemSlice'
import wordReducer from '../features/words/wordSlice'

export default configureStore({
	reducer: {
		poems: poemReducer, 
		words: wordReducer
	}
})