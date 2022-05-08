import { useEffect, useState, useRef, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Redux
import { useSelector } from 'react-redux';

// GraphQl
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { GET_CATEGORIES } from '../../graphql/Category/query';
import { CREATE_CATEGORY } from '../../graphql/Category/mutation';
import { GET_NOTES } from '../../graphql/Note/query';
import { UPDATE_CONTENT } from '../../graphql/Note/mutation';

// Component
import { NavbarDesktop } from '../../components/Application/Navbar';
import CategoryItem from '../../components/Application/CategoryItem';
import NoteItem from '../../components/Application/NoteItem';
import Loading from '../../components/Loading';
import { toast } from 'react-toastify';
import { VscPinned, VscAdd, VscSearch } from 'react-icons/vsc';
import Input from '../../components/Input';
import ReactLoading from 'react-loading';

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

const Application = () => {
	const { categoryUUID, notesUUID } = useParams();
	const navigate = useNavigate();
	const { darkMode } = useSelector((state) => state.theme);
	const userData = useSelector((state) => state.userData);
	const { user_settings: userSettings } = useSelector((state) => state.userData);
	const categoryToast = useRef(null);

	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const [pinnedCategory, setPinnedCategory] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [inputNewCategory, setInputNewCategory] = useState('');
	const [selectedNotes, setSelectedNotes] = useState(null);

	const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_CATEGORIES, {
		variables: {
			username: userData.username,
		},
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

	const [getNotes, { data: notesData, loading: notesLoading }] = useLazyQuery(GET_NOTES);
	const [updateContent] = useMutation(UPDATE_CONTENT, {
		fetchPolicy: 'no-cache',
		refetchQueries: [GET_NOTES],
		awaitRefetchQueries: true,
		variables: {
			noteID: notesUUID,
		},
		onCompleted: () => {
			toast.update(categoryToast.current, {
				type: toast.TYPE.SUCCESS,
				render: 'Note updated',
				autoClose: 1000,
			});
		},
	});

	const submitCategoryHandler = (e) => {
		e.preventDefault();
		categoryToast.current = toast('Creating new category...', {
			autoClose: false,
		});
		createCategory({ variables: { name: inputNewCategory } });
	};

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

	useEffect(() => {
		if (categoriesData && !categoriesLoading) {
			let filteredData = categoriesData.category.filter((category) => category.pinned);
			setPinnedCategory([...filteredData]);
		}
	}, [setPinnedCategory, categoriesData, categoriesLoading]);

	useEffect(() => {
		getNotes({ variables: { catID: categoryUUID } });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [categoryUUID]);
	useEffect(() => {
		if (notesData && !notesLoading) {
			let selectedNotesUUID = notesData.notes.filter((note) => note.uuid === notesUUID);
			if (selectedNotesUUID.length) {
				setSelectedNotes(selectedNotesUUID[0]);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [notesUUID, notesData, notesLoading]);

	if (categoriesLoading) {
		return <Loading />;
	}

	return (
		<div
			className='w-screen h-screen bg-light dark:bg-dark relative'
			onClick={() => {
				setIsDropdownOpen(false);
			}}
		>
			<div className='w-screen h-screen max-w-[1920px] mx-auto shadow-xl shadow-notokake-darker/10 dark:shadow-notokake-darker/75 grid grid-cols-12 grid-rows-12 text-notokake-darker dark:text-notokake-lighter transition fixed'>
				{/* 
          Navbar
        */}
				<NavbarDesktop state={isDropdownOpen} setState={setIsDropdownOpen} />

				{/* 
          Categories
        */}
				<div className='col-span-2 h-full row-[span_11_/_span_11] bg-notokake-light/25 dark:bg-notokake-dark/25 overflow-y-hidden border-r border-r-notokake-darker/50 dark:border-r-notokake-light/50 flex flex-col justify-between backdrop-blur-sm'>
					<div className='h-full max-h-[95%] overflow-y-auto py-2'>
						{pinnedCategory.length ? (
							<>
								<span className='font-bold text-notokake-dark dark:text-notokake-light flex items-center gap-4 px-4 my-2'>
									<VscPinned /> Pinned Category
								</span>
								<ul>
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

								<div className='w-full h-[1px] bg-notokake-dark/50 dark:bg-notokake-light/50 rounded-full my-4' />
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
					<div className='w-full py-4 px-4'>
						<Input properties={{ name: 'inputSearch', type: 'text', placeholder: 'Search Notes', icon: VscSearch }} />
					</div>
					<div className='w-full h-[1px] bg-notokake-dark/50 dark:bg-notokake-light/50 rounded-full' />

					<div className='w-full py-2'>
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
				</div>

				{/* 
          Content
         */}
				<div className='col-span-8 row-[span_11_/_span_11] bg-notokake-lighter dark:bg-notokake-darker text-notokake-darker dark:text-notokake-lighter p-8 overflow-y-auto markdown-body'>
					<ReactMarkdown
						children={selectedNotes?.content}
						rehypePlugins={[rehypePrismPlus, rehypeRaw, rehypeKatex]}
						remarkPlugins={[remarkGfm, remarkBreaks, remarkToc, remarkMath, remarkSlug]}
					/>
					<button
						onClick={() => {
							categoryToast.current = toast('Saving...', {
								type: 'info',
								autoClose: false,
								closeButton: false,
								pauseOnHover: false,
								pauseOnFocusLoss: false,
								closeOnClick: false,
								draggable: false,
								progress: undefined,
							});
							let ct = `# A demo of \`react-markdown\`

\`react-markdown\` is a markdown component for React.

👉 Changes are re-rendered as you type.

👈 Try writing some markdown on the left.
<kbd>Ctrl</kbd> + <kbd>Enter</kbd> to save.

## Overview

* Follows [CommonMark](https://commonmark.org)
* Optionally follows [GitHub Flavored Markdown](https://github.github.com/gfm/)
* Renders actual React elements instead of using \`dangerouslySetInnerHTML\`
* Lets you define your own components (to render \`MyHeading\` instead of \`h1\`)
* Has a lot of plugins

## Table of contents

Here is an example of a plugin in action ([\`remark-toc\`](https://github.com/remarkjs/remark-toc)).
This section is replaced by an actual table of contents.

## Syntax highlighting

Here is an example of a plugin to highlight code:
[\`rehype-highlight\`](https://github.com/rehypejs/rehype-highlight).

\`\`\`js
import React from 'react'
import ReactDOM from 'react-dom'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'

ReactDOM.render(
  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{'# Your markdown here'}</ReactMarkdown>,
  document.querySelector('#content')
)
\`\`\`

Pretty neat, eh?

## GitHub flavored markdown (GFM)

For GFM, you can *also* use a plugin: [\`remark-gfm\`](https://github.com/remarkjs/react-markdown#use).
It adds support for GitHub-specific extensions to the language: tables, strikethrough, tasklists, and literal URLs.

These features **do not work by default**.
👆 Use the toggle above to add the plugin.

| Feature    | Support              |
| ---------: | :------------------- |
| CommonMark | 100%                 |
| GFM        | 100% w/ \`remark-gfm\` |

~~strikethrough~~

* [ ] task list
* [x] checked item

https://example.com

## HTML in markdown

⚠️ HTML in markdown is quite unsafe, but if you want to support it, you can use [\`rehype-raw\`](https://github.com/rehypejs/rehype-raw).
You should probably combine it with [\`rehype-sanitize\`](https://github.com/rehypejs/rehype-sanitize).

<blockquote>
  👆 Use the toggle above to add the plugin.
</blockquote>
> Test

## Components

You can pass components to change things:

\`\`\`js
import React from 'react'
import ReactDOM from 'react-dom'
import ReactMarkdown from 'react-markdown'
import MyFancyRule from './components/my-fancy-rule.js'

ReactDOM.render(
  <ReactMarkdown
    components={{
      // Use h2s instead of h1s
      h1: 'h2',
      // Use a component instead of hrs
      hr: ({node, ...props}) => <MyFancyRule {...props} />
    }}
  >
    # Your markdown here
  </ReactMarkdown>,
  document.querySelector('#content')
)
\`\`\`

## Math test

Testing some math using KaTex
The lift coefficient ($C_L$) is a dimensionless coefficient.
$L = \\frac{1}{2} \\rho v^2 S C_L$
$f(x)=3+\\sqrt{2-4x}$

## More info?

Much more info is available in the
[readme on GitHub](https://github.com/remarkjs/react-markdown)!

***

A component by [Espen Hovlandsdal](https://espen.codes/)`;
							updateContent({ variables: { content: ct } });
						}}
					>
						Add
					</button>
				</div>
			</div>
		</div>
	);
};

export default Application;
