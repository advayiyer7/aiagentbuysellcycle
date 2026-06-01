/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: {
          900: '#05060A',
          800: '#0A0D16',
          700: '#10141F',
        },
        ink: {
          DEFAULT: '#E6EAF2',
          muted: '#8A93A6',
        },
        atlas: '#22D3EE',
        ceres: '#A78BFA',
        maturity: {
          today: '#34D399',
          emerging: '#FBBF24',
          gap: '#FB7185',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
