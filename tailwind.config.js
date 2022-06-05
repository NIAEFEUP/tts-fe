const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#204057',
        darkish: '#333640',
        dark: '#252832',
        darker: '#1e2028',
        darkest: '#1a1c23',
        lightish: '#ebedf0',
        light: '#f2f4f7',
        lighter: '#f7f7f7',
        lightest: '#fbfbfb',
        primary: '#b33636',
        secondary: '#0C4A6E',
        tertiary: '#115E59',
        feup: '#7D221E',
        labs: '#4F2E2E',
        practical: '#69656A',
        theoretical: '#A8A199',
      },
      spacing: {
        '1/6': '16.6666666667%',
        '5/6': '83.3333333333%',
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
