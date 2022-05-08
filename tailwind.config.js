const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			gridTemplateRows: {
				12: 'repeat(12, minmax(0,1fr))',
			},
			screens: {
				xs: '320px',
				...defaultTheme.screens,
			},
			width: {
				mobile: '22rem',
				desktop: '32rem',
			},
			colors: {
				notokake: {
					lighter: '#fff',
					light: '#eef3f4',
					dark: '#2b3e50',
					darker: '#192530',
					accent: '#e84c3c',
					'accent-lighter': '#ff6041',
					'accent-darker': '#b43b2e',
					accent2: '#3497d3',
					'accent2-lighter': '#3eb6ff',
					'accent2-darker': '#1e72a0',
				},
			},
			fontFamily: {
				sans: ['Ubuntu', ...defaultTheme.fontFamily.sans],
				roboto: ['Roboto Condensed'],
				mono: ['Ubuntu Mono', ...defaultTheme.fontFamily.mono],
			},
			backgroundImage: {
				dark: 'url("./assets/background/bg-dark.png")',
				light: 'url("./assets/background/bg-light.png")',
			},
		},
	},
	plugins: [require('@tailwindcss/line-clamp')],
};
