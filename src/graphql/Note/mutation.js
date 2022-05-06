import { gql } from '@apollo/client';

export const NEW_USER_NOTE = gql`
	mutation NEW_USER_NOTE($catID: uuid, $content: String!) {
		insert_notes(objects: { category_uuid: $catID, title: "Getting Started", content: $content, tags: "tag1, tag2, tag3" }) {
			returning {
				uuid
				title
				date_created
				content
				tags
			}
		}
	}
`;

export const VIEW_NOTE = gql`
	query GET_USER_NOTES($noteID: uuid) {
		notes(where: { uuid: { _eq: $noteID } }) {
			title
			tags
			date_modified
			content
		}
	}
`;
