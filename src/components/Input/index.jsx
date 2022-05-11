/**
 * Use input component.
 * @param {Object} properties - Input properties data.
 * @param {string} properties.name - Affect name and id of the input. REQUIRED.
 * @param {string} properties.type - Input type. REQUIRED.
 * @param {string} properties.placeholder - Input placeholder. REQUIRED.
 * @param {IconType} properties.icon - Add icon at the start of the input. OPTIONAL.
 * @param {string} [className] - Extra class for component.
 */
const Input = ({ properties, reference = null, className, ...rest }) => {
	return (
		<div className='relative flex items-center group transition'>
			{properties.icon && (
				<properties.icon
					className='absolute left-2 text-notokake-darker/25 dark:text-notokake-lighter/25 
          group-hover:text-notokake-accent2/75
          dark:group-hover:text-notokake-accent2-lighter/75
          group-focus-within:text-notokake-accent2 dark:group-focus-within:text-notokake-accent2-lighter transition ml-2'
					size={20}
				/>
			)}
			<input
				name={properties.name}
				type={properties.type}
				id={properties.name}
				placeholder={properties.placeholder}
				className={`${properties.icon && 'pl-10'} rounded-full ${className}`}
				ref={reference}
				{...rest}
			/>
		</div>
	);
};
export default Input;
