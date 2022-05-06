// Redux
import { useDispatch } from 'react-redux';
import { switchTheme } from '../store/Theme';

const useSwitchTheme = () => {
	const dispatch = useDispatch();

	function changeTheme() {
		dispatch(switchTheme());
	}
	return [changeTheme];
};

export default useSwitchTheme;
