import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { loginHandler } from '../../store/UserData';

// GraphQL
import { useLazyQuery, useMutation } from '@apollo/client';
import { USER_LOGIN } from '../../graphql/User/query';
import { SEND_TOKEN } from '../../graphql/User/mutation';

// Library
import { compareSync } from 'bcryptjs';
import { encrypt } from '../../utils/encryption';
import { toast } from 'react-toastify';

// Component
import Button from '../../components/Button';
import { LogoLong } from '../../components/Logo';
import Footer from '../../components/Footer';
import SignInput from '../../components/SignInput';
import { MdPerson, MdLock } from 'react-icons/md';

const Login = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const loginToast = useRef(null);

	const userData = useSelector((state) => state.userData);

	const [input, setInput] = useState({
		username: '',
		password: '',
	});
	const [disableButton, setdisableButton] = useState(true);
	const [error, setError] = useState({});

	const formInputs = [
		{
			name: 'username',
			label: 'Username : ',
			error: error.username,
			type: 'text',
			placeholder: 'Username',
			autoComplete: 'off',
			icon: MdPerson,
		},
		{
			name: 'password',
			label: 'Password : ',
			error: error.password,
			type: 'password',
			placeholder: 'Password',
			autoComplete: 'off',
			icon: MdLock,
		},
	];

	const [loginUser, { loading: loginLoading }] = useLazyQuery(USER_LOGIN, {
		fetchPolicy: 'no-cache',
		onCompleted: (data) => {
			if (!data.user.length) {
				toast.update(loginToast.current, {
					render: 'Username not found',
					type: 'error',
					autoClose: 3000,
				});
				setError({ ...error, username: 'Username not found' });
				return;
			}
			let user = data.user[0];
			let comparePassword = compareSync(input.password, user.password);

			if (!comparePassword) {
				toast.update(loginToast.current, {
					render: 'Incorrect password',
					type: 'error',
					autoClose: 3000,
				});
				setError({ ...error, password: 'Incorrect password' });
				return;
			}
			let token = `${user.username}:${user.password}`;
			let encryptedToken = encrypt(token);

			sendToken({ variables: { username: user.username, token: encryptedToken } });

			let payload = {
				username: user.username,
				full_name: user.full_name,
				email: user.email,
				uid: user.uid,
				user_settings: user.user_settings,
				avatar: user.avatar,
				token: encryptedToken,
			};
			dispatch(loginHandler({ ...payload }));

			toast.update(loginToast.current, {
				render: 'Logged in! Redirecting to app...',
				type: 'success',
				autoClose: 1000,
				hideProgressBar: true,
			});
		},
	});
	const [sendToken, { data: tokenData }] = useMutation(SEND_TOKEN);

	const inputChangeHandler = (e) => {
		const { name, value } = e.target;
		setInput({ ...input, [name]: value });
		setError({ ...error, [name]: '' });
	};
	const formSubmitHandler = (e) => {
		e.preventDefault();
		loginToast.current = toast('Logging in...', { autoClose: false });

		loginUser({ variables: { username: input.username.toLowerCase() } });
	};

	// Button state
	useEffect(() => {
		if (input.username && input.password) {
			setdisableButton(false);
		} else {
			setdisableButton(true);
		}
	}, [input]);

	useEffect(() => {
		if (Object.keys(userData).length && tokenData) {
			navigate('/app');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userData, tokenData]);

	return (
		<div className={`w-screen min-h-screen h-fit overflow-auto flex flex-col justify-between items-center bg-light dark:bg-dark transition`}>
			<div className='flex flex-col my-auto'>
				<LogoLong className='h-16 md:h-24 mx-0 p-0 my-4' />
				<form
					className='flex flex-col bg-notokake-light/75 dark:bg-notokake-dark/80 mx-4 md:my-4 md:mx-0 px-4 py-4 md:px-8 md:py-4 rounded-xl shadow-xl shadow-notokake-darker/25 dark:shadow-notokake-darker/75 w-mobile md:w-desktop'
					onSubmit={formSubmitHandler}
				>
					<div className='my-4 text-center'>
						<h1 className='text-2xl font-bold'>Sign In</h1>
					</div>

					<SignInput inputs={formInputs} inputChangeHandler={inputChangeHandler} />
					<Link to={'/forgot-password'} className='flex w-fit justify-end mb-2 ml-auto'>
						Forgot password?
					</Link>

					<Button size='md' className='btn-accent' isLoading={loginLoading} disable={disableButton}>
						Login
					</Button>
					<p className='text-sm text-center my-1'>
						Doesn't have an account? <br />
						<Link to={'/register'}>Click here</Link> to sign up.
					</p>
				</form>
			</div>

			<Footer />
		</div>
	);
};

export default Login;
