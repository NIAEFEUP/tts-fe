const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        darkish: '#333640',
        dark: '#252832',
        darker: '#1e2028',
        darkest: '#1a1c23',
        lightish: '#ebedf0',
        light: '#f2f4f7',
        lighter: '#f7f7f7',
        lightest: '#fbfbfb',
        primary: '#b33636',
        secondary: '#893632',
        tertiary: '#C1D2D6',
        feup: '#893632', // 7D221E
        labs: '#4F2E2E',
        pratical: '#69656A',
        theoretical: '#A8A199',
        'primary-light': '#BF6060',
        'secondary-light': '#9E5956',
        'tertiary-light': '#C1D2D6',
        'feup-dark': '#ECC2C1',
        'feup-light': '#9E5956',
        'labs-light': '#725757',
        'pratical-light': '#868387',
        'theoretical-light': '#B9B3AD',
      },
      flex: {
        end: '0 1 auto',
      },
      minHeight: {
        'half-screen': '50vh',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      fontSize: {
        xxs: '0.6rem',
      },
      fontFamily: {
        flow: 'Flow',
        prose: ['Inter', ...defaultTheme.fontFamily.sans],
        headings: ['Inter', ...defaultTheme.fontFamily.sans],
        mono: ['Fira Code', ...defaultTheme.fontFamily.mono],
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(0.5deg)' },
          '50%': { transform: 'rotate(-0.5deg)' },
        },
      },
      animation: {
        wiggle: 'wiggle 400ms ease-in-out',
      },
      backgroundSize: {
        'size-200': '200% 200%',
      },
      backgroundPosition: {
        'pos-0': '0% 0%',
        'pos-100': '100% 100%',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
