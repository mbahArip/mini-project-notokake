import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { updateUserDataHandler } from '../../store/UserData';

// GraphQl
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { GET_CATEGORIES } from '../../graphql/Category/query';
import { CREATE_CATEGORY } from '../../graphql/Category/mutation';
import { GET_NOTES, SEARCH_NOTES_TITLE } from '../../graphql/Note/query';
import { NEW_NOTE } from '../../graphql/Note/mutation';
import { USER_UPDATE_AVATAR, USER_UPDATE_PASSWORD, USER_UPDATE_SETTINGS } from '../../graphql/User/mutation';

// Component
import { NavbarDesktop } from '../../components/Application/Navbar';
import CategoryItem from '../../components/Application/CategoryItem';
import NoteItem from '../../components/Application/NoteItem';
import Loading from '../../components/Loading';
import { toast } from 'react-toastify';
import { VscPinned, VscAdd, VscSearch } from 'react-icons/vsc';
import { AiFillCamera, AiOutlineClose } from 'react-icons/ai';
import Input from '../../components/Input';
import ReactLoading from 'react-loading';
import NoteHead from '../../components/Application/NoteHead';
import { compareSync } from 'bcryptjs';
import { decrypt, encrypt } from '../../utils/encryption';
import { genSaltSync, hashSync } from 'bcryptjs';

// Remark
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import rehypePrismPlus from 'rehype-prism-plus';
import remarkSlug from 'remark-slug';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkToc from 'remark-toc';
import remarkMath from 'remark-math';

// Editor
import CodeMirror, { keymap } from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { historyKeymap } from '@codemirror/history';
import { markdown, markdownLanguage, markdownKeymap } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { tags } from '@codemirror/highlight';
import { syntaxHighlighting, HighlightStyle } from '@codemirror/language';
import { oneDark } from '../../components/Application/EditorTheme/dark';
import { oneLight } from '../../components/Application/EditorTheme/light';
import Modal from '../../components/Modal';
import Avatar from 'react-avatar';
import { toBase64 } from '../../utils/toBase64';
import { SEND_TOKEN } from '../../graphql/User/mutation';
import Button from '../../components/Button';
import { setTheme } from '../../store/Theme';

const editorTheme = () => [baseTheme];
const baseTheme = EditorView.baseTheme({
	'.cm-content': { 'white-space': 'pre-wrap' },
	'.cm-gutterElement': { display: 'flex', 'align-items': 'center', 'justify-content': 'end' },
});
const syntaxHighlight = HighlightStyle.define([
	{
		tag: tags.heading1,
		fontSize: '1.875rem',
		lineHeight: '2.25rem',
		fontWeight: 'bold',
	},
	{
		tag: tags.heading2,
		fontSize: '1.5rem',
		lineHeight: '2rem',
		fontWeight: 'bold',
	},
	{
		tag: tags.heading3,
		fontSize: '1.25rem',
		lineHeight: '1.75rem',
		fontWeight: 'bold',
	},
	{
		tag: tags.heading4,
		fontSize: '1.125rem',
		lineHeight: '1.75rem',
		fontWeight: 'bold',
	},
	{
		tag: tags.heading5,
		fontSize: '1rem',
		lineHeight: '1.75rem',
		fontWeight: 'bold',
	},
]);

