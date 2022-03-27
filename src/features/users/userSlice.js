import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    users: [
        { id: 'a', name: '🌎' },
        { id: 'b', name: 'JT' },
        { id: 'c', name: 'DC' },
    ],
    activeUserId: 'a',
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
});

export default usersSlice.reducer;
