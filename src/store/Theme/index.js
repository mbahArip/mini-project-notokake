import { createSlice } from '@reduxjs/toolkit';

let initialState = { darkMode: false };

export const themeSlice = createSlice({
	name: 'theme',
	initialState,
	reducers: {
		switchTheme: (state) => {
			state.darkMode = !state.darkMode;
		},
	},
});

const { actions, reducer } = themeSlice;
export const { switchTheme } = actions;
export default reducer;
