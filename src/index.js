import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Redux
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistedStore } from './store';

// Library
import { ApolloProvider } from '@apollo/client';
import client from './utils/apolloClient';

// Style
import './global.css';

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
	<React.StrictMode>
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistedStore}>
				<ApolloProvider client={client}>
					<App />
				</ApolloProvider>
			</PersistGate>
		</Provider>
	</React.StrictMode>,
);
