/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [
    require('@repo/tailwind-config'), // Use shared Tailwind config
    require('nativewind/preset')      // NativeWind preset for React Native
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}