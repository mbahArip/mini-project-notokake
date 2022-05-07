import { useEffect, useState, useRef } from 'react';

// Redux
import { useSelector } from 'react-redux';

// GraphQl
import { useQuery, useMutation } from '@apollo/client';
import { GET_CATEGORIES } from '../../graphql/Category/query';
import { CREATE_CATEGORY } from '../../graphql/Category/mutation';

// Component
import { NavbarDesktop } from '../../components/Application/Navbar';
import CategoryItem from '../../components/Application/CategoryItem';
import Loading from '../../components/Loading';
import { toast } from 'react-toastify';
import { VscPinned, VscAdd } from 'react-icons/vsc';
import Input from '../../components/Input';

const Application = () => {
	const userData = useSelector((state) => state.userData);
	const { user_settings: userSettings } = useSelector((state) => state.userData);
	const categoryToast = useRef(null);

	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [pinnedCategory, setPinnedCategory] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [inputNewCategory, setInputNewCategory] = useState('');

	const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_CATEGORIES, {
		variables: {
			username: userData.username,
		},
		onCompleted: (data) => {
			if (Object.keys(userSettings).length && userSettings.defaultCategory) {
				setSelectedCategory(userSettings.defaultCategory);
			} else if (data && Object.keys(data.category).length) {
				setSelectedCategory(data.category[0].uuid);
			}
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

	const submitCategoryHandler = (e) => {
		e.preventDefault();
		categoryToast.current = toast('Creating new category...', {
			autoClose: false,
		});
		createCategory({ variables: { name: inputNewCategory } });
	};

	useEffect(() => {
		if (categoriesData && !categoriesLoading) {
			let filteredData = categoriesData.category.filter((category) => category.pinned);
			setPinnedCategory([...filteredData]);
		}
	}, [setPinnedCategory, categoriesData, categoriesLoading]);

	if (categoriesLoading) {
		return <Loading />;
	}

	return (
		<div
			className='w-screen h-screen bg-light dark:bg-dark'
			onClick={() => {
				setIsDropdownOpen(false);
			}}
		>
			<div className='w-screen h-screen max-w-[1920px] mx-auto shadow-xl shadow-notokake-darker/10 dark:shadow-notokake-darker/75 grid grid-cols-12 grid-rows-12 text-notokake-darker dark:text-notokake-lighter transition'>
				{/* 
          Navbar
        */}
				<NavbarDesktop state={isDropdownOpen} setState={setIsDropdownOpen} />

				{/* 
          Categories
        */}
				<div className='col-span-2 h-full row-[span_11_/_span_11] bg-notokake-light/25 dark:bg-notokake-dark/25 overflow-y-hidden border-r border-r-notokake-darker/50 dark:border-r-notokake-light/50 flex flex-col justify-between backdrop-blur-sm'>
					<div className='h-full max-h-[95%] overflow-y-auto py-2'>
						<span className='font-bold text-notokake-dark dark:text-notokake-light flex items-center gap-4 px-4 my-2'>
							<VscPinned /> Pinned Category
						</span>
						<ul>
							{pinnedCategory.length ? (
								<>
									{pinnedCategory?.map((item) => (
										<CategoryItem
											data={item}
											key={item.uuid}
											selectedState={selectedCategory}
											onClick={() => {
												setSelectedCategory(item.uuid);
											}}
										/>
									))}
								</>
							) : (
								<li className='flex items-center gap-4 w-full'>
									<span className='text-notokake-dark dark:text-notokake-light flex items-center gap-4 justify-center w-full my-2'>
										No pinned category
									</span>
								</li>
							)}
						</ul>

						<div className='w-full h-[1px] bg-notokake-dark/50 dark:bg-notokake-light/50 rounded-full my-4' />

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
												setSelectedCategory(item.uuid);
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
				<div className='col-span-2 row-[span_11_/_span_11] bg-notokake-light/80 dark:bg-notokake-dark/80 p-4 overflow-y-auto border-r border-r-notokake-darker/50 dark:border-r-notokake-light/50'>
					Notes
				</div>

				{/* 
          Content
         */}
				<div className='col-span-8 row-[span_11_/_span_11] bg-notokake-lighter dark:bg-notokake-darker p-8 overflow-y-auto'></div>
			</div>
		</div>
	);
};

export default Application;
