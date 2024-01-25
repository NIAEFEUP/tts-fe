const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  darkMode : 'class',
  content : ['./src/**/*.{js,jsx,ts,tsx}', './src/styles/safelist.txt'],
  theme : {
    extend : {
      colors : {
        ...colors,
        navy : '#18222e',
        lightNavy : '#212a36',
        darkish : '#333640',
        dark : '#252832',
        darker : '#1e2028',
        darkest : '#1a1c23',
        lightish : '#ebedf0',
        light : '#f2f4f7',
        lighter : '#f7f7f7',
        lightest : '#fbfbfb',
        primary : '#b33636',
        secondary : '#0C4A6E',
        tertiary : '#357672',
        feup : '#7D221E',
        schedule : {
          lunch : '#BE123C',
          t : '#91897F',
          tp : '#115E59',
          pl : '#003d7a',
          ot : '#5c8fc2',
          s : '#7d3179',
          p : '#b66046',
          tc : '#733C3C',
          o : '#69656A',
        },
      },
      spacing : {
        '1/6' : '16.6666666667%',
        '5/6' : '83.3333333333%',
      },
      flex : {
        end : '0 1 auto',
      },
      minHeight : {
        'half-screen' : '50vh',
      },
      maxWidth : {
        '8xl' : '88rem',
        '9xl' : '96rem',
      },
      gridTemplateRows : {
        7 : 'repeat(7, minmax(0, 1fr))',
        8 : 'repeat(8, minmax(0, 1fr))',
      },
      fontSize : {
        xxs : '0.6rem',
      },
      fontFamily : {
        flow : 'Flow',
        prose : ['Inter', ...defaultTheme.fontFamily.sans],
        headings : ['Montserrat', ...defaultTheme.fontFamily.sans],
        mono : ['Fira Code', ...defaultTheme.fontFamily.mono],
      },
      boxShadow : {
        'inner-xl' : 'inset 0px 0px 4px 4px rgb(0 0 0 / 0.1)',
      },
      keyframes : {
        wiggle : {
          '0%' : {transform : 'rotate(-0.5deg)'},
          '25%' : {transform : 'rotate(0.5deg)'},
          '50%' : {transform : 'rotate(-0.5deg)'},
          '75%' : {transform : 'rotate(0.5deg)'},
          '100%' : {transform : 'rotate(0)'},
        },
        fade : {
          '0%' : {opacity : '100%'},
          '25%' : {opacity : '50%'},
          '50%' : {opacity : '10%'},
          '75%' : {opacity : '50%'},
          '100%' : {opacity : '100%'},
        },
        'accordion-down' : {
          from : {height : '0'},
          to : {height : 'var(--radix-accordion-content-height)'},
        },
        'accordion-up' : {
          from : {height : 'var(--radix-accordion-content-height)'},
          to : {height : '0'},
        },
      },
      animation : {
        'accordion-down' : 'accordion-down 0.2s ease-out',
        'accordion-up' : 'accordion-up 0.2s ease-out',
        fade : 'fade 1000ms ease-in-out infinite',
        wiggle : 'wiggle 700ms ease-in-out',
        'wiggle-infinity' : 'wiggle 700ms infinite ease-in-out',
      },
      backgroundSize : {
        'size-200' : '200% 200%',
      },
      backgroundPosition : {
        'pos-0' : '0% 0%',
        'pos-100' : '100% 100%',
      },
    },
    container : {
      center : true,
      padding : '2rem',
      screens : {
        '2xl' : '1400px',
      },
    },
  },
  plugins : [require('tailwindcss-animate'), require('@tailwindcss/forms')],
}
