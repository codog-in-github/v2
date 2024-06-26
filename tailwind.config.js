/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        'login-gradient-dark': '#5169dc',
        'login-gradient-light': '#8ac6f4',
        'primary': '#426CF6'
      }
    },
  },
  plugins: [],
}

