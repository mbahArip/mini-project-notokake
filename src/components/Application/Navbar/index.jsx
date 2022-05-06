import { Fragment, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { logoutHandler } from '../../../store/UserData';

// Hook
import useSwitchTheme from '../../../hook/useSwitchTheme';

// Component
import Input from '../../Input';
import { LogoLong } from '../../Logo';
import { MdSearch } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { MdDarkMode, MdLightMode } from 'react-icons/md';

export const NavbarDesktop = ({ state, setState }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [changeTheme] = useSwitchTheme();
	const { darkMode } = useSelector((state) => state.theme);
	const userData = useSelector((state) => state.userData);

	const dropdownMenu = [
		{
			name: 'User Settings',
			link: '/user-settings',
		},
		{
			name: 'Logout',
			onClick: () => {
				dispatch(logoutHandler());
			},
		},
	];

	const [switchButton, setSwitchButton] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');

	const searchHandler = (e) => {
		let { value } = e.target;
		setSearchQuery(value);
	};

	// Search Query
	useEffect(() => {
		const delaySearch = setTimeout(() => {
			console.log('Search: ', searchQuery);
		}, 3000);

		return () => clearTimeout(delaySearch);
	}, [searchQuery]);

	// Logout
	useEffect(() => {
		if (!Object.keys(userData).length) {
			navigate('/');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userData]);

	return (
		<div className='col-span-full row-span-1 flex justify-between items-center py-4 px-8 bg-notokake-light dark:bg-notokake-dark drop-shadow-xl transition border-b border-b-notokake-darker/50 dark:border-b-notokake-light/50'>
			<LogoLong className='h-full' onClick={changeTheme} />

			<Input
				properties={{ name: 'search', type: 'text', placeholder: 'Search posts', icon: MdSearch }}
				autoComplete='off'
				onChange={searchHandler}
			/>

			<div className='flex items-center gap-4'>
				<button
					className='h-full flex items-center text-notokake-darker dark:text-notokake-lighter p-2 bg-notokake-lighter dark:bg-notokake-darker rounded-full shadow-md'
					onClick={() => {
						setSwitchButton(!switchButton);
						const change = changeTheme;
						setTimeout(() => {
							change();
						}, 100);
					}}
				>
					{darkMode ? (
						<MdLightMode size={24} className={`transition ${switchButton ? 'opacity-100 rotate-0' : ' opacity-0 -rotate-180'}`} />
					) : (
						<MdDarkMode size={24} className={`transition ${!switchButton ? 'opacity-100 rotate-0' : ' opacity-0 rotate-180'}`} />
					)}
				</button>
				<div className='relative inlin-block'>
					<img
						src='https://drive.mbaharip.me/api?path=/test.jpg&raw=true'
						alt='avatar'
						className='w-14 h-14 rounded-full bg-notokake-darker object-cover object-top cursor-pointer'
						onClick={(e) => {
							e.stopPropagation();
							setState(!state);
						}}
					/>

					<div
						className={`absolute w-64 mt-2 right-0 transition-all duration-150 ${
							state ? 'opacity-100 pointer-events-auto' : ' opacity-0 pointer-events-none'
						}`}
						onClick={(e) => {
							e.stopPropagation();
						}}
					>
						<ul className='bg-notokake-light dark:bg-notokake-dark text-notokake-darker dark:text-notokake-light shadow-lg outline outline-1 outline-notokake-dark/25 dark:outline-notokake-light/25 rounded-lg overflow-hidden'>
							<li className='inline-block relative w-full h-fit'>
								<img
									src='https://cdn.donmai.us/sample/fd/f8/__isekai_joucho_kamitsubaki_studio_drawn_by_misumigumi__sample-fdf801489198ad322b7f01d65dd9cff4.jpg'
									alt='banner'
									className='w-full h-16 object-cover'
								/>
								<div className='relative -top-8 -mb-8 select-none'>
									<img
										src='https://drive.mbaharip.me/api?path=/test.jpg&raw=true'
										alt='avatar'
										className='w-16 h-16 object-cover rounded-full mx-auto outline outline-4 outline-notokake-light dark:outline-notokake-dark'
									/>
									<div className='w-full flex flex-col text-center'>
										<span className='text-lg text-notokake-darker dark:text-notokake-lighter font-bold'>Username</span>
										<span className='text-sm text-notokake-dark/75 dark:text-notokake-lighter/75'>email@notekake.com</span>
									</div>
								</div>
							</li>

							<li className='border-t border-notokake-dark/25 dark:border-notokake-light/25' />
							{dropdownMenu.map((item, index) => (
								<Fragment key={index}>
									{item === 'divider' ? (
										<li className='border-t border-notokake-dark/25 dark:border-notokake-light/25' key={index} />
									) : (
										<li key={index}>
											<Link
												to={item.link ? item.link : '#'}
												className='block px-4 py-2 w-full hover:bg-notokake-dark hover:text-notokake-lighter text-notokake-darker dark:text-notokake-light dark:hover:bg-notokake-light dark:hover:text-notokake-darker'
												onClick={item.onClick ? item.onClick : () => {}}
											>
												{item.name}
											</Link>
										</li>
									)}
								</Fragment>
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};
