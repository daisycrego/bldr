import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit';
import { client } from '../../client';

const initialMap = {};
const initialState = {
    word: {
        word: '',
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

const wordSlice = createSlice({
    name: 'words',
    initialState,
    reducers: {
        currentWordUpdated(state, action) {
            state.word.word = action.payload;
            state.word.syllables = 0;
            state.word.definition = '';
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
                        word: word['word'],
                        definition: word.definition,
                        syllables: word.syllables,
                        updated: false,
                        original: {
                            word: word['word'],
                            definition: word.definition,
                            syllables: word.syllables,
                        },
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
            state.word.word = state.word.word;
            state.word.syllables = action.payload.syllables;
            state.word.definition = action.payload.definition;
        },
        [fetchWord.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        },
    },
});

export const { currentWordUpdated, wordAdded, wordUpdated } = wordSlice.actions;

export default wordSlice.reducer;
