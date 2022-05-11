import { gql } from '@apollo/client';

export const NEW_USER_NOTE = gql`
	mutation NEW_USER_NOTE($catID: uuid, $content: String!) {
		insert_notes(objects: { category_uuid: $catID, title: "Getting Started", content: $content, tags: "Tutorial, New User" }) {
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

export const UPDATE_NOTE = gql`
	mutation UPDATE_NOTE($noteID: uuid!, $title: String!, $content: String!) {
		update_notes(where: { uuid: { _eq: $noteID } }, _set: { title: $title, content: $content, date_modified: "now()" }) {
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

export const UPDATE_TAGS = gql`
	mutation UPDATE_CONTENT($noteID: uuid!, $tags: String!) {
		update_notes(where: { uuid: { _eq: $noteID } }, _set: { tags: $tags, date_modified: "now()" }) {
			returning {
				uuid
				title
				tags
			}
		}
	}
`;

export const NEW_NOTE = gql`
	mutation NEW_NOTE($catID: uuid) {
		insert_notes(objects: { category_uuid: $catID, title: "Untitled", content: "", tags: "" }) {
			returning {
				uuid
				title
			}
		}
	}
`;

export const MOVE_NOTE = gql`
	mutation MOVE_NOTE($noteID: uuid!, $catID: uuid!) {
		update_notes(where: { uuid: { _eq: $noteID } }, _set: { category_uuid: $catID, date_modified: "now()" }) {
			returning {
				uuid
				category_uuid
				title
				date_modified
			}
		}
	}
`;

export const DELETE_NOTE = gql`
	mutation DELETE_NOTE($noteID: uuid!) {
		delete_notes(where: { uuid: { _eq: $noteID } }) {
			returning {
				uuid
				title
				date_modified
			}
		}
	}
`;
