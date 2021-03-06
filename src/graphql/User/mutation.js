import { gql } from '@apollo/client';

export const USER_REGIST = gql`
	mutation USER_REGIST($username: String!, $password: String!, $fullname: String!, $email: String!) {
		insert_user(objects: { username: $username, password: $password, full_name: $fullname, email: $email }) {
			returning {
				uid
				username
				full_name
				email
			}
		}
	}
`;

export const USER_UPDATE = gql`
	mutation USER_UPDATE($username: String!, $password: String, $fullname: String, $avatar: String, $settings: jsonb) {
		update_user(
			where: { username: { _eq: $username } }
			_set: { password: $password, full_name: $fullname, avatar: $avatar, user_settings: $settings }
		) {
			returning {
				uid
				username
				full_name
				avatar
			}
		}
	}
`;
export const USER_UPDATE_AVATAR = gql`
	mutation USER_UPDATE_AVATAR($username: String!, $avatar: String!) {
		update_user(where: { username: { _eq: $username } }, _set: { avatar: $avatar }) {
			returning {
				uid
				username
				avatar
			}
		}
	}
`;
export const USER_UPDATE_PASSWORD = gql`
	mutation USER_UPDATE_PASSWORD($username: String!, $password: String!) {
		update_user(where: { username: { _eq: $username } }, _set: { password: $password }) {
			returning {
				uid
				username
				password
			}
		}
	}
`;
export const USER_UPDATE_SETTINGS = gql`
	mutation USER_UPDATE_SETTINGS($username: String!, $settings: jsonb!) {
		update_user(where: { username: { _eq: $username } }, _set: { user_settings: $settings }) {
			returning {
				uid
				username
				user_settings
			}
		}
	}
`;

export const SEND_TOKEN = gql`
	mutation SEND_TOKEN($username: String!, $token: String!) {
		update_user(where: { username: { _eq: $username } }, _set: { token: $token }) {
			returning {
				uid
				username
				token
			}
		}
	}
`;
