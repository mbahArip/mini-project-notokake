import { gql } from '@apollo/client';

export const NEW_USER_COLLECTION = gql`
	mutation NEW_USER_COLLECTION($username: String!) {
		insert_category(objects: { owner: $username, name: "Starter Collection" }) {
			returning {
				uuid
				name
			}
		}
	}
`;

export const CREATE_CATEGORY = gql`
	mutation CREATE_CATEGORY($username: String!, $name: String!) {
		insert_category(objects: { owner: $username, name: $name }) {
			returning {
				uuid
				name
			}
		}
	}
`;

export const UPDATE_PIN = gql`
	mutation UPDATE_PIN($uuid: uuid!, $pinned: Boolean!) {
		update_category(where: { uuid: { _eq: $uuid } }, _set: { pinned: $pinned }) {
			returning {
				uuid
				name
				pinned
			}
		}
	}
`;
