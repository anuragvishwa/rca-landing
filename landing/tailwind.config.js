/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        canvas: '#ffffff',
        surface: '#fafafa',
        border: '#e5e5e5',
        'border-hover': '#d4d4d4',
        foreground: '#0a0a0a',
        muted: '#71717a',
        secondary: '#22c55e',
        primary: {
          DEFAULT: '#22c55e',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#22c55e',
          foreground: '#ffffff',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'blink': 'blink 1s steps(2, start) infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
