import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit';
import { client } from '../../client';

const initialMap = {};
const initialState = {
    currentWord: {
        word: 'poem',
        definition: null,
        syllables: null,
    },
    words: initialMap,
    status: 'idle',
    error: null,
};

export const fetchWord = createAsyncThunk(
    'currentWord/fetchWord',
    async (word) => {
        const response = await client.get(`wordAPI/${word}`);
        return response;
    }
);

export const fetchWordMap = createAsyncThunk(
    'currentWord/fetchWordMap',
    async (userId) => {
        const response = await client.get(`map/${userId}`);
        console.log(`fetchMap returned this: ${JSON.stringify(response)}`);
        return response;
    }
);

const wordSlice = createSlice({
    name: 'words',
    initialState,
    reducers: {
        currentWordUpdated(state, action) {
            state.currentWord.word = action.payload;
            state.currentWord.syllables = 0;
            state.currentWord.definition = '';
            state.status = 'idle';
            fetchWord(action.payload);
        },
        wordAdded: {
            reducer(state, action) {
                state.words[action.payload.word] = action.payload;
            },
            prepare(word) {
                return {
                    payload: {
                        word,
                        original: word,
                        updated: false,
                    },
                };
            },
        },
        wordUpdated(state, action) {
            const { word, definition, syllables } = action.payload;
            const existingWord = state.words[word];
            if (existingWord) {
                existingWord.definition = definition;
                existingWord.syllables = syllables;
                existingWord.updated = true;
            }
            state.words[word] = existingWord;
        },
    },
    extraReducers: {
        [fetchWord.pending]: (state, action) => {
            state.status = 'loading';
        },
        [fetchWord.fulfilled]: (state, action) => {
            state.status = 'succeeded';
            state.currentWord.word = state.currentWord.word;
            state.currentWord.syllables = action.payload.syllables;
            state.currentWord.definition = action.payload.definition;
            state.words[state.currentWord.word] = state.currentWord;
        },
        [fetchWord.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        },
    },
});

export const { currentWordUpdated, wordAdded, wordUpdated } = wordSlice.actions;

export default wordSlice.reducer;
