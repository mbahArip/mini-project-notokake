import { Link } from 'react-router-dom';

// Utils
import removeMd from 'remove-markdown';
import { formatDate } from '../../../utils/formatDate';

const NoteItem = ({ urlParams, data }) => {
	return (
		<li
			className={`py-2 px-4 block group ${
				data.uuid === urlParams.notesUUID
					? 'bg-notokake-accent-lighter dark:bg-notokake-accent cursor-default'
					: 'hover:bg-notokake-accent/25 '
			}`}
		>
			<Link to={`/app/${data.category_uuid}/${data.uuid}`} className={'p-0 h-fit'}>
				<div className='w-full flex justify-between items-center gap-2'>
					<span
						className={`${
							data.uuid === urlParams.notesUUID
								? 'text-notokake-lighter dark:text-notokake-light'
								: 'text-notokake-darker dark:text-notokake-light group-hover:text-notokake-darker dark:group-hover:text-notokake-light'
						} text-lg font-bold truncate text-ellipsis overflow-hidden`}
					>
						{data.title}
					</span>
					<span
						className={`${
							data.uuid === urlParams.notesUUID
								? 'text-notokake-lighter dark:text-notokake-light'
								: 'text-notokake-darker dark:text-notokake-light group-hover:text-notokake-darker dark:group-hover:text-notokake-light'
						} text-xs font-light opacity-75`}
					>
						{formatDate(data.date_modified)}
					</span>
				</div>
				<p
					className={`${
						data.uuid === urlParams.notesUUID
							? 'text-notokake-lighter dark:text-notokake-light'
							: 'text-notokake-darker dark:text-notokake-light group-hover:text-notokake-darker dark:group-hover:text-notokake-light'
					} line-clamp-1 h-fit text-sm font-light opacity-75`}
				>
					{removeMd(data.content)}
				</p>
			</Link>
		</li>
	);
};

export default NoteItem;
