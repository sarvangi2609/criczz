/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#13ec5b",
                "background-light": "#f6f8f6",
                "background-dark": "#102216",
                "text-dark": "#0d1b12",
            },
            fontFamily: {
                display: ["Lexend", "sans-serif"],
            },
        },
    },
    plugins: [],
}
