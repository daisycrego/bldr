import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    users: [
        { id: 'a', name: 'JT' },
        { id: 'b', name: 'DC' },
        { id: 'c', name: 'SUPREME 1' },
    ],
    activeUserId: 'a',
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
});

export default usersSlice.reducer;
