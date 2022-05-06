import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { logoutHandler } from '../../store/UserData';

// GraphQL
import { useQuery } from '@apollo/client';
import { USER_GET_TOKEN } from '../../graphql/User/query';
import Loading from '../Loading';

// Component

const ProtectedRoutes = ({ children }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState(true);
	const [checkToken, setCheckToken] = useState(null);

	const userData = useSelector((state) => state.userData);

	// eslint-disable-next-line
	const { data: loginData, loading: loginLoading } = useQuery(USER_GET_TOKEN, {
		variables: {
			username: userData.username || '',
		},
		fetchPolicy: 'no-cache',
	});

	useEffect(() => {
		if (!Object.keys(userData).length) {
			navigate('/');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userData]);

	useEffect(() => {
		if (loginData && !loginLoading) {
			let user = loginData.user[0];
			if (user.token !== userData.token) {
				dispatch(logoutHandler());
			} else {
				setCheckToken(true);
				return setIsLoading(false);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loginData, loginLoading]);
	useEffect(() => {
		if (checkToken === false) {
			console.log('return to login');
		}
	}, [checkToken]);

	if (isLoading) {
		return <Loading />;
	}

	return <>{children}</>;
};

export default ProtectedRoutes;
