import { gql } from '@apollo/client';

export const GET_NOTES = gql`
	query GET_NOTES($catID: uuid) {
		notes(where: { category_uuid: { _eq: $catID } }, order_by: { date_modified: desc }) {
			uuid
			category_uuid
			title
			tags
			date_modified
			content
		}
	}
`;

export const SEARCH_NOTES_TITLE = gql`
	query SEARCH_NOTES($username: String!, $query: String!) {
		category(where: { user: { username: { _eq: $username } } }) {
			notes(where: { title: { _ilike: $query } }) {
				uuid
				title
				tags
				date_modified
				date_created
				content
				category_uuid
			}
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
