import { createSlice } from '@reduxjs/toolkit';

let initialState = {};

export const userDataSlice = createSlice({
	name: 'userData',
	initialState,
	reducers: {
		loginHandler: (state, { payload }) => payload,
		logoutHandler: () => initialState,
		updateUserDataHandler: (state, { payload }) => {
			return { ...state, ...payload };
		},
	},
});

const { actions, reducer } = userDataSlice;
export const { loginHandler, logoutHandler, updateUserDataHandler } = actions;
export default reducer;
