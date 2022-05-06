const Footer = () => {
	const getCurrentYear = () => {
		const date = new Date();
		return date.getFullYear();
	};

	return (
		<div className='w-full h-fit text-xs bg-notokake-light dark:bg-notokake-dark italic font-roboto flex items-center justify-center mt-8 py-1'>
			©{getCurrentYear()} Notekake
		</div>
	);
};

export default Footer;
