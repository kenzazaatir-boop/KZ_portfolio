/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#FAF7F2',
        bg2: 'rgba(255, 255, 255, 0.72)',
        bg3: 'rgba(250, 247, 242, 0.92)',
        card: 'rgba(255, 255, 255, 0.55)',
        cardH: 'rgba(255, 255, 255, 0.8)',
        gold: '#A8783A',
        goldL: '#C9954F',
        goldD: 'rgba(168, 120, 58, 0.1)',
        violet: '#6E62D9',
        teal: '#0F9E92',
        sky: '#3A7FD4',
        ink: '#1C1917',
        ink2: '#57524B',
        ink3: '#8A847A',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"Space Grotesk"', 'monospace'],
      },
      borderColor: {
        glass: 'rgba(28, 25, 23, 0.08)',
        soft: 'rgba(28, 25, 23, 0.1)',
        goldBorder: 'rgba(168, 120, 58, 0.35)',
      },
    },
  },
  plugins: [],
}
