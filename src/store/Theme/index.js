import { createSlice } from '@reduxjs/toolkit';

let initialState = { darkMode: false };

export const themeSlice = createSlice({
	name: 'theme',
	initialState,
	reducers: {
		switchTheme: (state) => {
			state.darkMode = !state.darkMode;
		},
		setTheme: (state, { payload }) => {
			if (payload === 'light') {
				state.darkMode = false;
			} else if (payload === 'dark') {
				state.darkMode = true;
			}
		},
	},
});

const { actions, reducer } = themeSlice;
export const { switchTheme, setTheme } = actions;
export default reducer;
