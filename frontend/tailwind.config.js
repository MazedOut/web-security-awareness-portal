/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#FDFBF7',
          deep: '#F8FAFC',
          light: '#F1F5F9',
        },
        graphite: {
          DEFAULT: '#1E293B',
          light: '#334155',
          dark: '#0F172A',
        },
        cyber: {
          green: {
            DEFAULT: '#059669', // Emerald Green (Security/Protection)
            light: '#D1FAE5',
            dark: '#047857',
            glow: 'rgba(5, 150, 105, 0.15)',
          },
          blue: {
            DEFAULT: '#2563EB', // Royal Blue (Information/Learning)
            light: '#DBEAFE',
            dark: '#1D4ED8',
            glow: 'rgba(37, 99, 235, 0.15)',
          },
          gold: {
            DEFAULT: '#B45309', // Muted Gold (Achievements)
            light: '#FEF3C7',
            dark: '#92400E',
            glow: 'rgba(180, 83, 9, 0.15)',
          },
          purple: {
            DEFAULT: '#7C3AED', // Soft Purple (AI/Advanced insights)
            light: '#EDE9FE',
            dark: '#6D28D9',
            glow: 'rgba(124, 58, 237, 0.15)',
          },
          red: {
            DEFAULT: '#EF4444', // Coral/Red (Warnings/Threats)
            light: '#FEE2E2',
            dark: '#B91C1C',
            glow: 'rgba(239, 68, 68, 0.15)',
          },
          teal: {
            DEFAULT: '#0D9488', // Teal (Analytics)
            light: '#CCFBF1',
            dark: '#0F766E',
            glow: 'rgba(13, 148, 136, 0.15)',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Lora', 'Noto Serif Devanagari', 'serif'],
      },
      boxShadow: {
        'glass': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'glass-hover': '0 8px 30px -4px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
        'radar': 'radar 4s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
