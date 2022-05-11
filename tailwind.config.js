const defaultTheme = require('tailwindcss/defaultTheme');
const svgToDataUri = require('mini-svg-data-uri');

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
				'select-light': `url("${svgToDataUri(
					`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 8l4 4 4-4"/></svg>`,
				)}")`,
				'select-dark': `url("${svgToDataUri(
					`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="#192530" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 8l4 4 4-4"/></svg>`,
				)}")`,
			},
		},
	},
	plugins: [require('@tailwindcss/line-clamp')],
};
