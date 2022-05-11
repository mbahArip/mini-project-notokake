// Components
import { LogoLong } from '../Logo';

const Loading = () => {
	return (
		<div className='w-screen h-screen grid place-items-center bg-light dark:bg-dark'>
			<LogoLong className='animate-pulse w-mobile md:w-desktop' />
		</div>
	);
};

export default Loading;
