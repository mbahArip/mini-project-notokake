import { useState } from 'react';

// Component
import { NavbarDesktop } from '../../components/Application/Navbar';
// import Loading from '../../components/Loading';

const Application = () => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	// const [isLoading] = useState(false);

	// if (isLoading) {
	// 	return <Loading />;
	// }

	return (
		<div
			className='w-screen h-screen bg-light dark:bg-dark'
			onClick={() => {
				setIsDropdownOpen(false);
			}}
		>
			<div className='w-screen h-screen max-w-[1920px] mx-auto shadow-xl shadow-notokake-darker/25 dark:shadow-notokake-darker/75 grid grid-cols-12 grid-rows-12 text-notokake-darker dark:text-notokake-lighter'>
				<NavbarDesktop state={isDropdownOpen} setState={setIsDropdownOpen} />

				<div className='col-span-2 row-[span_11_/_span_11] bg-notokake-light dark:bg-notokake-dark p-4 overflow-y-auto border-r border-r-darker/50 dark:border-r-notokake-light/50'>
					<span className='text-xl font-bold'>Recent</span>
					<ul className='px-2 flex flex-col gap-1 my-2'>
						<li>Lorem</li>
						<li>Ipsum</li>
						<li>Dolor</li>
					</ul>
					<span className='text-xl font-bold'>Category</span>
					<ul className='px-2 flex flex-col gap-1 my-2'>
						<li>Lorem</li>
						<li>Ipsum</li>
						<li>Dolor</li>
					</ul>
				</div>
				<div className='col-span-2 row-[span_11_/_span_11] bg-notokake-light/75 dark:bg-notokake-dark/75 p-4 overflow-y-auto border-r border-r-darker/50 dark:border-r-notokake-light/50'>
					Notes
				</div>
				<div className='col-span-8 row-[span_11_/_span_11] bg-notokake-lighter dark:bg-notokake-darker p-8 overflow-y-auto'></div>
			</div>
		</div>
	);
};

export default Application;
