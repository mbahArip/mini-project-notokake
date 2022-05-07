import { gql } from '@apollo/client';

export const GET_CATEGORIES = gql`
	query GET_CATEGORIES($username: String!) {
		category(where: { user: { username: { _eq: $username } } }, order_by: { name: asc }) {
			name
			uuid
			pinned
			notes_aggregate {
				aggregate {
					count
				}
			}
		}
	}
`;

export const SUBS_CATEGORIES = gql`
	subscription SUBS_CATEGORIES($username: String!) {
		category(where: { user: { username: { _eq: $username } } }, order_by: { name: asc }) {
			name
			uuid
			notes_aggregate {
				aggregate {
					count
				}
			}
		}
	}
`;
