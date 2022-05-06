import { gql } from '@apollo/client';

export const USER_LOGIN = gql`
	query USER_LOGIN($username: String!) {
		user(where: { username: { _eq: $username } }) {
			username
			password
			email
			avatar
			user_settings
			uid
			full_name
		}
	}
`;

export const USER_GET_TOKEN = gql`
	query USER_GET_TOKEN($username: String!) {
		user(where: { username: { _eq: $username } }) {
			uid
			username
			token
		}
	}
`;
