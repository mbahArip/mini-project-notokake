import { useNavigate } from 'react-router-dom';

// Component
import Button from '../../components/Button';
import Footer from '../../components/Footer';
import { LogoLong } from '../../components/Logo';

const NotFound = () => {
	const navigate = useNavigate();

	return (
		<div className='w-screen min-h-screen h-fit overflow-auto flex flex-col justify-between items-center bg-light dark:bg-dark transition'>
			{/* <Navbar /> */}

			<div className='flex flex-col my-auto'>
				<LogoLong className='h-16 md:h-24 mx-0 p-0 my-4' />
				<div className='flex w-mobile md:w-desktop flex-col bg-notokake-light/75 dark:bg-notokake-dark/80 mx-4 my-auto md:mx-0 px-8 py-2 md:px-8 rounded-xl shadow-xl shadow-notokake-darker/25 dark:shadow-notokake-darker/75'>
					<h1 className='text-6xl font-bold my-2 text-notokake-accent'>Oops!</h1>
					<p className='text-lg'>We can't find the page you are looking for.</p>
					<code className='px-4 my-4 py-2 bg-notokake-darker rounded-lg border border-notokake-light/50 text-notokake-lighter/75'>
						Error code: 404
					</code>
					<Button onClick={() => navigate('/')}>Go back Home</Button>
				</div>
			</div>

			<Footer />
		</div>
	);
};

export default NotFound;
