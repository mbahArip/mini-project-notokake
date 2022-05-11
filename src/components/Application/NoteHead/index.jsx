import { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// GraphQL
import { useMutation } from '@apollo/client';
import { MOVE_NOTE, DELETE_NOTE, UPDATE_TAGS, UPDATE_NOTE } from '../../../graphql/Note/mutation';

// Component
import Button from '../../Button';
import { toast } from 'react-toastify';
import { AiFillEdit, AiFillDelete, AiFillFolder, AiFillSave, AiOutlinePlus, AiOutlineClose } from 'react-icons/ai';

// Utils
import { formatDateWithTime } from '../../../utils/formatDate';
import { capitalizeWord } from '../../../utils/capitalize';

const NoteHead = ({ dataNote, editState, draftState, listCategory }) => {
	const { state: isEditMode, setState: setIsEditMode } = editState;
	const { state: draft, setState: setDraft } = draftState;
	const { categoryUUID } = useParams();
	const navigate = useNavigate();
	const changeCategoryToast = useRef(null);
	const toastRef = useRef(null);

	const tagInputRef = useRef();
	const tagFormRef = useRef();
	const [isAddingTag, setIsAddingTag] = useState(false);
	const [tagInput, setTagInput] = useState('');

	// edit state

	const [moveNote] = useMutation(MOVE_NOTE, {
		variables: {
			noteID: dataNote.uuid,
		},
		refetchQueries: ['GET_NOTES', 'GET_CATEGORIES'],
		awaitRefetchQueries: true,
		onCompleted: (data) => {
			changeCategoryToast.current = toast.update(changeCategoryToast.current, {
				type: toast.TYPE.SUCCESS,
				render: 'Note moved',
				autoClose: 1000,
			});
			const { returning } = data.update_notes;
			console.log(returning);
			navigate(`/app/${returning[0].category_uuid}/${returning[0].uuid}`);
		},
	});
	const [deleteNote, { loading: deleteLoading }] = useMutation(DELETE_NOTE, {
		variables: {
			noteID: dataNote.uuid,
		},
		refetchQueries: ['GET_NOTES', 'GET_CATEGORIES'],
		awaitRefetchQueries: true,
		onCompleted: () => {
			changeCategoryToast.current = toast.update(changeCategoryToast.current, {
				type: toast.TYPE.SUCCESS,
				render: 'Note deleted',
				autoClose: 1000,
			});
			navigate(`/app/${currentCategory}`);
		},
	});
	const [updateTags] = useMutation(UPDATE_TAGS, {
		variables: {
			noteID: dataNote.uuid,
		},
		refetchQueries: ['GET_NOTES'],
		awaitRefetchQueries: true,
		onCompleted: (data) => {
			console.log(data);
			toastRef.current = toast.update(toastRef.current, {
				type: toast.TYPE.SUCCESS,
				render: 'Tags updated!',
				autoClose: 2500,
			});
		},
		onError: (error) => {
			toastRef.current = toast.update(toastRef.current, {
				type: toast.TYPE.ERROR,
				render: error.message,
				autoClose: 2500,
			});
		},
	});
	const [updateNote] = useMutation(UPDATE_NOTE, {
		variables: {
			noteID: dataNote.uuid,
			title: draft.title,
			content: draft.content,
		},
		refetchQueries: ['GET_NOTES'],
		awaitRefetchQueries: true,
		onCompleted: (data) => {
			toast.update('editedNote', {
				type: toast.TYPE.SUCCESS,
				render: 'Note successfully saved',
				autoClose: 2500,
			});
			setIsEditMode(false);
		},
		onError: (error) => {
			toast.update('editedNote', {
				type: toast.TYPE.ERROR,
				render: error.message,
				autoClose: 2500,
			});
		},
	});

	const [currentCategory, setCurrentCategory] = useState(categoryUUID);

	return (
		<>
			<div className='h-1/6 w-full bg-notokake-light dark:bg-notokake-dark text-notokake-darker dark:text-notokake-lighter px-4 py-2 text-center border-b border-b-notokake-darker/50 dark:border-b-notokake-light/50 flex flex-col justify-between'>
				<div className='flex flex-col justify-center h-full'>
					{/* Title */}
					<input
						className={`text-3xl max-w-6xl line-clamp-1 font-bold text-left bg-transparent text-notokake-darker dark:text-notokake-lighter outline-none focus:outline-none ${
							isEditMode && 'underline decoration-1 underline-offset-2 '
						}`}
						value={draft?.title}
						onChange={(e) => setDraft({ ...draft, title: e.target.value })}
						disabled={!isEditMode}
					/>
					{/* Date and Tags */}
					<p className='text-left text-sm'>{formatDateWithTime(dataNote.date_modified)}</p>
					<div className='w-full max-w-full h-8 flex gap-2 text-xs items-center'>
						<div className='w-fit max-w-[83.3333%] flex overflow-x-auto gap-2 pb-2'>
							{dataNote.tags !== '' && dataNote.tags !== null && (
								<>
									{dataNote.tags.split(',').map((item, index) => (
										<div
											className='bg-notokake-dark/10 dark:bg-notokake-light/10 px-2 rounded-full cursor-default w-fit h-fit relative flex items-center'
											key={index}
										>
											<div className='h-full w-fit pr-4 flex items-center justify-center whitespace-nowrap'>
												{capitalizeWord(item)}
											</div>
											<button
												className={
													'w-4 h-4 m-0 text-notokake-darker dark:text-notokake-lighter hover:bg-notokake-dark/10 dark:hover:bg-notokake-light/10 aspect-square place-items-center absolute right-0.5 transition z-10 rounded-full cursor-pointer grid'
												}
												type='button'
												onClick={(e) => {
													e.preventDefault();
													let tagsArray = dataNote.tags.split(',');
													let filterArray = tagsArray.filter((tag) => tag !== item);
													let joinedArray = filterArray.join(',');
													toastRef.current = toast('Deleting tags...', {
														type: toast.TYPE.INFO,
														autoClose: false,
													});
													updateTags({ variables: { tags: joinedArray } });
												}}
											>
												<AiOutlineClose size={12} />
											</button>
										</div>
									))}
								</>
							)}
						</div>

						<div className='w-2/12 h-6 flex items-center overflow-hidden relative rounded-full mb-2'>
							<form
								className='w-fit h-full flex items-center'
								onSubmit={(e) => {
									e.preventDefault();
									if (tagInput.length > 0) {
										setIsAddingTag(false);
										setTagInput('');
										toastRef.current = toast('Adding tag...', {
											type: toast.TYPE.INFO,
											autoClose: false,
										});
										let tagsArray = dataNote.tags.split(',');
										if (tagsArray.includes(tagInput)) {
											toast.update(toastRef.current, {
												type: toast.TYPE.ERROR,
												render: 'Tag already exists',
												autoClose: 2500,
											});
											return;
										}
										console.log(tagsArray.length);
										tagsArray.push(tagInput);
										let filteredArray = tagsArray.filter((tag) => tag !== '');
										let joinedArray = filteredArray.join(',');
										console.log('joinedArray', filteredArray);
										updateTags({ variables: { tags: joinedArray } });
									}
								}}
								onBlur={(e) => {
									if (e.currentTarget.contains(e.relatedTarget)) {
										setTagInput('');
										tagInputRef.current.focus();
									} else {
										setIsAddingTag(false);
										setTagInput('');
									}
								}}
								ref={tagFormRef}
							>
								<input
									className={`h-full relative ${
										isAddingTag ? 'left-0' : '-left-full'
									} w-48 px-2 pr-8 py-0 outline-none focus:outline-none rounded-full bg-notokake-lighter dark:bg-notokake-darker text-notokake-darker dark:text-notokake-lighter anim-med z-10`}
									value={tagInput}
									onChange={(e) => {
										setTagInput(e.target.value);
									}}
									onKeyDown={(e) => {
										if (e.key === 'Escape') {
											document.activeElement.blur();
										}
										return;
									}}
									ref={tagInputRef}
								/>
								{tagInput.length > 0 && isAddingTag && (
									<button
										className={
											'w-4 h-4 m-0 text-notokake-darker dark:text-notokake-lighter hover:bg-notokake-dark/10 dark:hover:bg-notokake-light/10 aspect-square grid place-items-center absolute right-6 transition z-10 rounded-full cursor-pointer'
										}
										type='button'
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											setTagInput('');
										}}
									>
										<AiOutlineClose size={12} />
									</button>
								)}
							</form>
							<div className='w-fit h-full flex items-center gap-2 overflow-hidden absolute'>
								<button
									className={`bg-notokake-dark/10 dark:bg-notokake-light/10 rounded-full m-0 flex items-center gap-2 h-full hover:bg-notokake-dark/25 dark:hover:bg-notokake-light/25 overflow-hidden px-2 w-fit relative anim-long ${
										isAddingTag ? '-left-full' : 'left-0'
									}`}
									onClick={() => {
										setIsAddingTag(true);
										let waitInput = setTimeout(() => {
											tagInputRef.current.focus();
										}, 100);

										return () => clearTimeout(waitInput);
									}}
								>
									<AiOutlinePlus />
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Menu */}
				<div className='w-full flex justify-between items-center my-1 h-fit'>
					<div className='flex items-center gap-2 max-w-xs'>
						<AiFillFolder size={24} />
						<select
							className='w-full pr-10 my-0'
							onChange={(e) => {
								setCurrentCategory(e.target.value);
								changeCategoryToast.current = toast('Changing category...', {
									type: toast.TYPE.INFO,
									autoClose: false,
								});
								moveNote({
									variables: {
										catID: e.target.value,
									},
								});
							}}
							value={currentCategory}
						>
							{listCategory?.category.map((item) => (
								<option key={item.uuid} value={item.uuid}>
									{item.name}
								</option>
							))}
						</select>
					</div>

					{isEditMode ? (
						<div className='flex w-fit items-center justify-center h-full gap-1'>
							<Button
								size={'sm'}
								isLoading={false}
								disabled={false}
								className={'my-0 flex items-center gap-2 btn-danger'}
								onClick={() => {
									setDraft({
										title: dataNote.title,
										content: dataNote.content,
									});
									setIsEditMode(!isEditMode);
								}}
							>
								<AiOutlineClose />
								Cancel
							</Button>
							<Button
								size={'sm'}
								isLoading={false}
								disabled={false}
								className={'my-0 flex items-center gap-2 btn-accent2'}
								onClick={() => {
									if (!toast.isActive('editedNote')) {
										toast('Saving...', {
											type: toast.TYPE.INFO,
											toastId: 'editedNote',
										});
									} else {
										toast.update('editedNote', {
											type: toast.TYPE.INFO,
											render: 'Saving...',
										});
									}
									updateNote();
								}}
							>
								<AiFillSave />
								Save
							</Button>
						</div>
					) : (
						<div className='flex w-fit items-center justify-center h-full gap-1'>
							<Button
								size={'sm'}
								isLoading={deleteLoading}
								disabled={false}
								className={'my-0 flex items-center gap-2 btn-danger'}
								onClick={() => {
									changeCategoryToast.current = toast('Deleting note...', {
										type: toast.TYPE.INFO,
										autoClose: false,
									});
									deleteNote();
								}}
							>
								<AiFillDelete />
								Delete
							</Button>

							<Button
								size={'sm'}
								isLoading={false}
								disabled={false}
								className={'my-0 flex items-center gap-2 btn-accent2'}
								onClick={() => {
									setIsEditMode(!isEditMode);
								}}
							>
								<AiFillEdit />
								Edit
							</Button>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default NoteHead;
