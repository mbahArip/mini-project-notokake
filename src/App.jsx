import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Redux
import { useSelector } from 'react-redux';

// Library
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Register from './pages/Register';
import Login from './pages/Login';
import ProtectedRoutes from './components/ProtectedRoutes';
import Application from './pages/Application';
import NotFound from './pages/NotFound';

function App() {
	// Set Dark Theme
	const htmlRoot = window.document.documentElement;
	const theme = useSelector((state) => state.theme);
	if (theme.darkMode) {
		htmlRoot.classList.add('dark');
	} else {
		htmlRoot.classList.remove('dark');
	}

	return (
		<div className='overflow-x-hidden'>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<Login />} />
					<Route path='/login' element={<Login />} />
					<Route path='/register' element={<Register />} />
					<Route
						path='/app'
						element={
							<ProtectedRoutes>
								<Application />
							</ProtectedRoutes>
						}
					/>
					<Route
						path='/app/:categoryUUID'
						element={
							<ProtectedRoutes>
								<Application />
							</ProtectedRoutes>
						}
					/>
					<Route
						path='/app/:categoryUUID/:notesUUID'
						element={
							<ProtectedRoutes>
								<Application />
							</ProtectedRoutes>
						}
					/>
					<Route path='*' element={<NotFound />} />
				</Routes>
			</BrowserRouter>
			<ToastContainer
				position='bottom-center'
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss={false}
				draggable
				pauseOnHover={false}
				theme={theme.darkMode ? 'dark' : 'light'}
			/>
		</div>
	);
}

export default App;
