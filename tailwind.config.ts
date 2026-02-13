import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF6EE',
          200: '#F5F0E8',
          300: '#EDE5D8',
          400: '#E0D5C4',
          500: '#D4C9B5',
        },
        green: {
          50: '#E8F5EE',
          100: '#C5E6D4',
          200: '#9DD4B7',
          300: '#6FBF96',
          400: '#4AA87A',
          500: '#2D8B5E',
          600: '#2D6A4F',
          700: '#245540',
          800: '#1B4030',
          900: '#122B20',
        },
        coral: {
          50: '#FEF0E8',
          100: '#FCD9C5',
          200: '#F5B896',
          300: '#EE9868',
          400: '#E88548',
          500: '#E07A3A',
          600: '#D06A2E',
          700: '#B85624',
          800: '#9E441C',
          900: '#7A3415',
        },
        charcoal: {
          50: '#F5F5F5',
          100: '#E8E8E8',
          200: '#D1D1D1',
          300: '#A3A3A3',
          400: '#737373',
          500: '#525252',
          600: '#404040',
          700: '#333333',
          800: '#2D2D2D',
          900: '#1A1A1A',
        },
      },
      /* Legacy dark-theme palette used by sub-pages */
      dark: {
        300: '#A1A1AA',
        400: '#71717A',
        500: '#52525B',
        600: '#3F3F46',
        700: '#27272A',
        800: '#18181B',
        900: '#09090B',
      },
      primary: {
        400: '#60A5FA',
        500: '#3B82F6',
        950: '#172554',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
