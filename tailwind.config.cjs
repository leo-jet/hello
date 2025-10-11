/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
    './public/index.html'
  ],
  theme: {
    extend: {
      keyframes: {
        dialogScaleIn: {
          'from': { opacity: '0', transform: 'scale(0.9)' },
          'to': { opacity: '1', transform: 'scale(1)' }
        },
        dialogFadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' }
        },
        dialogSlideUp: {
          'from': { opacity: '0', transform: 'translateY(1.25rem)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        },
        dialogSlideDown: {
          'from': { opacity: '0', transform: 'translateY(-1.25rem)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        },
        dialogSlideLeft: {
          'from': { opacity: '0', transform: 'translateX(1.25rem)' },
          'to': { opacity: '1', transform: 'translateX(0)' }
        },
        dialogSlideRight: {
          'from': { opacity: '0', transform: 'translateX(-1.25rem)' },
          'to': { opacity: '1', transform: 'translateX(0)' }
        },
        dialogShake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-0.25rem)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(0.25rem)' }
        }
      },
      animation: {
        'dialog-scale': 'dialogScaleIn 0.3s ease',
        'dialog-fade': 'dialogFadeIn 0.3s ease',
        'dialog-slide-up': 'dialogSlideUp 0.3s ease',
        'dialog-slide-down': 'dialogSlideDown 0.3s ease',
        'dialog-slide-left': 'dialogSlideLeft 0.3s ease',
        'dialog-slide-right': 'dialogSlideRight 0.3s ease',
        'dialog-shake': 'dialogShake 0.5s ease'
      }
    },
  },
  plugins: [],
}
