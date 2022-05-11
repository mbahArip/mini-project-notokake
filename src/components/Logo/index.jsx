// Redux
import { useSelector } from 'react-redux';

// Assets
import LogoDark from '../../assets/logo/logo-long-dark.svg';
import LogoLight from '../../assets/logo/logo-long.svg';
import IconDark from '../../assets/logo/logo-icon-dark.svg';
import IconLight from '../../assets/logo/logo-icon.svg';

const useDarkMode = () => {
	const { darkMode } = useSelector((state) => state.theme);
	return darkMode;
};

export const LogoLong = ({ className, ...rest }) => {
	return <img src={`${useDarkMode() ? LogoLight : LogoDark}`} alt='Notekake logo' className={`${className} drop-shadow-lg my-auto`} {...rest} />;
};

export const LogoIcon = ({ className, ...rest }) => {
	return <img src={`${useDarkMode() ? IconLight : IconDark}`} alt='Notekake logo' className={`${className} drop-shadow-lg my-auto`} {...rest} />;
};
