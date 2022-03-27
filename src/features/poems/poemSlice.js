import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit';
import { client } from '../../client';

const initialState = {
    activePoem: null,
    poems: [],
    listStatus: 'idle',
    listError: null,
    activePoemStatus: 'idle',
    activePoemError: null,
};

export const addPoem = createAsyncThunk(
    'poems/addPoem',
    async (initialPoem) => {
        const response = await client.post(`/wordAPI/poem/`, initialPoem);
        return response;
    }
);

export const fetchPoems = createAsyncThunk('poems/fetchPoems', async () => {
    let activeUser;
    if (!activeUser) {
        activeUser = 'a';
    }

    const response = await client.get(`wordAPI/poem/${activeUser}`);
    return response;
});

export const fetchActivePoem = createAsyncThunk(
    'poems/fetchActivePoem',
    async () => {
        let activeUser;
        if (!activeUser) {
            activeUser = 'a';
        }

        const response = await client.get(`wordAPI/poem/${activeUser}`);
        if (response.length) {
            return response[0];
        } else {
            return {
                activePoem: null,
                userId: activeUser,
            };
        }
    }
);

export const fetchPoemById = createAsyncThunk(
    'poems/fetchPoemById',
    async (poemId) => {
        let activeUser;
        if (!activeUser) {
            activeUser = 'a';
        }

        const poems = await client.get(`wordAPI/poem/${activeUser}`);
        if (poems.length) {
            return poems.find((poem) => poem.id === poemId);
        } else {
            return null;
        }
    }
);

const poemSlice = createSlice({
    name: 'poems',
    initialState,
    reducers: {
        poemAdded: {
            reducer(state, action) {
                state.poems.push(action.payload);
            },
            prepare(userId = null, lines = null, title = null) {
                const syllableLimits = [5, 7, 5];
                const syllableCounts = [0, 0, 0];
                const placeholders = [
                    'haikus are easy',
                    "but sometimes they don't make sense",
                    'refrigerator',
                ];
                const reactions = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
                const valid = false;
                const id = nanoid();
                if (!userId) {
                    userId = '';
                }
                if (!lines) {
                    lines = ['', '', ''];
                }
                if (!title) {
                    title = `Poem ${id}`;
                }
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
                        reactions,
                    },
                };
            },
        },
        poemUpdated(state, action) {
            const { id, title, lines } = action.payload;
            const existingPoem = state.poems.find((poem) => poem.id === id);
            if (existingPoem) {
                existingPoem.title = title;
                existingPoem.lines = lines;
            }
            addPoem(existingPoem);
        },
        poemReset(state, action) {
            const id = action.payload;
            const existingPoem = state.poems.find((poem) => poem.id === id);
            if (existingPoem) {
                existingPoem.syllableCounts = [0, 0, 0];
                existingPoem.lines = ['', '', ''];
                existingPoem.valid = false;
            }
        },
        reactionAdded(state, action) {
            const { poemId, reaction } = action.payload;
            const existingPoem = state.poems.find((poem) => poem.id === poemId);
            if (existingPoem) {
                existingPoem.reactions[reaction]++;
            }
        },
    },
    extraReducers: {
        [fetchPoems.pending]: (state, action) => {
            state.listStatus = 'loading';
        },
        [fetchPoems.fulfilled]: (state, action) => {
            state.listStatus = 'succeeded';
            state.poems = state.poems.concat(action.payload);
        },
        [fetchPoems.rejected]: (state, action) => {
            state.listStatus = 'failed';
            state.listError = action.error.message;
        },
        [addPoem.fulfilled]: (state, action) => {
            var removeIndex = state.poems
                .map((item) => item.id)
                .indexOf(action.payload.id);
            ~removeIndex && state.poems.splice(removeIndex, 1);
            state.poems.push(action.payload);
            state.activePoem = action.payload;
        },
        [fetchActivePoem.fulfilled]: (state, action) => {
            if (!action.payload) {
                addPoem(action.payload);
            } else {
                state.activePoem = action.payload;
                state.activePoemStatus = 'succeeded';
            }
        },
        [fetchPoemById.fulfilled]: (state, action) => {
            state.activePoem = action.payload;
            state.activePoemStatus = 'succeeded';
        },
    },
});

export const { poemAdded, poemUpdated, poemReset, reactionAdded } =
    poemSlice.actions;

export default poemSlice.reducer;

export const selectAllPoems = (state) => state.poems.poems;

export const selectPoemById = (state, poemId) => {
    return state.poems.poems.find((poem) => poem.id === poemId);
};

export const selectActivePoem = (state) => {
    return state.poems.activePoem;
};
