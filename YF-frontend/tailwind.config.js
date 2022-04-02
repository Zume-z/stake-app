module.exports = {
  mode: 'jit',
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false,
  theme: {
    extend: {
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%, 0%': {
            'background-size': '700% 700%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '700% 700%',
            'background-position': 'right center',
          },
        },
      },

      screens: {
        xs: '475px',
        '3xl': '1920px',
      },
    },
    fontFamily: {
      jura: ['Nb Grotesk Pro Mono', 'sans-serif'],
    },
    fontFamily: {
      Nb: ['Nb International Pro', 'sans-serif'],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
}
