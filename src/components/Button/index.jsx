import ReactLoading from 'react-loading';

/**
 * Use Button component.
 * @param {String} [size] - Size of the button. Accept only ['xs', 'sm', 'md', 'lg', 'xl'].
 * @param {boolean} [isLoading] - Define wether the button is on loading state or not.
 * @param {boolean} [disable] - Define wether the button is disabled or not.
 * @param {string} [className] - Extra class for component.
 * @param {Component} children - Children of the button.
 */
const Button = ({ isLoading = false, size = 'md', className, disable = false, children, ...rest }) => {
	let buttonSize;
	switch (size) {
		case 'xs':
			buttonSize = 'btn-xs';
			break;
		case 'sm':
			buttonSize = 'btn-sm';
			break;
		case 'md':
			buttonSize = 'btn-md';
			break;
		case 'lg':
			buttonSize = 'btn-lg';
			break;
		case 'xl':
			buttonSize = 'btn-xl';
			break;
		default:
			buttonSize = 'btn-md';
	}
	return (
		<button
			className={`${buttonSize} bg-notokake-accent text-notokake-light mx-auto ${className}`}
			disabled={isLoading ? true : false || disable}
			{...rest}
		>
			{isLoading ? <ReactLoading type='bubbles' color='#fff' height={24} width={24} /> : <>{children}</>}
		</button>
	);
};

export default Button;
