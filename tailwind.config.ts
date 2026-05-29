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
          base:     'var(--sp-base)',
          surface:  'var(--sp-surface)',
          elevated: 'var(--sp-elevated)',
          card:     'var(--sp-card)',
          sidebar:  'var(--sp-sidebar)',
          green:    'var(--sp-green)',
          muted:    'var(--sp-muted)',
          border:   'var(--sp-border)',
          negative: 'var(--sp-negative)',
          warning:  'var(--sp-warning)',
          text:     'var(--sp-text)',
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
