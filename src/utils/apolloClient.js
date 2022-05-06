import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
	uri: 'https://notokake.hasura.app/v1/graphql',
	cache: new InMemoryCache(),
	headers: {
		'x-hasura-admin-secret': process.env.REACT_APP_HASURA_SECRET,
	},
});

export default client;
