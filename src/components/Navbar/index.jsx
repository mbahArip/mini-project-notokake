import { useState } from 'react';
import { Link } from 'react-router-dom';

// Redux
import { useSelector } from 'react-redux';

// Component
import { LogoLong } from '../Logo';
import { GiHamburgerMenu } from 'react-icons/gi';
import { MdClose } from 'react-icons/md';

const Navigation = [
	{
		name: 'Home',
		link: '/',
	},
	{
		name: 'About',
		link: '/about',
	},
	{
		name: 'Gallery',
		link: '/gallery',
	},
	{
		name: 'Contact',
		link: '/contact',
	},
];

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isHidden, setIsHidden] = useState(false);

	const userData = useSelector((state) => state.userData);

	return (
		<div className='w-full h-16 bg-notokake-light dark:bg-notokake-dark text-notokake-darker dark:text-notokake-lighter shadow-lg shadow-darker/50 flex justify-center md:justify-between items-center relative px-8 max-w-[1920px] md:rounded-b-xl'>
			<button
				className='grid place-items-center absolute p-2 top-auto right-4 cursor-pointer bg-transparent active:bg-transparent md:hidden'
				type='button'
				onClick={() => {
					setIsHidden(true);
					setIsOpen(!isOpen);
					setTimeout(() => {
						setIsHidden(false);
					}, 100);
				}}
			>
				{isOpen ? (
					<MdClose size={32} className={`${isHidden ? 'opacity-0' : 'opacity-100'} transition-all duration-150`} />
				) : (
					<GiHamburgerMenu size={28} className={`${isHidden ? 'opacity-0' : 'opacity-100'} transition-all duration-150`} />
				)}
			</button>

			<Link to={'/'} className='h-full'>
				<LogoLong className={'h-full py-4'} />
			</Link>

			<ul className='md:flex gap-4 hidden'>
				{Navigation.map((item, index) => (
					<li key={index} className='flex items-center'>
						<Link to={item.link} className='text-notokake-darker dark:text-notokake-light hover:text-notokake-accent'>
							{item.name}
						</Link>
					</li>
				))}
				{Object.keys(userData).length ? (
					<li>
						<Link
							to='/app'
							className='text-notokake-light dark:text-notokake-light hover:text-notokake-lighter bg-notokake-accent hover:bg-notokake-accent-lighter px-4 py-1 rounded-full flex items-center gap-2'
						>
							Go to App
						</Link>
					</li>
				) : (
					<li>
						<Link
							to='/login'
							className='text-notokake-darker dark:text-notokake-light hover:text-notokake-light hover:bg-notokake-accent border border-notokake-darker dark:border-notokake-light hover:border-transparent px-4 py-1 rounded-full flex items-center gap-2'
						>
							Login
						</Link>
					</li>
				)}
			</ul>
		</div>
	);
};

export default Navbar;