const Application = () => {
	const { categoryUUID, notesUUID } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { darkMode } = useSelector((state) => state.theme);
	const userData = useSelector((state) => state.userData);
	const { user_settings: userSettings } = useSelector((state) => state.userData);

	const avatarInputRef = useRef();
	const searchRef = useRef();
	const categoryToast = useRef(null);
	const toastRef = useRef(null);

	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const [pinnedCategory, setPinnedCategory] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [inputNewCategory, setInputNewCategory] = useState('');

	const [selectedNotes, setSelectedNotes] = useState(null);
	const [isNotesLoading, setIsNotesLoading] = useState(true);

	const [isEditMode, setIsEditMode] = useState(false);
	const [editedNote, setEditedNote] = useState({
		title: '',
		content: '',
	});

	const [searchQuery, setSearchQuery] = useState('');
	const [isSearching, setIsSearching] = useState(false);
	const [searchResult, setSearchResult] = useState([]);

	const searchHandler = (e) => {
		let { value } = e.target;
		if (value === '') return setIsSearching(false);
		setIsSearching(true);
		setSearchQuery(value);
	};

	useEffect(() => {
		let delaySearch;
		if (searchQuery !== '') {
			delaySearch = setTimeout(() => {
				searchNotes();
			}, 1000);
		}

		return () => clearTimeout(delaySearch);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchQuery]);

	const [isUserSettingsOpen, setIsUserSettingsOpen] = useState(false);
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [passwordError, setPasswordError] = useState({
		current: false,
		new: false,
		confirm: false,
	});

	const editor = useRef();
	const preview = useRef();

	// GraphQL Queries goes here
	const [userUpdateAvatar] = useMutation(USER_UPDATE_AVATAR, {
		variables: {
			username: userData.username,
		},
		fetchPolicy: 'no-cache',
		onCompleted: (data) => {
			dispatch(updateUserDataHandler({ avatar: data.update_user.returning[0].avatar }));
			toast.update(toastRef.current, {
				render: 'Avatar updated successfully',
				type: toast.TYPE.SUCCESS,
				autoClose: 2500,
			});
		},
		onError: (err) => {
			toast.update(toastRef.current, {
				render: err.message,
				type: toast.TYPE.ERROR,
				autoClose: 2500,
			});
		},
	});
	const [userUpdateSettings] = useMutation(USER_UPDATE_SETTINGS, {
		variables: {
			username: userData.username,
		},
		fetchPolicy: 'no-cache',
		onCompleted: (data) => {
			let categoryUUID = data.update_user.returning[0].user_settings.defaultCategory;
			dispatch(updateUserDataHandler({ user_settings: { defaultCategory: categoryUUID } }));
			toast.update(toastRef.current, {
				render: 'Settings updated successfully',
				type: toast.TYPE.SUCCESS,
				autoClose: 2500,
			});
			// console.log(userSettings);
		},
		onError: (error) => {
			toast.update(toastRef.current, {
				render: error.message,
				type: toast.TYPE.ERROR,
				autoClose: 2500,
			});
		},
	});
	const [userUpdatePassword] = useMutation(USER_UPDATE_PASSWORD, {
		variables: {
			username: userData.username,
		},
		fetchPolicy: 'no-cache',
		onCompleted: (data) => {
			toast.update(toastRef.current, {
				render: 'Password updated successfully',
				type: toast.TYPE.SUCCESS,
				autoClose: 2500,
			});
			let token = `${userData.username}:${data.update_user.returning[0].password}`;
			let encryptedToken = encrypt(token);
			dispatch(updateUserDataHandler({ token: encryptedToken }));
			sendToken({ variables: { token: encryptedToken } });

			setCurrentPassword('');
			setNewPassword('');
			setConfirmPassword('');
		},
		onError: (error) => {
			toast.update(toastRef.current, {
				render: error.message,
				type: toast.TYPE.ERROR,
				autoClose: 2500,
			});
		},
	});
	const [sendToken] = useMutation(SEND_TOKEN, {
		variables: {
			username: userData.username,
		},
		fetchPolicy: 'no-cache',
	});

	const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_CATEGORIES, {
		variables: {
			username: userData.username,
		},
		nextFetchPolicy: 'no-cache',
	});
	const [createCategory] = useMutation(CREATE_CATEGORY, {
		fetchPolicy: 'no-cache',
		refetchQueries: [GET_CATEGORIES],
		awaitRefetchQueries: true,
		variables: {
			username: userData.username,
		},
		onCompleted: () => {
			setInputNewCategory('');
			toast.update(categoryToast.current, {
				type: toast.TYPE.SUCCESS,
				render: 'Category created',
				autoClose: 1000,
			});
		},
	});
	const [searchNotes, { loading: searchLoading }] = useLazyQuery(SEARCH_NOTES_TITLE, {
		fetchPolicy: 'no-cache',
		nextFetchPolicy: 'no-cache',
		variables: {
			username: userData.username,
			query: `%${searchQuery}%`,
		},
		onCompleted: (data) => {
			let { category } = data;
			let notesArray = [];
			category.forEach((category) => {
				notesArray.push(...category.notes);
			});
			setSearchResult(notesArray);
		},
	});
	const [getNotes, { data: notesData, loading: notesLoading }] = useLazyQuery(GET_NOTES, {
		fetchPolicy: 'cache-and-network',
		nextFetchPolicy: 'no-cache',
	});
	const [createNote] = useMutation(NEW_NOTE, {
		fetchPolicy: 'no-cache',
		refetchQueries: [GET_NOTES, GET_CATEGORIES],
		awaitRefetchQueries: true,
		variables: {
			catID: selectedCategory,
		},
		onCompleted: (data) => {
			setIsEditMode(true);
			toast.update(toastRef.current, {
				type: toast.TYPE.SUCCESS,
				render: 'Note created',
				autoClose: 2500,
			});
			navigate(`/app/${selectedCategory}/${data.insert_notes.returning[0].uuid}`);
		},
	});

	const submitCategoryHandler = (e) => {
		e.preventDefault();
		if (inputNewCategory === '') {
			toast('Category name must be filled', {
				type: toast.TYPE.ERROR,
				autoClose: 2500,
			});
			return;
		}
		categoryToast.current = toast('Creating new category...', {
			autoClose: false,
		});
		createCategory({ variables: { name: inputNewCategory } });
	};

	// Get default category
	useEffect(() => {
		if (categoryUUID) {
			return setSelectedCategory(categoryUUID);
		}
		if (Object.keys(userSettings).length && userSettings.defaultCategory) {
			setSelectedCategory(userSettings.defaultCategory);
			navigate(`/app/${userSettings.defaultCategory}`);
		} else if (categoriesData && Object.keys(categoriesData.category).length) {
			setSelectedCategory(categoriesData.category[0].uuid);
			navigate(`/app/${categoriesData.category[0].uuid}`);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [categoryUUID, userSettings, categoriesData]);
	// Get pinned category
	useEffect(() => {
		if (categoriesData && !categoriesLoading) {
			let filteredData = categoriesData.category.filter((category) => category.pinned);
			setPinnedCategory([...filteredData]);
		}
	}, [setPinnedCategory, categoriesData, categoriesLoading]);

	// Get notes on category
	useEffect(() => {
		getNotes({ variables: { catID: categoryUUID } });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [categoryUUID]);
	// View note
	useEffect(() => {
		setIsNotesLoading(true);
		setIsEditMode(false);
		let timeout;
		if (notesData && !notesLoading) {
			let selectedNotesUUID = notesData.notes.filter((note) => note.uuid === notesUUID);
			if (selectedNotesUUID.length) {
				if (selectedNotesUUID[0].content === '') {
					setEditedNote({
						title: selectedNotesUUID[0].title,
						content: selectedNotesUUID[0].content,
					});
					setIsEditMode(true);
				}
				setSelectedNotes(selectedNotesUUID[0]);
				timeout = setTimeout(() => {
					setIsNotesLoading(false);
				}, 1);
			} else {
				setSelectedNotes(null);
			}
		}

		return () => {
			clearTimeout(timeout);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [notesUUID, notesData, notesLoading]);

	useEffect(() => {
		if (!isEditMode) {
			setEditedNote({
				title: selectedNotes?.title,
				content: selectedNotes?.content,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedNotes, isEditMode]);
	useEffect(() => {
		if (toastRef.current && !isEditMode) {
			toast.dismiss('editedNote');
		}
		if (!isEditMode) return;
		if (!selectedNotes) return;
		if (editedNote.content !== selectedNotes.content || editedNote.title !== selectedNotes.title) {
			toastRef.current = toast('Note has been modified', {
				position: toast.POSITION.BOTTOM_LEFT,
				type: toast.TYPE.INFO,
				toastId: 'editedNote',
				autoClose: false,
			});
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editedNote, selectedNotes, isEditMode]);

	useEffect(() => {
		window.addEventListener('keydown', (e) => {
			if (e.key.toLowerCase() === 'k' && e.ctrlKey) {
				searchRef.current.focus();
			}
		});

		return () => {
			window.removeEventListener('keydown', () => {});
		};
	}, []);

	if (categoriesLoading) {
		return <Loading />;
	}

	return (
		<div
			className='w-screen h-screen bg-light dark:bg-dark relative grid place-items-center'
			onClick={() => {
				setIsDropdownOpen(false);
			}}
		>
			<div className='w-screen h-screen max-w-[1920px] mx-auto shadow-xl shadow-notokake-darker/10 dark:shadow-notokake-darker/75 grid grid-cols-12 grid-rows-12 text-notokake-darker dark:text-notokake-lighter transition fixed'>
				{/* 
          Navbar
        */}
				<NavbarDesktop
					dropDownState={{ state: isDropdownOpen, setState: setIsDropdownOpen }}
					userSettingsState={{ state: isUserSettingsOpen, setState: setIsUserSettingsOpen }}
				/>

				{/* 
          Categories
        */}
				<div className='col-span-2 h-full row-[span_11_/_span_11] bg-notokake-light/25 dark:bg-notokake-dark/25 overflow-y-hidden border-r border-r-notokake-darker/50 dark:border-r-notokake-light/50 flex flex-col justify-between backdrop-blur-sm'>
					<div className='h-full overflow-y-auto py-2'>
						{pinnedCategory.length ? (
							<>
								<span className='font-bold text-notokake-dark dark:text-notokake-light flex items-center gap-4 px-4 my-2'>
									<VscPinned /> Pinned Category
								</span>
								<ul className='py-2'>
									{pinnedCategory?.map((item) => (
										<CategoryItem
											data={item}
											key={item.uuid}
											selectedState={selectedCategory}
											onClick={() => {
												navigate(`/app/${item.uuid}`);
											}}
										/>
									))}
								</ul>

								<div className='w-3/4 h-[1px] bg-notokake-dark/50 dark:bg-notokake-light/50 rounded-full my-2 mx-auto' />
							</>
						) : (
							<></>
						)}

						<form className='w-full flex justify-between gap-2 items-center px-4' onSubmit={submitCategoryHandler}>
							<Input
								properties={{ name: 'addCategory', type: 'text', placeholder: 'New Category' }}
								className='w-full px-4'
								value={inputNewCategory}
								onChange={(e) => {
									setInputNewCategory(e.target.value);
								}}
							/>
							<button
								type='submit'
								className='aspect-square h-6 w-6 p-0 m-0 grid place-items-center rounded-full hover:bg-notokake-dark dark:hover:bg-notokake-light text-notokake-darker dark:text-notokake-lighter hover:text-notokake-lighter dark:hover:text-notokake-darker cursor-pointer'
							>
								<VscAdd size={16} />
							</button>
						</form>

						<ul>
							{Object.keys(categoriesData.category).length ? (
								<>
									{categoriesData?.category.map((item) => (
										<CategoryItem
											key={item.uuid}
											data={item}
											selectedState={selectedCategory}
											onClick={() => {
												navigate(`/app/${item.uuid}`);
											}}
										/>
									))}
								</>
							) : (
								<li className='flex items-center gap-4 w-full'>
									<span className='text-notokake-dark dark:text-notokake-light flex items-center gap-4 justify-center w-full my-2'>
										No categories
									</span>
								</li>
							)}
						</ul>
					</div>
				</div>

				{/* 
          Notes
        */}
				<div className='col-span-2 row-[span_11_/_span_11] bg-notokake-light/80 dark:bg-notokake-dark/80 border-r border-r-notokake-darker/50 dark:border-r-notokake-light/50 overflow-y-auto'>
					{/* Search */}
					<div className='w-full px-4 relative flex items-center justify-center'>
						<Input
							properties={{ name: 'inputSearch', type: 'text', placeholder: 'Search Notes', icon: VscSearch }}
							onChange={searchHandler}
							reference={searchRef}
							autoComplete={'off'}
							className='pr-20'
						/>
						<div className='absolute right-8 text-sm'>
							<kbd>Ctrl</kbd> + <kbd>k</kbd>
						</div>
					</div>

					<div className='w-3/4 h-[1px] bg-notokake-dark/50 dark:bg-notokake-light/50 rounded-full my-2 mx-auto' />

					{/* New note button */}
					<button
						className='w-full m-0 p-0 rounded-none py-2 flex items-center justify-center gap-2 hover:bg-notokake-accent/25 text-notokake-darker dark:text-notokake-light'
						onClick={() => {
							toastRef.current = toast('Working...', {
								type: toast.TYPE.INFO,
								autoClose: false,
							});
							createNote();
						}}
					>
						New note <VscAdd />
					</button>

					{/* Is searching? */}
					{isSearching ? (
						<div className='w-full'>
							{searchResult.length && !searchLoading ? (
								<ul>
									{searchResult?.map((item) => (
										<NoteItem key={item.uuid} urlParams={{ categoryUUID: categoryUUID, notesUUID: notesUUID }} data={item} />
									))}
								</ul>
							) : searchLoading ? (
								<div className='flex items-center justify-center py-2'>
									<ReactLoading type='spin' color={darkMode ? '#fff' : '#192530'} height={24} width={24} />
								</div>
							) : (
								<div className='flex items-center justify-center py-2 text-notokake-darker dark:text-notokake-light'>
									No note found.
								</div>
							)}
						</div>
					) : (
						<div className='w-full'>
							{notesData?.notes.length && !notesLoading ? (
								<ul>
									{notesData?.notes.map((item) => (
										<NoteItem key={item.uuid} urlParams={{ categoryUUID: categoryUUID, notesUUID: notesUUID }} data={item} />
									))}
								</ul>
							) : notesLoading ? (
								<div className='flex items-center justify-center py-2'>
									<ReactLoading type='spin' color={darkMode ? '#fff' : '#192530'} height={24} width={24} />
								</div>
							) : (
								<div className='flex items-center justify-center py-2 text-notokake-darker dark:text-notokake-light'>
									This category is empty.
								</div>
							)}
						</div>
					)}
				</div>

				{/* 
          Content
         */}
				<div className='col-span-8 row-[span_11_/_span_11] flex justify-center items-center w-full h-full flex-wrap'>
					{/* 
            Check if there any selected note and loaded, show it.
            If there are selected note and not loaded, show loading.
            If there are no selected note, show empty.
          */}
					{selectedNotes && !isNotesLoading ? (
						<>
							<NoteHead
								dataNote={selectedNotes}
								editState={{ state: isEditMode, setState: setIsEditMode }}
								draftState={{ state: editedNote, setState: setEditedNote }}
								listCategory={categoriesData}
							/>

							<div className='h-5/6 w-full flex overflow-hidden relative z-0'>
								{/* Editor */}
								<div
									className={`h-full w-1/2 absolute z-10 ${
										isEditMode ? 'left-0' : '-left-1/2'
									} overflow-y-auto markdown-body bg-notokake-lighter dark:bg-notokake-darker text-notokake-darker dark:text-notokake-lighter duration-300`}
									ref={editor}
								>
									<CodeMirror
										value={editedNote?.content}
										extensions={[
											markdown({ base: markdownLanguage, codeLanguages: languages, addKeymap: true }),
											keymap.of([...defaultKeymap, ...historyKeymap, ...markdownKeymap]),
											syntaxHighlighting(syntaxHighlight),
											editorTheme(),
										]}
										theme={darkMode ? oneDark : oneLight}
										onChange={(e) => {
											// setSelectedNotes({ ...selectedNotes, content: e });
											setEditedNote({ ...editedNote, content: e });
										}}
									/>
								</div>

								{/* Preview */}
								<div
									className={`h-full absolute z-10 ${
										isEditMode ? 'w-1/2 left-1/2' : 'w-full left-0'
									} px-4 py-2 overflow-y-auto markdown-body bg-notokake-lighter dark:bg-notokake-darker text-notokake-darker dark:text-notokake-lighter duration-300`}
									ref={preview}
									onScroll={(e) => {
										if (editor && editor.current) {
											editor.current.scrollTop = e.target.scrollTop;
										}
									}}
								>
									<ReactMarkdown
										children={editedNote?.content}
										rehypePlugins={[rehypePrismPlus, rehypeRaw, rehypeKatex]}
										remarkPlugins={[remarkGfm, remarkBreaks, remarkToc, remarkMath, remarkSlug]}
									/>
								</div>
							</div>
						</>
					) : selectedNotes ? (
						<div className='col-span-full row-span-full bg-notokake-lighter dark:bg-notokake-darker place-items-center w-full h-full flex items-center justify-center flex-col'>
							<ReactLoading type='spin' width={32} height={32} color={darkMode ? '#fff' : '#192530'} />
							<span className='italic'>Fetching notes...</span>
						</div>
					) : (
						<div className='col-span-full row-span-full bg-notokake-lighter dark:bg-notokake-darker place-items-center w-full h-full flex items-center justify-center flex-col'>
							<span className='italic text-lg'>No note selected.</span>
						</div>
					)}
				</div>
			</div>

			<Modal state={{ state: isUserSettingsOpen, setState: setIsUserSettingsOpen }}>
				<div className='flex justify-between items-center'>
					<h1 className='text-notokake-darker dark:text-notokake-lighter font-bold text-2xl'>User Settings</h1>
					<button
						className='text-notokake-darker dark:text-notokake-lighter hover:bg-notokake-dark/20 dark:hover:bg-notokake-light/20 rounded-full p-2'
						onClick={() => {
							setIsUserSettingsOpen(false);
						}}
					>
						<AiOutlineClose size={16} />
					</button>
				</div>
				<hr />
				{/* User Profile */}
				<div className='flex flex-col my-4 px-8'>
					{/* Title */}
					<div className='flex justify-between items-center'>
						<h2 className='text-notokake-darker dark:text-notokake-lighter font-bold text-xl'>User Profile</h2>
					</div>

					<div className='flex gap-16 justify-start items-center w-full px-8 my-2'>
						{/* Avatar */}
						<div
							className='w-64 h-64 relative flex aspect-square group cursor-pointer rounded-full'
							onClick={() => {
								avatarInputRef.current.click();
							}}
						>
							<div className='w-full h-full absolute grid place-items-center z-10 opacity-0 group-hover:opacity-100 bg-zinc-900/50 rounded-full text-notokake-lighter'>
								<AiFillCamera size={48} />
							</div>
							<input
								type='file'
								className='absolute opacity-0 pointer-events-none'
								onChange={async (e) => {
									const MEGABYTES = 1024 * 1024;
									const SIZE_LIMIT = 1 * MEGABYTES;
									const file = e.target.files[0];

									if (file.size > SIZE_LIMIT) {
										toastRef.current = toast.error(`File size too large.\nMax size is ${SIZE_LIMIT / MEGABYTES}MB`, {
											autoClose: 2500,
										});
										return;
									}

									let b64 = await toBase64(file);
									toastRef.current = toast('Uploading avatar...', {
										type: toast.TYPE.INFO,
										autoClose: false,
									});
									userUpdateAvatar({ variables: { avatar: b64 } });
								}}
								ref={avatarInputRef}
							/>
							{userData?.avatar ? (
								<img src={userData?.avatar} alt='User Avatar' className='rounded-full h-full w-full absolute object-cover' />
							) : (
								<Avatar
									name={userData.full_name}
									size={'256px'}
									round={true}
									className='w-32 h-32 rounded-full bg-notokake-darker object-cover object-top absolute'
								/>
							)}
						</div>

						{/* Data */}
						<div className='flex flex-col justify-start items-start w-full gap-2'>
							{/* Name Data */}
							<div className='flex justify-between items-center gap-8'>
								<div className='flex flex-col justify-start items-start'>
									<span className='text-xs'>Full name</span>
									{/* <span className='text-lg'>{userData?.full_name}</span> */}
									<Input
										properties={{ name: 'full_name', type: 'text', placeholder: 'Full Name' }}
										className='px-4 cursor-not-allowed'
										value={userData?.full_name}
										disabled={true}
										onChange={() => {}}
									/>
								</div>
								<div className='flex flex-col justify-start items-start'>
									<span className='text-xs'>Email</span>
									<Input
										properties={{ name: 'email', type: 'text', placeholder: 'Email' }}
										className='px-4 cursor-not-allowed'
										value={userData?.email}
										disabled={true}
										onChange={() => {}}
									/>
								</div>
							</div>
							{/* Change password */}
							<span className='font-bold text-lg'>Change password</span>
							<form
								className='flex flex-col justify-start items-start w-full'
								onSubmit={(e) => {
									const PASSWORD_SALT = genSaltSync(10);

									e.preventDefault();
									let currentPasswordHash = decrypt(userData.token).split(':')[1];
									let comparePassword = compareSync(currentPassword, currentPasswordHash);
									console.log(currentPasswordHash);
									if (!comparePassword) {
										toastRef.current = toast.error('Current password incorrect.', {
											autoClose: 2500,
										});
										setPasswordError({ ...passwordError, current: true });
										return;
									}
									if (newPassword !== confirmPassword) {
										toastRef.current = toast.error("New password doesn't match.", {
											autoClose: 2500,
										});
										setPasswordError({ ...passwordError, new: true, confirm: true });
										return;
									}

									const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,64}$/;
									if (!PASSWORD_REGEX.test(newPassword) || !PASSWORD_REGEX.test(confirmPassword)) {
										toastRef.current = toast.error(
											'Password must be at least 8 characters long and contain at least one number, one uppercase letter and one lowercase letter.',
											{
												autoClose: 2500,
											},
										);
										setPasswordError({ ...passwordError, new: true, confirm: true });
										return;
									}

									toastRef.current = toast('Updating password...', {
										type: toast.TYPE.INFO,
										autoClose: false,
									});
									let newPass = hashSync(newPassword, PASSWORD_SALT);
									userUpdatePassword({ variables: { password: newPass } });
								}}
							>
								<div className='flex justify-between items-center gap-8'>
									<div className='flex flex-col justify-start items-start'>
										<span className='text-xs'>Old password</span>
										<Input
											properties={{ name: 'currentPassword', type: 'password', placeholder: 'Current password' }}
											className={`px-4 ${passwordError.current && 'error'}`}
											onChange={(e) => {
												setPasswordError({ ...passwordError, current: false });
												setCurrentPassword(e.currentTarget.value);
											}}
											value={currentPassword}
										/>
									</div>
								</div>
								<div className='flex justify-between items-center gap-8'>
									<div className='flex flex-col justify-start items-start'>
										<span className='text-xs'>New password</span>
										<Input
											properties={{ name: 'newPassword', type: 'password', placeholder: 'New password' }}
											className={`px-4 ${passwordError.new && 'error'}`}
											onChange={(e) => {
												setPasswordError({ ...passwordError, new: false });
												setNewPassword(e.currentTarget.value);
											}}
											value={newPassword}
										/>
									</div>
									<div className='flex flex-col justify-start items-start'>
										<span className='text-xs'>Confirm password</span>
										<Input
											properties={{ name: 'confirmPassword', type: 'password', placeholder: 'Confirm password' }}
											className={`px-4 ${passwordError.confirm && 'error'}`}
											onChange={(e) => {
												setPasswordError({ ...passwordError, confirm: false });
												setConfirmPassword(e.currentTarget.value);
											}}
											value={confirmPassword}
										/>
									</div>
								</div>
								<Button size='sm' isLoading={false} disabled={false} className='my-0 py-0' type='submit'>
									Change password
								</Button>
							</form>
						</div>
					</div>
				</div>
				<hr />
				{/* App settings */}
				<div className='flex flex-col my-4 px-8'>
					{/* Title */}
					<div className='flex justify-between items-center'>
						<h2 className='text-notokake-darker dark:text-notokake-lighter font-bold text-xl'>Application Settings</h2>
					</div>

					{/* Theme */}
					<div className='flex flex-col justify-between items-center my-4 px-4'>
						<div className='flex justify-between items-center w-full gap-2 text-lg'>
							<span>Theme</span>
							<select
								className='w-fit pr-10 my-0'
								onChange={(e) => {
									dispatch(setTheme(e.target.value));
								}}
								value={darkMode ? 'dark' : 'light'}
							>
								<option value='light'>Light</option>
								<option value='dark'>Dark</option>
							</select>
						</div>

						<div className='flex justify-between items-center w-full gap-2 text-lg'>
							<span>Default Category</span>
							<select
								className='w-fit pr-10 my-0'
								onChange={(e) => {
									toastRef.current = toast('Saving...', {
										type: toast.TYPE.INFO,
										autoClose: false,
									});
									userUpdateSettings({ variables: { settings: { defaultCategory: e.target.value } } });
								}}
								value={
									userSettings?.defaultCategory
										? userSettings.defaultCategory
										: categoriesData?.category.length
										? categoriesData.category[0].uuid
										: ''
								}
							>
								<option value=''>Select default category</option>
								{categoriesData?.category.map((category) => (
									<option value={category.uuid} key={category.uuid}>
										{category.name}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default Application;
