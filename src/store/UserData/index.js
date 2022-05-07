import { createSlice } from '@reduxjs/toolkit';

let initialState = {};

export const userDataSlice = createSlice({
	name: 'userData',
	initialState,
	reducers: {
		loginHandler: (state, { payload }) => payload,
		logoutHandler: () => initialState,
	},
});

const { actions, reducer } = userDataSlice;
export const { loginHandler, logoutHandler, addCategoryPin } = actions;
export default reducer;
