/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0C',
        bg2: 'rgba(20, 20, 24, 0.55)',
        bg3: 'rgba(15, 15, 18, 0.8)',
        card: 'rgba(255, 255, 255, 0.03)',
        cardH: 'rgba(255, 255, 255, 0.06)',
        gold: '#C49450',
        goldL: '#E4B672',
        goldD: 'rgba(196, 148, 80, 0.15)',
        violet: '#8C80F2',
        teal: '#42E8DF',
        sky: '#5BA4F8',
        ink: '#F7F5F1',
        ink2: '#A09C96',
        ink3: '#6C6862',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"Space Grotesk"', 'monospace'],
      },
      borderColor: {
        glass: 'rgba(255, 255, 255, 0.06)',
        soft: 'rgba(255, 255, 255, 0.08)',
        goldBorder: 'rgba(196, 148, 80, 0.3)',
      },
    },
  },
  plugins: [],
}
