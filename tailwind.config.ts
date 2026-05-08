// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        spotify: {
          base:     '#121212',
          surface:  '#181818',
          elevated: '#1f1f1f',
          card:     '#282828',
          green:    '#1ed760',
          muted:    '#b3b3b3',
          border:   '#535353',
          negative: '#f3727f',
          warning:  '#ffa42b',
        },
      },
      borderRadius: {
        pill:      '9999px',
        'pill-lg': '500px',
        circle:    '50%',
      },
      boxShadow: {
        'spotify-heavy':  'rgba(0,0,0,0.5) 0px 8px 24px',
        'spotify-medium': 'rgba(0,0,0,0.3) 0px 8px 8px',
        'spotify-bottom': 'rgba(0,0,0,0.5) 0px -8px 24px',
      },
      fontSize: {
        'sp-xs':   ['10px', { lineHeight: 'normal' }],
        'sp-sm':   ['12px', { lineHeight: '1.5' }],
        'sp-base': ['14px', { lineHeight: 'normal' }],
        'sp-md':   ['16px', { lineHeight: 'normal' }],
        'sp-lg':   ['18px', { lineHeight: '1.3' }],
        'sp-xl':   ['24px', { lineHeight: 'normal' }],
      },
      letterSpacing: {
        'sp-btn': '1.4px',
        'sp-nav': '2px',
      },
    },
  },
  plugins: [],
}

export default config
