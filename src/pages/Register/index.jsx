import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Redux
import { useSelector } from 'react-redux';

// GraphQL
import { useMutation } from '@apollo/client';
import { USER_REGIST } from '../../graphql/User/mutation';
import { NEW_USER_COLLECTION } from '../../graphql/Category/mutation';
import { NEW_USER_NOTE } from '../../graphql/Note/mutation';

// Library
import { genSaltSync, hashSync } from 'bcryptjs';
import { toast } from 'react-toastify';

// Component
import Button from '../../components/Button';
import { LogoLong } from '../../components/Logo';
import Footer from '../../components/Footer';
import SignInput from '../../components/SignInput';
import { MdEmail, MdPerson, MdLock } from 'react-icons/md';

// PASS: Create default category and notes.
const Register = () => {
	const navigate = useNavigate();
	const registerToast = useRef(null);

	const userData = useSelector((state) => state.userData);

	const NAME_REGEX = /^[A-Za-z\s]{1,}[.]{0,1}[A-Za-z\s]{0,}$/;
	const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,64}$/;
	const PASSWORD_CONTAINS_REGEX = {
		lowercase: /^(?=.*[a-z]).+$/,
		uppercase: /^(?=.*[A-Z]).+$/,
		number: /^(?=.*[0-9]).+$/,
	};
	const EMAIL_REGEX =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	const PASSWORD_SALT = genSaltSync(10);

	const [input, setInput] = useState({
		name: '',
		username: '',
		email: '',
		password: '',
		confirm: '',
	});
	const [error, setError] = useState({});
	const [loadingButton, setLoadingButton] = useState(false);
	const [disableButton, setDisableButton] = useState(true);

	const formInputs = [
		{
			name: 'name',
			label: 'Full name : ',
			error: error.name,
			type: 'text',
			placeholder: 'ex. John Smith',
			autoComplete: 'off',
			icon: MdPerson,
		},
		{
			name: 'username',
			label: 'Username : ',
			error: error.username,
			type: 'text',
			placeholder: 'ex. johnsmith',
			autoComplete: 'off',
			icon: MdPerson,
		},
		{
			name: 'email',
			label: 'Email : ',
			error: error.email,
			type: 'email',
			placeholder: 'ex. johnsmith@notekake.com',
			autoComplete: 'off',
			icon: MdEmail,
		},
		{
			name: 'password',
			label: 'Password : ',
			error: error.password,
			type: 'password',
			placeholder: 'Strong password no one can guess',
			autoComplete: 'off',
			icon: MdLock,
		},
		{
			name: 'confirm',
			label: 'Confirm password : ',
			error: error.confirm,
			type: 'password',
			placeholder: 'Confirm your password',
			autoComplete: 'off',
			icon: MdLock,
		},
	];

	const [registerUser, { loading: registerLoading }] = useMutation(USER_REGIST, {
		onCompleted: (data) => {
			if (!data) return;
			createCategory({ variables: { username: data.insert_user.returning[0].username } });
		},
		onError: (error) => {
			let message;
			if (error.message.includes('username')) {
				message = 'Username already exists';
			}
			if (error.message.includes('email')) {
				message = 'Email already exists';
			}
			toast.update(registerToast.current, {
				type: toast.TYPE.ERROR,
				render: `Registration failed!\n${message}`,
				autoClose: 3000,
			});
		},
	});
	const [createCategory, { loading: categoryLoading }] = useMutation(NEW_USER_COLLECTION, {
		onCompleted: (data) => {
			if (!data) return;
			let defaultContent = `# Header\n\nLorem ipsum dolor sit amet\n\n## Sub header\n\nLong long long long paragraph;`;
			console.log(data);
			createNote({ variables: { catID: data.insert_category.returning[0].uuid, content: defaultContent } });
		},
		onError: (error) => {
			toast.update(registerToast.current, {
				type: toast.TYPE.ERROR,
				render: `Registration failed!\n${error.message}`,
				autoClose: 3000,
			});
		},
	});
	const [createNote, { loading: noteLoading }] = useMutation(NEW_USER_NOTE, {
		onCompleted: (data) => {
			if (!data) return;
			setDisableButton(true);
			console.log(data);
			toast.update(registerToast.current, {
				type: toast.TYPE.SUCCESS,
				render: 'Success! Redirecting in 3 seconds...',
				autoClose: 1000,
				hideProgressBar: true,
				onClose: () => navigate('/login'),
			});
		},
		onError: (error) => {
			toast.update(registerToast.current, {
				type: toast.TYPE.ERROR,
				render: `Registration failed!\n${error.message}`,
				autoClose: 3000,
			});
		},
	});

	const inputChangeHandler = (e) => {
		const { name, value } = e.target;

		// Check full name
		if (name === 'name') {
			if (!NAME_REGEX.test(value)) {
				setError({ ...error, name: 'Invalid name' });
			} else {
				setError({ ...error, name: '' });
			}
		}
		// Check username
		if (name === 'username') {
			if (value.length < 5) {
				setError({ ...error, username: 'Username must be at least 5 characters' });
			} else {
				setError({ ...error, username: '' });
			}
		}
		// Check email
		if (name === 'email') {
			if (!EMAIL_REGEX.test(value)) {
				setError({ ...error, email: 'Invalid email' });
			} else {
				setError({ ...error, email: '' });
			}
		}
		// Check password
		if (name === 'password') {
			if (!PASSWORD_REGEX.test(value)) {
				setError({ ...error, password: 'Invalid password pattern' });
			} else {
				setError({ ...error, password: '' });
			}
		}
		// Check confirm password
		if (name === 'confirm') {
			if (value !== input.password) {
				setError({ ...error, confirm: 'Password does not match' });
			} else {
				setError({ ...error, confirm: '' });
			}
		}

		setInput({
			...input,
			[name]: value,
		});
	};
	const formSubmitHandler = async (e) => {
		e.preventDefault();
		registerToast.current = toast('Registering...', { autoClose: false });

		registerUser({
			variables: {
				fullname: input.name,
				username: input.username.toLowerCase(),
				email: input.email.toLowerCase(),
				password: hashSync(input.password, PASSWORD_SALT),
			},
		});
	};

	// Button disable state
	useEffect(() => {
		if (
			input.name !== '' &&
			input.username !== '' &&
			input.email !== '' &&
			input.password !== '' &&
			input.confirm !== '' &&
			error.name === '' &&
			error.username === '' &&
			error.email === '' &&
			error.password === '' &&
			error.confirm === ''
		) {
			setDisableButton(false);
		} else {
			setDisableButton(true);
		}
	}, [input, error]);
	// Button loading state
	useEffect(() => {
		if (registerLoading || categoryLoading || noteLoading) {
			setLoadingButton(true);
		} else {
			setLoadingButton(false);
		}
	}, [registerLoading, categoryLoading, noteLoading]);

	useEffect(() => {
		if (Object.keys(userData).length) {
			navigate('/app');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userData]);

	return (
		<div className={`w-screen min-h-screen h-fit overflow-auto flex flex-col justify-between items-center bg-light dark:bg-dark transition`}>
			<div className='flex flex-col my-auto'>
				<LogoLong className='h-16 md:h-24 mx-0 p-0 my-4' />
				<form
					className='flex w-mobile md:w-desktop flex-col bg-notokake-light/75 dark:bg-notokake-dark/80 mx-4 md:my-4 md:mx-0 px-4 py-4 md:px-8 md:py-4 rounded-xl shadow-xl shadow-notokake-darker/25 dark:shadow-notokake-darker/75'
					onSubmit={formSubmitHandler}
				>
					<div className='my-4 text-center'>
						<h1 className='text-2xl font-bold'>Register new user</h1>
						<p className='text-sm text-notokake-dark/75 dark:text-notokake-light/75'>Fill the form below to register.</p>
					</div>

					<SignInput inputs={formInputs} inputChangeHandler={inputChangeHandler} />

					<p className='text-xs md:text-sm'>
						Password must contains: <br />
						<span className='grid grid-cols-2'>
							<span className={`${input.password.length < 8 ? 'text-notokake-accent' : ''}`}>・ At least 8 characters</span>
							<span className={`${!PASSWORD_CONTAINS_REGEX.uppercase.test(input.password) ? 'text-notokake-accent' : ''}`}>
								・ At least one uppercase letter
							</span>
							<span className={`${!PASSWORD_CONTAINS_REGEX.lowercase.test(input.password) ? 'text-notokake-accent' : ''}`}>
								・ At least one lowercase letter
							</span>
							<span className={`${!PASSWORD_CONTAINS_REGEX.number.test(input.password) ? 'text-notokake-accent' : ''}`}>
								・ At least one number
							</span>
						</span>
					</p>

					<p className='mt-8 mb-2 text-sm text-center'>
						{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
						With registering you are agree to our <a href='#'>Terms of Use</a> and <a href='#'>Privacy Policy</a>.
					</p>
					<Button size='md' className='btn-accent' isLoading={loadingButton} disable={disableButton}>
						Join
					</Button>
					<p className='text-sm text-center my-1'>
						Already have an account? <br />
						<Link to={'/login'}>Click here</Link> to login.
					</p>
				</form>
			</div>

			<Footer />
		</div>
	);
};

export default Register;
