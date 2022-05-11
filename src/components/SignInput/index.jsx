import { Fragment } from 'react';
import Input from '../Input';

const SignInput = ({ inputs, inputChangeHandler }) => {
	return (
		<>
			{inputs?.map((input, inputIdx) => (
				<Fragment key={inputIdx}>
					<div className='flex justify-end items-end -my-1' key={inputIdx}>
						<span className='text-red-500 text-xs italic'>{input.error || '‎'}</span>
					</div>
					<Input
						properties={input}
						autoComplete={input.autoComplete}
						onChange={inputChangeHandler}
						className={`${input.error ? 'error' : ''} w-full`}
					/>
				</Fragment>
			))}
		</>
	);
};

export default SignInput;
