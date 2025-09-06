/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'caveat': ['Caveat', 'cursive'],
      },
      colors: {
        primary: {
          DEFAULT: '#714B67',
          50: '#F5F2F4',
          100: '#EBE5E9',
          200: '#D7CCD3',
          300: '#C3B2BD',
          400: '#AF99A7',
          500: '#714B67',
          600: '#5D3E55',
          700: '#493043',
          800: '#352331',
          900: '#21151F'
        },
        secondary: {
          DEFAULT: '#875A7B',
          50: '#F6F3F5',
          100: '#EDE7EB',
          200: '#DBCFD7',
          300: '#C9B7C3',
          400: '#B79FAF',
          500: '#875A7B',
          600: '#6C4862',
          700: '#51364A',
          800: '#362431',
          900: '#1B1219'
        },
        accent: {
          DEFAULT: '#00A09D',
          50: '#E6F7F7',
          100: '#CCEFEF',
          200: '#99DFDF',
          300: '#66CFCF',
          400: '#33BFBF',
          500: '#00A09D',
          600: '#00807E',
          700: '#00605E',
          800: '#00403F',
          900: '#00201F'
        },
        success: {
          DEFAULT: '#28A745',
          50: '#E8F5E8',
          100: '#D1EBD1',
          200: '#A3D7A3',
          300: '#75C375',
          400: '#47AF47',
          500: '#28A745',
          600: '#208637',
          700: '#186429',
          800: '#10431B',
          900: '#08210D'
        },
        warning: {
          DEFAULT: '#FFC107',
          50: '#FFFBE6',
          100: '#FFF7CC',
          200: '#FFEF99',
          300: '#FFE666',
          400: '#FFDE33',
          500: '#FFC107',
          600: '#E6AC00',
          700: '#B38600',
          800: '#805F00',
          900: '#4D3900'
        },
        danger: {
          DEFAULT: '#DC3545',
          50: '#FDEAEA',
          100: '#FBD5D5',
          200: '#F7ABAB',
          300: '#F38181',
          400: '#EF5757',
          500: '#DC3545',
          600: '#B02A37',
          700: '#841F29',
          800: '#58151B',
          900: '#2C0A0D'
        },
        background: {
          DEFAULT: '#F8F9FA',
          card: '#FFFFFF',
          gray: '#F1F3F4'
        },
        border: {
          DEFAULT: '#DEE2E6',
          light: '#E9ECEF',
          dark: '#CED4DA'
        },
        text: {
          DEFAULT: '#212529',
          primary: '#212529',
          secondary: '#6C757D',
          muted: '#868E96',
          light: '#ADB5BD'
        },
      },
      boxShadow: {
        'odoo': '0 2px 4px 0 rgba(113, 75, 103, 0.1)',
        'odoo-lg': '0 4px 8px 0 rgba(113, 75, 103, 0.15)',
        'odoo-xl': '0 8px 16px 0 rgba(113, 75, 103, 0.2)',
      },
      borderRadius: {
        'odoo': '4px',
        'odoo-lg': '8px',
      }
    },
  },
  plugins: [],
}
