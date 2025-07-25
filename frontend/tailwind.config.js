/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dojo Coding Brand Colors
        background: 'hsl(0 0% 100%)',
        foreground: 'hsl(222.2 84% 4.9%)',
        primary: {
          DEFAULT: 'hsl(222.2 47.4% 11.2%)',
          foreground: 'hsl(210 40% 98%)',
        },
        muted: {
          DEFAULT: 'hsl(210 40% 96.1%)',
          foreground: 'hsl(215.4 16.3% 46.9%)',
        },
        destructive: {
          DEFAULT: 'hsl(0 84.2% 60.2%)',
        },
        border: 'hsl(214.3 31.8% 91.4%)',
        // Dojo Brand Colors
        'dojo-yellow': 'hsl(52 100% 76%)',
        'dojo-coral': 'hsl(10 100% 76%)',
        'dojo-purple': 'hsl(281 100% 75%)',
        'dojo-blue': 'hsl(190 89% 78%)',
        'dojo-green': 'hsl(145 100% 85%)',
        'dojo-light-blue': 'hsl(187 92% 85%)',
        // Gradient variables
        'gradient-primary': 'linear-gradient(135deg, hsl(52 100% 76%), hsl(10 100% 76%), hsl(281 100% 75%))',
        'gradient-secondary': 'linear-gradient(135deg, hsl(52 100% 76%), hsl(281 100% 75%), hsl(190 89% 78%))',
        'gradient-accent': 'linear-gradient(135deg, hsl(10 100% 76%), hsl(145 100% 85%), hsl(281 100% 75%))',
        'gradient-hero': 'linear-gradient(135deg, hsl(52 100% 76%), hsl(10 100% 76%), hsl(187 92% 85%))',
        'gradient-timeline': 'linear-gradient(135deg, hsl(190 89% 78%), hsl(145 100% 85%), hsl(281 100% 75%))',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'bounce-gentle': 'bounce 2s infinite',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      maxWidth: {
        'container': '1400px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
} 