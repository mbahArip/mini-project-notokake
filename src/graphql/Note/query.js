import { gql } from '@apollo/client';

export const GET_NOTES = gql`
	query GET_NOTES($catID: uuid) {
		notes(where: { category_uuid: { _eq: $catID } }) {
			uuid
			title
			tags
			date_modified
			content
		}
	}
`;

export const SEARCH_NOTES_TITLE = gql`
	query SEARCH_NOTES($search: String!) {
		notes(where: { title: { _ilike: "%$search%" } }) {
			uuid
			title
			tags
			date_modified
			content
		}
	}
`;

export const SEARCH_NOTES_TAGS = gql`
	query SEARCH_NOTES($search: String!) {
		notes(where: { tags: { _ilike: "%$search%" } }) {
			uuid
			title
			tags
			date_modified
			content
		}
	}
`;
