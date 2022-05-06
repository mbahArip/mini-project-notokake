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
