import { configureStore } from '@reduxjs/toolkit';
import poemReducer from '../features/poems/poemSlice';
import wordReducer from '../features/words/wordSlice';
import userReducer from '../features/users/userSlice';

export default configureStore({
    reducer: {
        poems: poemReducer,
        users: userReducer,
        words: wordReducer,
    },
});
