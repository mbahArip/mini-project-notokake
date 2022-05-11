import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Reducer
import themeReducer from './Theme';
import userDataReducer from './UserData';
import draftReducer from './EditorDraft';

const reducer = combineReducers({ theme: themeReducer, userData: userDataReducer, draft: draftReducer });

const persistConfig = {
	key: 'notokake',
	version: 1,
	storage,
};
const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
});
const persistedStore = persistStore(store);

export { store, persistedStore };
