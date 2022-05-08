import { useRef } from 'react';

// Redux
import { useSelector } from 'react-redux';

// GraphQL
import { useMutation } from '@apollo/client';
import { UPDATE_PIN } from '../../../graphql/Category/mutation';

// Component
import { toast } from 'react-toastify';
import ReactLoading from 'react-loading';
import { VscPin, VscClose } from 'react-icons/vsc';

// PASS: Pin Loading
const CategoryItem = ({ data, selectedState, ...rest }) => {
	const { darkMode } = useSelector((state) => state.theme);

	const [updatePin, { loading: pinLoading }] = useMutation(UPDATE_PIN, {
		refetchQueries: ['GET_CATEGORIES'],
		awaitRefetchQueries: true,
		onCompleted: (data) => {
			toast.update(pinToast.current, {
				render: 'Pin updated successfully',
				type: toast.TYPE.SUCCESS,
				autoClose: 1000,
			});
		},
	});
	const pinToast = useRef(null);

	return (
		<li className='flex items-center gap-4 w-full my-1'>
			<button id={data.uuid} className={`w-full flex items-center justify-between m-0 px-4 transition rounded-none group gap-2`} {...rest}>
				<span
					className={`h-full w-full text-left px-4 py-1 rounded-full ${
						data.uuid === selectedState
							? 'bg-notokake-accent-lighter dark:bg-notokake-accent text-notokake-light cursor-default'
							: ' hover:bg-notokake-accent-lighter/25 text-notokake-darker dark:text-notokake-light hover:text-notokake-darker'
					}`}
				>
					{data.name} ({data.notes_aggregate.aggregate.count})
				</span>
				{pinLoading ? (
					<div className='h-6 grid place-items-center w-6 rounded-full'>
						<ReactLoading type='spin' color={darkMode ? '#fff' : '#192530'} height={16} width={16} />
					</div>
				) : (
					<div
						className='h-6 grid place-items-center w-6 rounded-full hover:bg-notokake-dark dark:hover:bg-notokake-light text-notokake-darker dark:text-notokake-lighter hover:text-notokake-lighter dark:hover:text-notokake-darker cursor-pointer aspect-square'
						onClick={(e) => {
							e.stopPropagation();
							pinToast.current = toast('Pinning Category...', { autoClose: false });
							updatePin({ variables: { uuid: data.uuid, pinned: !data.pinned } });
						}}
					>
						{data.pinned ? <VscClose size={16} /> : <VscPin size={16} />}
					</div>
				)}
			</button>
		</li>
	);
};

export default CategoryItem;
