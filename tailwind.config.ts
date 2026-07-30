import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#B25E33',
        'primary-dark': '#8C4526',
        accent: '#D9A566',
        cream: '#FAF6EE',
        ink: '#34281F',
        powder: '#B7CBD9',
        blush: '#E8AFA3',
        'blush-light': '#F3D9D0',
        sage: '#93A57C',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
        script: ['Petit Formal Script', 'cursive'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s ease-out both',
        sway: 'sway 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
export default config
