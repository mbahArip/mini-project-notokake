import { createSlice } from '@reduxjs/toolkit';

let initialState = { title: '', content: '', tags: '' };

export const draftSlice = createSlice({
	name: 'draft',
	initialState,
	reducers: {
		setDraft: (state, { payload }) => {
			return { ...payload };
		},
		clearDraft: () => initialState,
	},
});

const { actions, reducer } = draftSlice;
export const { setDraft, clearDraft } = actions;
export default reducer;
