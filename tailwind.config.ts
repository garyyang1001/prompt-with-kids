import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 主色調 - 溫暖橙色系
        primary: {
          DEFAULT: '#FF8C42',
          light: '#FFB380',
          dark: '#E67A35',
        },
        // 輔助色 - 親和藍色系
        secondary: {
          DEFAULT: '#4A90E2',
          light: '#7BB3F0',
          dark: '#3A7BC8',
        },
        // 背景色系
        bg: {
          cream: '#FEFDF8',
          light: '#F9F8F3',
          warm: '#FFF8F0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans TC', 'sans-serif'],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
    },
  },
  plugins: [],
}
export default config