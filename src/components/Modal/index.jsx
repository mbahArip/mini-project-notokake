const Modal = ({ state, children }) => {
	const { state: isOpen, setState: setIsOpen } = state;

	return (
		<div
			className={`w-screen h-screen bg-black/50 backdrop-blur grid place-items-center ${
				isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
			}`}
			onClick={() => setIsOpen(false)}
		>
			<div
				className='w-1/2 min-w-fit max-w-screen h-fit max-h-screen px-8 py-4 bg-notokake-light text-notokake-darker dark:bg-notokake-dark dark:text-notokake-lighter rounded-xl overflow-y-auto'
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				{children}
			</div>
		</div>
	);
};

export default Modal;
