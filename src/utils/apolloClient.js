import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';

const DOMAIN = process.env.REACT_APP_HASURA_DOMAIN;

const httpLink = () =>
	new HttpLink({
		uri: `https://${DOMAIN}`,
		headers: {
			'x-hasura-admin-secret': process.env.REACT_APP_HASURA_SECRET,
		},
	});

const wsLink = () =>
	new GraphQLWsLink(
		createClient({
			url: `wss://${DOMAIN}`,
		}),
	);

const splitLink = () =>
	split(
		({ query }) => {
			const definition = getMainDefinition(query);
			return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
		},
		wsLink(),
		httpLink(),
	);

const client = new ApolloClient({
	link: splitLink(),
	cache: new InMemoryCache(),
});

export default client;
