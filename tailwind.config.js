/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // 🎨 Paleta oficial DinerUP
        brand: {
          primary: "#88C9FF", // Celeste del texto DinerUP
          secondary: "#0E3C89", // Azul profundo del header y fondo
          dark: "#3A1E5F", // Morado oscuro inferior
          gradientStart: "#0E3C89", // Inicio gradiente del splash
          gradientEnd: "#4A2A82", // Fin del gradiente
        },

        // ✔ Mantengo tus colores existentes por si ya los usas
        primary: {
          900: "#1E3A8A",
          600: "#2563EB",
        },

        success: "#16A34A",
        accent: "#F97316",

        neutral: {
          50: "#FFFFFF",
          100: "#F3F4F6",
          700: "#374151",
        },
      },

      // 🎨 Gradientes listos para usar
      backgroundImage: {
        "dinerup-gradient":
          "linear-gradient(to bottom, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
