/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          900: "#1E3A8A", // Azul Profundo
          600: "#2563EB", // Azul Medio
        },
        success: "#16A34A", // Verde Esmeralda
        accent: "#F97316", // Naranja Vibrante
        neutral: {
          50: "#FFFFFF", // Blanco
          100: "#F3F4F6", // Gris Claro
          700: "#374151", // Gris Oscuro
        },
      },
    },
  },
  plugins: [],
};
