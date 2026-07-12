import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fbf4',
          100: '#dcf6e5',
          200: '#bbeccb',
          300: '#8cddaa',
          400: '#58c582',
          500: '#34a862',
          600: '#25884b',
          700: '#1f6c3d',
          800: '#1c5633',
          900: '#18472b',
          950: '#0c2718',
        },
        accent: {
          50: '#fdfbeb',
          100: '#fcf6c7',
          200: '#f8eb8b',
          300: '#f4d84f',
          400: '#efc123',
          500: '#dca413',
          600: '#be7e0e',
          700: '#98580f',
          800: '#7c4411',
          900: '#663712',
          950: '#3b1c05',
        },
        slate: {
          950: '#090d16',
        }
      },
      backgroundImage: {
        'glass-radial': 'radial-gradient(120% 120% at 50% 10%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
        'glass-dark': 'radial-gradient(100% 100% at 50% 0%, rgba(24, 30, 48, 0.4) 0%, rgba(14, 17, 28, 0.9) 100%)',
      },
      boxShadow: {
        'glass-soft': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-glow': '0 0 15px 2px rgba(52, 168, 98, 0.25)',
      }
    },
  },
  plugins: [],
};

export default config;
